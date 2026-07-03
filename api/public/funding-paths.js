import fs from "node:fs";
import { runApiRoute, getQuery, asNumber, clamp } from "../../lib/api/http.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe, sanitizeForPublic } from "../../lib/api/public-boundary.js";
import { toPublicFundingPath } from "../../lib/api/safe-result-presenter.js";

const PUBLIC_FAMILIES_PATH = new URL("../../data/product-families.public.json", import.meta.url);

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    const query = getQuery(req);
    const registry = readRegistry(PUBLIC_FAMILIES_PATH);
    let entries = (registry.entries || []).map(toPublicFundingPath);

    if (query.familyId) {
      entries = entries.filter((entry) => entry.familyId === query.familyId || entry.id === query.familyId);
    }

    if (query.search) {
      const needle = String(query.search).toLowerCase();
      entries = entries.filter((entry) => [entry.label, entry.summary, ...(entry.bestFor || [])].join(" ").toLowerCase().includes(needle));
    }

    const limit = clamp(asNumber(query.limit, entries.length), 1, 25);
    const payload = assertPublicSafe({
      registryId: registry.id || "product-families-public",
      version: registry.version || "1.0.0",
      count: Math.min(entries.length, limit),
      entries: entries.slice(0, limit),
      disclaimer: "These are public-safe funding path categories for review. They are not approvals, offers, or guarantees of funding."
    });

    return sendOk(res, payload);
  });
}

function readRegistry(url) {
  try {
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch {
    return {
      id: "product-families-public-fallback",
      version: "fallback",
      entries: fallbackFundingPaths()
    };
  }
}

function fallbackFundingPaths() {
  return sanitizeForPublic([
    {
      id: "fast-working-capital",
      label: "Fast Working Capital",
      summary: "Potential path for operators with recurring business deposits and short-term cash-flow needs.",
      commonDocuments: ["Recent business bank statements", "Funding purpose notes", "Business information"]
    },
    {
      id: "manual-review",
      label: "Manual Funding Strategy Review",
      summary: "Human review path when the answers need context before suggesting a funding direction.",
      commonDocuments: ["Bank statements", "Funding purpose details", "Business overview"]
    }
  ]);
}
