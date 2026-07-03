import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  calculateFundingReadiness,
  getScoreTier,
  scoreRevenue,
  scoreTimeInBusiness,
  scoreCredit,
  scoreBankActivity,
  scoreBusinessStructure,
  scoreFundingPurpose,
  calculateRedFlagPenalty
} from "../lib/scorecard-engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures");

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, name), "utf8"));
}

test("scorecard engine returns expected lead tiers for core fixtures", () => {
  const cases = [
    ["hot-lead.json", "highly_fundable", "hot", [80, 100]],
    ["warm-lead.json", "fundable_review", "warm", [65, 79]],
    ["nurture-lead.json", "selective_programs", "nurture", [45, 64]],
    ["not-ready-lead.json", "not_ready_fixable", "education", [0, 44]]
  ];

  for (const [fixtureName, expectedTierId, expectedLeadPriority, [minScore, maxScore]] of cases) {
    const fixture = readFixture(fixtureName);
    const result = calculateFundingReadiness(fixture.answers);

    assert.equal(result.valid, true, `${fixtureName} should be valid`);
    assert.equal(result.tier.id, expectedTierId, `${fixtureName} tier mismatch`);
    assert.equal(result.leadPriority, expectedLeadPriority, `${fixtureName} lead priority mismatch`);
    assert.ok(result.score >= minScore && result.score <= maxScore, `${fixtureName} score ${result.score} outside ${minScore}-${maxScore}`);
    assert.equal(typeof result.primaryFundingFamily, "string");
    assert.ok(Array.isArray(result.recommendationCards));
    assert.ok(Array.isArray(result.nextSteps));
    assert.ok(Array.isArray(result.recommendedDocuments));
  }
});

test("scorecard scoring primitives preserve current scoring bands", () => {
  assert.equal(scoreRevenue(100000), 25);
  assert.equal(scoreRevenue(15000), 18);
  assert.equal(scoreRevenue(8500), 13);
  assert.equal(scoreRevenue(2999), 0);

  assert.equal(scoreTimeInBusiness(24), 20);
  assert.equal(scoreTimeInBusiness(12), 16);
  assert.equal(scoreTimeInBusiness(6), 12);
  assert.equal(scoreTimeInBusiness(1), 4);

  assert.equal(scoreCredit(700), 20);
  assert.equal(scoreCredit(680), 18);
  assert.equal(scoreCredit(600), 13);
  assert.equal(scoreCredit(500), 5);

  assert.equal(scoreBankActivity("strong_clean"), 15);
  assert.equal(scoreBankActivity("consistent"), 11);
  assert.equal(scoreBankActivity("none"), 0);

  assert.equal(scoreBusinessStructure("entity_bank_ein_clean"), 10);
  assert.equal(scoreBusinessStructure("entity_with_bank"), 8);
  assert.equal(scoreBusinessStructure("none"), 0);

  assert.equal(scoreFundingPurpose("equipment_vehicle"), 9);
  assert.equal(scoreFundingPurpose("working_capital"), 7);
  assert.equal(scoreFundingPurpose("not_sure"), 5);
});

test("red flag penalties cap at 45 and none clears penalties", () => {
  assert.equal(calculateRedFlagPenalty(["none"]), 0);
  assert.equal(calculateRedFlagPenalty(["open_bankruptcy"]), 25);
  assert.equal(calculateRedFlagPenalty(["open_bankruptcy", "tax_lien", "recent_nsfs", "marketplace_suspended"]), 45);
});

test("getScoreTier maps score boundaries correctly", () => {
  assert.equal(getScoreTier(100).id, "highly_fundable");
  assert.equal(getScoreTier(80).id, "highly_fundable");
  assert.equal(getScoreTier(79).id, "fundable_review");
  assert.equal(getScoreTier(65).id, "fundable_review");
  assert.equal(getScoreTier(64).id, "selective_programs");
  assert.equal(getScoreTier(45).id, "selective_programs");
  assert.equal(getScoreTier(44).id, "not_ready_fixable");
  assert.equal(getScoreTier(0).id, "not_ready_fixable");
});

test("invalid answers produce validation errors instead of a score", () => {
  const result = calculateFundingReadiness({
    businessPersona: "",
    monthlyRevenue: -1,
    redFlags: []
  });

  assert.equal(result.valid, false);
  assert.ok(Array.isArray(result.errors));
  assert.ok(result.errors.length > 0);
});
