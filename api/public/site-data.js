import fs from "node:fs";
import { runApiRoute, getQuery } from "../../lib/api/http.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe, sanitizeForPublic } from "../../lib/api/public-boundary.js";

const DATASETS = {
  pages: { path: "../../site-data/pages.json", visibility: "public_runtime_browser_safe" },
  navigation: { path: "../../site-data/navigation.json", visibility: "public_runtime_browser_safe" },
  ctas: { path: "../../site-data/ctas.json", visibility: "public_runtime_browser_safe" },
  faq: { path: "../../site-data/faq.json", visibility: "public_runtime_browser_safe" },
  "result-tiers": { path: "../../site-data/result-tiers.json", visibility: "public_runtime_browser_safe" },
  "funding-paths": { path: "../../site-data/funding-paths.json", visibility: "public_runtime_browser_safe" },
  "document-checklists": { path: "../../site-data/document-checklists.json", visibility: "public_runtime_browser_safe" },
  resources: { path: "../../site-data/resource-library.json", visibility: "public_runtime_browser_safe" },
  "embed-presets": { path: "../../site-data/embed-presets.json", visibility: "public_runtime_browser_safe" },
  seo: { path: "../../site-data/seo-pages.json", visibility: "public_runtime_browser_safe" },
  "product-families": { path: "../../data/product-families.public.json", visibility: "public_runtime_browser_safe" },
  compliance: { path: "../../data/compliance-copy.public.json", visibility: "public_runtime_browser_safe" },
  "lead-field-map": { path: "../../config/lead-field-map.public.json", visibility: "public_build_time_only" }
};

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    const query = getQuery(req);
    const datasetId = String(query.dataset || "index");
    const includeIndex = datasetId === "index" || datasetId === "all";

    if (includeIndex) {
      return sendOk(res, assertPublicSafe({
        registryId: "public-site-data-index",
        count: Object.keys(DATASETS).length,
        datasets: Object.entries(DATASETS).map(([id, dataset]) => ({
          id,
          visibility: dataset.visibility,
          endpoint: `/api/public/site-data?dataset=${encodeURIComponent(id)}`
        })),
        disclaimer: "This endpoint returns public-safe site data only."
      }));
    }

    const dataset = DATASETS[datasetId];
    if (!dataset) {
      return sendOk(res, assertPublicSafe({
        dataset: datasetId,
        found: false,
        data: fallbackDataset(datasetId),
        message: "Requested dataset was not found, so a public-safe fallback was returned."
      }));
    }

    const data = readJson(dataset.path, fallbackDataset(datasetId));
    return sendOk(res, assertPublicSafe({
      dataset: datasetId,
      visibility: dataset.visibility,
      found: true,
      data: sanitizeForPublic(data),
      disclaimer: "This endpoint returns public-safe site data only."
    }));
  });
}

function readJson(relativePath, fallback) {
  try {
    const url = new URL(relativePath, import.meta.url);
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch {
    return fallback;
  }
}

function fallbackDataset(datasetId) {
  const fallbacks = {
    pages: {
      id: "pages-fallback",
      entries: [
        { id: "home", title: "Am I Fundable", path: "/" },
        { id: "scorecard", title: "Funding Readiness Scorecard", path: "/scorecard.html" },
        { id: "resources", title: "Resources", path: "/resources.html" }
      ]
    },
    navigation: {
      id: "navigation-fallback",
      primary: [
        { label: "Scorecard", href: "/scorecard.html" },
        { label: "Funding Paths", href: "/funding-paths.html" },
        { label: "Resources", href: "/resources.html" }
      ]
    },
    ctas: {
      id: "ctas-fallback",
      entries: [
        { id: "start-scorecard", label: "Check Funding Readiness", href: "/scorecard.html" },
        { id: "request-review", label: "Request Review", href: "/fundable-review.html" }
      ]
    }
  };

  return fallbacks[datasetId] || {
    id: `${datasetId || "unknown"}-fallback`,
    entries: [],
    note: "No public-safe fallback records are configured for this dataset."
  };
}
