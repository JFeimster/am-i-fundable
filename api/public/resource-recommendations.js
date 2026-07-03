import { runApiRoute } from "../../lib/api/http.js";
import { readJsonBody } from "../../lib/api/request-parser.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe } from "../../lib/api/public-boundary.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["POST", "OPTIONS"] }, async () => {
    const payload = await readJsonBody(req);
    const tierId = String(payload.tierId || payload?.result?.tier?.id || "fundable_review");
    const fundingPurpose = String(payload.fundingPurpose || payload?.answers?.fundingPurpose || "not_sure");
    const manualReviewRecommended = payload.manualReviewRecommended === true || payload?.result?.manualReviewRecommended === true;

    const resources = recommendResources({ tierId, fundingPurpose, manualReviewRecommended });

    return sendOk(res, assertPublicSafe({
      tierId,
      fundingPurpose,
      count: resources.length,
      resources,
      disclaimer: "Resources are educational next-step suggestions. They are not funding offers or outcome guarantees."
    }));
  });
}

function recommendResources({ tierId, fundingPurpose, manualReviewRecommended }) {
  const resources = [
    {
      id: "document-prep-checklist",
      title: "Funding Document Prep Checklist",
      type: "checklist",
      path: "/documents.html",
      summary: "Organize bank statements, business details, and funding-purpose notes before requesting review."
    }
  ];

  if (["highly_fundable", "fundable_review"].includes(tierId) || manualReviewRecommended) {
    resources.push({
      id: "manual-review-guide",
      title: "Funding Strategy Review Guide",
      type: "guide",
      path: "/fundable-review.html",
      summary: "Understand what a funding strategist should review before provider-specific direction is shared."
    });
  }

  if (["selective_programs", "not_ready_fixable"].includes(tierId)) {
    resources.push({
      id: "readiness-improvement-plan",
      title: "Funding Readiness Improvement Plan",
      type: "nurture",
      path: "/not-ready.html",
      summary: "Focus on setup, banking, documentation, and timing before a deeper funding review."
    });
  }

  if (fundingPurpose === "equipment_vehicle") {
    resources.push({
      id: "equipment-prep",
      title: "Equipment Funding Prep Notes",
      type: "purpose-guide",
      path: "/documents.html?fundingPurpose=equipment_vehicle",
      summary: "Prepare quotes, invoices, equipment details, and expected business use."
    });
  }

  if (fundingPurpose === "ecommerce_growth") {
    resources.push({
      id: "marketplace-sales-prep",
      title: "Marketplace Sales Prep Notes",
      type: "purpose-guide",
      path: "/documents.html?fundingPurpose=ecommerce_growth",
      summary: "Prepare platform sales reports, payout records, and recent bank activity."
    });
  }

  return resources.slice(0, 5);
}
