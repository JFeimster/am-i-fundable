/* Render document prep checklists from public-safe site data. */
(function () {
  "use strict";

  var FALLBACK = [
    { id: "core", title: "Core Funding Review Documents", items: ["Recent business bank statements", "Government ID", "Business entity details", "Revenue summary", "Funding purpose notes"] },
    { id: "equipment", title: "Equipment Funding Prep", items: ["Equipment quote or invoice", "Vendor details", "Business-use explanation", "Insurance details if available"] },
    { id: "real_estate", title: "Real Estate Funding Prep", items: ["Property address", "Purchase or project budget", "Experience summary", "Exit or repayment plan"] }
  ];

  function normalize(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.checklists)) return data.checklists;
    if (data && Array.isArray(data.items)) return data.items;
    return FALLBACK;
  }

  function selectedPath() {
    return new URLSearchParams(window.location.search).get("path") || document.body.dataset.path || "";
  }

  function createChecklist(checklist) {
    var article = document.createElement("article");
    article.className = "document-checklist-card";
    article.dataset.checklistId = checklist.id || "general";
    var title = document.createElement("h3");
    title.textContent = checklist.title || checklist.label || "Document Checklist";
    article.appendChild(title);
    if (checklist.summary || checklist.description) {
      var summary = document.createElement("p");
      summary.textContent = checklist.summary || checklist.description;
      article.appendChild(summary);
    }
    var list = document.createElement("ul");
    (checklist.items || checklist.documents || []).forEach(function (item) {
      var text = typeof item === "string" ? item : item.label || item.name || item.title;
      var li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });
    article.appendChild(list);
    return article;
  }

  async function load() {
    try {
      var response = await fetch("/site-data/document-checklists.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Checklist data unavailable");
      return normalize(await response.json());
    } catch (error) {
      return FALLBACK;
    }
  }

  async function init() {
    var targets = Array.from(document.querySelectorAll("[data-document-checklists]"));
    if (!targets.length) return;
    var path = selectedPath();
    var checklists = await load();
    var filtered = path ? checklists.filter(function (item) {
      return item.id === path || item.path === path || (Array.isArray(item.paths) && item.paths.indexOf(path) >= 0) || item.id === "core";
    }) : checklists;
    if (!filtered.length) filtered = checklists;
    targets.forEach(function (target) {
      target.innerHTML = "";
      filtered.forEach(function (checklist) { target.appendChild(createChecklist(checklist)); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
