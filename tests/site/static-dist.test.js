import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const root = new URL("../../", import.meta.url);

const legacyEmbedFiles = [
  "embed.html",
  "embed-example.html",
  "widget.html",
  "widget.js",
  "widget.css"
];

test("static build excludes the legacy embed surface now owned by funding-quiz", () => {
  const consolidatedApi = new URL("../../api/index.js", import.meta.url);
  const sourceApiRoute = new URL("../../api/health.js", import.meta.url);
  assert.equal(fs.existsSync(consolidatedApi), true, "api/index.js must exist before the static build");
  assert.equal(fs.existsSync(sourceApiRoute), true, "individual API source routes must exist before the static build");

  execFileSync(process.execPath, ["scripts/build-static-dist.js"], {
    cwd: root,
    stdio: "pipe"
  });

  for (const fileName of legacyEmbedFiles) {
    const output = new URL(`../../dist/${fileName}`, import.meta.url);
    assert.equal(fs.existsSync(output), false, `${fileName} must not be published by am-i-fundable`);
  }

  const homepage = new URL("../../dist/index.html", import.meta.url);
  assert.equal(fs.existsSync(homepage), true, "index.html must remain in the public build");
  assert.equal(fs.existsSync(consolidatedApi), true, "the static build must preserve api/index.js");
  assert.equal(fs.existsSync(sourceApiRoute), true, "the static build must preserve individual API source routes");
});
