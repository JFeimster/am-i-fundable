import { handleOptions, setCorsHeaders } from "./cors.js";
import { methodNotAllowed, toApiError } from "./errors.js";
import { sendError } from "./response.js";

export function requireMethod(req, allowedMethods = []) {
  const method = String(req?.method || "GET").toUpperCase();
  if (!allowedMethods.includes(method)) {
    throw methodNotAllowed(method, allowedMethods);
  }
  return method;
}

export async function runApiRoute(req, res, options, handler) {
  const methods = options?.methods || ["GET", "POST", "OPTIONS"];
  setCorsHeaders(req, res, { methods });

  if (handleOptions(req, res, { methods })) return;

  try {
    requireMethod(req, methods.filter((method) => method !== "OPTIONS"));
    return await handler(req, res);
  } catch (error) {
    return sendError(res, toApiError(error));
  }
}

export function getQuery(req = {}) {
  if (req.query && typeof req.query === "object") return req.query;

  const url = req.url ? new URL(req.url, "http://localhost") : new URL("http://localhost");
  return Object.fromEntries(url.searchParams.entries());
}

export function asBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") return defaultValue;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

export function asNumber(value, defaultValue = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : defaultValue;
}

export function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
}
