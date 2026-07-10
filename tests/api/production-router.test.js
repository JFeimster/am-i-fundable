import test from "node:test";
import assert from "node:assert/strict";
import handler from "../../api/index.js";

const strongAnswers = {
  businessPersona: "existing_business",
  monthlyRevenue: 52000,
  timeInBusinessMonths: 30,
  creditScore: 690,
  bankStatus: "consistent",
  businessStructure: "entity_bank_ein_clean",
  fundingPurpose: "working_capital",
  desiredFundingAmount: 65000,
  redFlags: ["none"]
};

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { return this; }
  };
}

async function request(route, { method = "GET", body = undefined, query = {} } = {}) {
  const req = {
    method,
    body,
    query: { route, ...query },
    url: `/api/index?route=${encodeURIComponent(route)}`
  };
  const res = mockResponse();
  await handler(req, res);
  return res;
}

test("consolidated health route reports healthy", async () => {
  const res = await request("health");
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "healthy");
  assert.equal(res.body.runtime, "consolidated-public-api");
});

test("score submission returns a public-safe readiness result", async () => {
  const res = await request("submit-score", {
    method: "POST",
    body: {
      applicant: {
        firstName: "Demo",
        lastName: "Owner",
        businessName: "Demo Services LLC",
        email: "demo@example.com",
        phone: "2025550142",
        state: "DC",
        consent: true
      },
      answers: strongAnswers
    }
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(typeof res.body.publicResult.score, "number");
  assert.equal("provider_match_ids" in res.body, false);
});

test("funding path matching returns only public recommendation fields", async () => {
  const res = await request("match/funding-paths", {
    method: "POST",
    body: { answers: strongAnswers }
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "funding_paths_generated");
  assert.ok(Array.isArray(res.body.recommendations));
  assert.equal(JSON.stringify(res.body).includes("apply_url"), false);
  assert.equal(JSON.stringify(res.body).includes("commission"), false);
});

test("manual review route creates a review queue response", async () => {
  const res = await request("scorecard/request-review", {
    method: "POST",
    body: {
      applicant: {
        businessName: "Demo Services LLC",
        email: "demo@example.com",
        state: "DC",
        consent: true
      },
      answers: { ...strongAnswers, redFlags: ["open_bankruptcy"] }
    }
  });
  assert.equal(res.statusCode, 201);
  assert.match(res.body.status, /^queued_for_/);
  assert.equal(typeof res.body.reviewId, "string");
});

test("unsupported API routes return structured 404 responses", async () => {
  const res = await request("does-not-exist");
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.error.code, "not_found");
});
