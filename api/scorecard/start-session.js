import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendCreated } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";

const SESSION_TTL_MINUTES = 45;

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const sessionId = createSessionId();
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + SESSION_TTL_MINUTES * 60 * 1000);

    const session = {
      sessionId,
      status: "started",
      source: cleanSource(payload.source),
      audience: cleanValue(payload.audience || "business_owner"),
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      nextRoute: "/scorecard.html",
      apiRoutes: {
        submitScore: "/api/scorecard/submit-score",
        getResult: "/api/scorecard/get-result",
        requestReview: "/api/scorecard/request-review"
      },
      metadata: sanitizeMetadata(payload.metadata || {}),
      message: "Scorecard session started. Results are readiness guidance only and should be reviewed before action."
    };

    return sendCreated(res, assertPublicSafe(session));
  });
}

function createSessionId() {
  return `frs_session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function cleanSource(value) {
  return String(value || "Funding Readiness Scorecard").slice(0, 120);
}

function cleanValue(value) {
  return String(value || "").trim().slice(0, 80);
}

function sanitizeMetadata(metadata) {
  const allowed = ["utmSource", "utmMedium", "utmCampaign", "pageUrl", "embedPartnerId", "referrer"];
  const output = {};
  for (const key of allowed) {
    if (metadata[key] !== undefined && metadata[key] !== null) {
      output[key] = String(metadata[key]).slice(0, 240);
    }
  }
  return output;
}
