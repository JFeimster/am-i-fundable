import fs from "node:fs";
import { matchPartners } from "../lib/partner-match-engine.js";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const applicant = payload?.applicant || payload?.answers || {};
    const providers = readJson("../internal/providers/funding-providers.registry.json").entries || [];
    const products = readJson("../internal/products/funding-products.registry.json").entries || [];
    const matchResult = matchPartners(applicant, providers, products, { maxMatches: 5 });

    // Public response deliberately omits provider names, affiliate links, apply URLs, commissions, and contacts.
    return res.status(200).json({
      ok: true,
      message: "Potential funding paths generated for review. This is not an approval, offer, or guarantee of funding.",
      humanReviewRequired: matchResult.humanReviewRequired,
      recommendations: matchResult.publicRecommendations,
      internalMatchCount: matchResult.internalMatches.length
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to generate funding path recommendations", requestId: `err_${Date.now()}` });
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(new URL(relativePath, import.meta.url), "utf8"));
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.SCORECARD_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
