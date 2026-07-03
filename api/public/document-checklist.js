import fs from "node:fs";
import { runApiRoute, getQuery } from "../../lib/api/http.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { toPublicFundingPath } from "../../lib/api/safe-result-presenter.js";

const PUBLIC_FAMILIES_PATH = new URL("../../data/product-families.public.json", import.meta.url);

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    const query = getQuery(req);
    const fundingPurpose = String(query.fundingPurpose || "not_sure");
    const familyId = String(query.familyId || purposeToFamilyId(fundingPurpose));
    const registry = readRegistry(PUBLIC_FAMILIES_PATH);
    const paths = (registry.entries || []).map(toPublicFundingPath);
    const path = paths.find((entry) => entry.id === familyId || entry.familyId === familyId) || paths.find((entry) => entry.id === "manual-review");

    const checklist = buildChecklist({ familyId, fundingPurpose, path });
    return sendOk(res, assertPublicSafe({
      familyId,
      fundingPurpose,
      title: checklist.title,
      items: checklist.items,
      nextStep: checklist.nextStep,
      disclaimer: "Document checklists are preparation guidance only. Actual requirements depend on review and funding path."
    }));
  });
}

function buildChecklist({ familyId, fundingPurpose, path }) {
  const baseItems = [
    { id: "business-info", label: "Business information", detail: "Legal name, entity type, state, EIN status, and contact details." },
    { id: "bank-statements", label: "Recent business bank statements", detail: "Prepare the most recent 3 to 6 months when available." },
    { id: "funding-purpose", label: "Funding purpose notes", detail: "Summarize how funds would be used and why now." }
  ];

  const familyItems = {
    "equipment-asset-backed": [
      { id: "equipment-quote", label: "Equipment quote, invoice, or repair estimate", detail: "Include asset details, vendor information, and expected use." }
    ],
    "real-estate-asset-secured": [
      { id: "property-details", label: "Property details or project scope", detail: "Include address, purchase contract, rehab scope, rent roll, or exit plan where relevant." }
    ],
    "ecommerce-marketplace-capital": [
      { id: "marketplace-reports", label: "Marketplace or store sales reports", detail: "Prepare platform sales history, store reports, and payout records." }
    ],
    "startup-credit-leverage": [
      { id: "credit-income-docs", label: "Credit profile and income documentation", detail: "Prepare income records and review credit-readiness basics." }
    ],
    "business-credit-builder": [
      { id: "entity-banking-setup", label: "Entity, EIN, and banking setup records", detail: "Confirm entity formation, EIN confirmation, and business bank account setup." }
    ]
  };

  const purposeItems = {
    business_credit: [
      { id: "vendor-account-list", label: "Business credit setup checklist", detail: "List current accounts, vendor accounts, and business identity details." }
    ],
    debt_refi: [
      { id: "current-obligations", label: "Current obligation summary", detail: "List balances, payment frequency, and payoff goals." }
    ]
  };

  return {
    title: `${path?.label || "Funding Path"} Document Prep Checklist`,
    items: [...(familyItems[familyId] || []), ...(purposeItems[fundingPurpose] || []), ...baseItems].slice(0, 8),
    nextStep: "Collect the strongest available documents before requesting a funding strategy review."
  };
}

function purposeToFamilyId(purpose) {
  const map = {
    working_capital: "fast-working-capital",
    inventory_materials: "fast-working-capital",
    growth_marketing: "fast-working-capital",
    equipment_vehicle: "equipment-asset-backed",
    real_estate: "real-estate-asset-secured",
    ecommerce_growth: "ecommerce-marketplace-capital",
    startup_launch: "startup-credit-leverage",
    business_credit: "business-credit-builder"
  };
  return map[purpose] || "manual-review";
}

function readRegistry(url) {
  try {
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch {
    return { entries: [{ id: "manual-review", label: "Manual Funding Strategy Review" }] };
  }
}
