import { calculateFundingReadiness } from "../../lib/scorecard-engine.js";
import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { buildReadinessReport } from "../../lib/api/report-builder.js";
import { validateScorecardAnswers, normalizeApplicant } from "../../lib/api/validate-payload.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const applicant = normalizeApplicant(payload.applicant || {});
    const answers = validateScorecardAnswers(payload.answers || {});
    const calculated = calculateFundingReadiness(answers);

    if (!calculated.valid) {
      return sendOk(res, assertPublicSafe({
        status: "invalid_answers",
        errors: calculated.errors || [],
        message: "A readiness report could not be generated until the scorecard answers are valid."
      }));
    }

    const report = buildReadinessReport({
      applicant,
      answers,
      result: calculated,
      resources: payload.resources || []
    });

    return sendOk(res, assertPublicSafe({
      status: "report_generated",
      report,
      message: "Readiness report generated. This is educational guidance only and not a funding offer."
    }));
  });
}
