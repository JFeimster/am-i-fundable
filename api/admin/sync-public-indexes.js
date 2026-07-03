import fs from "node:fs";

const PRODUCT_FAMILIES_PATH = new URL("../../data/product-families.public.json", import.meta.url);
const PROVIDER_CATEGORIES_PATH = new URL("../../data/provider-categories.public.json", import.meta.url);

export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["POST"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const payload = await readJsonBody(req);
  const dryRun = payload.dryRun !== false;
  const productFamilies = readRegistry(PRODUCT_FAMILIES_PATH);
  const providerCategories = readRegistry(PROVIDER_CATEGORIES_PATH);

  const generatedIndexes = {
    publicFundingPathIndex: {
      id: "public-funding-path-index",
      generatedAt: new Date().toISOString(),
      count: Array.isArray(productFamilies.entries) ? productFamilies.entries.length : 0,
      entries: (productFamilies.entries || []).map((entry) => ({
        id: entry.id,
        label: entry.label,
        summary: entry.summary,
        documentCount: Array.isArray(entry.commonDocuments) ? entry.commonDocuments.length : 0
      }))
    },
    publicCategoryIndex: {
      id: "public-provider-category-index",
      generatedAt: new Date().toISOString(),
      count: Array.isArray(providerCategories.entries) ? providerCategories.entries.length : 0,
      entries: (providerCategories.entries || []).map((entry) => ({
        id: entry.id || entry.slug,
        label: entry.label || entry.name,
        summary: entry.summary || ""
      }))
    }
  };

  return sendJson(res, 200, {
    status: dryRun ? "dry_run_generated" : "write_not_enabled",
    visibility: "internal_admin_only",
    dryRun,
    generatedIndexes,
    note: "This admin route prepares public-safe index payloads. File writes are intentionally not performed by default."
  });
}

function readRegistry(url) {
  try {
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch {
    return { entries: [] };
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
