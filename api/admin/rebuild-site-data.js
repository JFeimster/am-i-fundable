import fs from "node:fs";

const ROUTES_PATH = new URL("../../config/routes.json", import.meta.url);
const PAGES_PATH = new URL("../../config/pages/funding-readiness-scorecard.page.json", import.meta.url);
const PRODUCT_FAMILIES_PATH = new URL("../../data/product-families.public.json", import.meta.url);

export default async function handler(req, res) {
  setAdminCors(res);
  if (!methodGate(req, res, ["POST"])) return;

  const access = requireAdminAccess(req);
  if (!access.allowed) return adminDenied(res, access);

  const payload = await readJsonBody(req);
  const dryRun = payload.dryRun !== false;
  const routes = readJson(ROUTES_PATH, { routes: [] });
  const pageConfig = readJson(PAGES_PATH, {});
  const families = readJson(PRODUCT_FAMILIES_PATH, { entries: [] });

  const siteDataPlan = {
    id: "site-data-rebuild-plan",
    generatedAt: new Date().toISOString(),
    dryRun,
    pages: buildPages(routes, pageConfig),
    navigation: buildNavigation(routes),
    fundingPathCount: Array.isArray(families.entries) ? families.entries.length : 0,
    suggestedFiles: [
      "/site-data/pages.json",
      "/site-data/navigation.json",
      "/site-data/funding-paths.json",
      "/site-data/seo-pages.json"
    ]
  };

  return sendJson(res, 200, {
    status: dryRun ? "dry_run_generated" : "write_not_enabled",
    visibility: "internal_admin_only",
    plan: siteDataPlan,
    note: "This route generates a site-data rebuild plan only. It does not overwrite files or deploy changes."
  });
}

function readJson(url, fallback) {
  try {
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch {
    return fallback;
  }
}

function buildPages(routes, pageConfig) {
  const routeEntries = Array.isArray(routes.routes) ? routes.routes : [];
  return routeEntries
    .filter((route) => route.type === "page" || String(route.file || "").endsWith(".html"))
    .map((route) => ({
      id: route.id || route.path.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "home",
      path: route.path,
      title: route.title || route.surface || "Am I Fundable",
      file: route.file || null,
      canonicalRoute: pageConfig.canonicalRoute || "/"
    }));
}

function buildNavigation(routes) {
  const routeEntries = Array.isArray(routes.routes) ? routes.routes : [];
  return routeEntries
    .filter((route) => route.type === "page" || String(route.file || "").endsWith(".html"))
    .slice(0, 8)
    .map((route) => ({
      label: route.title || route.surface || route.path,
      href: route.path
    }));
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
