import assert from "node:assert/strict";
import test from "node:test";
import {
  assertPublicSafe,
  findPublicBoundaryIssues,
  sanitizeForPublic
} from "../../lib/api/public-boundary.js";

test("sanitizeForPublic removes sensitive fields recursively", () => {
  const input = {
    publicLabel: "Fast Working Capital",
    affiliateUrl: "https://example.com/private",
    nested: {
      applyUrl: "https://example.com/apply",
      safe: "visible"
    },
    list: [
      {
        providerName: "Demo Provider",
        summary: "Public summary"
      }
    ]
  };

  const output = sanitizeForPublic(input);
  assert.equal(output.publicLabel, "Fast Working Capital");
  assert.equal(output.affiliateUrl, undefined);
  assert.equal(output.nested.applyUrl, undefined);
  assert.equal(output.nested.safe, "visible");
  assert.equal(output.list[0].providerName, undefined);
  assert.equal(output.list[0].summary, "Public summary");
});

test("assertPublicSafe rejects sensitive public fields", () => {
  assert.throws(
    () => assertPublicSafe({ publicLabel: "Path", applyUrl: "https://example.com/apply" }),
    /Public response failed safety boundary review/
  );
});

test("findPublicBoundaryIssues detects restricted certainty language", () => {
  const issues = findPublicBoundaryIssues({
    message: ["This says you are", " approved, which should not be public-safe."].join("")
  });

  assert.ok(issues.length > 0);
});
