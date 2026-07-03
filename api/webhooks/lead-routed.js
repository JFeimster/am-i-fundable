import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { validationError } from "../../lib/api/errors.js";

const PUBLIC_ROUTE_TYPES = [
  "fast_follow_up",
  "standard_follow_up",
  "funding_strategy_review",
  "readiness_nurture",
  "document_request"
];

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const leadId = String(payload.leadId || payload.subjectId || "").slice(0, 120);
    const routeType = String(payload.routeType || payload.queue || "standard_follow_up").slice(0, 80);

    if (!leadId) {
      throw validationError([{ field: "leadId", message: "leadId or subjectId is required for lead route events." }]);
    }

    if (!PUBLIC_ROUTE_TYPES.includes(routeType)) {
      throw validationError([{ field: "routeType", message: `routeType must be one of: ${PUBLIC_ROUTE_TYPES.join(", ")}` }]);
    }

    return sendOk(res, assertPublicSafe({
      accepted: true,
      eventId: String(payload.eventId || `lead.routed_${Date.now()}`).slice(0, 120),
      eventType: "lead.routed",
      leadId,
      routeType,
      receivedAt: new Date().toISOString(),
      nextAction: nextAction(routeType),
      message: "Lead route event received with public-safe route summary only."
    }));
  });
}

function nextAction(routeType) {
  const map = {
    fast_follow_up: "send_document_checklist",
    standard_follow_up: "send_funding_path_summary",
    funding_strategy_review: "human_review",
    readiness_nurture: "send_readiness_resources",
    document_request: "wait_for_documents"
  };
  return map[routeType] || "review_route";
}
