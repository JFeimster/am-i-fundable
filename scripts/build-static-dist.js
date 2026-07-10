import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "dist");

const publicDirectories = ["assets", "lib", "site-data"];

const rootFiles = [
  "404.html",
  "broker.html",
  "documents.html",
  "embed-example.html",
  "embed.html",
  "faq.html",
  "fundable-review.html",
  "funding-paths.html",
  "highly-fundable.html",
  "index.html",
  "not-ready.html",
  "partners.html",
  "privacy.html",
  "resources.html",
  "results.html",
  "robots.txt",
  "scorecard.html",
  "script.js",
  "sitemap.xml",
  "styles.css",
  "terms.html",
  "thank-you.html",
  "white-label.html",
  "widget.css",
  "widget.html",
  "widget.js"
];

const copied = [];
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const fileName of rootFiles) {
  const source = path.join(root, fileName);
  if (fs.existsSync(source)) copyFile(source, path.join(outputDir, fileName));
}

for (const dirName of publicDirectories) {
  const source = path.join(root, dirName);
  if (fs.existsSync(source)) copyDirectory(source, path.join(outputDir, dirName));
}

fs.writeFileSync(
  path.join(outputDir, ".static-deploy-manifest.json"),
  JSON.stringify(
    {
      project: "am-i-fundable",
      purpose: "Static Vercel deployment output",
      copied_count: copied.length,
      generated_at: new Date().toISOString()
    },
    null,
    2
  )
);

console.log(`Static dist output created with ${copied.length} files.`);
console.log("The repo /api source remains untouched; only the generated dist folder is deployed.");

function copyDirectory(sourceDir, targetDir) {
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) copyDirectory(source, target);
    if (entry.isFile()) copyFile(source, target);
  }
}

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  copied.push(path.relative(root, source));
}
