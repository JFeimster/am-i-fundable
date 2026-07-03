export const DEFAULT_DISCLAIMER = "This guidance is educational and review-oriented. It is not an approval, offer, underwriting decision, or guarantee of funding.";

export function sendJson(res, statusCode = 200, payload = {}, headers = {}) {
  const safePayload = {
    ok: statusCode >= 200 && statusCode < 400,
    ...payload
  };

  setResponseHeaders(res, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": statusCode >= 400 ? "no-store" : "no-store, max-age=0",
    ...headers
  });

  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(safePayload);
  }

  res.statusCode = statusCode;
  return res.end(JSON.stringify(safePayload));
}

export function sendOk(res, payload = {}, headers = {}) {
  return sendJson(res, 200, payload, headers);
}

export function sendCreated(res, payload = {}, headers = {}) {
  return sendJson(res, 201, payload, headers);
}

export function sendNoContent(res, headers = {}) {
  setResponseHeaders(res, headers);
  if (typeof res.status === "function" && typeof res.end === "function") {
    return res.status(204).end();
  }
  res.statusCode = 204;
  return res.end();
}

export function sendError(res, error, headers = {}) {
  const statusCode = Number(error?.statusCode || error?.status || 500);
  const code = error?.code || (statusCode >= 500 ? "internal_error" : "request_error");
  const message = statusCode >= 500 ? "Unable to complete request." : String(error?.message || "Request could not be processed.");

  return sendJson(res, statusCode, {
    error: {
      code,
      message,
      requestId: error?.requestId || createRequestId("err")
    },
    disclaimer: DEFAULT_DISCLAIMER
  }, headers);
}

export function createRequestId(prefix = "req") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function setResponseHeaders(res, headers = {}) {
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined || value === null) continue;
    if (typeof res.setHeader === "function") res.setHeader(key, value);
  }
}
