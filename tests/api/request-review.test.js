import assert from "node:assert/strict";
import test from "node:test";
import handler from "../../api/scorecard/request-review.js";


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


test("POST /api/scorecard/request-review queues review with valid consent and answers", async () => {
  const res = await invokeHandler(handler, {
    method: "POST",
    url: "/api/scorecard/request-review",
    body: {
      applicant: reviewApplicant,
      answers: hotAnswers
    }
  });

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.ok, true);
  assert.ok(res.body.reviewId);
  assert.ok(["queued_for_manual_review", "queued_for_strategy_review", "needs_answer_review"].includes(res.body.status));
  assert.ok(res.body.message);
  assertPublicSafeObject(res.body);
});

test("POST /api/scorecard/request-review rejects missing consent", async () => {
  const res = await invokeHandler(handler, {
    method: "POST",
    url: "/api/scorecard/request-review",
    body: {
      applicant: { ...reviewApplicant, consent: false },
      answers: hotAnswers
    }
  });

  assert.equal(res.statusCode, 422);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.error.code, "validation_error");
  assertPublicSafeObject(res.body);
});
