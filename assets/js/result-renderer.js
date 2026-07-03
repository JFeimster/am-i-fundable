/* Render public-safe funding readiness results from session, query params, or site-data. */
(function () {
  "use strict";

  function $(selector, root) { return (root || document).querySelector(selector); }
  function all(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }

  function parseStoredResult() {
    var params = new URLSearchParams(window.location.search);
    var encoded = params.get("result");
    if (encoded) {
      try { return JSON.parse(decodeURIComponent(encoded)); } catch (error) { return null; }
    }
    try { return JSON.parse(window.sessionStorage.getItem("fundingReadinessResult") || "null"); } catch (error) { return null; }
  }

  function normalizeTier(tier) {
    if (!tier) return null;
    if (typeof tier === "string") return { id: tier, label: tier.replace(/_/g, " ") };
    return tier;
  }

  async function fetchTierData() {
    try {
      var response = await fetch("/site-data/result-tiers.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Result tier data unavailable");
      var data = await response.json();
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.tiers)) return data.tiers;
      if (Array.isArray(data.items)) return data.items;
      return [];
    } catch (error) {
      return [];
    }
  }

  function fallbackResult() {
    var params = new URLSearchParams(window.location.search);
    var score = Number(params.get("score") || 0);
    var tierId = params.get("tier") || (score >= 80 ? "highly_fundable" : score >= 62 ? "review_ready" : score >= 42 ? "selective_fit" : "prep_first");
    return {
      score: score || "—",
      tier: { id: tierId, label: tierId.replace(/_/g, " ").replace(/\b\w/g, function (m) { return m.toUpperCase(); }) },
      fundingPaths: ["Review your answers and funding purpose before choosing a path."],
      blockers: ["Specific blockers depend on documentation and review."],
      nextSteps: ["Prepare bank statements, revenue details, and business setup information."]
    };
  }

  function renderList(selector, items) {
    all(selector).forEach(function (node) {
      node.innerHTML = "";
      (items && items.length ? items : ["No items available yet."]).forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = String(text);
        node.appendChild(li);
      });
    });
  }

  function render(result, tierData) {
    var tier = normalizeTier(result.tier) || {};
    var matchingTier = tierData.find(function (item) { return item.id === tier.id || item.slug === tier.id; }) || {};
    var label = tier.label || matchingTier.label || "Funding Readiness Result";
    var summary = tier.summary || result.summary || matchingTier.summary || matchingTier.description || "Your score is a directional readiness signal based on your answers. It is not an approval, offer, or guarantee of funding.";

    all("[data-result-score]").forEach(function (node) { node.textContent = String(result.score || "—"); });
    all("[data-result-tier]").forEach(function (node) { node.textContent = label; });
    all("[data-result-summary], [data-result-copy]").forEach(function (node) { node.textContent = summary; });
    renderList("[data-result-paths]", result.fundingPaths || matchingTier.fundingPaths || matchingTier.next_paths);
    renderList("[data-result-risks]", result.blockers || result.risks || matchingTier.common_blockers);
    renderList("[data-result-next], [data-result-next-steps]", result.nextSteps || matchingTier.next_steps);

    all("[data-result-disclaimer]").forEach(function (node) {
      node.textContent = result.disclaimer || "This page provides educational readiness guidance only. It is not an approval, offer, commitment, or guarantee of funding.";
    });
  }

  async function init() {
    if (!document.querySelector("[data-result-renderer]")) return;
    var result = parseStoredResult() || fallbackResult();
    var tiers = await fetchTierData();
    render(result, tiers);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
