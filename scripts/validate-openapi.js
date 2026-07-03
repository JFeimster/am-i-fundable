import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const openapiDir = path.join(root, "schemas", "openapi");
const requiredFiles = [
  "am-i-fundable.public-actions.openapi.yaml",
  "public-scorecard.openapi.yaml",
  "public-funding-paths.openapi.yaml",
  "document-checklist.openapi.yaml",
  "resource-recommendations.openapi.yaml",
  "review-request.openapi.yaml",
  "readiness-report.openapi.yaml"
];

const requiredOperations = [
  "getHealth",
  "getApiVersion",
  "listPublicFundingPaths",
  "getDocumentChecklist",
  "getResultTier",
  "recommendResources",
  "requestFundingReview",
  "generateReadinessReport",
  "matchFundingPaths"
];

const forbiddenTerms = [
  "affiliateUrl",
  "applyUrl",
  "commissionRate",
  "contactEmail",
  "keyContact",
  "privateNotes",
  "routingNotes",
  "underwritingNotes",
  "rawApplyUrl",
  "apiKey",
  "secret",
  "token"
];

const issues = [];

if (!fs.existsSync(openapiDir)) {
  issues.push(`Missing OpenAPI directory: ${path.relative(root, openapiDir)}`);
} else {
  for (const fileName of requiredFiles) {
    const filePath = path.join(openapiDir, fileName);

    if (!fs.existsSync(filePath)) {
      issues.push(`Missing required OpenAPI file: schemas/openapi/${fileName}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");

    for (const requiredSnippet of ["openapi: 3.1.0", "info:", "servers:", "paths:", "components:", "schemas:"]) {
      if (!raw.includes(requiredSnippet)) {
        issues.push(`schemas/openapi/${fileName} missing required snippet: ${requiredSnippet}`);
      }
    }

    if (!raw.includes("not an approval") && !raw.includes("not a funding offer")) {
      issues.push(`schemas/openapi/${fileName} should include a public-safe disclaimer phrase`);
    }

    for (const term of forbiddenTerms) {
      if (raw.includes(term)) {
        issues.push(`schemas/openapi/${fileName} includes forbidden private field term: ${term}`);
      }
    }
  }

  const combinedPath = path.join(openapiDir, "am-i-fundable.public-actions.openapi.yaml");
  if (fs.existsSync(combinedPath)) {
    const combined = fs.readFileSync(combinedPath, "utf8");
    for (const operationId of requiredOperations) {
      if (!combined.includes(`operationId: ${operationId}`)) {
        issues.push(`Combined public actions OpenAPI missing operationId: ${operationId}`);
      }
    }
  }
}

if (issues.length > 0) {
  console.error("OpenAPI validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`OpenAPI validation passed for ${requiredFiles.length} files.`);
