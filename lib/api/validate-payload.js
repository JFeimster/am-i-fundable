import { validationError } from "./errors.js";

export const SCORECARD_FIELDS = [
  "businessPersona",
  "monthlyRevenue",
  "timeInBusinessMonths",
  "creditScore",
  "bankStatus",
  "businessStructure",
  "fundingPurpose",
  "desiredFundingAmount",
  "redFlags"
];

export function validateRequiredObject(value, name = "payload") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw validationError([{ field: name, message: `${name} must be an object.` }]);
  }
  return value;
}

export function validateRequiredFields(value, fields = [], prefix = "") {
  validateRequiredObject(value, prefix || "payload");
  const errors = [];

  for (const field of fields) {
    const fieldPath = prefix ? `${prefix}.${field}` : field;
    const fieldValue = value[field];

    if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
      errors.push({ field: fieldPath, message: `${fieldPath} is required.` });
    }
  }

  if (errors.length > 0) throw validationError(errors);
  return value;
}

export function normalizeScorecardAnswers(input = {}) {
  return {
    businessPersona: String(input.businessPersona || "not_sure"),
    monthlyRevenue: toNonNegativeNumber(input.monthlyRevenue),
    timeInBusinessMonths: toNonNegativeNumber(input.timeInBusinessMonths),
    creditScore: toNonNegativeNumber(input.creditScore),
    bankStatus: String(input.bankStatus || "none"),
    businessStructure: String(input.businessStructure || "none"),
    fundingPurpose: String(input.fundingPurpose || "not_sure"),
    desiredFundingAmount: toNonNegativeNumber(input.desiredFundingAmount),
    redFlags: normalizeRedFlags(input.redFlags)
  };
}

export function validateScorecardAnswers(input = {}) {
  const answers = normalizeScorecardAnswers(input);
  const errors = [];

  for (const field of SCORECARD_FIELDS) {
    if (answers[field] === undefined || answers[field] === null || answers[field] === "") {
      errors.push({ field, message: `${field} is required.` });
    }
  }

  if (!Array.isArray(answers.redFlags) || answers.redFlags.length === 0) {
    errors.push({ field: "redFlags", message: "Select at least one red-flag option." });
  }

  if (answers.redFlags.includes("none") && answers.redFlags.length > 1) {
    errors.push({ field: "redFlags", message: "Use either none or specific caution flags, not both." });
  }

  if (errors.length > 0) throw validationError(errors);
  return answers;
}

export function normalizeApplicant(input = {}) {
  return {
    firstName: cleanText(input.firstName || input.name || ""),
    lastName: cleanText(input.lastName || ""),
    businessName: cleanText(input.businessName || ""),
    email: cleanText(input.email || ""),
    phone: cleanText(input.phone || ""),
    state: cleanText(input.state || ""),
    consent: input.consent === true || input.contactConsent === true
  };
}

export function validateReviewApplicant(input = {}) {
  const applicant = normalizeApplicant(input);
  const errors = [];

  if (!applicant.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email)) {
    errors.push({ field: "applicant.email", message: "A valid email is required for review requests." });
  }

  if (!applicant.consent) {
    errors.push({ field: "applicant.consent", message: "Consent is required before requesting follow-up review." });
  }

  if (errors.length > 0) throw validationError(errors);
  return applicant;
}

function normalizeRedFlags(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (!value) return ["none"];
  return [String(value)];
}

function toNonNegativeNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number < 0) return 0;
  return number;
}

function cleanText(value) {
  return String(value || "").trim().slice(0, 160);
}
