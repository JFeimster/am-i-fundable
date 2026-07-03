import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures");

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, name), "utf8"));
}

test("partner match engine ranks products without exposing private partner data", async (t) => {
  let engine;

  try {
    engine = await import("../lib/partner-match-engine.js");
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND") {
      t.skip("partner-match-engine.js not present yet; enable this test when Batch 8/partner matching lands.");
      return;
    }
    throw error;
  }

  const matchFn =
    engine.matchFundingProducts ||
    engine.matchPartnerProducts ||
    engine.rankFundingProducts ||
    engine.default;

  assert.equal(typeof matchFn, "function", "partner match engine must export a matching function");

  const fixture = readFixture("hot-lead.json");
  const matches = await matchFn(fixture.answers);

  assert.ok(Array.isArray(matches), "partner match engine should return an array");
  assert.ok(matches.length > 0, "partner match engine should return at least one match");

  for (const match of matches) {
    assert.equal(typeof match, "object");
    assert.equal(typeof match.name === "string" || typeof match.productName === "string" || typeof match.label === "string", true);
    assert.equal(/sk-|api[_-]?key|token|secret|password|commission|private apply|affiliate portal/i.test(JSON.stringify(match)), false);
  }
});
