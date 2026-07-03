import { sendNoContent } from "./response.js";

const DEFAULT_METHODS = ["GET", "POST", "OPTIONS"];

export function setCorsHeaders(req, res, options = {}) {
  const configuredOrigin = process.env.SCORECARD_ALLOWED_ORIGIN || "*";
  const requestOrigin = req?.headers?.origin;
  const allowOrigin = resolveAllowedOrigin(requestOrigin, configuredOrigin);

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", (options.methods || DEFAULT_METHODS).join(", "));
  res.setHeader("Access-Control-Allow-Headers", options.headers || "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", String(options.maxAge || 86400));
}

export function handleOptions(req, res, options = {}) {
  setCorsHeaders(req, res, options);
  if (req?.method === "OPTIONS") {
    sendNoContent(res);
    return true;
  }
  return false;
}

function resolveAllowedOrigin(requestOrigin, configuredOrigin) {
  if (!configuredOrigin || configuredOrigin === "*") return "*";

  const allowed = configuredOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin;
  return allowed[0] || "*";
}
