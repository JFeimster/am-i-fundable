export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const reviewRequest = {
      id: `review_${Date.now()}`,
      source: payload?.source || "Funding Readiness Scorecard",
      applicant: payload?.applicant || {},
      scoreResult: payload?.scoreResult || {},
      requestedReviewType: payload?.requestedReviewType || "funding_path_review",
      priority: payload?.scoreResult?.leadPriority || "manual_review",
      note: "Human review required before provider-specific routing or funding path finalization.",
      createdAt: new Date().toISOString()
    };

    // Future connection point: POST reviewRequest to n8n, HubSpot task queue, Notion database, Airtable, or internal CRM.
    // Keep provider-specific outputs internal; do not return lender names or apply links from this endpoint.

    return res.status(200).json({
      ok: true,
      reviewId: reviewRequest.id,
      message: "Review request queued. This is not an approval, offer, underwriting decision, or guarantee of funding.",
      nextStep: "A funding strategist should review the score, documents, and stated funding purpose before recommending a path."
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to queue review request", requestId: `err_${Date.now()}` });
  }
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.SCORECARD_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
