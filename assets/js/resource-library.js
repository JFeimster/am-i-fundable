/* Render public-safe resource library cards. */
(function () {
  "use strict";

  var FALLBACK = [
    { id: "document-prep", title: "Document Prep Checklist", type: "Checklist", summary: "Know what to gather before requesting a review.", href: "documents.html" },
    { id: "funding-paths", title: "Funding Paths Guide", type: "Guide", summary: "Understand common funding families without provider-specific hype.", href: "funding-paths.html" },
    { id: "faq", title: "Funding Readiness FAQ", type: "FAQ", summary: "Answers to the common questions before using the scorecard.", href: "faq.html" }
  ];

  function normalize(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.resources)) return data.resources;
    if (data && Array.isArray(data.items)) return data.items;
    return FALLBACK;
  }

  function matchesFilter(item, filter) {
    if (!filter || filter === "all") return true;
    return String(item.type || item.category || "").toLowerCase() === filter.toLowerCase();
  }

  function createCard(item) {
    var card = document.createElement("article");
    card.className = "resource-card";
    card.dataset.resourceId = item.id || "resource";

    var type = document.createElement("span");
    type.className = "resource-type";
    type.textContent = item.type || item.category || "Resource";
    card.appendChild(type);

    var title = document.createElement("h3");
    title.textContent = item.title || item.label || "Resource";
    card.appendChild(title);

    var summary = document.createElement("p");
    summary.textContent = item.summary || item.description || "Funding readiness resource.";
    card.appendChild(summary);

    var link = document.createElement("a");
    link.href = item.href || item.path || "#";
    link.className = "btn btn-secondary";
    link.textContent = item.cta_label || "Open resource";
    card.appendChild(link);
    return card;
  }

  async function load() {
    try {
      var response = await fetch("/site-data/resource-library.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Resource data unavailable");
      return normalize(await response.json());
    } catch (error) {
      return FALLBACK;
    }
  }

  async function init() {
    var target = document.querySelector("[data-resource-library]");
    if (!target) return;
    var filter = new URLSearchParams(window.location.search).get("type") || target.getAttribute("data-filter") || "all";
    var resources = (await load()).filter(function (item) { return matchesFilter(item, filter); });
    target.innerHTML = "";
    resources.forEach(function (item) { target.appendChild(createCard(item)); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
