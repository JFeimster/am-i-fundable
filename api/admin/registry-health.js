import fs from "node:fs";

const REGISTRY_TARGETS = [
  { id: "funding-products", path: "../../internal/products/funding-products.registry.json", visibility: "server_side_internal" },
  { id: "funding-providers", path: "../../internal/providers/funding-providers.registry.json", visibility: "server_side_internal" },
  { id: "product-families-public", path: "../../data/product-families.public.json", visibility: "public_runtime_browser_safe" },
  { id: "compliance-copy-public", path: "../../data/compliance-copy.public.json", visibility: "public_runtime_browser_safe" },
  { id: "routes", path: "../../config/routes.json", visibility: "public_build_time_only" },
  { id: "tool-registry", path: "../../config/tool-registry.json", visibility: "public_build_time_only" }
];

export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["GET"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const checkedAt = new Date().toISOString();
  const registries = REGISTRY_TARGETS.map((target) => inspectRegistry(target));
  const issueCount = registries.reduce((sum, item) => sum + item.issues.length, 0);

  return sendJson(res, 200, {
    status: issueCount === 0 ? "healthy" : "needs_attention",
    visibility: "internal_admin_only",
    checkedAt,
    registryCount: registries.length,
    issueCount,
    registries,
    note: "This route returns registry health summaries only. It does not expose raw internal provider or product records."
  });
}

function inspectRegistry(target) {
  const result = {
    id: target.id,
    visibility: target.visibility,
    exists: false,
    parseable: false,
    entryCount: 0,
    version: null,
    issues: []
  };

  try {
    const url = new URL(target.path, import.meta.url);
    result.exists = fs.existsSync(url);
    if (!result.exists) {
      result.issues.push("file_missing");
      return result;
    }

    const parsed = JSON.parse(fs.readFileSync(url, "utf8"));
    result.parseable = true;
    result.version = parsed.version || null;
    result.entryCount = Array.isArray(parsed.entries) ? parsed.entries.length : 0;

    if (!parsed.id) result.issues.push("missing_id");
    if (!parsed.visibility) result.issues.push("missing_visibility");
    if (target.path.includes("/internal/") && !["internal", "server_side_internal"].includes(String(parsed.visibility))) {
      result.issues.push("internal_registry_visibility_should_be_internal");
    }

    return result;
  } catch (error) {
    result.issues.push(`parse_or_read_error:${error.message}`);
    return result;
  }
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
