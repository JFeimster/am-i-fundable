import assert from "node:assert/strict";
import test from "node:test";
import handler from "../../api/scorecard/generate-readiness-report.js";


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


test("POST /api/scorecard/generate-readiness-report returns structured report and markdown", async () => {
  const res = await invokeHandler(handler, {
    method: "POST",
    url: "/api/scorecard/generate-readiness-report",
    body: {
      applicant: {
        businessName: "Demo Growth LLC",
        state: "DC"
      },
      answers: hotAnswers,
      resources: [
        {
          id: "document-prep-checklist",
          title: "Funding Document Prep Checklist",
          type: "checklist",
          path: "/documents.html",
          summary: "Organize bank statements, business details, and funding-purpose notes before requesting review."
        }
      ]
    }
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.status, "report_generated");
  assert.ok(res.body.report.title);
  assert.ok(Array.isArray(res.body.report.sections));
  assert.ok(res.body.report.markdown.includes("Funding Readiness Summary"));
  assertPublicSafeObject(res.body);
});

test("POST /api/scorecard/generate-readiness-report rejects invalid answers", async () => {
  const res = await invokeHandler(handler, {
    method: "POST",
    url: "/api/scorecard/generate-readiness-report",
    body: {
      answers: { ...hotAnswers, redFlags: [] }
    }
  });

  assert.equal(res.statusCode, 422);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.error.code, "validation_error");
  assertPublicSafeObject(res.body);
});
