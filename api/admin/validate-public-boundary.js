import fs from "node:fs";
import path from "node:path";

const SCAN_TARGETS = [
  "api",
  "lib/api",
  "data",
  "config",
  "schemas/api",
  "schemas/openapi",
  "examples/api",
  "docs/api"
];

const FORBIDDEN_FIELDS = [
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
  "webhook_secret"
];

const RESTRICTED_PHRASE_PARTS = [
  ["you are", " approved"],
  ["guaranteed", " funding"],
  ["final", " eligibility"],
  ["underwriting", " complete"],
  ["best rates", " guaranteed"],
  ["instant", " approval"]
];

export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["GET", "POST"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const root = process.cwd();
  const issues = [];

  for (const target of SCAN_TARGETS) {
    const absolute = path.join(root, target);
    if (!fs.existsSync(absolute)) continue;

    for (const filePath of listFiles(absolute)) {
      const relative = path.relative(root, filePath);
      const ext = path.extname(filePath).toLowerCase();
      if (![".js", ".json", ".yaml", ".yml", ".md", ".html", ".css"].includes(ext)) continue;

      const content = fs.readFileSync(filePath, "utf8");
      for (const field of FORBIDDEN_FIELDS) {
        if (content.includes(field) && !isAllowedBoundaryFile(relative)) {
          issues.push({ file: relative, type: "forbidden_field_reference", value: field });
        }
      }

      for (const parts of RESTRICTED_PHRASE_PARTS) {
        const phrase = parts.join("");
        if (new RegExp(escapeRegex(phrase), "i").test(content)) {
          issues.push({ file: relative, type: "restricted_outcome_phrase", value: parts.join("+") });
        }
      }
    }
  }

  return sendJson(res, 200, {
    status: issues.length === 0 ? "passed" : "failed",
    visibility: "internal_admin_only",
    checkedAt: new Date().toISOString(),
    issueCount: issues.length,
    issues: issues.slice(0, 100),
    note: "This internal/admin-only route checks for public/private boundary issues and does not return raw lead or provider data."
  });
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules"].includes(entry.name)) return [];
      return listFiles(full);
    }
    return [full];
  });
}

function isAllowedBoundaryFile(relative) {
  return [
    "lib/api/public-boundary.js",
    "scripts/check-public-api-safety.js",
    "docs/api/public-data-boundary.md",
    "api/admin/validate-public-boundary.js"
  ].includes(relative.replaceAll("\\", "/"));
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
