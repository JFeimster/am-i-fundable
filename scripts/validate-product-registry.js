import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const registryPaths = [
  "config/eam-tools.registry.json",
  "internal/tools/funding-tools.registry.json"
].map((filePath) => path.join(root, filePath));

const existingRegistryPaths = registryPaths.filter((filePath) => fs.existsSync(filePath));
let failed = false;

if (existingRegistryPaths.length === 0) {
  console.error("PRODUCT REGISTRY INVALID  No product registry files found.");
  console.error("Expected at least one of:");
  for (const filePath of registryPaths) console.error(`- ${path.relative(root, filePath)}`);
  process.exit(1);
}

const seenIds = new Map();
const seenSlugs = new Map();

for (const filePath of existingRegistryPaths) {
  const relativePath = path.relative(root, filePath);
  let registry;

  try {
    registry = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failed = true;
    console.error(`PRODUCT REGISTRY INVALID  ${relativePath}  ${error.message}`);
    continue;
  }

  const entries = getRegistryEntries(registry);

  if (!entries.length) {
    failed = true;
    console.error(`PRODUCT REGISTRY INVALID  ${relativePath}  Registry must contain a non-empty items/tools/products/entries array.`);
    continue;
  }

  entries.forEach((entry, index) => {
    const prefix = `${relativePath}#${index}`;

    requireString(entry, "id", prefix);
    requireString(entry, "name", prefix);
    requireString(entry, "slug", prefix);
    requireString(entry, "description", prefix);

    if (entry.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
      fail(`${prefix}.slug must be kebab-case.`);
    }

    if (entry.url && typeof entry.url === "string" && /sk-|api[_-]?key|token|secret|password/i.test(entry.url)) {
      fail(`${prefix}.url appears to expose a secret-like value.`);
    }

    if (entry.visibilityClass && ![
      "public_runtime_browser_safe",
      "public_build_time_only",
      "server_side_internal",
      "restricted_internal_no_repo"
    ].includes(entry.visibilityClass)) {
      fail(`${prefix}.visibilityClass is not recognized.`);
    }

    trackUnique(seenIds, entry.id, `${prefix}.id`);
    trackUnique(seenSlugs, entry.slug, `${prefix}.slug`);
  });

  console.log(`PRODUCT REGISTRY OK  ${relativePath}  ${entries.length} entries`);
}

if (failed) process.exit(1);

function getRegistryEntries(registry) {
  if (Array.isArray(registry)) return registry;
  if (Array.isArray(registry.items)) return registry.items;
  if (Array.isArray(registry.tools)) return registry.tools;
  if (Array.isArray(registry.products)) return registry.products;
  if (Array.isArray(registry.entries)) return registry.entries;
  return [];
}

function requireString(object, field, prefix) {
  if (!object || typeof object[field] !== "string" || object[field].trim().length === 0) {
    fail(`${prefix}.${field} must be a non-empty string.`);
  }
}

function trackUnique(map, value, label) {
  if (!value) return;
  if (map.has(value)) {
    fail(`${label} duplicates ${map.get(value)}.`);
    return;
  }
  map.set(value, label);
}

function fail(message) {
  failed = true;
  console.error(`PRODUCT REGISTRY INVALID  ${message}`);
}
