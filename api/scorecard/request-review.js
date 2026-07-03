import { calculateFundingReadiness } from "../../lib/scorecard-engine.js";
import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendCreated } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { toPublicScoreResult } from "../../lib/api/safe-result-presenter.js";
import { validateReviewApplicant, validateScorecardAnswers } from "../../lib/api/validate-payload.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const applicant = validateReviewApplicant(payload.applicant || payload.leadContact || {});
    const answers = validateScorecardAnswers(payload.answers || {});
    const calculated = calculateFundingReadiness(answers);

    if (!calculated.valid) {
      return sendCreated(res, assertPublicSafe({
        reviewId: createReviewId(),
        status: "needs_answer_review",
        message: "Review request received, but the answers need cleanup before a readiness result can be summarized.",
        errors: calculated.errors || [],
        nextStep: "Confirm the scorecard answers and request review again."
      }));
    }

    const publicResult = toPublicScoreResult(calculated);
    const reviewId = createReviewId();

    return sendCreated(res, assertPublicSafe({
      reviewId,
      status: calculated.manualReviewRecommended ? "queued_for_manual_review" : "queued_for_strategy_review",
      applicant: {
        businessName: applicant.businessName,
        state: applicant.state
      },
      result: publicResult,
      nextStep: calculated.manualReviewRecommended
        ? "A funding strategist should review the scorecard details before provider-specific direction is shared."
        : "Prepare documents and review the recommended funding path with a funding strategist.",
      message: "Review request queued. This is not an approval, offer, underwriting decision, or guarantee of funding."
    }));
  });
}

function createReviewId() {
  return `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
