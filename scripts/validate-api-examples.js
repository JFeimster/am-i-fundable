import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const exampleDir = path.join(root, "examples", "api");
const requiredFiles = [
  "scorecard-submit-request.hot.json",
  "scorecard-submit-response.hot.json",
  "funding-paths-response.json",
  "document-checklist-response.json",
  "readiness-report-request.json",
  "readiness-report-response.json",
  "error-response.validation.json"
];

const forbiddenFields = [
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

const restrictedPhrases = [
  new RegExp(["you are", " approved"].join(""), "i"),
  new RegExp(["guaranteed", " funding"].join(""), "i"),
  new RegExp(["final", " eligibility"].join(""), "i"),
  new RegExp(["underwriting", " complete"].join(""), "i"),
  new RegExp(["best rates", " guaranteed"].join(""), "i"),
  new RegExp(["instant", " approval"].join(""), "i")
];

const issues = [];

if (!fs.existsSync(exampleDir)) {
  issues.push(`Missing example directory: ${path.relative(root, exampleDir)}`);
} else {
  for (const fileName of requiredFiles) {
    const filePath = path.join(exampleDir, fileName);

    if (!fs.existsSync(filePath)) {
      issues.push(`Missing required API example: examples/api/${fileName}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");

    try {
      JSON.parse(raw);
    } catch (error) {
      issues.push(`Invalid JSON in examples/api/${fileName}: ${error.message}`);
      continue;
    }

    for (const field of forbiddenFields) {
      if (raw.includes(`"${field}"`)) {
        issues.push(`examples/api/${fileName} includes forbidden field: ${field}`);
      }
    }

    for (const pattern of restrictedPhrases) {
      if (pattern.test(raw)) {
        issues.push(`examples/api/${fileName} includes restricted outcome phrase: ${pattern}`);
      }
    }

    if (fileName.includes("response") && !raw.includes("not an approval")) {
      issues.push(`examples/api/${fileName} should include a public-safe disclaimer phrase`);
    }
  }
}

if (issues.length > 0) {
  console.error("API example validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`API example validation passed for ${requiredFiles.length} files.`);
