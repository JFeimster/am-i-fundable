#!/usr/bin/env node
/* Generate sitemap.xml from site-data/pages.json or root HTML files. */
const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const outputPath = path.join(repoRoot, "sitemap.xml");
const pagesPath = path.join(repoRoot, "site-data", "pages.json");
const defaultBaseUrl = process.env.SITE_URL || "https://am-i-fundable.vercel.app";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizePages(data) {
  const list = Array.isArray(data) ? data : data.pages || data.items || [];
  return list
    .filter((page) => page && page.hidden !== true && page.noindex !== true)
    .map((page) => page.path || page.href || page.url)
    .filter(Boolean);
}

function discoverHtmlPages() {
  return fs.readdirSync(repoRoot)
    .filter((name) => name.endsWith(".html"))
    .map((name) => (name === "index.html" ? "/" : `/${name}`));
}

function unique(values) {
  return Array.from(new Set(values));
}

function xmlEscape(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" }[char]));
}

function buildSitemap(paths) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.map((route) => {
    const clean = route === "/" ? "/" : `/${String(route).replace(/^\//, "")}`;
    return [
      "  <url>",
      `    <loc>${xmlEscape(defaultBaseUrl.replace(/\/$/, "") + clean)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      clean === "/" ? "    <priority>1.0</priority>" : "    <priority>0.8</priority>",
      "  </url>"
    ].join("\n");
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

const routes = fs.existsSync(pagesPath) ? normalizePages(readJson(pagesPath)) : discoverHtmlPages();
if (!routes.length) {
  console.error("No public routes found for sitemap generation.");
  process.exit(1);
}
fs.writeFileSync(outputPath, buildSitemap(unique(routes)), "utf8");
console.log(`Generated sitemap.xml with ${unique(routes).length} routes.`);
