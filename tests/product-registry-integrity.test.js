import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const registryFiles = [
  "config/eam-tools.registry.json",
  "internal/tools/funding-tools.registry.json"
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function entriesFor(registry) {
  if (Array.isArray(registry)) return registry;
  return registry.items || registry.tools || registry.products || registry.entries || [];
}

test("product registries exist and expose valid entry arrays", () => {
  const existing = registryFiles.filter((filePath) => fs.existsSync(path.join(root, filePath)));

  assert.ok(existing.length > 0, "expected at least one product registry file");

  for (const filePath of existing) {
    const registry = readJson(filePath);
    const entries = entriesFor(registry);

    assert.ok(Array.isArray(entries), `${filePath} should contain items/tools/products/entries array`);
    assert.ok(entries.length > 0, `${filePath} should not be empty`);

    for (const entry of entries) {
      assert.equal(typeof entry.id, "string");
      assert.equal(typeof entry.name, "string");
      assert.equal(typeof entry.slug, "string");
      assert.equal(typeof entry.description, "string");
      assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  }
});

test("product registries do not expose restricted private values", () => {
  const restrictedPattern = /sk-|api[_-]?key|token|secret|password|commission|private apply|affiliate portal|underwriting notes/i;

  for (const filePath of registryFiles) {
    const absolutePath = path.join(root, filePath);
    if (!fs.existsSync(absolutePath)) continue;

    const raw = fs.readFileSync(absolutePath, "utf8");
    assert.equal(restrictedPattern.test(raw), false, `${filePath} contains restricted private-looking text`);
  }
});

test("public registry entries use unique ids and slugs", () => {
  const seenIds = new Set();
  const seenSlugs = new Set();

  for (const filePath of registryFiles) {
    const absolutePath = path.join(root, filePath);
    if (!fs.existsSync(absolutePath)) continue;

    for (const entry of entriesFor(readJson(filePath))) {
      assert.equal(seenIds.has(entry.id), false, `duplicate id: ${entry.id}`);
      assert.equal(seenSlugs.has(entry.slug), false, `duplicate slug: ${entry.slug}`);
      seenIds.add(entry.id);
      seenSlugs.add(entry.slug);
    }
  }
});
