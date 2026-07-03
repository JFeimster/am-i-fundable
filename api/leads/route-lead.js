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
    const route = buildRoute(result, answers);

    return sendOk(res, assertPublicSafe({
      status: "lead_route_created",
      leadId: payload.leadId ? String(payload.leadId).slice(0, 80) : null,
      score: result.valid ? result.score : null,
      tier: result.valid ? result.tier : null,
      route,
      message: "Lead route created using public-safe readiness logic only."
    }));
  });
}

function buildRoute(result, answers) {
  if (result.manualReviewRecommended) {
    return {
      queue: "funding_strategy_review",
      priority: result.leadPriority || "manual_review",
      nextAction: "manual_review",
      nextPage: "/fundable-review.html",
      tasks: [
        "Review caution areas",
        "Confirm funding purpose",
        "Request recent documents"
      ]
    };
  }

  if (result.tier?.id === "highly_fundable") {
    return {
      queue: "fast_follow_up",
      priority: "hot",
      nextAction: "document_checklist",
      nextPage: "/highly-fundable.html",
      tasks: [
        "Send document checklist",
        "Confirm desired funding amount",
        "Offer funding strategy review"
      ]
    };
  }

  if (result.tier?.id === "not_ready_fixable") {
    return {
      queue: "readiness_nurture",
      priority: "education",
      nextAction: "readiness_resources",
      nextPage: "/not-ready.html",
      tasks: [
        "Send readiness improvement resources",
        "Recommend document cleanup",
        "Invite future review when signals improve"
      ]
    };
  }

  return {
    queue: "standard_follow_up",
    priority: result.leadPriority || "warm",
    nextAction: "funding_path_summary",
    nextPage: "/results.html",
    tasks: [
      "Summarize public-safe funding path",
      "Request missing documents",
      "Offer human review"
    ],
    fundingPurpose: answers.fundingPurpose
  };
}
