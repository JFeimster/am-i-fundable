/*
 * Site navigation and footer renderer for Am I Fundable.
 * Vanilla JS, browser-safe, public data only.
 */
(function () {
  "use strict";

  var NAVIGATION_URL = "/site-data/navigation.json";

  var FALLBACK_DATA = {
    brand: {
      name: "Moonshine Capital",
      product_name: "Funding Readiness Scorecard",
      short_name: "Am I Fundable",
      home_path: "/",
      brand_mark_text: "MC"
    },
    header: {
      aria_label: "Primary navigation",
      items: [
        { id: "nav_scorecard", label: "Scorecard", href: "/scorecard.html" },
        { id: "nav_paths", label: "Funding Paths", href: "/funding-paths.html" },
        { id: "nav_documents", label: "Documents", href: "/documents.html" },
        { id: "nav_resources", label: "Resources", href: "/resources.html" },
        { id: "nav_brokers", label: "Brokers", href: "/broker.html" }
      ],
      cta: { id: "header_get_score", label: "Get My Score", href: "/scorecard.html" }
    },
    footer: {
      columns: [
        {
          id: "footer_scorecard",
          heading: "Scorecard",
          links: [
            { label: "Run the Scorecard", href: "/scorecard.html" },
            { label: "Understand Results", href: "/results.html" },
            { label: "Funding Paths", href: "/funding-paths.html" },
            { label: "Document Prep", href: "/documents.html" }
          ]
        },
        {
          id: "footer_operators",
          heading: "For Operators",
          links: [
            { label: "Resources", href: "/resources.html" },
            { label: "FAQ", href: "/faq.html" },
            { label: "Manual Review", href: "/fundable-review.html" }
          ]
        },
        {
          id: "footer_growth",
          heading: "For Growth Partners",
          links: [
            { label: "Broker Workflow", href: "/broker.html" },
            { label: "Partner Page", href: "/partners.html" },
            { label: "White Label", href: "/white-label.html" },
            { label: "Embed Example", href: "/embed-example.html" }
          ]
        },
        {
          id: "footer_trust",
          heading: "Trust",
          links: [
            { label: "Privacy", href: "/privacy.html" },
            { label: "Terms", href: "/terms.html" }
          ]
        }
      ],
      disclaimer: "The Funding Readiness Scorecard provides educational readiness guidance only. It is not a funding approval, offer, commitment, final funding decision, or guarantee of funding."
    }
  };

  function normalizeHref(href) {
    if (!href || typeof href !== "string") return "#";
    if (/^https?:\/\//i.test(href)) return href;
    if (href.charAt(0) === "/") return href;
    return "/" + href.replace(/^\.\//, "");
  }

  function isExternalHref(rawHref) {
    return /^https?:\/\//i.test(rawHref || "");
  }

  function createLink(item, className) {
    var rawHref = item.href || item.path || item.url || "#";
    var link = document.createElement("a");
    link.textContent = item.label || item.title || "Untitled";
    link.href = normalizeHref(rawHref);
    if (className) link.className = className;
    if (item.id) link.dataset.navId = item.id;
    if (item.cta_id) link.dataset.ctaId = item.cta_id;
    if (item.description) link.title = item.description;
    if (isExternalHref(rawHref)) {
      link.rel = "noopener noreferrer";
      link.target = "_blank";
    }
    return link;
  }

  function getPrimaryItems(data) {
    if (data && data.header && Array.isArray(data.header.items)) return data.header.items;
    if (data && Array.isArray(data.primary)) return data.primary;
    if (Array.isArray(data)) return data;
    return FALLBACK_DATA.header.items;
  }

  function getFooterColumns(data) {
    if (data && data.footer && Array.isArray(data.footer.columns)) return data.footer.columns;
    return FALLBACK_DATA.footer.columns;
  }

  function getFooterDisclaimer(data) {
    return (data && data.footer && data.footer.disclaimer) || FALLBACK_DATA.footer.disclaimer;
  }

  function getHeaderCta(data) {
    return (data && data.header && data.header.cta) || FALLBACK_DATA.header.cta;
  }

  function getBrand(data) {
    return (data && data.brand) || FALLBACK_DATA.brand;
  }

  function currentPathAliases() {
    var path = window.location.pathname || "/";
    var file = path.split("/").pop() || "index.html";
    var aliases = [path, file, "/" + file];
    if (path === "/" || file === "index.html") aliases.push("/", "/index.html", "index.html");
    return aliases;
  }

  function markCurrentPage(root) {
    var aliases = currentPathAliases();
    root.querySelectorAll("a[href]").forEach(function (link) {
      var rawHref = (link.getAttribute("href") || "").split("#")[0].split("?")[0];
      if (aliases.indexOf(rawHref) !== -1) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function renderBrand(data) {
    var brand = getBrand(data);
    document.querySelectorAll(".brand-lockup, .frs-brand, [data-site-brand]").forEach(function (brandNode) {
      var mark = brandNode.querySelector(".brand-mark, .frs-brand-mark");
      var strong = brandNode.querySelector("strong");
      var em = brandNode.querySelector("em");
      brandNode.setAttribute("href", normalizeHref(brand.home_path || "/"));
      brandNode.setAttribute("aria-label", (brand.product_name || brand.short_name || "Funding Readiness Scorecard") + " home");
      if (mark) mark.textContent = brand.brand_mark_text || "MC";
      if (strong) strong.textContent = brand.name || "Moonshine Capital";
      if (em) em.textContent = brand.product_name || "Funding Readiness Scorecard";
    });
  }

  function ensureMobileToggle(header, nav) {
    if (!header || !nav) return null;
    var toggle = header.querySelector("[data-site-menu-toggle]");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "frs-menu-toggle";
      toggle.dataset.siteMenuToggle = "";
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = "<span>Menu</span><i aria-hidden=\"true\"></i>";
      header.insertBefore(toggle, nav);
    }
    var id = nav.id || "site-mobile-menu";
    nav.id = id;
    toggle.setAttribute("aria-controls", id);
    return toggle;
  }

  function closeMenu(toggle) {
    document.body.classList.remove("site-menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu(toggle) {
    document.body.classList.add("site-menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function bindMenu(toggle, nav) {
    if (!toggle || toggle.dataset.bound === "true") return;
    toggle.dataset.bound = "true";
    toggle.addEventListener("click", function () {
      var isOpen = document.body.classList.contains("site-menu-open");
      if (isOpen) closeMenu(toggle);
      else openMenu(toggle);
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(toggle);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu(toggle);
    });
    document.addEventListener("click", function (event) {
      if (!document.body.classList.contains("site-menu-open")) return;
      if (event.target.closest(".site-header, .frs-site-header")) return;
      closeMenu(toggle);
    });
  }

  function renderPrimaryNav(targets, data) {
    var items = getPrimaryItems(data).filter(function (item) { return item && item.hidden !== true; });
    var cta = getHeaderCta(data);
    targets.forEach(function (target) {
      target.innerHTML = "";
      target.setAttribute("aria-label", (data && data.header && data.header.aria_label) || "Primary navigation");
      items.forEach(function (item) { target.appendChild(createLink(item)); });
      if (cta && cta.hidden !== true) target.appendChild(createLink(cta, "nav-cta frs-nav-cta"));
      var header = target.closest(".site-header, .frs-site-header, header");
      var toggle = ensureMobileToggle(header, target);
      bindMenu(toggle, target);
      markCurrentPage(target);
    });
  }

  function renderFooter(targets, data) {
    var columns = getFooterColumns(data);
    var disclaimer = getFooterDisclaimer(data);
    targets.forEach(function (target) {
      target.innerHTML = "";
      target.classList.add("frs-rich-footer");
      var grid = document.createElement("div");
      grid.className = "frs-footer-grid";
      columns.forEach(function (column) {
        var section = document.createElement("section");
        section.className = "frs-footer-column";
        if (column.id) section.dataset.footerColumn = column.id;
        var heading = document.createElement("h2");
        heading.textContent = column.heading || "Links";
        section.appendChild(heading);
        var list = document.createElement("ul");
        (column.links || []).forEach(function (item) {
          var li = document.createElement("li");
          li.appendChild(createLink(item));
          list.appendChild(li);
        });
        section.appendChild(list);
        grid.appendChild(section);
      });
      target.appendChild(grid);
      var note = document.createElement("p");
      note.className = "disclaimer frs-footer-disclaimer";
      note.textContent = disclaimer;
      target.appendChild(note);
      markCurrentPage(target);
    });
  }

  async function fetchPublicNavigation() {
    try {
      var response = await fetch(NAVIGATION_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Navigation data unavailable");
      return await response.json();
    } catch (error) {
      return FALLBACK_DATA;
    }
  }

  async function init() {
    var data = await fetchPublicNavigation();
    var navTargets = Array.from(document.querySelectorAll("[data-site-nav], .site-header .main-nav, .frs-site-header .frs-nav"));
    var footerTargets = Array.from(document.querySelectorAll("[data-site-footer], .site-footer"));
    renderBrand(data);
    if (navTargets.length) renderPrimaryNav(navTargets, data);
    if (footerTargets.length) renderFooter(footerTargets, data);
    document.body.classList.add("site-nav-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
