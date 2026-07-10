const baseUrl = process.env.PRODUCTION_SMOKE_BASE_URL || "https://am-i-fundable.vercel.app";

const answers = {
  businessPersona: "existing_business",
  monthlyRevenue: 52000,
  timeInBusinessMonths: 30,
  creditScore: 690,
  bankStatus: "consistent",
  businessStructure: "entity_bank_ein_clean",
  fundingPurpose: "working_capital",
  desiredFundingAmount: 65000,
  redFlags: ["none"]
};

const applicant = {
  firstName: "Demo",
  lastName: "Owner",
  businessName: "Production Smoke Test LLC",
  email: "production.smoke@example.com",
  phone: "2025550142",
  state: "DC",
  consent: true
};

await checkHtml("/", ["Funding Readiness Scorecard", "name=\"viewport\""]);
await checkHtml("/scorecard.html", ["Funding Readiness", "name=\"viewport\""]);
await checkHtml("/embed.html?partner_id=SMOKE&campaign_id=production-smoke", ["widget.html", "name=\"viewport\"", "@media (max-width: 640px)"]);
await checkHtml("/widget.html", ["Funding Readiness Scorecard Widget", "widget.js", "widget.css"]);
await checkAsset("/widget.js", "javascript");
await checkAsset("/widget.css", "css");

const health = await requestJson("/api/health", { expectedStatus: 200 });
assert(health.status === "healthy", "API health status must be healthy");
assert(health.environment === "production", "API health must report production environment");

const version = await requestJson("/api/version", { expectedStatus: 200 });
assert(version.deployment?.branch === "main", "API version must report main branch");
assert(version.runtime === "consolidated-public-api", "API version must report consolidated runtime");

const score = await requestJson("/api/submit-score", {
  method: "POST",
  expectedStatus: 200,
  body: { applicant, answers }
});
assert(score.ok === true, "Score submission must return ok=true");
assert(Number.isFinite(score.publicResult?.score), "Score submission must return a numeric public score");
assertPublicSafe(score, "score submission");

const paths = await requestJson("/api/match/funding-paths", {
  method: "POST",
  expectedStatus: 200,
  body: { answers }
});
assert(paths.status === "funding_paths_generated", "Funding path match must return generated status");
assert(Array.isArray(paths.recommendations) && paths.recommendations.length > 0, "Funding path match must return recommendations");
assertPublicSafe(paths, "funding path match");

const review = await requestJson("/api/scorecard/request-review", {
  method: "POST",
  expectedStatus: 201,
  body: {
    applicant,
    answers: { ...answers, redFlags: ["open_bankruptcy"] }
  }
});
assert(String(review.status || "").startsWith("queued_for_"), "Review request must enter a review queue");
assert(typeof review.reviewId === "string" && review.reviewId.length > 8, "Review request must return a review ID");
assertPublicSafe(review, "human review routing");

console.log("Production smoke verification passed.");

async function checkHtml(path, requiredFragments) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
  const text = await response.text();
  assert(response.status === 200, `${path} must return HTTP 200; received ${response.status}`);
  for (const fragment of requiredFragments) {
    assert(text.includes(fragment), `${path} must contain ${fragment}`);
  }
}

async function checkAsset(path, type) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
  const text = await response.text();
  assert(response.status === 200, `${path} must return HTTP 200; received ${response.status}`);
  assert(text.length > 100, `${path} must contain a non-empty ${type} payload`);
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: "follow"
  });
  const text = await response.text();
  assert(response.status === options.expectedStatus, `${path} expected HTTP ${options.expectedStatus}; received ${response.status}: ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${path} did not return JSON: ${text.slice(0, 300)}`);
  }
}

function assertPublicSafe(value, label) {
  const serialized = JSON.stringify(value);
  const restricted = /apply_url|affiliate_url|commission|providerName|provider_id|underwriting_notes|api[_-]?key|secret|password/i;
  assert(!restricted.test(serialized), `${label} exposed a restricted field`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
