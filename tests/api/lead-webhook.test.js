import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  buildLeadWebhookPayload,
  deliverLeadWebhook,
  resolveLeadWebhook,
  toPublicLeadDelivery
} from "../../internal/api/lead-webhook.js";

const lead = {
  id: "frs_test_001",
  source: "Test Scorecard",
  createdAt: "2026-09-13T12:00:00.000Z",
  applicant: { email: "demo@example.com", consent: true },
  answers: { monthlyRevenue: 15000 },
  scoreResult: {
    score: 56,
    tier: { id: "selective_programs", label: "Possible Fit for Select Programs" },
    leadPriority: "nurture",
    manualReviewRecommended: true,
    primaryFundingFamily: "Fast Working Capital",
    secondaryFundingFamilies: ["Business Line of Credit"],
    strengths: ["Revenue signal"],
    risks: ["Documentation gap"],
    nextSteps: ["Prepare statements"],
    recommendedDocuments: ["Bank statements"]
  }
};

test("preferred generic webhook takes precedence over the n8n fallback", () => {
  assert.deepEqual(resolveLeadWebhook({
    SCORECARD_LEAD_WEBHOOK_URL: "https://make.example/hook",
    N8N_SCORECARD_WEBHOOK_URL: "https://n8n.example/hook"
  }), {
    configured: true,
    url: "https://make.example/hook",
    variable: "SCORECARD_LEAD_WEBHOOK_URL"
  });
});

test("n8n environment variable remains fallback-compatible", () => {
  assert.deepEqual(resolveLeadWebhook({ N8N_SCORECARD_WEBHOOK_URL: "https://n8n.example/hook" }), {
    configured: true,
    url: "https://n8n.example/hook",
    variable: "N8N_SCORECARD_WEBHOOK_URL"
  });
});

test("successful webhook POST reports delivered=true with normalized payload", async () => {
  let postedUrl = "";
  let postedBody;
  const payload = buildLeadWebhookPayload({ lead });
  const delivery = await deliverLeadWebhook({
    env: { SCORECARD_LEAD_WEBHOOK_URL: "https://hooks.example/scorecard" },
    payload,
    fetchImpl: async (url, options) => {
      postedUrl = url;
      postedBody = JSON.parse(options.body);
      return { ok: true, status: 202 };
    }
  });

  assert.equal(postedUrl, "https://hooks.example/scorecard");
  assert.equal(postedBody.event, "funding_readiness_scorecard.completed");
  assert.equal(postedBody.schemaVersion, "1.0");
  assert.equal(postedBody.readiness.tierId, "selective_programs");
  assert.equal(delivery.delivered, true);
  assert.equal(toPublicLeadDelivery(delivery).delivered, true);
});

test("failed webhook responses report delivered=false without throwing", async () => {
  const delivery = await deliverLeadWebhook({
    env: { SCORECARD_LEAD_WEBHOOK_URL: "https://hooks.example/scorecard" },
    payload: {},
    fetchImpl: async () => ({ ok: false, status: 503 })
  });

  assert.deepEqual(toPublicLeadDelivery(delivery), {
    configured: true,
    delivered: false,
    status: "failed"
  });
});

test("no webhook configured is handled safely", async () => {
  const delivery = await deliverLeadWebhook({ payload: {} });

  assert.deepEqual(delivery, { configured: false, delivered: false, status: "not_configured" });
  assert.deepEqual(toPublicLeadDelivery(delivery), {
    configured: false,
    delivered: false,
    status: "not_configured"
  });
});

test("source API files remain present and public delivery never includes a webhook URL", () => {
  for (const file of ["api/index.js", "api/submit-score.js", "functions/api/submit-score.js"]) {
    assert.equal(fs.existsSync(file), true, `${file} must remain present`);
  }

  const publicDelivery = toPublicLeadDelivery({
    configured: true,
    delivered: true,
    status: "delivered",
    url: "https://secret.example/hook"
  });
  assert.equal(JSON.stringify(publicDelivery).includes("secret.example"), false);
});
