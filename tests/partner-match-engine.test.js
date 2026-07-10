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

test("partner match engine returns public-safe recommendations", async () => {
  const engine = await import("../lib/partner-match-engine.js");
  assert.equal(typeof engine.matchPartners, "function", "partner match engine must export matchPartners");

  const fixture = readFixture("hot-lead.json");
  const applicant = {
    ...fixture.answers,
    fundingReadinessScore: 82
  };
  const providers = [
    {
      id: "demo-working-capital-provider",
      name: "Internal Demo Provider",
      productFamilyIds: ["working-capital"],
      eligibility: {
        minCreditScore: 500,
        minMonthlyRevenue: 5000,
        minTimeInBusinessMonths: 3
      },
      industryAppetite: []
    }
  ];

  const result = engine.matchPartners(applicant, providers, [], { maxMatches: 5 });
  const recommendations = result.publicRecommendations;

  assert.ok(Array.isArray(recommendations), "public recommendations should be an array");
  assert.ok(recommendations.length > 0, "public recommendations should include at least one funding path");

  for (const recommendation of recommendations) {
    assert.equal(typeof recommendation, "object");
    assert.equal(typeof recommendation.publicLabel, "string");
    const serialized = JSON.stringify(recommendation);
    assert.equal(/sk-|api[_-]?key|token|secret|password|commission|private apply|affiliate portal/i.test(serialized), false);
    assert.equal(serialized.includes("Internal Demo Provider"), false, "provider identity must not leak into public recommendations");
  }
});
