import { getScoreTier } from "../../lib/scorecard-engine.js";
import { runApiRoute, getQuery, asNumber } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "POST", "OPTIONS"] }, async () => {
    const input = req.method === "POST" ? await readJsonBody(req) : getQuery(req);
    const score = asNumber(input.score, NaN);
    const resultId = input.resultId ? String(input.resultId).slice(0, 80) : null;

    if (!Number.isFinite(score)) {
      return sendOk(res, assertPublicSafe({
        status: "result_lookup_not_persisted",
        resultId,
        message: "Persistent result lookup is not enabled yet. Provide a score to receive public-safe tier guidance.",
        nextStep: "Use /api/scorecard/submit-score to compute a fresh readiness result."
      }));
    }

    const tier = getScoreTier(score);
    return sendOk(res, assertPublicSafe({
      status: "result_tier_resolved",
      resultId,
      score: Math.max(0, Math.min(100, score)),
      tier: {
        id: tier.id,
        label: tier.label,
        summary: tier.summary || tier.description || defaultTierSummary(tier.id)
      },
      nextStep: getNextStep(tier.id),
      disclaimer: "This result is readiness guidance only. It is not an approval, offer, underwriting decision, or guarantee of funding."
    }));
  });
}

function defaultTierSummary(tierId) {
  const summaries = {
    highly_fundable: "Your answers show stronger readiness signals. A fast document review may be the right next step.",
    fundable_review: "Your answers show possible readiness, but a human review should confirm the best path.",
    selective_programs: "Some paths may be possible, but prep work and context are important before program-specific direction.",
    not_ready_fixable: "Your answers suggest prep work should come before a funding review."
  };
  return summaries[tierId] || "Your result should be reviewed with context before choosing a funding path.";
}

function getNextStep(tierId) {
  const steps = {
    highly_fundable: "Prepare recent bank statements and request a funding strategy review.",
    fundable_review: "Review caution areas and request human review.",
    selective_programs: "Prepare documents and focus on the most likely public-safe funding path category.",
    not_ready_fixable: "Start with a readiness improvement checklist before seeking a deeper funding review."
  };
  return steps[tierId] || "Review the scorecard result with a funding strategist.";
}
