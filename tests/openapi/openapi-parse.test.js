import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const openapiDir = path.join(root, "schemas", "openapi");

const expectedFiles = [
  "am-i-fundable.public-actions.openapi.yaml",
  "public-scorecard.openapi.yaml",
  "public-funding-paths.openapi.yaml",
  "document-checklist.openapi.yaml",
  "resource-recommendations.openapi.yaml",
  "review-request.openapi.yaml",
  "readiness-report.openapi.yaml"
];

test("OpenAPI files exist and contain required top-level sections", () => {
  for (const fileName of expectedFiles) {
    const filePath = path.join(openapiDir, fileName);
    assert.ok(fs.existsSync(filePath), `${fileName} should exist`);

    const raw = fs.readFileSync(filePath, "utf8");
    for (const snippet of ["openapi: 3.1.0", "info:", "servers:", "paths:", "components:", "schemas:"]) {
      assert.ok(raw.includes(snippet), `${fileName} should include ${snippet}`);
    }
  }
});

test("combined public OpenAPI includes expected public operation IDs", () => {
  const filePath = path.join(openapiDir, "am-i-fundable.public-actions.openapi.yaml");
  const raw = fs.readFileSync(filePath, "utf8");

  const operations = [
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

  for (const operationId of operations) {
    assert.ok(raw.includes(`operationId: ${operationId}`), `missing operationId ${operationId}`);
  }
});

test("public OpenAPI files do not include admin route paths", () => {
  for (const fileName of expectedFiles) {
    const filePath = path.join(openapiDir, fileName);
    const raw = fs.readFileSync(filePath, "utf8");

    assert.equal(raw.includes("/api/admin/"), false, `${fileName} must not expose admin paths`);
  }
});
