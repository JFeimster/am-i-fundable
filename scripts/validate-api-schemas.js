import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const schemaDir = path.join(root, "schemas", "api");
const requiredFiles = [
  "scorecard-submit-request.schema.json",
  "scorecard-submit-response.schema.json",
  "review-request.schema.json",
  "review-response.schema.json",
  "readiness-report-request.schema.json",
  "readiness-report-response.schema.json",
  "funding-paths-response.schema.json",
  "document-checklist-response.schema.json",
  "resource-recommendation-request.schema.json",
  "resource-recommendation-response.schema.json",
  "error-response.schema.json",
  "health-response.schema.json"
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

const issues = [];

if (!fs.existsSync(schemaDir)) {
  issues.push(`Missing schema directory: ${path.relative(root, schemaDir)}`);
} else {
  for (const fileName of requiredFiles) {
    const filePath = path.join(schemaDir, fileName);

    if (!fs.existsSync(filePath)) {
      issues.push(`Missing required API schema: schemas/api/${fileName}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      issues.push(`Invalid JSON in schemas/api/${fileName}: ${error.message}`);
      continue;
    }

    if (parsed.$schema !== "https://json-schema.org/draft/2020-12/schema") {
      issues.push(`schemas/api/${fileName} must use JSON Schema draft 2020-12`);
    }

    for (const key of ["$id", "title", "description", "type", "properties"]) {
      if (!Object.prototype.hasOwnProperty.call(parsed, key)) {
        issues.push(`schemas/api/${fileName} missing required schema key: ${key}`);
      }
    }

    if (parsed.type !== "object") {
      issues.push(`schemas/api/${fileName} root type must be object`);
    }

    for (const field of forbiddenFields) {
      if (raw.includes(`"${field}"`)) {
        issues.push(`schemas/api/${fileName} defines forbidden public field: ${field}`);
      }
    }
  }
}

if (issues.length > 0) {
  console.error("API schema validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`API schema validation passed for ${requiredFiles.length} files.`);
