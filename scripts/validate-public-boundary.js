#!/usr/bin/env node
/* Scan public-facing files for private data, restricted claims, and internal registry imports. */
const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const publicExtensions = new Set([".html", ".css", ".js", ".json", ".md", ".txt", ".xml"]);
const ignoredDirs = new Set([".git", "node_modules", ".vercel", "internal"]);
const allowedScript = path.join("scripts", "validate-public-boundary.js");

const forbiddenPatterns = [
  { label: "affiliate/apply URL field", pattern: /\b(affiliate_url|affiliateUrl|apply_url|applyUrl)\b/i },
  { label: "provider identifier field", pattern: /\b(provider_id|providerId|lender_id|lenderId)\b/i },
  { label: "commission or payout field", pattern: /\b(commission|payout|revshare|revenue_share)\b/i },
  { label: "private notes field", pattern: /\b(private_notes|underwriting_notes|routing_secret|credentials)\b/i },
  { label: "guarantee claim", pattern: /\b(guaranteed funding|instant approval|final eligibility|best rates)\b/i },
  { label: "browser import of internal registry", pattern: /(fetch\(["']\/internal|from\s+["']\.\.\/\.\.\/internal|from\s+["']\/internal)/i }
];

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    const rel = path.relative(repoRoot, full);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) return [];
      return listFiles(full);
    }
    if (!publicExtensions.has(path.extname(entry.name))) return [];
    if (rel === allowedScript) return [];
    if (rel.startsWith("schemas" + path.sep) && rel.includes("schema")) return [];
    return [full];
  });
}

const issues = [];
listFiles(repoRoot).forEach((file) => {
  const rel = path.relative(repoRoot, file);
  const text = fs.readFileSync(file, "utf8");
  forbiddenPatterns.forEach((rule) => {
    if (rule.pattern.test(text)) issues.push(`${rel}: ${rule.label}`);
  });
});

if (issues.length) {
  console.error("Public boundary validation failed:");
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}
console.log("Public boundary validation passed.");
