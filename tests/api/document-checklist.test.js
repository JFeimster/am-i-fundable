import assert from "node:assert/strict";
import test from "node:test";
import handler from "../../api/public/document-checklist.js";


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

function createMockRequest({ method = "GET", url = "/", body = undefined, query = undefined, headers = {} } = {}) {
  return {
    method,
    url,
    body,
    query,
    headers
  };
}

async function invokeHandler(handler, requestOptions = {}) {
  const req = createMockRequest(requestOptions);
  const res = createMockResponse();
  await handler(req, res);
  return res;
}

function assertPublicSafeObject(value) {
  const json = JSON.stringify(value);
  const forbidden = [
    /affiliateUrl/i,
    /applyUrl/i,
    /commissionRate/i,
    /contactEmail/i,
    /keyContact/i,
    /notionUrl/i,
    /portalUrl/i,
    /dashboardUrl/i,
    /rawApplyUrl/i,
    /apiKey/i,
    /secret/i,
    /token/i
  ];

  for (const pattern of forbidden) {
    if (pattern.test(json)) {
      throw new Error(`Public response included forbidden field/pattern: ${pattern}`);
    }
  }
}

const hotAnswers = {
  businessPersona: "local_service_business",
  monthlyRevenue: 85000,
  timeInBusinessMonths: 36,
  creditScore: 710,
  bankStatus: "strong_clean",
  businessStructure: "entity_bank_ein_clean",
  fundingPurpose: "working_capital",
  desiredFundingAmount: 125000,
  redFlags: ["none"]
};

const reviewApplicant = {
  firstName: "Demo",
  lastName: "Owner",
  businessName: "Demo Growth LLC",
  email: "demo@example.com",
  phone: "5555555555",
  state: "DC",
  consent: true
};


test("GET /api/public/document-checklist returns preparation checklist", async () => {
  const res = await invokeHandler(handler, {
    method: "GET",
    url: "/api/public/document-checklist?fundingPurpose=working_capital",
    query: { fundingPurpose: "working_capital" }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.ok(res.body.familyId);
  assert.ok(res.body.title);
  assert.ok(Array.isArray(res.body.items));
  assert.ok(res.body.items.length >= 1);
  assert.ok(res.body.items.every((item) => item.id && item.label));
  assertPublicSafeObject(res.body);
});

test("GET /api/public/document-checklist handles specialized equipment purpose", async () => {
  const res = await invokeHandler(handler, {
    method: "GET",
    url: "/api/public/document-checklist?fundingPurpose=equipment_vehicle",
    query: { fundingPurpose: "equipment_vehicle" }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.familyId, "equipment-asset-backed");
  assert.ok(res.body.items.some((item) => /equipment/i.test(item.label)));
  assertPublicSafeObject(res.body);
});
