#!/usr/bin/env node
/* Build public-safe indexes from site-data only. Does not read internal registries. */
const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const siteDataDir = path.join(repoRoot, "site-data");
const outDir = path.join(repoRoot, "public-indexes");
const outputPath = path.join(outDir, "funding-readiness.index.json");

function readJson(name) {
  const filePath = path.join(siteDataDir, name);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function list(data, key) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data[key] || data.items || data.pages || data.paths || data.resources || [];
}

function safePick(item, fields) {
  const clean = {};
  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(item, field)) clean[field] = item[field];
  });
  return clean;
}

const index = {
  id: "funding-readiness-public-index",
  generated_at: new Date().toISOString(),
  visibility: "public_runtime_browser_safe",
  disclaimer: "This index contains public-safe readiness content only and does not include provider, routing, affiliate, or underwriting data.",
  pages: list(readJson("pages.json"), "pages").map((item) => safePick(item, ["id", "title", "path", "description", "audience"])),
  funding_paths: list(readJson("funding-paths.json"), "paths").map((item) => safePick(item, ["id", "title", "summary", "description", "signals", "best_for"])),
  result_tiers: list(readJson("result-tiers.json"), "tiers").map((item) => safePick(item, ["id", "label", "summary", "next_steps", "page"])),
  resources: list(readJson("resource-library.json"), "resources").map((item) => safePick(item, ["id", "title", "type", "summary", "href"]))
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log(`Generated ${path.relative(repoRoot, outputPath)}.`);
