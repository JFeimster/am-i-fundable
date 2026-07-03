import fs from "node:fs";

const REQUIRED_FILES = [
  "api/health.js",
  "api/public/funding-paths.js",
  "api/scorecard/request-review.js",
  "api/match/funding-paths.js",
  "lib/api/http.js",
  "lib/api/public-boundary.js",
  "schemas/openapi/am-i-fundable.public-actions.openapi.yaml",
  "schemas/api/scorecard-submit-request.schema.json",
  "docs/api/README.md",
  "tests/api/health.test.js"
];

export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["GET"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const root = process.cwd();
  const files = REQUIRED_FILES.map((file) => ({
    file,
    exists: fs.existsSync(`${root}/${file}`)
  }));

  const missing = files.filter((item) => !item.exists).map((item) => item.file);
  const env = {
    adminRoutesEnabled: process.env.AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES === "true",
    adminTokenConfigured: Boolean(process.env.AM_I_FUNDABLE_ADMIN_TOKEN),
    vercelEnvironment: process.env.VERCEL_ENV || "local",
    nodeEnv: process.env.NODE_ENV || "unknown"
  };

  return sendJson(res, 200, {
    status: missing.length === 0 ? "system_ready" : "system_needs_attention",
    visibility: "internal_admin_only",
    checkedAt: new Date().toISOString(),
    requiredFileCount: REQUIRED_FILES.length,
    missingFileCount: missing.length,
    missingFiles: missing,
    environment: env,
    note: "System check returns operational readiness summary only and does not expose secrets or private registry records."
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
