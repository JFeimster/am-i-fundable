#!/usr/bin/env node
/* Validate public JSON data files without external dependencies. */
const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const dataDir = path.join(repoRoot, "site-data");
const requiredFiles = [
  "pages.json",
  "navigation.json",
  "ctas.json",
  "faq.json",
  "result-tiers.json",
  "document-checklists.json",
  "funding-paths.json",
  "audiences.json",
  "forms.json",
  "trust-badges.json",
  "resource-library.json",
  "lead-magnets.json",
  "embed-presets.json",
  "seo-pages.json",
  "analytics-events.json"
];

const forbiddenKeys = [
  "provider_id",
  "providerId",
  "affiliate_url",
  "affiliateUrl",
  "apply_url",
  "applyUrl",
  "commission",
  "private_notes",
  "underwriting_notes",
  "credentials",
  "secret"
];

function walk(value, file, trail = []) {
  if (!value || typeof value !== "object") return [];
  const issues = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => issues.push(...walk(item, file, trail.concat(index))));
    return issues;
  }
  Object.keys(value).forEach((key) => {
    if (forbiddenKeys.includes(key)) issues.push(`${file}: forbidden key ${trail.concat(key).join(".")}`);
    issues.push(...walk(value[key], file, trail.concat(key)));
  });
  return issues;
}

function validateFile(name) {
  const filePath = path.join(dataDir, name);
  if (!fs.existsSync(filePath)) return [`Missing ${name}`];
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const issues = walk(parsed, name);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && !parsed.id && !parsed.generated_from && !Object.keys(parsed).length) {
      issues.push(`${name}: empty object is not useful site data`);
    }
    return issues;
  } catch (error) {
    return [`${name}: invalid JSON - ${error.message}`];
  }
}

if (!fs.existsSync(dataDir)) {
  console.error("Missing site-data directory.");
  process.exit(1);
}

const issues = requiredFiles.flatMap(validateFile);
if (issues.length) {
  console.error("Site data validation failed:");
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}
console.log(`Site data validation passed for ${requiredFiles.length} files.`);
