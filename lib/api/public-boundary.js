import { privateBoundaryViolation } from "./errors.js";

export const SENSITIVE_PUBLIC_KEYS = new Set([
  "providerId",
  "providerName",
  "provider",
  "lender",
  "lenderId",
  "affiliateUrl",
  "applyUrl",
  "referralUrl",
  "commission",
  "commissionRate",
  "payout",
  "contactEmail",
  "keyContact",
  "privateNotes",
  "internalNotes",
  "routingNotes",
  "underwritingNotes",
  "portalUrl",
  "dashboardUrl",
  "rawApplyUrl",
  "notionUrl",
  "apiKey",
  "token",
  "secret"
]);

export const RESTRICTED_PUBLIC_PHRASES = [
  /\byou are approved\b/i,
  /\bguaranteed funding\b/i,
  /\bfinal eligibility\b/i,
  /\bunderwriting complete\b/i,
  /\bbest rates guaranteed\b/i,
  /\binstant approval\b/i
];

export function sanitizeForPublic(value) {
  if (Array.isArray(value)) return value.map(sanitizeForPublic).filter((item) => item !== undefined);
  if (!value || typeof value !== "object") return value;

  const output = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (SENSITIVE_PUBLIC_KEYS.has(key)) continue;
    output[key] = sanitizeForPublic(nestedValue);
  }
  return output;
}

export function assertPublicSafe(value, context = "publicResponse") {
  const issues = findPublicBoundaryIssues(value, context);
  if (issues.length > 0) {
    throw privateBoundaryViolation(issues);
  }
  return value;
}

export function findPublicBoundaryIssues(value, context = "publicResponse") {
  const issues = [];
  walk(value, [context], issues);
  return issues;
}

function walk(value, path, issues) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...path, String(index)], issues));
    return;
  }

  if (!value || typeof value !== "object") {
    if (typeof value === "string") scanText(value, path, issues);
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const nextPath = [...path, key];

    if (SENSITIVE_PUBLIC_KEYS.has(key) && hasMeaningfulValue(nestedValue)) {
      issues.push({ path: nextPath.join("."), message: "Sensitive internal field is not allowed in public output." });
    }

    walk(nestedValue, nextPath, issues);
  }
}

function scanText(text, path, issues) {
  for (const pattern of RESTRICTED_PUBLIC_PHRASES) {
    if (pattern.test(text)) {
      issues.push({ path: path.join("."), message: "Restricted certainty/outcome phrase found." });
    }
  }
}

function hasMeaningfulValue(value) {
  if (value === null || value === undefined || value === false || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}
