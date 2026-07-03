const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAnswers(answers = {}) {
  const errors = [];
  requireField(errors, answers, "businessPersona");
  requireNumber(errors, answers, "monthlyRevenue");
  requireNumber(errors, answers, "timeInBusinessMonths");
  requireNumber(errors, answers, "creditScore");
  requireField(errors, answers, "bankStatus");
  requireField(errors, answers, "businessStructure");
  requireField(errors, answers, "fundingPurpose");
  requireNumber(errors, answers, "desiredFundingAmount");

  if (!Array.isArray(answers.redFlags)) errors.push({ field: "redFlags", message: "Select at least one red-flag option." });
  if (Array.isArray(answers.redFlags) && answers.redFlags.includes("none") && answers.redFlags.length > 1) {
    errors.push({ field: "redFlags", message: "Use either none or specific red flags, not both." });
  }
  return { valid: errors.length === 0, errors };
}

export function validateLeadContact(leadContact = {}) {
  const errors = [];
  if (!leadContact.name || String(leadContact.name).trim().length < 1) errors.push({ field: "name", message: "Name is required." });
  if (!leadContact.email || !EMAIL_PATTERN.test(String(leadContact.email).trim())) errors.push({ field: "email", message: "Valid email is required." });
  if (!leadContact.phone || String(leadContact.phone).replace(/\D/g, "").length < 7) errors.push({ field: "phone", message: "Phone is required." });
  if (!leadContact.state || String(leadContact.state).trim().length < 2) errors.push({ field: "state", message: "State is required." });
  return { valid: errors.length === 0, errors };
}

export function validateConsent(consent = {}) {
  const valid = consent.contactConsent === true;
  return { valid, errors: valid ? [] : [{ field: "contactConsent", message: "Consent is required before submitting." }] };
}

export function normalizeAnswers(answers = {}) {
  return {
    businessPersona: String(answers.businessPersona || "not_sure"),
    monthlyRevenue: Number(answers.monthlyRevenue || 0),
    timeInBusinessMonths: Number(answers.timeInBusinessMonths || 0),
    creditScore: Number(answers.creditScore || 0),
    bankStatus: String(answers.bankStatus || "none"),
    businessStructure: String(answers.businessStructure || "none"),
    fundingPurpose: String(answers.fundingPurpose || "not_sure"),
    desiredFundingAmount: Number(answers.desiredFundingAmount || 0),
    redFlags: Array.isArray(answers.redFlags) ? answers.redFlags : []
  };
}

export function validateSubmission(submission = {}) {
  const answerCheck = validateAnswers(submission.answers || {});
  const contactCheck = validateLeadContact(submission.leadContact || {});
  const consentCheck = validateConsent(submission.consent || {});
  return { valid: answerCheck.valid && contactCheck.valid && consentCheck.valid, errors: [...answerCheck.errors, ...contactCheck.errors, ...consentCheck.errors] };
}

function requireField(errors, object, field) {
  if (!object[field]) errors.push({ field, message: `${field} is required.` });
}

function requireNumber(errors, object, field) {
  const value = Number(object[field]);
  if (!Number.isFinite(value) || value < 0) errors.push({ field, message: `${field} must be a positive number or zero.` });
}
