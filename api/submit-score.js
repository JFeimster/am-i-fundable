import { calculateFundingReadiness } from "../lib/scorecard-engine.js";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const applicant = payload?.applicant || {};
    const answers = payload?.answers || {};

    if (!applicant.email || !applicant.phone || applicant.consent !== true) {
      return res.status(400).json({ error: "Missing required applicant contact or consent fields." });
    }

    const scoreResult = payload?.scoreResult || calculateFundingReadiness(answers);
    if (scoreResult.valid === false) return res.status(400).json({ error: "Invalid scorecard answers", details: scoreResult.errors });

    const lead = {
      id: `frs_${Date.now()}`,
      source: payload?.source || "Funding Readiness Scorecard",
      applicant: sanitizeApplicant(applicant),
      answers,
      scoreResult,
      leadPriority: scoreResult.leadPriority,
      reviewStatus: scoreResult.manualReviewRecommended ? "queued_for_review" : "new",
      createdAt: new Date().toISOString()
    };

    // Future connection points:
    // - HubSpot: use HUBSPOT_PRIVATE_APP_TOKEN
    // - Notion: use NOTION_TOKEN and NOTION_FUNDING_PIPELINE_DATABASE_ID
    // - Airtable: use AIRTABLE_API_KEY
    // - Google Sheets: use GOOGLE_SERVICE_ACCOUNT_JSON
    // - n8n: POST to N8N_SCORECARD_WEBHOOK_URL
    await maybePostWebhook(process.env.N8N_SCORECARD_WEBHOOK_URL, lead);

    return res.status(200).json({
      ok: true,
      message: "Score received for review. This is not an approval, offer, or guarantee of funding.",
      leadId: lead.id,
      publicResult: {
        score: scoreResult.score,
        tier: scoreResult.tier,
        primaryFundingFamily: scoreResult.primaryFundingFamily,
        leadPriority: scoreResult.leadPriority,
        manualReviewRecommended: scoreResult.manualReviewRecommended
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to process score submission", requestId: `err_${Date.now()}` });
  }
}

function sanitizeApplicant(applicant = {}) {
  return {
    firstName: applicant.firstName || "",
    lastName: applicant.lastName || "",
    email: applicant.email || "",
    phone: applicant.phone || "",
    businessName: applicant.businessName || "",
    state: applicant.state || "",
    consent: applicant.consent === true
  };
}

async function maybePostWebhook(url, payload) {
  if (!url) return { skipped: true };
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return { posted: true };
  } catch {
    return { posted: false };
  }
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.SCORECARD_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
