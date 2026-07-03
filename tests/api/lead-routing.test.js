import assert from "node:assert/strict";
import test from "node:test";
import routeLeadHandler from "../../api/leads/route-lead.js";
import createLeadHandler from "../../api/leads/create-lead.js";
import updateStatusHandler from "../../api/leads/update-lead-status.js";


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


test("POST /api/leads/route-lead creates public-safe route summary", async () => {
  const res = await invokeHandler(routeLeadHandler, {
    method: "POST",
    url: "/api/leads/route-lead",
    body: {
      leadId: "lead_demo_001",
      answers: sampleAnswers,
      requestedRouteMode: "auto"
    }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.status, "lead_route_created");
  assert.ok(res.body.route.queue);
  assert.ok(res.body.route.nextAction);
  assertPublicSafe(res.body);
});

test("POST /api/leads/create-lead creates demo lead summary", async () => {
  const res = await invokeHandler(createLeadHandler, {
    method: "POST",
    url: "/api/leads/create-lead",
    body: {
      source: "Funding Readiness Scorecard",
      applicant: sampleApplicant,
      answers: sampleAnswers
    }
  });

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.status, "lead_created_demo");
  assert.ok(res.body.leadId);
  assert.ok(res.body.routing.queue);
  assertPublicSafe(res.body);
});

test("POST /api/leads/update-lead-status validates allowed status", async () => {
  const res = await invokeHandler(updateStatusHandler, {
    method: "POST",
    url: "/api/leads/update-lead-status",
    body: {
      leadId: "lead_demo_001",
      status: "documents_requested",
      note: "Demo note"
    }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.leadStatus, "documents_requested");
  assertPublicSafe(res.body);
});
