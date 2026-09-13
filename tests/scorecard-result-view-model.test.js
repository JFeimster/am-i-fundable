import test from "node:test";
import assert from "node:assert/strict";

import { calculateBrowserFundingReadiness } from "../lib/browser-scorecard-adapter.js";
import { normalizeScorecardResult } from "../lib/scorecard-result-view-model.js";

const answers = {
  businessPersona: "existing_business",
  monthlyRevenue: 52000,
  timeInBusinessMonths: 30,
  creditScore: 690,
  bankStatus: "consistent",
  businessStructure: "entity_bank_ein_clean",
  fundingPurpose: "working_capital",
  desiredFundingAmount: 65000,
  redFlags: ["none"]
};

test("browser result exposes every data group required by the scorecard", () => {
  const result = calculateBrowserFundingReadiness(answers);

  assert.equal(result.valid, true);
  assert.equal(typeof result.score, "number");
  assert.equal(typeof result.tierLabel, "string");
  assert.equal(typeof result.tierCopy, "string");
  assert.ok(Array.isArray(result.strengths));
  assert.ok(Array.isArray(result.recommendationCards));
  assert.ok(Array.isArray(result.risks));
  assert.ok(Array.isArray(result.nextSteps));
  assert.ok(Array.isArray(result.recommendedDocuments));
  assert.equal(typeof result.cta.label, "string");
  assert.equal(typeof result.cta.url, "string");
});

test("result view model preserves strengths, recommendations, risks, next steps, documents, and CTA", () => {
  const result = normalizeScorecardResult({
    score: 56,
    tier: { label: "Possible Fit for Select Programs", summary: "Prep is recommended." },
    strengths: ["Meaningful monthly revenue signal"],
    recommendationCards: [{ label: "Fast Working Capital", summary: "Potential path.", nextStep: "Review deposits." }],
    risks: ["Recent NSFs"],
    nextSteps: ["Prepare bank statements"],
    recommendedDocuments: ["Business bank statements"],
    manualReviewRecommended: true,
    cta: { label: "Get a Prep Checklist", url: "/documents.html" }
  });

  assert.deepEqual(result.strengths, ["Meaningful monthly revenue signal"]);
  assert.equal(result.recommendationCards[0].label, "Fast Working Capital");
  assert.deepEqual(result.risks, ["Recent NSFs"]);
  assert.deepEqual(result.nextSteps, ["Prepare bank statements"]);
  assert.deepEqual(result.recommendedDocuments, ["Business bank statements"]);
  assert.equal(result.cta.label, "Get a Prep Checklist");
  assert.equal(result.cta.url, "/documents.html");
  assert.equal(result.manualReviewRecommended, true);
});

test("empty optional result arrays are safe and risks receive a useful fallback", () => {
  const result = normalizeScorecardResult({ score: 20, cta: {} });

  assert.ok(result.strengths.length > 0);
  assert.deepEqual(result.risks, ["No material blockers were identified from the answers provided."]);
  assert.ok(result.recommendationCards.length > 0);
  assert.deepEqual(result.nextSteps, []);
  assert.deepEqual(result.recommendedDocuments, []);
});
