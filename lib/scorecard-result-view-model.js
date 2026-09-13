const NO_STRENGTHS_MESSAGE = "Your completed scorecard creates a clearer starting point for review.";
const NO_RISKS_MESSAGE = "No material blockers were identified from the answers provided.";
const NO_RECOMMENDATIONS_MESSAGE = "A funding strategist should review your answers before a specific path is selected.";

export function normalizeScorecardResult(result = {}) {
  const tier = result.tier || {};
  const recommendationCards = arrayOrEmpty(result.recommendationCards);
  const strengths = arrayOrEmpty(result.strengths);
  const risks = arrayOrEmpty(result.risks);
  const nextSteps = arrayOrEmpty(result.nextSteps);
  const recommendedDocuments = arrayOrEmpty(result.recommendedDocuments);

  return {
    ...result,
    score: Number(result.score || 0),
    tierLabel: result.tierLabel || tier.label || "Funding Readiness Review",
    tierCopy: result.tierCopy || tier.summary || "Your result should be reviewed with context before choosing a funding path.",
    strengths: strengths.length ? strengths : [NO_STRENGTHS_MESSAGE],
    risks: risks.length ? risks : [NO_RISKS_MESSAGE],
    recommendationCards: recommendationCards.length ? recommendationCards : [{
      label: result.primaryFundingFamily || "Manual Funding Strategy Review",
      summary: NO_RECOMMENDATIONS_MESSAGE,
      nextStep: "Request a funding strategy review."
    }],
    nextSteps,
    recommendedDocuments,
    manualReviewRecommended: result.manualReviewRecommended === true,
    cta: {
      label: result.cta?.label || "Request Review",
      url: result.cta?.url || result.cta?.href || "#strategy-review"
    }
  };
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}
