import assert from "node:assert/strict";
import test from "node:test";
import handler from "../../api/match/funding-paths.js";


function createMockResponse() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: undefined,
    ended: false,
    headers,
    setHeader(name, value) {
      headers.set(String(name).toLowerCase(), value);
    },
    getHeader(name) {
      return headers.get(String(name).toLowerCase());
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      this.ended = true;
      return this;
    },
    end(payload = "") {
      this.body = payload;
      this.ended = true;
      return this;
    }
  };
}

function createMockRequest({ method = "GET", url = "/", query = undefined, body = undefined, headers = {} } = {}) {
  return { method, url, query, body, headers };
}

async function invokeHandler(handler, requestOptions = {}) {
  const req = createMockRequest(requestOptions);
  const res = createMockResponse();
  await handler(req, res);
  return res;
}

function assertPublicSafe(value) {
  const text = JSON.stringify(value);
  const forbiddenTerms = [
    "affiliateUrl",
    "applyUrl",
    "commissionRate",
    "contactEmail",
    "keyContact",
    "privateNotes",
    "routingNotes",
    "underwritingNotes",
    "rawApplyUrl",
    "apiKey",
    "webhookSecret"
  ];

  for (const term of forbiddenTerms) {
    if (text.includes(term)) {
      throw new Error(`Public output included restricted field reference: ${term}`);
    }
  }
}

const sampleAnswers = {
  businessPersona: "contractor",
  monthlyRevenue: 32000,
  timeInBusinessMonths: 22,
  creditScore: 635,
  bankStatus: "consistent",
  businessStructure: "entity_with_bank",
  fundingPurpose: "equipment_vehicle",
  desiredFundingAmount: 65000,
  redFlags: ["none"]
};

const sampleApplicant = {
  firstName: "Demo",
  lastName: "Owner",
  businessName: "Demo Contractor LLC",
  email: "demo@example.com",
  phone: "5555555555",
  state: "GA",
  consent: true
};


test("POST /api/match/funding-paths returns public-safe funding path recommendations", async () => {
  const res = await invokeHandler(handler, {
    method: "POST",
    url: "/api/match/funding-paths",
    body: { answers: sampleAnswers }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.ok(Array.isArray(res.body.recommendations));
  assert.ok(res.body.recommendations.length >= 1);
  assert.ok(res.body.recommendations.every((item) => item.familyId || item.publicLabel || item.label));
  assertPublicSafe(res.body);
});

test("POST /api/match/funding-paths handles weaker readiness with review-safe output", async () => {
  const weakAnswers = {
    ...sampleAnswers,
    monthlyRevenue: 4000,
    timeInBusinessMonths: 3,
    creditScore: 545,
    bankStatus: "low_inconsistent",
    desiredFundingAmount: 50000,
    redFlags: ["new_bank_account"]
  };

  const res = await invokeHandler(handler, {
    method: "POST",
    url: "/api/match/funding-paths",
    body: { answers: weakAnswers }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.ok(res.body.humanReviewRequired === true || Array.isArray(res.body.recommendations));
  assertPublicSafe(res.body);
});
