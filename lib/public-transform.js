const BLOCKED_PUBLIC_FIELDS = new Set([
  "providerName",
  "providerId",
  "affiliate",
  "affiliateUrl",
  "applyUrl",
  "commissionRate",
  "contactEmail",
  "keyContact",
  "website",
  "source",
  "routing",
  "underwriting",
  "privateNotes",
  "internalNotes",
  "notes"
]);

export const PUBLIC_FAMILY_LABELS = {
  "working-capital": "Fast Working Capital",
  "business-line-access": "Business Line of Credit",
  "structured-growth-loans": "Structured Growth Capital",
  "startup-credit-leverage": "Startup / Credit-Leverage Funding",
  "equipment-finance": "Equipment / Truck / Asset-Backed Funding",
  "real-estate-capital": "Real Estate / Asset-Secured Capital",
  "marketplace-capital": "Ecommerce / Marketplace Seller Capital"
};

export function stripBlockedFields(value) {
  if (Array.isArray(value)) return value.map(stripBlockedFields);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !BLOCKED_PUBLIC_FIELDS.has(key))
      .map(([key, nested]) => [key, stripBlockedFields(nested)])
  );
}

export function toPublicProductFamily(productFamilyId, products = []) {
  const familyProducts = products.filter((product) => product.productFamily === productFamilyId);
  return {
    id: toPublicFamilyId(productFamilyId),
    sourceFamilyId: productFamilyId,
    label: PUBLIC_FAMILY_LABELS[productFamilyId] || "Manual Funding Strategy Review",
    summary: getFamilySummary(productFamilyId),
    fundingTypes: [...new Set(familyProducts.map((product) => product.fundingType).filter(Boolean))].sort(),
    sourceProductCount: familyProducts.length,
    primaryCta: { label: "Get My Funding Score", href: "#scorecard" }
  };
}

export function toPublicProductsRegistry(internalProductsRegistry = {}) {
  const products = internalProductsRegistry.entries || [];
  const families = [...new Set(products.map((product) => product.productFamily).filter(Boolean))].sort();
  return {
    id: "products-public",
    name: "Public Funding Path Summaries",
    version: "1.0.0",
    visibility: "public_runtime_browser_safe",
    generatedFrom: "internal/products/funding-products.registry.json",
    note: "White-labeled summaries only. Provider-specific details are intentionally omitted.",
    entries: families.map((familyId) => toPublicProductFamily(familyId, products))
  };
}

export function toPublicProviderCategories() {
  return {
    id: "provider-categories-public",
    name: "Provider Category Summaries",
    version: "1.0.0",
    visibility: "public_runtime_browser_safe",
    note: "This file intentionally avoids naming individual providers or exposing affiliate/apply details.",
    entries: [
      { id: "working-capital-network", label: "Working Capital Network", description: "Potential capital paths for operators with recurring deposits and short-term cash flow needs." },
      { id: "business-line-network", label: "Business Line Network", description: "Potential revolving-access paths for businesses with stronger revenue, credit, and operating history." },
      { id: "startup-credit-network", label: "Startup / Credit-Leverage Network", description: "Potential paths for newer operators where credit and income may matter more than business history." },
      { id: "asset-capital-network", label: "Asset-Secured Capital Network", description: "Potential paths for equipment, vehicles, trucks, real estate, and other asset-backed needs." },
      { id: "marketplace-seller-network", label: "Marketplace Seller Capital Network", description: "Potential paths for ecommerce sellers with platform/store sales history." }
    ]
  };
}

export function toPublicFamilyId(familyId = "manual-review") {
  return String(familyId)
    .replace("working-capital", "fast-working-capital")
    .replace("business-line-access", "business-line-of-credit")
    .replace("structured-growth-loans", "structured-growth-capital")
    .replace("equipment-finance", "equipment-asset-backed")
    .replace("real-estate-capital", "real-estate-asset-secured")
    .replace("marketplace-capital", "ecommerce-marketplace-capital")
    .replace(/_/g, "-");
}

function getFamilySummary(familyId) {
  const summaries = {
    "working-capital": "Potential path for operators with recurring business deposits and short-term cash-flow needs.",
    "business-line-access": "Potential revolving-access path for businesses with stronger revenue, credit, and operating history.",
    "structured-growth-loans": "Potential path for more established operators seeking planned growth capital or better-structured terms.",
    "startup-credit-leverage": "Potential path for newer operators where personal credit, income, and clean setup may matter more than business history.",
    "equipment-finance": "Potential path for revenue-producing equipment, vehicles, trucks, repairs, or asset-backed needs.",
    "real-estate-capital": "Potential path for property-backed or project-specific capital.",
    "marketplace-capital": "Potential path for ecommerce or marketplace sellers with sales history and platform data."
  };
  return summaries[familyId] || "Potential funding path requiring manual review.";
}
