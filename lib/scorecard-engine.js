import { getFundingRecommendations } from "./recommendation-engine.js";
import { getNextSteps, getRecommendedDocuments, getTierCopy } from "./result-copy.js";
import { normalizeAnswers, validateAnswers } from "./validation.js";

export const SCORE_TIERS = [
  { id: "highly_fundable", min: 80, max: 100, label: "Highly Fundable", leadPriority: "hot" },
  { id: "fundable_review", min: 65, max: 79, label: "Fundable, But Needs Review", leadPriority: "warm" },
  { id: "selective_programs", min: 45, max: 64, label: "Possible Fit for Select Programs", leadPriority: "nurture" },
  { id: "not_ready_fixable", min: 0, max: 44, label: "Not Ready Yet — But Fixable", leadPriority: "education" }
];

const RED_FLAG_PENALTIES = {
  open_bankruptcy: 25,
  tax_lien: 15,
  recent_missed_payments: 10,
  recent_nsfs: 10,
  new_bank_account: 8,
  existing_daily_advance: 10,
  marketplace_suspended: 15,
  no_current_revenue: 20
};

export function calculateFundingReadiness(rawAnswers = {}) {
  const answers = normalizeAnswers(rawAnswers);
  const validation = validateAnswers(answers);
  if (!validation.valid) return { valid: false, errors: validation.errors };

  const baseScore = scoreRevenue(answers.monthlyRevenue) + scoreTimeInBusiness(answers.timeInBusinessMonths) + scoreCredit(answers.creditScore) + scoreBankActivity(answers.bankStatus) + scoreBusinessStructure(answers.businessStructure) + scoreFundingPurpose(answers.fundingPurpose);
  const penalty = calculateRedFlagPenalty(answers.redFlags);
  const score = clampScore(baseScore - penalty);
  const tier = getScoreTier(score);
  const strengths = getStrengths(answers);
  const risks = getRisks(answers, score);
  const recommendations = getFundingRecommendations(answers, score, risks);
  const tierCopy = getTierCopy(tier.id);

  return {
    valid: true,
    score,
    tier: { id: tier.id, label: tier.label, summary: tierCopy.body },
    leadPriority: tier.leadPriority,
    primaryFundingFamily: recommendations.primaryFundingFamily,
    secondaryFundingFamilies: recommendations.secondaryFundingFamilies,
    recommendationCards: recommendations.recommendationCards,
    strengths,
    risks,
    nextSteps: getNextSteps(score),
    recommendedDocuments: getRecommendedDocuments(answers),
    manualReviewRecommended: shouldTriggerManualReview(answers, score, risks),
    cta: { label: tierCopy.ctaLabel, url: "#strategy-review" },
    calculatedAt: new Date().toISOString()
  };
}

export function scoreRevenue(monthlyRevenue) {
  if (monthlyRevenue >= 100000) return 25;
  if (monthlyRevenue >= 50000) return 24;
  if (monthlyRevenue >= 20000) return 22;
  if (monthlyRevenue >= 15000) return 18;
  if (monthlyRevenue >= 8500) return 13;
  if (monthlyRevenue >= 3000) return 7;
  return 0;
}

export function scoreTimeInBusiness(months) {
  if (months >= 24) return 20;
  if (months >= 12) return 16;
  if (months >= 6) return 12;
  if (months >= 4) return 8;
  if (months > 0) return 4;
  return 0;
}

export function scoreCredit(creditScore) {
  if (creditScore >= 700) return 20;
  if (creditScore >= 680) return 18;
  if (creditScore >= 660) return 16;
  if (creditScore >= 600) return 13;
  if (creditScore >= 580) return 8;
  if (creditScore >= 500) return 5;
  return 0;
}

export function scoreBankActivity(bankStatus) {
  return ({ none: 0, low_inconsistent: 5, consistent: 11, strong_clean: 15, recent_nsfs: 4 })[bankStatus] ?? 0;
}

export function scoreBusinessStructure(businessStructure) {
  return ({ none: 0, sole_prop: 4, entity_no_bank: 6, entity_with_bank: 8, entity_bank_ein_clean: 10 })[businessStructure] ?? 0;
}

export function scoreFundingPurpose(fundingPurpose) {
  return ({ working_capital: 7, inventory_materials: 8, growth_marketing: 8, equipment_vehicle: 9, real_estate: 8, ecommerce_growth: 9, startup_launch: 6, debt_refi: 6, business_credit: 7, not_sure: 5 })[fundingPurpose] ?? 5;
}

export function calculateRedFlagPenalty(redFlags = []) {
  if (!Array.isArray(redFlags) || redFlags.includes("none")) return 0;
  const total = redFlags.reduce((sum, flag) => sum + (RED_FLAG_PENALTIES[flag] || 0), 0);
  return Math.min(total, 45);
}

export function getScoreTier(score) {
  return SCORE_TIERS.find((tier) => score >= tier.min && score <= tier.max) || SCORE_TIERS[SCORE_TIERS.length - 1];
}

export function getStrengths(answers = {}) {
  const strengths = [];
  if (answers.monthlyRevenue >= 15000) strengths.push("Meaningful monthly revenue signal");
  if (answers.timeInBusinessMonths >= 12) strengths.push("Operating history supports deeper review");
  if (answers.creditScore >= 660) strengths.push("Credit profile may support more funding paths");
  if (["consistent", "strong_clean"].includes(answers.bankStatus)) strengths.push("Business bank activity available for review");
  if (["entity_with_bank", "entity_bank_ein_clean"].includes(answers.businessStructure)) strengths.push("Business structure is moving in the right direction");
  if (strengths.length === 0) strengths.push("You completed the readiness screen and now have a clearer starting point");
  return strengths;
}

export function getRisks(answers = {}, score = 0) {
  const risks = [];
  if (answers.monthlyRevenue < 3000) risks.push("Current revenue may limit available paths");
  if (answers.timeInBusinessMonths < 6) risks.push("Limited operating history may narrow options");
  if (answers.creditScore < 580) risks.push("Credit profile may create pricing or path limitations");
  if (answers.bankStatus === "none") risks.push("No business bank account may slow review");
  if (answers.bankStatus === "recent_nsfs") risks.push("Recent bank activity issues should be reviewed");
  if (answers.businessStructure === "none") risks.push("Business setup is not yet complete");
  if (Array.isArray(answers.redFlags) && answers.redFlags.some((flag) => flag !== "none")) risks.push("Caution flags may require manual review");
  if (score < 45) risks.push("Prep work is recommended before a funding review");
  return [...new Set(risks)];
}

export function shouldTriggerManualReview(answers = {}, score = 0, risks = []) {
  const redFlags = Array.isArray(answers.redFlags) ? answers.redFlags : [];
  const hasMajorFlag = redFlags.some((flag) => ["open_bankruptcy", "tax_lien", "marketplace_suspended", "existing_daily_advance"].includes(flag));
  const requestedAmountHighVsRevenue = Number(answers.desiredFundingAmount || 0) > Number(answers.monthlyRevenue || 0) * 5 && Number(answers.monthlyRevenue || 0) < 20000;
  return hasMajorFlag || requestedAmountHighVsRevenue || risks.length >= 3 || score < 65;
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

if (typeof window !== "undefined") {
  window.FundingReadinessEngine = { calculateFundingReadiness, getScoreTier, scoreRevenue, scoreTimeInBusiness, scoreCredit, scoreBankActivity, scoreBusinessStructure, scoreFundingPurpose, calculateRedFlagPenalty };
}
