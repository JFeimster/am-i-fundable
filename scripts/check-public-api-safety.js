import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanTargets = [
  "api",
  "lib/api",
  "schemas/api",
  "schemas/openapi",
  "examples/api",
  "docs/api"
];

const forbiddenFields = [
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
  "keyContact",
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
  "secret",
  "webhook_secret"
];

const restrictedOutcomePhrases = [
  new RegExp(["you are", " approved"].join(""), "i"),
  new RegExp(["guaranteed", " funding"].join(""), "i"),
  new RegExp(["final", " eligibility"].join(""), "i"),
  new RegExp(["underwriting", " complete"].join(""), "i"),
  new RegExp(["best rates", " guaranteed"].join(""), "i"),
  new RegExp(["instant", " approval"].join(""), "i")
];

const allowedFilesForFieldNames = new Set([
  path.normalize("lib/api/public-boundary.js"),
  path.normalize("scripts/check-public-api-safety.js"),
  path.normalize("docs/api/public-data-boundary.md")
]);

const issues = [];

for (const target of scanTargets) {
  const absoluteTarget = path.join(root, target);
  if (!fs.existsSync(absoluteTarget)) continue;

  for (const filePath of listFiles(absoluteTarget)) {
    const relative = path.normalize(path.relative(root, filePath));
    const ext = path.extname(filePath).toLowerCase();
    if (![".js", ".json", ".yaml", ".yml", ".md", ".html", ".css"].includes(ext)) continue;

    const content = fs.readFileSync(filePath, "utf8");

    if (!allowedFilesForFieldNames.has(relative)) {
      for (const field of forbiddenFields) {
        const quoted = new RegExp(`["']${escapeRegex(field)}["']`);
        const bare = new RegExp(`\\b${escapeRegex(field)}\\b`);
        if (quoted.test(content) || bare.test(content)) {
          issues.push(`${relative}: forbidden private field/reference found: ${field}`);
        }
      }
    }

    for (const pattern of restrictedOutcomePhrases) {
      if (pattern.test(content)) {
        issues.push(`${relative}: restricted outcome phrase found: ${pattern}`);
      }
    }
  }
}

if (issues.length > 0) {
  console.error("Public API safety check failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Public API safety check passed.");

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

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
