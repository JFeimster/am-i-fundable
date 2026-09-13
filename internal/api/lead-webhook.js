const DEFAULT_TIMEOUT_MS = 5000;

export function resolveLeadWebhook(env = {}) {
  const primary = cleanUrl(env.SCORECARD_LEAD_WEBHOOK_URL);
  if (primary) {
    return { configured: true, url: primary, variable: "SCORECARD_LEAD_WEBHOOK_URL" };
  }

  const fallback = cleanUrl(env.N8N_SCORECARD_WEBHOOK_URL);
  if (fallback) {
    return { configured: true, url: fallback, variable: "N8N_SCORECARD_WEBHOOK_URL" };
  }

  return { configured: false, url: "", variable: null };
}

export function buildLeadWebhookPayload({ lead = {}, scoreResult = lead.scoreResult || {} } = {}) {
  const tier = scoreResult.tier || {};

  return {
    event: "funding_readiness_scorecard.completed",
    schemaVersion: "1.0",
    leadId: lead.id || "",
    source: lead.source || "Funding Readiness Scorecard",
    submittedAt: lead.createdAt || new Date().toISOString(),
    applicant: lead.applicant || {},
    readiness: {
      score: Number(scoreResult.score || 0),
      tierId: tier.id || "unknown",
      tierLabel: tier.label || "Funding Readiness Review",
      leadPriority: scoreResult.leadPriority || "manual_review",
      manualReviewRecommended: scoreResult.manualReviewRecommended === true,
      primaryFundingFamily: scoreResult.primaryFundingFamily || "Manual Funding Strategy Review",
      secondaryFundingFamilies: arrayOrEmpty(scoreResult.secondaryFundingFamilies),
      strengths: arrayOrEmpty(scoreResult.strengths),
      risks: arrayOrEmpty(scoreResult.risks),
      nextSteps: arrayOrEmpty(scoreResult.nextSteps),
      recommendedDocuments: arrayOrEmpty(scoreResult.recommendedDocuments)
    },
    answers: lead.answers || {}
  };
}

export async function deliverLeadWebhook({ env = {}, payload, fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const destination = resolveLeadWebhook(env);
  if (!destination.configured) {
    return { configured: false, delivered: false, status: "not_configured" };
  }

  if (typeof fetchImpl !== "function") {
    return { configured: true, delivered: false, status: "failed" };
  }

  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeout = setTimeout(() => controller?.abort(), timeoutMs);

  try {
    const response = await fetchImpl(destination.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      ...(controller ? { signal: controller.signal } : {})
    });
    const delivered = response?.ok === true;
    return {
      configured: true,
      delivered,
      status: delivered ? "delivered" : "failed",
      responseStatus: Number.isFinite(response?.status) ? response.status : null
    };
  } catch {
    return { configured: true, delivered: false, status: "failed" };
  } finally {
    clearTimeout(timeout);
  }
}

export function toPublicLeadDelivery(delivery = {}) {
  return {
    configured: delivery.configured === true,
    delivered: delivery.delivered === true,
    status: delivery.status || (delivery.delivered ? "delivered" : "failed")
  };
}

function cleanUrl(value) {
  const url = String(value || "").trim();
  return url || "";
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}
