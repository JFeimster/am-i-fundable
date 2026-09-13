/*
 * Public site interaction polish for Am I Fundable.
 * No dependencies. No internal data access.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateScrollState() {
    document.body.classList.toggle("has-scrolled", window.scrollY > 12);
  }

  function initHomepageProofCards() {
    var proof = document.querySelector(".hero-section .hero-proof");
    if (!proof || proof.dataset.polished === "true") return;

    var configs = [
      {
        mark: "100",
        title: "Know your number",
        detail: "100-point funding readiness score",
        meta: "Revenue · credit · bank activity"
      },
      {
        mark: "PATH",
        title: "See your lane",
        detail: "White-label capital path logic",
        meta: "Primary + backup funding paths"
      },
      {
        mark: "NEXT",
        title: "Fix what matters",
        detail: "Clear next steps, not empty motivation",
        meta: "Blockers · documents · next moves"
      }
    ];

    Array.from(proof.children).forEach(function (card, index) {
      var config = configs[index];
      if (!config) return;
      var strong = card.querySelector("strong");
      var detail = card.querySelector("span");
      if (strong) strong.textContent = config.title;
      if (detail) detail.textContent = config.detail;
      card.classList.add("proof-card");
      card.setAttribute("data-proof-mark", config.mark);

      var meta = document.createElement("small");
      meta.className = "proof-meta";
      meta.textContent = config.meta;
      card.appendChild(meta);
    });

    proof.dataset.polished = "true";
  }

  function initCapitalMarquee() {
    var strip = document.querySelector(".trust-strip");
    if (!strip || strip.dataset.polished === "true") return;

    var labels = Array.from(strip.children)
      .filter(function (item) { return item.tagName === "SPAN"; })
      .map(function (item) { return item.textContent.trim(); })
      .filter(Boolean);

    ["Revenue-based capital", "Term financing", "SBA-aligned paths", "Bridge capital"].forEach(function (label) {
      if (labels.indexOf(label) === -1) labels.push(label);
    });

    if (!labels.length) return;

    function buildGroup(isClone) {
      var group = document.createElement("div");
      group.className = "trust-group";
      if (isClone) group.setAttribute("aria-hidden", "true");
      labels.forEach(function (label) {
        var pill = document.createElement("span");
        pill.className = "capital-pill";
        pill.textContent = label;
        group.appendChild(pill);
      });
      return group;
    }

    strip.textContent = "";
    var track = document.createElement("div");
    track.className = "trust-track";
    track.appendChild(buildGroup(false));
    track.appendChild(buildGroup(true));
    strip.appendChild(track);
    strip.dataset.polished = "true";
  }

  function createSignalVisual() {
    var visual = document.createElement("div");
    visual.className = "bento-visual signal-visual";
    visual.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 6; i += 1) {
      visual.appendChild(document.createElement("span"));
    }
    return visual;
  }

  function createGaugeVisual() {
    var visual = document.createElement("div");
    visual.className = "bento-visual gauge-visual";
    visual.setAttribute("aria-hidden", "true");
    var value = document.createElement("span");
    value.textContent = "100";
    visual.appendChild(value);
    return visual;
  }

  function createRouteVisual() {
    var visual = document.createElement("div");
    visual.className = "bento-visual route-visual";
    visual.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 4; i += 1) {
      var node = document.createElement("span");
      node.className = "route-node route-node-" + (i + 1);
      visual.appendChild(node);
    }
    return visual;
  }

  function appendBentoMeta(card, label, chips) {
    var meta = document.createElement("div");
    meta.className = "bento-meta";

    var metaLabel = document.createElement("strong");
    metaLabel.className = "bento-meta-label";
    metaLabel.textContent = label;
    meta.appendChild(metaLabel);

    chips.forEach(function (chipText) {
      var chip = document.createElement("span");
      chip.className = "bento-chip";
      chip.textContent = chipText;
      meta.appendChild(chip);
    });

    card.appendChild(meta);
  }

  function initBentoPolish() {
    var grid = document.querySelector("#how-it-works .bento-grid");
    if (!grid || grid.dataset.polished === "true") return;

    var cards = Array.from(grid.querySelectorAll(".bento-card"));
    var configs = [
      {
        mark: "01",
        visual: createSignalVisual,
        label: "Signal set",
        chips: ["Revenue", "Credit", "Deposits", "Structure"]
      },
      {
        mark: "02",
        visual: createGaugeVisual,
        label: "4 readiness tiers",
        chips: ["Fundable", "Review-ready", "Selective", "Prep-first"]
      },
      {
        mark: "03",
        visual: createRouteVisual,
        label: "Capital lanes",
        chips: ["Primary path", "Backup path", "Next documents"]
      }
    ];

    cards.forEach(function (card, index) {
      var config = configs[index];
      if (!config) return;
      card.classList.add("bento-card-polished");
      card.setAttribute("data-bento-mark", config.mark);
      card.insertBefore(config.visual(), card.firstChild);
      appendBentoMeta(card, config.label, config.chips);
    });

    grid.dataset.polished = "true";
  }

  function initHomepagePolish() {
    initHomepageProofCards();
    initCapitalMarquee();
    initBentoPolish();
  }

  function initReveal() {
    var items = Array.from(document.querySelectorAll("[data-reveal], .bento-card, .path-grid article, .utility-card, .result-card"));
    if (!items.length) return;
    items.forEach(function (item) {
      if (!item.hasAttribute("data-reveal")) item.setAttribute("data-reveal", "");
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (item) { observer.observe(item); });
  }

  function initGlowCards() {
    document.querySelectorAll(".bento-card, .result-card, .utility-card, .frs-card").forEach(function (card) {
      card.setAttribute("data-glow-card", "");
    });
  }

  function injectMobileCtaStyles() {
    if (document.getElementById("frs-mobile-cta-style")) return;
    var style = document.createElement("style");
    style.id = "frs-mobile-cta-style";
    style.textContent = "@media (min-width:901px){.frs-mobile-sticky-cta{display:none!important}}@media (max-width:900px){.frs-mobile-sticky-cta{position:fixed;left:14px;right:14px;bottom:14px;z-index:70;display:flex;min-height:54px;align-items:center;justify-content:center;border-radius:18px;background:linear-gradient(135deg,#d4a64e,#f0c96d);color:#07111f!important;text-transform:uppercase;letter-spacing:.12em;font-weight:950;font-size:.82rem;box-shadow:0 20px 60px rgba(0,0,0,.38);border:1px solid rgba(255,255,255,.3)}body{padding-bottom:70px}}";
    document.head.appendChild(style);
  }

  function initStickyMobileCta() {
    if (document.querySelector(".frs-mobile-sticky-cta")) return;
    injectMobileCtaStyles();
    var scorecardHref = document.querySelector('a[href*="scorecard"]') ? "/scorecard.html" : "#scorecard";
    var cta = document.createElement("a");
    cta.className = "frs-mobile-sticky-cta";
    cta.href = scorecardHref;
    cta.textContent = "Get My Score";
    document.body.appendChild(cta);
  }

  function init() {
    if (reduceMotion) document.body.classList.add("reduced-motion");
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    initHomepagePolish();
    initReveal();
    initGlowCards();
    initStickyMobileCta();
    document.body.classList.add("site-effects-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
