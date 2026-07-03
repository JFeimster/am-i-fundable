import { DEFAULT_DISCLAIMER } from "./response.js";
import { toPublicScoreResult } from "./safe-result-presenter.js";

export function buildReadinessReport({ applicant = {}, answers = {}, result = {}, resources = [] } = {}) {
  const publicResult = toPublicScoreResult(result);
  const generatedAt = new Date().toISOString();
  const businessName = applicant.businessName || "Your business";
  const title = `${businessName} Funding Readiness Summary`;

  const sections = [
    {
      id: "readiness-summary",
      title: "Readiness Summary",
      body: [
        `${businessName} received a funding readiness score of ${publicResult.score}.`,
        `Current tier: ${publicResult.tier.label}.`,
        `Primary review path: ${publicResult.primaryFundingFamily}.`
      ]
    },
    {
      id: "strengths",
      title: "Strengths",
      items: publicResult.strengths.length ? publicResult.strengths : ["The scorecard was completed, which creates a clearer starting point for review."]
    },
    {
      id: "caution-areas",
      title: "Caution Areas",
      items: publicResult.risks.length ? publicResult.risks : ["No major caution areas were identified from the provided answers."]
    },
    {
      id: "documents",
      title: "Documents to Prepare",
      items: publicResult.recommendedDocuments.length ? publicResult.recommendedDocuments : defaultDocuments(answers)
    },
    {
      id: "next-steps",
      title: "Recommended Next Steps",
      items: publicResult.nextSteps.length ? publicResult.nextSteps : defaultNextSteps(publicResult.manualReviewRecommended)
    },
    {
      id: "resources",
      title: "Helpful Resources",
      items: resources.map((resource) => `${resource.title}: ${resource.summary}`).slice(0, 5)
    }
  ];

  return {
    title,
    generatedAt,
    applicant: {
      businessName: applicant.businessName || "",
      state: applicant.state || ""
    },
    result: publicResult,
    sections,
    markdown: toMarkdown(title, generatedAt, sections),
    disclaimer: DEFAULT_DISCLAIMER
  };
}

function toMarkdown(title, generatedAt, sections) {
  const lines = [`# ${title}`, "", `Generated: ${generatedAt}`, ""];
  for (const section of sections) {
    lines.push(`## ${section.title}`, "");
    if (section.body) {
      for (const paragraph of section.body) lines.push(paragraph, "");
    }
    if (section.items) {
      for (const item of section.items) lines.push(`- ${item}`);
      lines.push("");
    }
  }
  lines.push(`> ${DEFAULT_DISCLAIMER}`);
  return lines.join("\n").trim() + "\n";
}

function defaultDocuments(answers = {}) {
  const purpose = answers.fundingPurpose || "not_sure";
  const base = ["Recent business bank statements", "Business information", "Funding purpose notes"];
  const purposeDocs = {
    equipment_vehicle: ["Equipment quote, invoice, or repair estimate"],
    real_estate: ["Property details, purchase contract, or project scope"],
    ecommerce_growth: ["Marketplace sales reports or platform performance records"],
    business_credit: ["Entity documents and EIN confirmation"]
  };
  return [...(purposeDocs[purpose] || []), ...base].slice(0, 5);
}

function defaultNextSteps(manualReviewRecommended) {
  if (manualReviewRecommended) {
    return [
      "Request a human funding strategy review",
      "Prepare recent bank statements",
      "Confirm the desired funding amount and use of funds"
    ];
  }

  return [
    "Review the recommended funding path",
    "Prepare the listed documents",
    "Confirm contact information before requesting follow-up"
  ];
}
