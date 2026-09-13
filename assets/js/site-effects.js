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

  function createHeroHud() {
    var hud = document.createElement("aside");
    hud.className = "hero-hud";
    hud.setAttribute("aria-label", "Illustrative funding readiness preview");
    hud.innerHTML = [
      '<div class="hero-hud-topline"><span>Funding readiness</span><span class="hud-live"><i></i> signal engine</span></div>',
      '<div class="hero-hud-score-row">',
      '  <div class="hero-hud-score-ring"><strong>78</strong><small>/100</small></div>',
      '  <div><span class="hud-label">Illustrative preview</span><strong class="hud-tier">Strong signal</strong><p>Actual output is calculated from your answers.</p></div>',
      '</div>',
      '<div class="hero-hud-bars" aria-hidden="true">',
      '  <div><span>Revenue</span><b><i style="--signal:86%"></i></b><em>86</em></div>',
      '  <div><span>Credit</span><b><i style="--signal:72%"></i></b><em>72</em></div>',
      '  <div><span>Banking</span><b><i style="--signal:81%"></i></b><em>81</em></div>',
      '  <div><span>Structure</span><b><i style="--signal:90%"></i></b><em>90</em></div>',
      '</div>',
      '<div class="hero-hud-footer"><span><small>Primary lane</small>Business LOC / Working capital</span><span class="hud-route">01 → 03</span></div>'
    ].join("");
    return hud;
  }

  function initHomepageHeroSystem() {
    var hero = document.querySelector(".hero-section");
    var content = hero && hero.querySelector(".hero-content");
    if (!content || content.dataset.operatingSystem === "true") return;

    var eyebrow = content.querySelector(".eyebrow");
    var heading = content.querySelector("h1");
    var copy = content.querySelector(".hero-copy");
    var actions = content.querySelector(".hero-actions");
    var proof = content.querySelector(".hero-proof");
    if (!eyebrow || !heading || !copy || !actions || !proof) return;

    var stage = document.createElement("div");
    stage.className = "hero-stage";

    var primary = document.createElement("div");
    primary.className = "hero-primary";
    [eyebrow, heading, copy, actions].forEach(function (node) { primary.appendChild(node); });
    stage.appendChild(primary);
    stage.appendChild(createHeroHud());

    var metrics = [
      {
        index: "01",
        value: "100-point score",
        title: "Readiness signal",
        detail: "Revenue · banking · credit · history"
      },
      {
        index: "02",
        value: "Primary + backup",
        title: "Capital pathing",
        detail: "Working capital · LOC · asset-backed · more"
      },
      {
        index: "03",
        value: "Next moves",
        title: "Action plan",
        detail: "Blockers · documents · prep"
      }
    ];

    proof.classList.add("hero-metric-rail");
    Array.from(proof.children).forEach(function (item, index) {
      var metric = metrics[index];
      if (!metric) return;
      item.className = "hero-metric";
      item.innerHTML = [
        '<span class="metric-index">' + metric.index + '</span>',
        '<strong class="metric-value">' + metric.value + '</strong>',
        '<span class="metric-title">' + metric.title + '</span>',
        '<small>' + metric.detail + '</small>'
      ].join("");
    });

    content.appendChild(stage);
    content.appendChild(proof);
    content.dataset.operatingSystem = "true";
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
    for (var i = 0; i < 6; i += 1) visual.appendChild(document.createElement("span"));
    return visual;
  }

  function createGaugeVisual() {
    var visual = document.createElement("div");
    visual.className = "bento-visual gauge-visual";
    visual.setAttribute("aria-hidden", "true");
    var value = document.createElement("span");
    value.textContent = "78";
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
        mark: "01 / INPUT",
        visual: createSignalVisual,
        label: "Signal set",
        chips: ["Revenue", "Credit", "Deposits", "Structure"]
      },
      {
        mark: "02 / SCORE",
        visual: createGaugeVisual,
        label: "Readiness output",
        chips: ["Fundable", "Review-ready", "Selective", "Prep-first"]
      },
      {
        mark: "03 / ROUTE",
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

      var stage = document.createElement("div");
      stage.className = "bento-visual-stage";
      stage.appendChild(config.visual());
      card.insertBefore(stage, card.firstChild);
      appendBentoMeta(card, config.label, config.chips);
    });

    grid.dataset.polished = "true";
  }

  function initHomepagePolish() {
    initHomepageHeroSystem();
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();