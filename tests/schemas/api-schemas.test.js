import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const schemaDir = path.join(root, "schemas", "api");

const requiredSchemas = [
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

test("API schema files exist and parse", () => {
  for (const fileName of requiredSchemas) {
    const filePath = path.join(schemaDir, fileName);
    assert.ok(fs.existsSync(filePath), `${fileName} should exist`);

    const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.ok(schema.$id, `${fileName} should include $id`);
    assert.ok(schema.title, `${fileName} should include title`);
    assert.equal(schema.type, "object", `${fileName} root type should be object`);
  }
});

test("public API schemas do not define private provider fields", () => {
  for (const fileName of requiredSchemas) {
    const filePath = path.join(schemaDir, fileName);
    const json = fs.readFileSync(filePath, "utf8");

    const forbidden = [
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

    for (const field of forbidden) {
      assert.equal(json.includes(`"${field}"`), false, `${fileName} must not define ${field}`);
    }
  }
});
