export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["GET", "POST"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const demoPayload = {
    id: "demo-scorecard-payload",
    generatedAt: new Date().toISOString(),
    visibility: "internal_admin_only_demo",
    applicant: {
      firstName: "Demo",
      lastName: "Owner",
      businessName: "Demo Growth LLC",
      email: "demo@example.com",
      phone: "5555555555",
      state: "DC",
      consent: true
    },
    answers: {
      businessPersona: "local_service_business",
      monthlyRevenue: 85000,
      timeInBusinessMonths: 36,
      creditScore: 710,
      bankStatus: "strong_clean",
      businessStructure: "entity_bank_ein_clean",
      fundingPurpose: "working_capital",
      desiredFundingAmount: 125000,
      redFlags: ["none"]
    },
    eventSamples: [
      {
        eventType: "scorecard.submitted",
        subjectId: "frs_result_demo_001"
      },
      {
        eventType: "review.requested",
        reviewId: "review_demo_001"
      },
      {
        eventType: "lead.routed",
        leadId: "lead_demo_001",
        routeType: "standard_follow_up"
      }
    ],
    note: "Demo payload only. Do not replace this with real borrower PII in the public repository."
  };

  return sendJson(res, 200, {
    status: "demo_payload_exported",
    visibility: "internal_admin_only",
    payload: demoPayload
  });
}

function requireAdminAccess(req) {
  const enabled = process.env.AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES === "true";
  const configuredToken = process.env.AM_I_FUNDABLE_ADMIN_TOKEN || "";
  const suppliedToken = String(
    req?.headers?.["x-admin-token"] ||
    req?.headers?.["x-am-i-fundable-admin-token"] ||
    ""
  );

  if (!enabled) {
    return {
      allowed: false,
      statusCode: 403,
      code: "admin_routes_disabled",
      message: "Internal/admin-only route is disabled by default. Set AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES=true in a protected environment to use it."
    };
  }

  if (!configuredToken || suppliedToken !== configuredToken) {
    return {
      allowed: false,
      statusCode: 401,
      code: "admin_auth_required",
      message: "Internal/admin-only route requires a valid admin token."
    };
  }

  return { allowed: true };
}

function adminDenied(res, decision) {
  return sendJson(res, decision.statusCode || 403, {
    error: {
      code: decision.code,
      message: decision.message
    },
    visibility: "internal_admin_only"
  });
}

function sendJson(res, statusCode, payload) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json({ ok: statusCode >= 200 && statusCode < 400, ...payload });
  }
  res.statusCode = statusCode;
  return res.end(JSON.stringify({ ok: statusCode >= 200 && statusCode < 400, ...payload }));
}

async function readJsonBody(req) {
  if (req?.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req?.body === "string" && req.body.trim()) return JSON.parse(req.body);
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

function methodGate(req, res, allowedMethods) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (!allowedMethods.includes(req.method)) {
    sendJson(res, 405, {
      error: {
        code: "method_not_allowed",
        message: `Method ${req.method || "UNKNOWN"} is not allowed.`
      }
    });
    return false;
  }
  return true;
}

function setAdminCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.AM_I_FUNDABLE_ADMIN_ORIGIN || "null");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token, X-Am-I-Fundable-Admin-Token");
  res.setHeader("Vary", "Origin");
}
