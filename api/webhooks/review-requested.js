import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { validationError } from "../../lib/api/errors.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const eventId = String(payload.eventId || `review.requested_${Date.now()}`).slice(0, 120);
    const reviewId = String(payload.reviewId || payload.subjectId || "").slice(0, 120);

    if (!reviewId) {
      throw validationError([{ field: "reviewId", message: "reviewId or subjectId is required for review request events." }]);
    }

    return sendOk(res, assertPublicSafe({
      accepted: true,
      eventId,
      eventType: "review.requested",
      reviewId,
      receivedAt: new Date().toISOString(),
      suggestedQueue: "funding_strategy_review",
      nextAction: "human_review",
      message: "Review request event received. This acknowledgement does not include private routing details."
    }));
  });
}
