import fs from "node:fs";

const PRODUCTS_PATH = new URL("../../internal/products/funding-products.registry.json", import.meta.url);
const PROVIDERS_PATH = new URL("../../internal/providers/funding-providers.registry.json", import.meta.url);

export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["GET", "POST"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const products = readRegistry(PRODUCTS_PATH);
  const providers = readRegistry(PROVIDERS_PATH);
  const providerIds = new Set((providers.entries || []).map((entry) => entry.id).filter(Boolean));
  const productIssues = [];

  for (const product of products.entries || []) {
    if (!product.id) productIssues.push({ productId: product.id || "unknown", issue: "missing_id" });
    if (!product.productFamily) productIssues.push({ productId: product.id || "unknown", issue: "missing_product_family" });
    if (product.providerId && !providerIds.has(product.providerId)) {
      productIssues.push({ productId: product.id || "unknown", issue: "provider_id_not_found_in_provider_registry" });
    }
    if (product.visibility !== "internal") {
      productIssues.push({ productId: product.id || "unknown", issue: "product_visibility_should_be_internal" });
    }
  }

  return sendJson(res, 200, {
    status: productIssues.length === 0 ? "passed" : "needs_attention",
    visibility: "internal_admin_only",
    checkedAt: new Date().toISOString(),
    productRegistry: summarizeRegistry(products),
    providerRegistry: summarizeRegistry(providers),
    issueCount: productIssues.length,
    issues: productIssues.slice(0, 100),
    note: "This route validates internal product/provider registries and returns summaries only, not raw records."
  });
}

function readRegistry(url) {
  try {
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch (error) {
    return { id: "unreadable", entries: [], readError: error.message };
  }
}

function summarizeRegistry(registry) {
  return {
    id: registry.id || "unknown",
    version: registry.version || null,
    visibility: registry.visibility || "unknown",
    count: Array.isArray(registry.entries) ? registry.entries.length : 0,
    readError: registry.readError || null
  };
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
