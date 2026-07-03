#!/usr/bin/env node
/* Generate FAQPage JSON-LD from site-data/faq.json. */
const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const faqPath = path.join(repoRoot, "site-data", "faq.json");
const outDir = path.join(repoRoot, "schemas", "seo");
const outPath = path.join(outDir, "faqpage.generated.json");

function normalize(data) {
  if (Array.isArray(data)) return data;
  return data.faqs || data.items || [];
}

function readFaq() {
  if (!fs.existsSync(faqPath)) {
    throw new Error("Missing site-data/faq.json. Run Batch 18 or provide public FAQ data first.");
  }
  return normalize(JSON.parse(fs.readFileSync(faqPath, "utf8")));
}

function buildSchema(items) {
  const mainEntity = items
    .filter((item) => item && (item.question || item.title) && (item.answer || item.response))
    .map((item) => ({
      "@type": "Question",
      name: item.question || item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || item.response
      }
    }));

  if (!mainEntity.length) throw new Error("No valid FAQ entries found.");

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity
  };
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(buildSchema(readFaq()), null, 2) + "\n", "utf8");
console.log(`Generated ${path.relative(repoRoot, outPath)}.`);
