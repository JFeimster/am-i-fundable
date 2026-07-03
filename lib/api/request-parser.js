import { badRequest } from "./errors.js";

const DEFAULT_MAX_BYTES = 64_000;

export async function readJsonBody(req, options = {}) {
  const maxBytes = Number(options.maxBytes || DEFAULT_MAX_BYTES);

  if (req?.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req?.body === "string") {
    return parseJson(req.body);
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) {
      throw badRequest(`Request body exceeds ${maxBytes} bytes.`);
    }
    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return parseJson(raw);
}

export function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    throw badRequest("Request body must be valid JSON.");
  }
}

export function pickPayloadObject(payload, keys = []) {
  for (const key of keys) {
    if (payload && typeof payload[key] === "object" && payload[key] !== null) return payload[key];
  }
  return payload && typeof payload === "object" ? payload : {};
}

export function parseDelimitedList(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
