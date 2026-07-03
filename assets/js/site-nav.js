/*
 * Site navigation renderer for Am I Fundable.
 * Vanilla JS, browser-safe, public data only.
 */
(function () {
  "use strict";

  var DEFAULT_NAV = [
    { label: "Scorecard", href: "scorecard.html" },
    { label: "Results", href: "results.html" },
    { label: "Funding Paths", href: "funding-paths.html" },
    { label: "Documents", href: "documents.html" },
    { label: "FAQ", href: "faq.html" }
  ];

  var DEFAULT_FOOTER = [
    { label: "Privacy", href: "privacy.html" },
    { label: "Terms", href: "terms.html" },
    { label: "Resources", href: "resources.html" },
    { label: "Partner With Us", href: "partners.html" }
  ];

  function normalizeHref(href) {
    if (!href || typeof href !== "string") return "#";
    if (/^https?:\/\//i.test(href)) return href;
    if (href.charAt(0) === "/") return href;
    return href;
  }

  function createLink(item) {
    var link = document.createElement("a");
    link.textContent = item.label || item.title || "Untitled";
    link.href = normalizeHref(item.href || item.path || item.url);
    if (item.description) link.title = item.description;
    if (/^https?:\/\//i.test(link.href)) {
      link.rel = "noopener";
      link.target = "_blank";
    }
    return link;
  }

  function readItems(data, key, fallback) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    if (data && data.header && Array.isArray(data.header.items)) return data.header.items;
    return fallback;
  }

  function renderNav(targets, items) {
    targets.forEach(function (target) {
      target.innerHTML = "";
      items.forEach(function (item) {
        if (item && item.hidden !== true) target.appendChild(createLink(item));
      });
    });
  }

  function markCurrentPage() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-site-nav] a, [data-site-footer] a, .main-nav a").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("#")[0].split("?")[0];
      if (href === current || href === "/" + current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  async function fetchPublicNavigation() {
    try {
      var response = await fetch("/site-data/navigation.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Navigation data unavailable");
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async function init() {
    var navTargets = Array.from(document.querySelectorAll("[data-site-nav]"));
    var footerTargets = Array.from(document.querySelectorAll("[data-site-footer]"));
    if (!navTargets.length && !footerTargets.length) return;

    var data = await fetchPublicNavigation();
    var navItems = readItems(data, "primary", DEFAULT_NAV);
    var footerItems = data && Array.isArray(data.footer) ? data.footer : DEFAULT_FOOTER;

    renderNav(navTargets, navItems);
    renderNav(footerTargets, footerItems);
    markCurrentPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
