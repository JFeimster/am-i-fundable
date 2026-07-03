export function matchPartners(applicant = {}, providers = [], products = [], options = {}) {
  const maxMatches = Number(options.maxMatches || 5);
  const internalMatches = providers
    .map((provider) => scoreProviderFit(applicant, provider, products))
    .filter((match) => match.fitScore >= 50)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, maxMatches);

  return {
    internalMatches,
    publicRecommendations: toPublicRecommendations(internalMatches, applicant),
    humanReviewRequired: shouldRequireHumanReview(applicant, internalMatches)
  };
}

export function scoreProviderFit(applicant = {}, provider = {}, products = []) {
  const eligibility = provider.eligibility || {};
  let score = 0;
  const reasonCodes = [];

  if (meetsMinimum(applicant.creditScore, eligibility.minCreditScore)) {
    score += 20;
    reasonCodes.push("credit_signal_fit");
  }

  if (meetsMinimum(applicant.monthlyRevenue, eligibility.minMonthlyRevenue)) {
    score += 25;
    reasonCodes.push("revenue_signal_fit");
  }

  if (meetsMinimum(applicant.timeInBusinessMonths, eligibility.minTimeInBusinessMonths)) {
    score += 20;
    reasonCodes.push("operating_history_fit");
  }

  const familyIds = provider.productFamilyIds || [];
  if (familyIds.some((family) => familyMatchesApplicant(family, applicant))) {
    score += 20;
    reasonCodes.push("funding_path_fit");
  }

  if (industryMatches(provider, applicant)) {
    score += 10;
    reasonCodes.push("industry_signal_fit");
  }

  if (hasMajorRedFlag(applicant)) {
    score -= 30;
    reasonCodes.push("manual_review_red_flag");
  }

  return {
    providerId: provider.id,
    providerName: provider.name,
    fitScore: Math.max(0, Math.min(100, score)),
    fitScoreBand: score >= 75 ? "strong_internal_fit" : score >= 50 ? "possible_internal_fit" : "weak_internal_fit",
    productFamilyIds: familyIds,
    reasonCodes
  };
}

export function toPublicRecommendations(internalMatches = [], applicant = {}) {
  const families = [...new Set(internalMatches.flatMap((match) => match.productFamilyIds || []))];
  const recommendations = families.slice(0, 4).map((family) => ({
    familyId: toPublicFamilyId(family),
    publicLabel: toPublicFamilyLabel(family),
    fitScoreBand: internalMatches.some((match) => match.fitScore >= 75 && (match.productFamilyIds || []).includes(family)) ? "strong_review_signal" : "possible_review_signal",
    summary: getPublicSummary(family),
    nextSteps: getPublicNextSteps(family)
  }));

  if (recommendations.length === 0) {
    recommendations.push({
      familyId: "manual-review",
      publicLabel: "Manual Funding Strategy Review",
      fitScoreBand: "needs_context",
      summary: "Your answers need more context before a responsible funding path can be suggested.",
      nextSteps: ["Review your score with a funding strategist", "Prepare recent bank statements", "Confirm funding purpose and desired amount"]
    });
  }

  return recommendations;
}

function meetsMinimum(value, minimum) {
  if (minimum === null || minimum === undefined) return true;
  return Number(value || 0) >= Number(minimum);
}

function familyMatchesApplicant(family, applicant) {
  const purpose = applicant.fundingPurpose;
  const persona = applicant.businessPersona;
  return (
    (family === "working-capital" && ["working_capital", "inventory_materials", "growth_marketing"].includes(purpose)) ||
    (family === "business-line-access" && Number(applicant.monthlyRevenue || 0) >= 15000) ||
    (family === "structured-growth-loans" && Number(applicant.monthlyRevenue || 0) >= 20000) ||
    (family === "startup-credit-leverage" && Number(applicant.timeInBusinessMonths || 0) < 6) ||
    (family === "equipment-finance" && (purpose === "equipment_vehicle" || persona === "equipment_heavy")) ||
    (family === "real-estate-capital" && (purpose === "real_estate" || persona === "real_estate_investor")) ||
    (family === "marketplace-capital" && (purpose === "ecommerce_growth" || persona === "ecommerce_seller"))
  );
}

function industryMatches(provider = {}, applicant = {}) {
  const appetite = (provider.industryAppetite || []).map((industry) => String(industry).toLowerCase());
  const persona = String(applicant.businessPersona || "").toLowerCase();
  if (!persona || appetite.length === 0) return false;
  return appetite.some((industry) => persona.includes(industry.replace(/\s+/g, "_")) || industry.includes(persona.replace(/_/g, " ")));
}

function hasMajorRedFlag(applicant = {}) {
  const redFlags = Array.isArray(applicant.redFlags) ? applicant.redFlags : [];
  return redFlags.some((flag) => ["open_bankruptcy", "tax_lien", "marketplace_suspended", "existing_daily_advance"].includes(flag));
}

function shouldRequireHumanReview(applicant = {}, matches = []) {
  return hasMajorRedFlag(applicant) || matches.length === 0 || Number(applicant.fundingReadinessScore || 0) < 65;
}

function toPublicFamilyId(family) {
  return String(family || "manual-review")
    .replace("working-capital", "fast-working-capital")
    .replace("business-line-access", "business-line-of-credit")
    .replace("structured-growth-loans", "structured-growth-capital")
    .replace("equipment-finance", "equipment-asset-backed")
    .replace("real-estate-capital", "real-estate-asset-secured")
    .replace("marketplace-capital", "ecommerce-marketplace-capital");
}

function toPublicFamilyLabel(family) {
  const labels = {
    "working-capital": "Fast Working Capital",
    "business-line-access": "Business Line of Credit",
    "structured-growth-loans": "Structured Growth Capital",
    "startup-credit-leverage": "Startup / Credit-Leverage Funding",
    "equipment-finance": "Equipment / Truck / Asset-Backed Funding",
    "real-estate-capital": "Real Estate / Asset-Secured Capital",
    "marketplace-capital": "Ecommerce / Marketplace Seller Capital"
  };
  return labels[family] || "Manual Funding Strategy Review";
}

function getPublicSummary(family) {
  const summaries = {
    "working-capital": "Potential path for businesses with recurring deposits and short-term cash-flow needs.",
    "business-line-access": "Potential revolving-access path for businesses with stronger revenue, credit, and operating history.",
    "structured-growth-loans": "Potential path for established businesses seeking planned growth capital.",
    "startup-credit-leverage": "Potential path for newer operators where credit and income may matter more than business history.",
    "equipment-finance": "Potential path for equipment, trucks, vehicles, or other revenue-producing assets.",
    "real-estate-capital": "Potential path for property-backed or project-specific capital.",
    "marketplace-capital": "Potential path for marketplace sellers with platform sales history."
  };
  return summaries[family] || "Potential path that should be reviewed by a funding strategist.";
}

function getPublicNextSteps(family) {
  const shared = ["Confirm funding purpose", "Prepare recent bank statements", "Review next steps with a funding strategist"];
  const specific = {
    "equipment-finance": ["Prepare equipment quote, invoice, or repair estimate"],
    "real-estate-capital": ["Prepare property details, purchase contract, or project scope"],
    "marketplace-capital": ["Prepare marketplace sales reports or platform access details"],
    "startup-credit-leverage": ["Review credit profile and income documentation"]
  };
  return [...(specific[family] || []), ...shared].slice(0, 4);
}
