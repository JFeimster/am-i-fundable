import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const blockedFields = new Set([
  "affiliate_url",
  "affiliateUrl",
  "apply_url",
  "applyUrl",
  "referral_url",
  "referralUrl",
  "commission",
  "commission_rate",
  "commissionRate",
  "payout",
  "partner_contact",
  "contact_email",
  "contactEmail",
  "private_notes",
  "privateNotes",
  "internal_notes",
  "internalNotes",
  "routing_notes",
  "routingNotes",
  "underwriting_notes",
  "underwritingNotes",
  "portal_url",
  "portalUrl",
  "dashboard_url",
  "dashboardUrl",
  "raw_apply_url",
  "rawApplyUrl",
  "api_key",
  "apiKey",
  "token",
  "secret",
  "webhook_secret",
  "notionUrl",
  "website",
  "keyContact"
]);

const ignoredFiles = new Set([
  path.normalize("config/directories/public-funding-directory.registry.json"),
  path.normalize("docs/private-data-handling.md"),
  path.normalize("schemas/private-data-boundary.schema.json"),
  path.normalize("scripts/scan-private-data.js"),
  path.normalize("scripts/sanitize-private-data.js"),
  path.normalize("config/registry-visibility.json"),
  path.normalize("internal/routing/funding-provider-rules.registry.json"),
  path.normalize("scripts/build-public-data.js"),
  path.normalize("api/match-partners.js"),
  path.normalize("internal/crm/hubspot-field-map.json"),
  path.normalize("internal/crm/notion-field-map.json"),
  path.normalize("internal/crm/funding-pipeline-field-map.json"),
  path.normalize("internal/crm/webhook-targets.example.json")
]);

const ignoredDirectories = [
  `${path.normalize("schemas")}${path.sep}`
];

const issues = [];

for (const file of listFiles(root)) {
  const relativePath = path.relative(root, file);
  const normalizedPath = path.normalize(relativePath);
  if (ignoredFiles.has(normalizedPath)) continue;
  if (ignoredDirectories.some((dir) => normalizedPath.startsWith(dir))) continue;

  if (relativePath.endsWith(".json")) {
    scanJsonFile(file, relativePath);
  } else if (/\.(js|html|md|css)$/i.test(relativePath)) {
    scanTextFile(file, relativePath);
  }
}

if (issues.length > 0) {
  console.error("Private data scan failed:");
  issues.forEach((issue) => console.error(issue));
  process.exit(1);
}

console.log("Private data scan passed.");

function scanJsonFile(file, relativePath) {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  walkJson(parsed, relativePath, []);
}

function walkJson(value, relativePath, pathParts) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkJson(item, relativePath, [...pathParts, String(index)]));
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, nestedValue] of Object.entries(value)) {
    const currentPath = [...pathParts, key];
    if (blockedFields.has(key) && hasSensitiveValue(key, nestedValue)) {
      issues.push(`${relativePath}:${currentPath.join(".")}=${JSON.stringify(nestedValue)}`);
    }
    walkJson(nestedValue, relativePath, currentPath);
  }
}

function hasSensitiveValue(key, value) {
  if (value === null || value === false) return false;
  if (Array.isArray(value)) return value.some((item) => hasSensitiveValue(key, item));
  if (typeof value === "object") {
    if (isSchemaLikeObject(value)) return false;
    return Object.values(value).some((item) => hasSensitiveValue(key, item));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (/^demo_|^example_|^placeholder_|^public_|^not_returned$/i.test(trimmed)) return false;
    if (/https?:\/\//i.test(trimmed)) return true;
    if (/@/.test(trimmed)) return true;
    if (/api|token|secret|key/i.test(key)) return trimmed.length > 6;
    return ["commission", "commission_rate", "commissionRate", "payout"].includes(key);
  }
  if (typeof value === "number") return ["commission", "commission_rate", "commissionRate", "payout"].includes(key);
  return true;
}

function isSchemaLikeObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Boolean(value.type || value.description || value.properties || value.items || value.enum || value.examples);
}

function scanTextFile(file, relativePath) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const hasSensitiveValue = /https?:\/\/|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(line);
    const hasBlockedField = /affiliateUrl|applyUrl|commissionRate|contactEmail|notionUrl|keyContact|website|portalUrl|dashboardUrl|referralUrl|rawApplyUrl|apiKey|token|secret/i.test(line);
    if (!hasSensitiveValue || !hasBlockedField) return;
    issues.push(`${relativePath}:${index + 1}:${line.trim()}`);
  });
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules"].includes(entry.name)) return [];
      return listFiles(fullPath);
    }
    return [fullPath];
  });
}
