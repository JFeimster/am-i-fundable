import fs from "node:fs";
import { runApiRoute, getQuery } from "../../lib/api/http.js";
import { sendOk } from "../../lib/api/response.js";
import { assertPublicSafe, sanitizeForPublic } from "../../lib/api/public-boundary.js";

const EMBED_CONFIG_PATH = new URL("../../config/embed.config.json", import.meta.url);
const EMBED_PRESETS_PATH = new URL("../../site-data/embed-presets.json", import.meta.url);

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    const query = getQuery(req);
    const requestedPreset = String(query.preset || "default");
    const baseConfig = readJson(EMBED_CONFIG_PATH, fallbackEmbedConfig());
    const presets = readJson(EMBED_PRESETS_PATH, fallbackPresets());
    const preset = findPreset(presets, requestedPreset);

    const payload = {
      id: "public-embed-config",
      preset: preset.id,
      visibility: "public_runtime_browser_safe",
      widget: {
        title: preset.title || baseConfig.title || "Am I Fundable?",
        subtitle: preset.subtitle || baseConfig.subtitle || "Check funding readiness in a few minutes.",
        targetSelector: preset.targetSelector || "#am-i-fundable-widget",
        mode: preset.mode || "standard",
        theme: preset.theme || "default",
        height: preset.height || "auto",
        source: preset.source || "public-embed"
      },
      routes: {
        scorecard: "/scorecard.html",
        submit: "/api/scorecard/submit-score",
        review: "/api/scorecard/request-review",
        fundingPaths: "/api/match/funding-paths",
        documentChecklist: "/api/public/document-checklist"
      },
      allowedOrigins: ["self", "partner-site"],
      installSnippet: `<div id="am-i-fundable-widget"></div><script src="https://am-i-fundable.vercel.app/assets/js/embed-loader.js" defer></script>`,
      disclaimer: "Embed configuration is public-safe and does not include private routing or program-specific data."
    };

    return sendOk(res, assertPublicSafe(sanitizeForPublic(payload)));
  });
}

function readJson(url, fallback) {
  try {
    return JSON.parse(fs.readFileSync(url, "utf8"));
  } catch {
    return fallback;
  }
}

function findPreset(registry, requestedPreset) {
  const entries = Array.isArray(registry.entries) ? registry.entries : [];
  return entries.find((entry) => entry.id === requestedPreset || entry.slug === requestedPreset) || entries[0] || fallbackPresets().entries[0];
}

function fallbackEmbedConfig() {
  return {
    title: "Am I Fundable?",
    subtitle: "Check funding readiness without treating the result as an offer."
  };
}

function fallbackPresets() {
  return {
    entries: [
      {
        id: "default",
        title: "Am I Fundable?",
        subtitle: "Check funding readiness and get a recommended next step.",
        mode: "standard",
        theme: "default",
        targetSelector: "#am-i-fundable-widget"
      },
      {
        id: "broker",
        title: "Check Funding Readiness",
        subtitle: "Start with a readiness score before a human funding strategy review.",
        mode: "broker",
        theme: "compact",
        targetSelector: "#am-i-fundable-widget"
      }
    ]
  };
}
