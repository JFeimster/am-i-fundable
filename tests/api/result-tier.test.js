import assert from "node:assert/strict";
import test from "node:test";
import handler from "../../api/public/result-tier.js";


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


test("GET /api/public/result-tier resolves tier from score", async () => {
  const res = await invokeHandler(handler, {
    method: "GET",
    url: "/api/public/result-tier?score=72",
    query: { score: "72" }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.ok(res.body.tier);
  assert.ok(res.body.tier.id);
  assert.ok(res.body.tier.label);
  assertPublicSafe(res.body);
});

test("GET /api/public/result-tier resolves explicit tier ID", async () => {
  const res = await invokeHandler(handler, {
    method: "GET",
    url: "/api/public/result-tier?tierId=not_ready_fixable",
    query: { tierId: "not_ready_fixable" }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.tier.id, "not_ready_fixable");
  assertPublicSafe(res.body);
});
