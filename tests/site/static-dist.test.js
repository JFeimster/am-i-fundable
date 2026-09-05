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
});
