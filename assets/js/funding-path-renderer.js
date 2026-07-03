/* Render public-safe funding family cards from /site-data/funding-paths.json. */
(function () {
  "use strict";

  var FALLBACK_PATHS = [
    { id: "working_capital", title: "Working Capital", summary: "For cash-flow timing, payroll, inventory, materials, and short-cycle operating needs.", signals: ["Consistent revenue", "Recent bank activity", "Clear use of funds"] },
    { id: "equipment", title: "Equipment & Asset Funding", summary: "For vehicles, machinery, trucks, tools, and assets tied to production or delivery.", signals: ["Asset details", "Business use case", "Operating history"] },
    { id: "startup", title: "Startup / Credit-Leverage Prep", summary: "For newer businesses where setup quality and personal profile may matter more than operating history.", signals: ["Entity setup", "Credit profile", "Launch plan"] },
    { id: "real_estate", title: "Real Estate Capital", summary: "For investor, rental, bridge, fix-and-flip, or commercial property scenarios.", signals: ["Property details", "Project budget", "Exit plan"] },
    { id: "ecommerce", title: "Ecommerce Seller Capital", summary: "For marketplace sellers with sales history, platform activity, and inventory growth needs.", signals: ["Marketplace sales", "Inventory plan", "Account health"] }
  ];

  function itemArray(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.paths)) return data.paths;
    if (data && Array.isArray(data.items)) return data.items;
    return FALLBACK_PATHS;
  }

  function createCard(path) {
    var article = document.createElement("article");
    article.className = "funding-path-card";
    article.dataset.pathId = path.id || "general";

    var title = document.createElement("h3");
    title.textContent = path.title || path.label || "Funding Path";
    article.appendChild(title);

    var summary = document.createElement("p");
    summary.textContent = path.summary || path.description || "Public-safe funding path guidance.";
    article.appendChild(summary);

    var signals = path.signals || path.best_for || path.readiness_signals || [];
    if (signals.length) {
      var list = document.createElement("ul");
      signals.slice(0, 5).forEach(function (signal) {
        var li = document.createElement("li");
        li.textContent = String(signal);
        list.appendChild(li);
      });
      article.appendChild(list);
    }

    var cta = document.createElement("a");
    cta.className = "btn btn-secondary";
    cta.href = "scorecard.html?path=" + encodeURIComponent(path.id || "general");
    cta.textContent = "Check readiness";
    article.appendChild(cta);
    return article;
  }

  async function loadPaths() {
    try {
      var response = await fetch("/site-data/funding-paths.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Funding path data unavailable");
      return itemArray(await response.json());
    } catch (error) {
      return FALLBACK_PATHS;
    }
  }

  async function init() {
    var targets = Array.from(document.querySelectorAll("[data-funding-paths]"));
    if (!targets.length) return;
    var paths = await loadPaths();
    targets.forEach(function (target) {
      target.innerHTML = "";
      paths.forEach(function (path) { target.appendChild(createCard(path)); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
