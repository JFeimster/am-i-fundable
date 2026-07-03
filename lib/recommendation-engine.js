const FUNDING_FAMILIES = {
  workingCapital: "Fast Working Capital",
  revenueBased: "Revenue-Based Funding",
  businessLine: "Business Line of Credit",
  structuredGrowth: "Structured Growth Capital",
  startupCredit: "Startup / Credit-Leverage Funding",
  equipment: "Equipment / Truck / Asset-Backed Funding",
  realEstate: "Real Estate / Asset-Secured Capital",
  ecommerce: "Ecommerce / Marketplace Seller Capital",
  creditBuilder: "Business Credit Builder / Funding Prep",
  manualReview: "Manual Funding Strategy Review"
};

export function getFundingRecommendations(answers = {}, score = 0, risks = []) {
  const monthlyRevenue = Number(answers.monthlyRevenue || 0);
  const timeInBusinessMonths = Number(answers.timeInBusinessMonths || 0);
  const creditScore = Number(answers.creditScore || 0);
  const purpose = answers.fundingPurpose || "not_sure";
  const persona = answers.businessPersona || "not_sure";
  const redFlags = Array.isArray(answers.redFlags) ? answers.redFlags : [];
  const families = [];

  if (persona === "ecommerce_seller" || purpose === "ecommerce_growth") families.push(FUNDING_FAMILIES.ecommerce);
  if (persona === "real_estate_investor" || purpose === "real_estate") families.push(FUNDING_FAMILIES.realEstate);
  if (persona === "equipment_heavy" || purpose === "equipment_vehicle") families.push(FUNDING_FAMILIES.equipment);

  if (monthlyRevenue >= 10000 && timeInBusinessMonths >= 6 && ["working_capital", "inventory_materials", "growth_marketing"].includes(purpose)) {
    families.push(FUNDING_FAMILIES.workingCapital, FUNDING_FAMILIES.revenueBased);
  }

  if (monthlyRevenue >= 15000 && timeInBusinessMonths >= 12 && creditScore >= 600) families.push(FUNDING_FAMILIES.businessLine);
  if (monthlyRevenue >= 20000 && timeInBusinessMonths >= 12 && creditScore >= 600) families.push(FUNDING_FAMILIES.structuredGrowth);
  if (timeInBusinessMonths < 6 && creditScore >= 680) families.push(FUNDING_FAMILIES.startupCredit);
  if (purpose === "business_credit" || score < 45 || creditScore < 580) families.push(FUNDING_FAMILIES.creditBuilder);
  if (purpose === "not_sure" || redFlags.some((flag) => flag !== "none") || risks.length >= 3) families.push(FUNDING_FAMILIES.manualReview);

  const uniqueFamilies = [...new Set(families)];
  if (uniqueFamilies.length === 0) uniqueFamilies.push(score >= 65 ? FUNDING_FAMILIES.manualReview : FUNDING_FAMILIES.creditBuilder);

  return {
    primaryFundingFamily: uniqueFamilies[0],
    secondaryFundingFamilies: uniqueFamilies.slice(1, 4),
    recommendationCards: uniqueFamilies.slice(0, 4).map((family) => buildRecommendationCard(family))
  };
}

export function buildRecommendationCard(family) {
  const cards = {
    [FUNDING_FAMILIES.workingCapital]: { label: FUNDING_FAMILIES.workingCapital, summary: "Potential path for operators with recurring deposits and short-term cash flow needs.", nextStep: "Review recent bank activity and funding purpose." },
    [FUNDING_FAMILIES.revenueBased]: { label: FUNDING_FAMILIES.revenueBased, summary: "Potential path where revenue and deposit activity matter more than perfect paperwork.", nextStep: "Prepare recent business bank statements." },
    [FUNDING_FAMILIES.businessLine]: { label: FUNDING_FAMILIES.businessLine, summary: "Potential revolving access path for businesses with stronger credit, revenue, and operating history.", nextStep: "Review revenue, credit band, and time in business." },
    [FUNDING_FAMILIES.structuredGrowth]: { label: FUNDING_FAMILIES.structuredGrowth, summary: "Potential path for more established businesses seeking planned growth capital.", nextStep: "Prepare tax returns, bank statements, and financials." },
    [FUNDING_FAMILIES.startupCredit]: { label: FUNDING_FAMILIES.startupCredit, summary: "Potential path for newer operators where personal credit and income may matter more than business history.", nextStep: "Review credit profile, income documentation, and entity setup." },
    [FUNDING_FAMILIES.equipment]: { label: FUNDING_FAMILIES.equipment, summary: "Potential path for equipment, trucks, vehicles, or revenue-producing assets.", nextStep: "Prepare quote, invoice, spec sheet, or repair estimate." },
    [FUNDING_FAMILIES.realEstate]: { label: FUNDING_FAMILIES.realEstate, summary: "Potential path for property-backed or project-specific capital.", nextStep: "Prepare property details, purchase contract, rent roll, or project scope." },
    [FUNDING_FAMILIES.ecommerce]: { label: FUNDING_FAMILIES.ecommerce, summary: "Potential path for platform sellers with marketplace or store sales history.", nextStep: "Prepare marketplace sales reports or platform access details." },
    [FUNDING_FAMILIES.creditBuilder]: { label: FUNDING_FAMILIES.creditBuilder, summary: "Prep path for improving funding readiness before a deeper review.", nextStep: "Start with entity, banking, documentation, and credit-readiness basics." },
    [FUNDING_FAMILIES.manualReview]: { label: FUNDING_FAMILIES.manualReview, summary: "Best used when answers need context before recommending a path.", nextStep: "Speak with a funding strategist before applying." }
  };
  return cards[family] || cards[FUNDING_FAMILIES.manualReview];
}

export { FUNDING_FAMILIES };
