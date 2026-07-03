import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "config", "api", "api-routes.registry.json");
const outputPath = path.join(root, "docs", "api", "route-index.generated.md");

if (!fs.existsSync(registryPath)) {
  console.error(`Missing registry: ${path.relative(root, registryPath)}`);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const entries = Array.isArray(registry.entries) ? registry.entries : [];

const publicRoutes = entries.filter((entry) => entry.visibility !== "server_side_internal");
const internalRoutes = entries.filter((entry) => entry.visibility === "server_side_internal");

const lines = [
  "# Generated API Route Index",
  "",
  "Generated from `/config/api/api-routes.registry.json`.",
  "",
  "## Public-safe routes",
  "",
  "| Method | Route | File | Purpose |",
  "|---|---|---|---|",
  ...publicRoutes.map((entry) => `| \`${entry.method}\` | \`${entry.path}\` | \`${entry.file}\` | ${escapePipes(entry.purpose)} |`),
  "",
  "## Internal/admin-only routes",
  "",
  "These routes must not be imported into public GPT Actions.",
  "",
  "| Method | Route | File | Purpose |",
  "|---|---|---|---|",
  ...internalRoutes.map((entry) => `| \`${entry.method}\` | \`${entry.path}\` | \`${entry.file}\` | ${escapePipes(entry.purpose)} |`),
  "",
  "## Boundary reminder",
  "",
  "Public API output is readiness guidance only. Do not return private routing, hidden partner details, credentials, or real borrower records.",
  ""
];

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join("\n"));
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} routes.`);

function escapePipes(value) {
  return String(value || "").replaceAll("|", "\\|");
}
