import { runApiRoute } from "../lib/api/http.js";
import { sendOk } from "../lib/api/response.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    return sendOk(res, {
      service: "funding-readiness-scorecard",
      project: "am-i-fundable",
      apiVersion: "1.0.0",
      contract: "public-safe-readiness-api",
      deployment: {
        environment: process.env.VERCEL_ENV || "local",
        branch: process.env.VERCEL_GIT_COMMIT_REF || "unknown",
        commitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown"
      },
      routes: [
        "/api/health",
        "/api/version",
        "/api/public/funding-paths",
        "/api/public/document-checklist",
        "/api/public/result-tier",
        "/api/public/resource-recommendations",
        "/api/scorecard/request-review",
        "/api/scorecard/generate-readiness-report",
        "/api/match/funding-paths"
      ],
      disclaimer: "Public routes return readiness guidance only. They do not provide approvals, offers, underwriting decisions, or guarantees of funding."
    });
  });
}
