import { calculateFundingReadiness } from "../../lib/scorecard-engine.js";
import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { toPublicScoreResult } from "../../lib/api/safe-result-presenter.js";
import { validateReviewApplicant, validateScorecardAnswers } from "../../lib/api/validate-payload.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const applicant = validateReviewApplicant(payload.applicant || payload.leadContact || {});
    const answers = validateScorecardAnswers(payload.answers || {});
    const calculated = calculateFundingReadiness(answers);
    const resultId = createResultId();

    if (calculated.valid === false) {
      return sendOk(res, assertPublicSafe({
        resultId,
        status: "needs_answer_review",
        message: "Scorecard answers need cleanup before a readiness result can be summarized.",
        errors: calculated.errors || [],
        nextStep: "Confirm the scorecard answers and submit again."
      }));
    }

    const publicResult = toPublicScoreResult(calculated);
    const leadId = `frs_lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return sendOk(res, assertPublicSafe({
      resultId,
      leadId,
      status: "scorecard_submitted",
      reviewStatus: calculated.manualReviewRecommended ? "manual_review_recommended" : "strategy_review_ready",
      applicant: {
        businessName: applicant.businessName,
        state: applicant.state
      },
      publicResult,
      routeSuggestion: {
        nextApiRoute: calculated.manualReviewRecommended ? "/api/scorecard/request-review" : "/api/match/funding-paths",
        nextPage: calculated.manualReviewRecommended ? "/fundable-review.html" : "/results.html",
        reason: calculated.manualReviewRecommended ? "Human review is recommended before program-specific direction." : "Public funding path categories can be reviewed next."
      },
      message: "Score received for funding readiness review. This is not an approval, offer, or guarantee of funding."
    }));
  });
}

function createResultId() {
  return `frs_result_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
