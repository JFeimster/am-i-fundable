import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";
import { validationError } from "../../lib/api/errors.js";

const ALLOWED_STATUSES = [
  "received",
  "scorecard_completed",
  "manual_review_needed",
  "strategy_review_ready",
  "documents_requested",
  "nurture_started",
  "review_complete",
  "archived_demo"
];

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const leadId = String(payload.leadId || "").trim();
    const status = String(payload.status || "").trim();

    if (!leadId) {
      throw validationError([{ field: "leadId", message: "leadId is required." }]);
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      throw validationError([{ field: "status", message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` }]);
    }

    return sendOk(res, assertPublicSafe({
      status: "lead_status_updated_demo",
      leadId,
      leadStatus: status,
      updatedAt: new Date().toISOString(),
      noteAccepted: typeof payload.note === "string" && payload.note.trim().length > 0,
      nextStep: nextStepForStatus(status),
      message: "Lead status response generated with demo persistence only."
    }));
  });
}

function nextStepForStatus(status) {
  const map = {
    received: "Complete the scorecard or confirm submitted answers.",
    scorecard_completed: "Review readiness result and document checklist.",
    manual_review_needed: "Queue a human funding strategy review.",
    strategy_review_ready: "Prepare document request and funding path summary.",
    documents_requested: "Wait for document upload or follow-up response.",
    nurture_started: "Send readiness improvement resources.",
    review_complete: "Summarize reviewed next steps.",
    archived_demo: "No further demo action."
  };
  return map[status] || "Review the lead status with context.";
}
