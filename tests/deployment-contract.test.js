import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);

function readText(relativePath) {
  return fs.readFileSync(new URL(relativePath, root), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

test("package scripts keep one canonical static build and local pre-PR check", () => {
  const packageJson = readJson("package.json");

  assert.equal(packageJson.scripts.build, "node scripts/build-static-dist.js");
  assert.equal(packageJson.scripts.check, "npm run validate && npm test && npm run build");
  assert.equal(packageJson.scripts.check.includes("verify:production"), false);
  assert.equal(packageJson.scripts["verify:production"], "node scripts/verify-production-smoke.js");
});

test("Vercel keeps automatic deployments disabled and routes through api/index.js", () => {
  const vercel = readJson("vercel.json");

  assert.equal(vercel.buildCommand, "npm run build");
  assert.equal(vercel.outputDirectory, "dist");
  assert.equal(vercel.git?.deploymentEnabled?.main, false);
  assert.equal(vercel.git?.deploymentEnabled?.["*"], false);
  assert.deepEqual(vercel.rewrites?.slice(0, 2), [
    { source: "/api", destination: "/api/index" },
    { source: "/api/:path*", destination: "/api/index?route=:path*" }
  ]);
});

test(".vercelignore excludes route files after preserving the consolidated entry point", () => {
  const rules = readText(".vercelignore")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  const rootApiRule = rules.indexOf("api/*.js");
  const nestedApiRule = rules.indexOf("api/**/*.js");
  const consolidatedException = rules.indexOf("!api/index.js");

  assert.notEqual(rootApiRule, -1);
  assert.notEqual(nestedApiRule, -1);
  assert.ok(consolidatedException > rootApiRule);
  assert.ok(consolidatedException > nestedApiRule);
  assert.equal(fs.existsSync(new URL("api/index.js", root)), true);
  assert.equal(fs.existsSync(new URL("api/health.js", root)), true, "the full API source tree must remain in the repository");
});

test("pull-request validation keeps production smoke behind a manual opt-in", () => {
  const workflow = readText(".github/workflows/validate.yml");

  assert.match(workflow, /workflow_dispatch:\s+inputs:\s+run_production_smoke:/);
  assert.match(workflow, /if: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.run_production_smoke == true \}\}/);
  assert.doesNotMatch(workflow, /github\.head_ref|ops\/relock-am-i-fundable-20260710/);

  for (const command of [
    "npm run validate:json",
    "npm run validate:js",
    "npm run scan:private-data",
    "npm test",
    "npm run build"
  ]) {
    assert.ok(workflow.includes(command), `pull-request validation must retain ${command}`);
  }
});
