import { DEFAULT_DISCLAIMER } from "./response.js";
import { sanitizeForPublic } from "./public-boundary.js";

export function toPublicScoreResult(result = {}) {
  const tier = result.tier || {};
  return sanitizeForPublic({
    score: Number(result.score || 0),
    tier: {
      id: tier.id || "unknown",
      label: tier.label || "Funding Readiness Review",
      summary: tier.summary || "Your result should be reviewed with context before choosing a funding path."
    },
    leadPriority: result.leadPriority || "manual_review",
    primaryFundingFamily: result.primaryFundingFamily || "Manual Funding Strategy Review",
    secondaryFundingFamilies: Array.isArray(result.secondaryFundingFamilies) ? result.secondaryFundingFamilies : [],
    recommendationCards: normalizeRecommendationCards(result.recommendationCards || []),
    strengths: Array.isArray(result.strengths) ? result.strengths : [],
    risks: Array.isArray(result.risks) ? result.risks : [],
    nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : [],
    recommendedDocuments: Array.isArray(result.recommendedDocuments) ? result.recommendedDocuments : [],
    manualReviewRecommended: result.manualReviewRecommended === true,
    cta: normalizeCta(result.cta),
    disclaimer: DEFAULT_DISCLAIMER
  });
}

export function toPublicFundingPath(path = {}) {
  return sanitizeForPublic({
    id: path.id || path.familyId || slugify(path.label || path.publicLabel || "manual-review"),
    familyId: path.familyId || path.id || "manual-review",
    label: path.label || path.publicLabel || "Manual Funding Strategy Review",
    publicLabel: path.publicLabel || path.label || "Manual Funding Strategy Review",
    summary: path.summary || "Potential path that should be reviewed before provider-specific direction is shared.",
    fitScoreBand: path.fitScoreBand || "possible_review_signal",
    bestFor: arrayOrEmpty(path.bestFor),
    watchOutFor: arrayOrEmpty(path.watchOutFor),
    commonDocuments: arrayOrEmpty(path.commonDocuments),
    nextSteps: arrayOrEmpty(path.nextSteps),
    typicalSpeedNote: path.typicalSpeedNote || "Timing depends on document readiness and review complexity.",
    primaryCta: normalizeCta(path.primaryCta)
  });
}

export function buildManualReviewPath(reason = "answers_need_context") {
  return {
    familyId: "manual-review",
    publicLabel: "Manual Funding Strategy Review",
    fitScoreBand: "needs_context",
    summary: "Your answers need more context before a responsible funding path can be suggested.",
    nextSteps: [
      "Review your score with a funding strategist",
      "Prepare recent bank statements",
      "Confirm funding purpose and desired amount"
    ],
    reason
  };
}

function normalizeRecommendationCards(cards = []) {
  return cards.map((card) => sanitizeForPublic({
    label: card.label || card.publicLabel || "Funding Path Review",
    summary: card.summary || "Potential path for review.",
    nextStep: card.nextStep || card.nextSteps?.[0] || "Review next steps with a funding strategist."
  }));
}

function normalizeCta(cta = {}) {
  return {
    label: cta?.label || "Request Review",
    url: cta?.url || cta?.href || "#strategy-review"
  };
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "manual-review";
}
