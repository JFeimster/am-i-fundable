import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { validationError } from "../../lib/api/errors.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const event = normalizeEvent(payload, "scorecard.submitted");

    if (!event.subjectId && !event.resultId) {
      throw validationError([{ field: "subjectId", message: "subjectId or resultId is required for scorecard submission events." }]);
    }

    return sendOk(res, assertPublicSafe({
      accepted: true,
      eventId: event.eventId,
      eventType: event.eventType,
      subjectId: event.subjectId || event.resultId,
      receivedAt: new Date().toISOString(),
      nextAction: "evaluate_readiness_route",
      message: "Scorecard submission event received. No private routing data was returned."
    }));
  });
}

function normalizeEvent(payload, defaultType) {
  return {
    eventId: String(payload.eventId || `${defaultType}_${Date.now()}`).slice(0, 120),
    eventType: String(payload.eventType || defaultType).slice(0, 120),
    subjectId: payload.subjectId ? String(payload.subjectId).slice(0, 120) : "",
    resultId: payload.resultId ? String(payload.resultId).slice(0, 120) : ""
  };
}
