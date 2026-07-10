import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const publicPages = ["index.html", "scorecard.html", "embed.html"];

for (const page of publicPages) {
  test(`${page} declares a mobile viewport`, () => {
    const html = fs.readFileSync(new URL(`../../${page}`, import.meta.url), "utf8");
    assert.match(html, /<meta[^>]+name=["']viewport["'][^>]+width=device-width/i);
  });
}

test("public styles retain responsive breakpoints", () => {
  const css = ["styles.css", "widget.css", "assets/css/site-pages.css", "assets/css/sizzle.css"]
    .filter((file) => fs.existsSync(new URL(`../../${file}`, import.meta.url)))
    .map((file) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8"))
    .join("\n");
  assert.match(css, /@media\s*\([^)]*max-width\s*:/i);
});

test("embed surface avoids fixed desktop-only width", () => {
  const html = fs.readFileSync(new URL("../../embed.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /width\s*=\s*["'](?:[7-9]\d\d|\d{4,})["']/i);
});
