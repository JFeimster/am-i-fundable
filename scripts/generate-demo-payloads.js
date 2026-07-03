import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "examples", "api", "generated");
fs.mkdirSync(outputDir, { recursive: true });

const profiles = [
  {
    id: "high-readiness-working-capital",
    tierIntent: "highly_fundable",
    applicant: demoApplicant("High", "Demo Growth LLC", "DC"),
    answers: {
      businessPersona: "local_service_business",
      monthlyRevenue: 85000,
      timeInBusinessMonths: 36,
      creditScore: 710,
      bankStatus: "strong_clean",
      businessStructure: "entity_bank_ein_clean",
      fundingPurpose: "working_capital",
      desiredFundingAmount: 125000,
      redFlags: ["none"]
    }
  },
  {
    id: "review-equipment",
    tierIntent: "fundable_review",
    applicant: demoApplicant("Review", "Demo Contractor LLC", "GA"),
    answers: {
      businessPersona: "contractor",
      monthlyRevenue: 32000,
      timeInBusinessMonths: 22,
      creditScore: 635,
      bankStatus: "consistent",
      businessStructure: "entity_with_bank",
      fundingPurpose: "equipment_vehicle",
      desiredFundingAmount: 65000,
      redFlags: ["none"]
    }
  },
  {
    id: "prep-first-business-credit",
    tierIntent: "not_ready_fixable",
    applicant: demoApplicant("Prep", "Demo New Venture LLC", "FL"),
    answers: {
      businessPersona: "new_business",
      monthlyRevenue: 0,
      timeInBusinessMonths: 1,
      creditScore: 540,
      bankStatus: "none",
      businessStructure: "none",
      fundingPurpose: "business_credit",
      desiredFundingAmount: 25000,
      redFlags: ["no_current_revenue", "new_bank_account"]
    }
  }
];

const manifest = {
  id: "generated-demo-payloads",
  generatedAt: new Date().toISOString(),
  visibility: "public_build_time_only",
  files: []
};

for (const profile of profiles) {
  const submitPayload = {
    source: "Funding Readiness Scorecard",
    applicant: profile.applicant,
    answers: profile.answers,
    metadata: {
      utmSource: "generated-demo",
      utmMedium: "script",
      utmCampaign: profile.id
    }
  };

  const reportPayload = {
    format: "both",
    applicant: {
      businessName: profile.applicant.businessName,
      state: profile.applicant.state
    },
    answers: profile.answers
  };

  writePayload(`${profile.id}.submit-score.json`, submitPayload, profile);
  writePayload(`${profile.id}.readiness-report.json`, reportPayload, profile);
}

fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Generated ${manifest.files.length} demo payloads in ${path.relative(root, outputDir)}.`);

function writePayload(fileName, payload, profile) {
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n");
  manifest.files.push({
    file: `/examples/api/generated/${fileName}`,
    profileId: profile.id,
    tierIntent: profile.tierIntent
  });
}

function demoApplicant(firstName, businessName, state) {
  return {
    firstName,
    lastName: "Owner",
    businessName,
    email: `${firstName.toLowerCase()}@example.com`,
    phone: "5555555555",
    state,
    consent: true
  };
}
