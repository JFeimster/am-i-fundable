export const TIER_COPY = {
  highly_fundable: { headline: "Strong Readiness Signals", body: "Your answers show stronger indicators across revenue, business history, banking, credit, or structure. A funding strategy review is the recommended next step.", ctaLabel: "Request a Funding Strategy Review" },
  fundable_review: { headline: "Good Signals, Needs Review", body: "Your answers show several positive signals, but one or more items should be reviewed before moving forward.", ctaLabel: "Review My Funding Paths" },
  selective_programs: { headline: "Possible Path, Prep Recommended", body: "Your answers suggest there may be selective paths, but documentation and risk items should be cleaned up first.", ctaLabel: "Get a Prep Checklist" },
  not_ready_fixable: { headline: "Not Ready Yet — But Fixable", body: "Your answers suggest prep work should come before a funding review. Focus on banking, documents, revenue consistency, and structure.", ctaLabel: "Build My Funding Readiness" }
};

export function getTierCopy(tierId) {
  return TIER_COPY[tierId] || TIER_COPY.not_ready_fixable;
}

export function getRecommendedDocuments(answers = {}) {
  const docs = ["Last 3–6 months of business bank statements", "Government ID", "Business formation documents", "EIN confirmation, if available"];
  if (answers.fundingPurpose === "ecommerce_growth" || answers.businessPersona === "ecommerce_seller") docs.push("Marketplace or store sales reports");
  if (answers.fundingPurpose === "equipment_vehicle" || answers.businessPersona === "equipment_heavy") docs.push("Equipment quote, invoice, spec sheet, or repair estimate");
  if (answers.fundingPurpose === "real_estate" || answers.businessPersona === "real_estate_investor") docs.push("Property address, purchase contract, rent roll, lease, appraisal, or project scope");
  if (Number(answers.timeInBusinessMonths || 0) >= 24) docs.push("Recent tax returns or year-to-date financials, if available");
  return [...new Set(docs)];
}

export function getNextSteps(score) {
  if (score >= 80) return ["Review your last 3–6 months of bank activity.", "Confirm the funding purpose and desired amount.", "Request a funding strategy review before submitting documents."];
  if (score >= 65) return ["Resolve any banking or documentation gaps before applying.", "Review your strongest funding path and backup path.", "Speak with a strategist to avoid applying for the wrong product."];
  if (score >= 45) return ["Prepare bank statements and business documents.", "Clarify your funding purpose and realistic request amount.", "Clean up the highest-risk blocker before submitting."];
  return ["Open or stabilize a business bank account.", "Build consistent revenue documentation.", "Focus on business structure, credit-readiness, and basic documentation first."];
}

export function getPublicDisclaimer() {
  return "This scorecard is for educational and pre-screening guidance only. It is not a lending decision, commitment to lend, or funding offer. Actual options depend on documentation, lender criteria, business performance, credit profile, bank activity, and other review factors.";
}
