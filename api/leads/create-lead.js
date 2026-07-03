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
    const applicant = validateReviewApplicant(payload.applicant || {});
    const answers = validateScorecardAnswers(payload.answers || {});
    const result = calculateFundingReadiness(answers);
    const publicResult = result.valid ? toPublicScoreResult(result) : null;
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return sendCreated(res, assertPublicSafe({
      status: "lead_created_demo",
      leadId,
      source: String(payload.source || "Funding Readiness Scorecard").slice(0, 120),
      applicant: {
        businessName: applicant.businessName,
        state: applicant.state,
        contactReady: Boolean(applicant.email && applicant.consent)
      },
      readiness: publicResult,
      routing: {
        queue: result.manualReviewRecommended ? "funding_strategy_review" : "scorecard_follow_up",
        priority: result.leadPriority || "manual_review",
        nextAction: result.manualReviewRecommended ? "manual_review" : "send_document_checklist"
      },
      message: "Lead record shaped for server-side follow-up. This response uses demo persistence only."
    }));
  });
}
