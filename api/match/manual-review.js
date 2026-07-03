import { calculateFundingReadiness } from "../../lib/scorecard-engine.js";
import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { validateScorecardAnswers } from "../../lib/api/validate-payload.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const answers = validateScorecardAnswers(payload.answers || {});
    const result = calculateFundingReadiness(answers);

    const reasons = buildReviewReasons(answers, result);
    const reviewRecommended = result.manualReviewRecommended === true || reasons.length > 0;

    return sendOk(res, assertPublicSafe({
      status: reviewRecommended ? "manual_review_recommended" : "standard_strategy_review_available",
      score: result.valid ? result.score : null,
      tier: result.valid ? result.tier : null,
      reviewRecommended,
      reasons,
      recommendedQueue: reviewRecommended ? "funding_strategy_review" : "standard_follow_up",
      nextStep: reviewRecommended
        ? "Queue a human review before program-specific direction is shared."
        : "Continue to public-safe funding path category review.",
      disclaimer: "Manual review guidance is not an approval, offer, underwriting decision, or guarantee of funding."
    }));
  });
}

function buildReviewReasons(answers, result) {
  const reasons = [];
  const redFlags = Array.isArray(answers.redFlags) ? answers.redFlags : [];

  if (result.manualReviewRecommended === true) {
    reasons.push("Scorecard result recommends human review.");
  }

  if (redFlags.some((flag) => ["open_bankruptcy", "tax_lien", "marketplace_suspended", "existing_daily_advance"].includes(flag))) {
    reasons.push("A caution flag needs human context.");
  }

  if (Number(answers.desiredFundingAmount || 0) > Number(answers.monthlyRevenue || 0) * 4) {
    reasons.push("Requested amount is high relative to monthly revenue signal.");
  }

  if (Number(answers.creditScore || 0) < 580) {
    reasons.push("Credit signal may limit some paths and should be reviewed carefully.");
  }

  return [...new Set(reasons)];
}
