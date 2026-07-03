import { calculateFundingReadiness } from "./scorecard-engine.js";
import { getPublicDisclaimer } from "./result-copy.js";

const VALUE_MAPS = {
  businessPersona: {
    small_business: "existing_business",
    ecommerce: "ecommerce_seller",
    startup: "startup_founder",
    real_estate: "real_estate_investor",
    unsure: "not_sure"
  },
  bankStatus: {
    inconsistent: "low_inconsistent",
    nsf_recent: "recent_nsfs"
  },
  businessStructure: {
    entity_bank: "entity_with_bank"
  },
  fundingPurpose: {
    inventory: "inventory_materials",
    growth: "growth_marketing",
    equipment: "equipment_vehicle",
    ecommerce: "ecommerce_growth",
    startup: "startup_launch",
    debt_consolidation: "debt_refi"
  },
  redFlags: {
    recent_late_payments: "recent_missed_payments",
    existing_mca: "existing_daily_advance",
    no_revenue: "no_current_revenue"
  }
};

export function normalizeBrowserAnswers(rawAnswers = {}) {
  const redFlags = Array.isArray(rawAnswers.redFlags) ? rawAnswers.redFlags : [];

  return {
    businessPersona: mapValue("businessPersona", rawAnswers.businessPersona || rawAnswers.persona),
    monthlyRevenue: Number(rawAnswers.monthlyRevenue || 0),
    timeInBusinessMonths: Number(rawAnswers.timeInBusinessMonths || 0),
    creditScore: Number(rawAnswers.creditScore || 0),
    bankStatus: mapValue("bankStatus", rawAnswers.bankStatus),
    businessStructure: mapValue("businessStructure", rawAnswers.businessStructure || rawAnswers.structure),
    fundingPurpose: mapValue("fundingPurpose", rawAnswers.fundingPurpose || rawAnswers.purpose),
    desiredFundingAmount: Number(rawAnswers.desiredFundingAmount || rawAnswers.desiredAmount || 0),
    redFlags: redFlags.includes("none") ? ["none"] : redFlags.map((flag) => mapValue("redFlags", flag))
  };
}

export function calculateBrowserFundingReadiness(rawAnswers = {}, options = {}) {
  const answers = normalizeBrowserAnswers(rawAnswers);
  const result = calculateFundingReadiness(answers);
  if (result.valid === false) return result;

  const fundingPaths = [
    result.primaryFundingFamily,
    ...(result.secondaryFundingFamilies || [])
  ].filter(Boolean);

  return {
    ...result,
    tierLabel: result.tier.label,
    tierCopy: result.tier.summary,
    fundingPaths,
    primaryFamily: result.primaryFundingFamily,
    secondaryFamilies: result.secondaryFundingFamilies || [],
    disclaimer: getPublicDisclaimer(),
    answers,
    source: options.source || "Funding Readiness Scorecard",
    createdAt: result.calculatedAt
  };
}

export function buildScoreSubmission(result = {}, lead = {}, source = "Funding Readiness Scorecard") {
  const applicant = {
    firstName: firstNameFrom(lead.name),
    lastName: lastNameFrom(lead.name),
    email: String(lead.email || "").trim(),
    phone: String(lead.phone || "").trim(),
    businessName: String(lead.businessName || "").trim(),
    state: String(lead.state || "").trim().toUpperCase(),
    consent: lead.consent === true || lead.consent === "on"
  };

  return {
    source,
    applicant,
    answers: result.answers || {}
  };
}

export async function submitScoreForReview(payload) {
  try {
    const response = await fetch("/api/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return { ok: response.ok, status: response.status, body: await safeJson(response) };
  } catch (error) {
    return { ok: false, status: 0, error: "Score submission unavailable" };
  }
}

function mapValue(group, value) {
  const stringValue = String(value || "");
  return VALUE_MAPS[group]?.[stringValue] || stringValue;
}

function firstNameFrom(name = "") {
  return String(name).trim().split(/\s+/)[0] || "";
}

function lastNameFrom(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
