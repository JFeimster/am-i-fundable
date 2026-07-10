import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const root = new URL("../../", import.meta.url);

const requiredEmbedFiles = [
  "embed.html",
  "widget.html",
  "widget.js",
  "widget.css"
];

test("static build includes the complete canonical embed surface", () => {
  execFileSync(process.execPath, ["scripts/build-static-dist.js"], {
    cwd: root,
    stdio: "pipe"
  });

  for (const fileName of requiredEmbedFiles) {
    const output = new URL(`../../dist/${fileName}`, import.meta.url);
    assert.equal(fs.existsSync(output), true, `${fileName} must be included in dist`);
    assert.ok(fs.statSync(output).size > 0, `${fileName} must not be empty`);
  }
});
