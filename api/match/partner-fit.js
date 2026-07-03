import fs from "node:fs";
import { calculateFundingReadiness } from "../../lib/scorecard-engine.js";
import { matchPartners } from "../../lib/partner-match-engine.js";
import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe, sanitizeForPublic } from "../../lib/api/public-boundary.js";
import { buildManualReviewPath } from "../../lib/api/safe-result-presenter.js";
import { validateScorecardAnswers } from "../../lib/api/validate-payload.js";

const SOURCE_A = new URL("../../internal/providers/funding-providers.registry.json", import.meta.url);
const SOURCE_B = new URL("../../internal/products/funding-products.registry.json", import.meta.url);

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const answers = validateScorecardAnswers(payload.answers || {});
    const scoreResult = calculateFundingReadiness(answers);
    const applicant = {
      ...answers,
      fundingReadinessScore: scoreResult.valid ? scoreResult.score : 0
    };

    const matchResult = matchPartners(applicant, readEntries(SOURCE_A), readEntries(SOURCE_B), {
      maxMatches: 5
    });

    const publicRecommendations = Array.isArray(matchResult.publicRecommendations) && matchResult.publicRecommendations.length
      ? matchResult.publicRecommendations
      : [buildManualReviewPath("needs_context")];

    const payloadOut = {
      status: "partner_fit_reviewed",
      score: scoreResult.valid ? scoreResult.score : null,
      tier: scoreResult.valid ? scoreResult.tier : null,
      humanReviewRequired: matchResult.humanReviewRequired === true || scoreResult.manualReviewRecommended === true,
      publicFitSummary: {
        categoryCount: publicRecommendations.length,
        strongestBand: publicRecommendations.some((item) => item.fitScoreBand === "strong_review_signal") ? "strong_review_signal" : "possible_review_signal",
        reviewMode: "public_category_fit_only"
      },
      recommendations: sanitizeForPublic(publicRecommendations),
      nextStep: "Use these categories for readiness discussion only. Program-specific direction should happen after human review.",
      message: "Public fit summary generated without exposing private routing details."
    };

    return sendOk(res, assertPublicSafe(payloadOut));
  });
}

function readEntries(url) {
  try {
    const registry = JSON.parse(fs.readFileSync(url, "utf8"));
    return Array.isArray(registry.entries) ? registry.entries : [];
  } catch {
    return [];
  }
}
