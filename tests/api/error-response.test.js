import assert from "node:assert/strict";
import test from "node:test";
import healthHandler from "../../api/health.js";
import reviewHandler from "../../api/scorecard/request-review.js";


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


test("unsupported method returns method error shape", async () => {
  const res = await invokeHandler(healthHandler, {
    method: "POST",
    url: "/api/health",
    body: {}
  });

  assert.equal(res.statusCode, 405);
  assert.equal(res.body.ok, false);
  assert.ok(res.body.error);
  assert.equal(res.body.error.code, "method_not_allowed");
  assertPublicSafe(res.body);
});

test("validation error response is public-safe", async () => {
  const res = await invokeHandler(reviewHandler, {
    method: "POST",
    url: "/api/scorecard/request-review",
    body: {
      applicant: { ...sampleApplicant, consent: false },
      answers: sampleAnswers
    }
  });

  assert.equal(res.statusCode, 422);
  assert.equal(res.body.ok, false);
  assert.ok(res.body.error);
  assert.equal(res.body.error.code, "validation_error");
  assertPublicSafe(res.body);
});
