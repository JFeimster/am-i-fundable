import { getScoreTier } from "../../lib/scorecard-engine.js";
import { runApiRoute, getQuery, asNumber } from "../../lib/api/http.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";

const TIER_DETAILS = {
  highly_fundable: {
    id: "highly_fundable",
    label: "Highly Fundable",
    leadPriority: "hot",
    range: "80-100",
    summary: "Your answers show stronger readiness signals. A fast document review may be the right next step.",
    nextSteps: ["Prepare recent bank statements", "Confirm funding purpose", "Request a funding strategy review"]
  },
  fundable_review: {
    id: "fundable_review",
    label: "Fundable, But Needs Review",
    leadPriority: "warm",
    range: "65-79",
    summary: "Your answers show possible readiness, but a human review should confirm the best path.",
    nextSteps: ["Review caution areas", "Prepare documents", "Request a funding strategy review"]
  },
  selective_programs: {
    id: "selective_programs",
    label: "Possible Fit for Select Programs",
    leadPriority: "nurture",
    range: "45-64",
    summary: "Some paths may be possible, but prep work and context are important before provider-specific direction.",
    nextSteps: ["Strengthen documents", "Review bank activity", "Request manual review if timing is urgent"]
  },
  not_ready_fixable: {
    id: "not_ready_fixable",
    label: "Not Ready Yet — But Fixable",
    leadPriority: "education",
    range: "0-44",
    summary: "Your answers suggest prep work should come before a funding review.",
    nextSteps: ["Complete business setup basics", "Organize bank activity", "Follow a readiness improvement checklist"]
  }
};

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    const query = getQuery(req);
    const score = asNumber(query.score, NaN);
    const tierId = query.tierId || (Number.isFinite(score) ? getScoreTier(score).id : "fundable_review");
    const tier = TIER_DETAILS[tierId] || TIER_DETAILS.fundable_review;

    return sendOk(res, assertPublicSafe({
      tier,
      allTiers: Object.values(TIER_DETAILS),
      disclaimer: "Result tiers are readiness categories only. They are not approvals, offers, underwriting decisions, or guarantees of funding."
    }));
  });
}
