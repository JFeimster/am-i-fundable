import fs from "node:fs";
import { matchPartners } from "../../lib/partner-match-engine.js";
import { calculateFundingReadiness } from "../../lib/scorecard-engine.js";
import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe, sanitizeForPublic } from "../../lib/api/public-boundary.js";
import { buildManualReviewPath } from "../../lib/api/safe-result-presenter.js";
import { validateScorecardAnswers } from "../../lib/api/validate-payload.js";

const PROVIDERS_PATH = new URL("../../internal/providers/funding-providers.registry.json", import.meta.url);
const PRODUCTS_PATH = new URL("../../internal/products/funding-products.registry.json", import.meta.url);

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const answers = validateScorecardAnswers(payload.answers || payload.applicant || {});
    const scoreResult = calculateFundingReadiness(answers);
    const applicant = {
      ...answers,
      fundingReadinessScore: scoreResult.valid ? scoreResult.score : 0
    };

    const providers = readRegistryEntries(PROVIDERS_PATH);
    const products = readRegistryEntries(PRODUCTS_PATH);
    const matchResult = matchPartners(applicant, providers, products, { maxMatches: 5 });

    const recommendations = matchResult.publicRecommendations?.length
      ? matchResult.publicRecommendations
      : [buildManualReviewPath("no_public_path_found")];

    return sendOk(res, assertPublicSafe({
      status: "funding_paths_generated",
      score: scoreResult.valid ? scoreResult.score : null,
      tier: scoreResult.valid ? scoreResult.tier : null,
      humanReviewRequired: matchResult.humanReviewRequired === true || scoreResult?.manualReviewRecommended === true,
      recommendations: sanitizeForPublic(recommendations),
      nextStep: "Review these public-safe funding path categories with a funding strategist before provider-specific direction is shared.",
      message: "Potential funding paths generated for review. This is not an approval, offer, underwriting decision, or guarantee of funding."
    }));
  });
}

function readRegistryEntries(url) {
  try {
    const registry = JSON.parse(fs.readFileSync(url, "utf8"));
    return Array.isArray(registry.entries) ? registry.entries : [];
  } catch {
    return [];
  }
}
