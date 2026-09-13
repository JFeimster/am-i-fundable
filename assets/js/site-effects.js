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

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function applyCapitalEnablementCopy() {
    if (!document.querySelector(".hero-section")) return;

    document.title = "Capital Fit & Funding Path Engine | Moonshine Capital";
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "Turn one business profile into a capital map: strongest funding lanes, friction points, document needs, and next moves before you apply.");

    setText(".brand-lockup em", "Capital Enablement Engine");

    var navLinks = document.querySelectorAll(".main-nav a");
    if (navLinks[0]) navLinks[0].textContent = "Capital Map";
    if (navLinks[1]) navLinks[1].textContent = "Capital Lanes";
    if (navLinks[2]) navLinks[2].textContent = "FAQ";
    var navCta = document.querySelector(".main-nav .nav-cta");
    if (navCta) navCta.textContent = "Map My Options";

    setText(".hero-section .eyebrow", "Capital enablement without the funding department");
    setText(".hero-section h1", "Turn Your Business Profile Into a Capital Plan.");
    setText(".hero-section .hero-copy", "Nine inputs. See the capital lanes your business can actually pursue, what is shrinking your options, and what to do next—without shopping brokers, chasing lenders, or filling out five applications.");
    var heroActions = document.querySelectorAll(".hero-section .hero-actions a");
    if (heroActions[0]) heroActions[0].textContent = "Map My Capital Options";
    if (heroActions[1]) heroActions[1].textContent = "See the Engine";

    setText("#how-it-works .section-kicker", "The engine");
    setText("#how-it-works .section-heading h2", "Not a loan broker. A capital routing layer.");
    setText("#how-it-works .section-heading p", "Most funding sites collect your form and sell or forward the lead. This engine turns your business signals into a capital map first—strongest lanes, friction points, and next moves.");
    var howCards = document.querySelectorAll("#how-it-works .bento-card");
    if (howCards[0]) {
      setText("#how-it-works .bento-card:nth-child(1) h3", "Feed the engine");
      setText("#how-it-works .bento-card:nth-child(1) p", "Revenue, history, credit, deposits, structure, use case, amount, and red flags become one signal set.");
    }
    if (howCards[1]) {
      setText("#how-it-works .bento-card:nth-child(2) h3", "Expose the friction");
      setText("#how-it-works .bento-card:nth-child(2) p", "See the strengths helping your file and the issues shrinking your options before you waste applications.");
    }
    if (howCards[2]) {
      setText("#how-it-works .bento-card:nth-child(3) h3", "Route the capital");
      setText("#how-it-works .bento-card:nth-child(3) p", "Get primary and alternate capital lanes, document prep, and the next move—not a random lender list.");
    }

    setText("#scorecard .section-kicker", "Capital fit engine");
    setText("#scorecard .section-heading h2", "See What Your Business Can Actually Pursue.");
    setText("#scorecard .section-heading p", "Nine inputs. Your strongest capital lanes, likely friction, and next moves. No blind applications. No broker roulette.");
    setText("#scorecard [data-score-preview]", "Map pending");
    setText("#scorecard [data-submit]", "Map My Capital Options");
    setText("#scorecard [data-lead-gate] .section-kicker", "Your capital map is ready");
    setText("#scorecard [data-lead-gate] h3", "Unlock your capital map.");
    setText("#scorecard [data-lead-gate] p", "Enter your details to view your fit signal, strongest funding lanes, friction points, and next moves.");
    var leadSubmit = document.querySelector('#scorecard [data-lead-form] button[type="submit"]');
    if (leadSubmit) leadSubmit.textContent = "Show My Capital Map";
    setText("#scorecard .result-hero-card .section-kicker", "Capital Fit Signal");
    setText("#scorecard .result-card:nth-child(1) h4", "What is working for you");
    setText("#scorecard .result-card:nth-child(2) h4", "What is shrinking your options");
    setText("#scorecard .recommendations-card h4", "Strongest capital lanes");
    setText("#scorecard .result-card:nth-child(4) h4", "Next moves");
    var resultCta = document.querySelector("#scorecard [data-result-cta]");
    if (resultCta) resultCta.textContent = "Review My Capital Strategy";
    var restart = document.querySelector("#scorecard [data-restart]");
    if (restart) restart.textContent = "Rebuild My Map";

    setText("#paths .section-kicker", "Capital enablement");
    setText("#paths .section-heading h2", "Stop Shopping for Loans. Start Routing Capital.");
    setText("#paths .section-heading p", "Working capital, structured growth, startup leverage, equipment, real estate, and commerce do not belong in one funnel. Different profiles should enter different lanes.");

    var split = document.querySelector(".split-cta");
    if (split) {
      setText(".split-cta .section-kicker", "The difference");
      setText(".split-cta h2", "You Do Not Need Another Funding Department. You Need a Capital Enablement Layer.");
      setText(".split-cta p", "For operators, brokers, and partners, one intake becomes structured capital intelligence before the first funding conversation.");
      var splitButton = split.querySelector(".btn");
      if (splitButton) splitButton.textContent = "Map a Business";
    }

    setText("#faq .section-kicker", "Straight answers");
    setText("#faq .section-heading h2", "What This Is. What It Isn't.");
    var faqSummaries = document.querySelectorAll("#faq summary");
    var faqAnswers = document.querySelectorAll("#faq details p");
    if (faqSummaries[0]) faqSummaries[0].textContent = "Is this a loan application?";
    if (faqAnswers[0]) faqAnswers[0].textContent = "No. This is a capital-fit and funding-path assessment. It is not an approval, offer, commitment to lend, or guarantee of funding.";
    if (faqSummaries[1]) faqSummaries[1].textContent = "Does this run my credit?";
    if (faqAnswers[1]) faqAnswers[1].textContent = "No. The public tool does not pull credit. It uses the information you provide to map likely capital lanes and readiness signals.";
    if (faqSummaries[2]) faqSummaries[2].textContent = "What do I get after the map?";
    if (faqAnswers[2]) faqAnswers[2].textContent = "You get a fit signal, strongest capital lanes, friction points, document needs, and suggested next moves.";
    if (faqSummaries[3]) faqSummaries[3].textContent = "Can partners embed this?";
    if (faqAnswers[3]) faqAnswers[3].textContent = "Yes. The engine can be packaged as an embeddable front door for partner pages and capital-enablement workflows.";

    setText(".final-cta h2", "One Intake. A Clearer Capital Plan.");
    setText(".final-cta p", "Map the strongest lanes, expose the friction, and know the next move before your file gets bounced around the funding internet.");
    var finalButton = document.querySelector(".final-cta .btn");
    if (finalButton) finalButton.textContent = "Map My Capital Options";

    setText(".site-footer > p:first-child", "Moonshine Capital · Capital enablement for business owners, brokers, and partners who need better routing—not another funding runaround.");
  }

  function createHeroHud() {
    var hud = document.createElement("aside");
    hud.className = "hero-hud";
    hud.setAttribute("aria-label", "Illustrative capital fit preview");
    hud.innerHTML = [
      '<div class="hero-hud-topline"><span>Capital fit engine</span><span class="hud-live"><i></i> signal layer</span></div>',
      '<div class="hero-hud-score-row">',
      '  <div class="hero-hud-score-ring"><strong>78</strong><small>/100</small></div>',
      '  <div><span class="hud-label">Illustrative preview</span><strong class="hud-tier">Strong capital fit</strong><p>Actual output is calculated from your business signals.</p></div>',
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
        value: "One intake",
        title: "Business signals",
        detail: "Revenue · banking · credit · history"
      },
      {
        index: "02",
        value: "Primary + backup",
        title: "Capital lanes",
        detail: "Working capital · LOC · asset-backed · more"
      },
      {
        index: "03",
        value: "Friction + moves",
        title: "Capital plan",
        detail: "Blockers · documents · next actions"
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
        label: "Business signals",
        chips: ["Revenue", "Credit", "Deposits", "Structure"]
      },
      {
        mark: "02 / FRICTION",
        visual: createGaugeVisual,
        label: "Capital fit",
        chips: ["Strengths", "Blockers", "Fit signal", "Prep"]
      },
      {
        mark: "03 / ROUTE",
        visual: createRouteVisual,
        label: "Capital lanes",
        chips: ["Primary lane", "Backup lane", "Next documents"]
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

  function ensureHomepageSystemStyles() {
    if (!document.querySelector(".hero-section")) return;

    if (!document.getElementById("homepage-system-style")) {
      var link = document.createElement("link");
      link.id = "homepage-system-style";
      link.rel = "stylesheet";
      link.href = "/assets/css/homepage-system.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("homepage-launch-style")) {
      var launchLink = document.createElement("link");
      launchLink.id = "homepage-launch-style";
      launchLink.rel = "stylesheet";
      launchLink.href = "/assets/css/homepage-launch.css";
      document.head.appendChild(launchLink);
    }

    document.body.classList.add("homepage-system-v2");
  }

  function findDirectChild(parent, className) {
    return Array.from(parent.children).find(function (child) {
      return child.classList && child.classList.contains(className);
    }) || null;
  }

  function createSystemHeader(section, code) {
    if (!section || section.dataset.systemHeader === "true") return section && section.querySelector(".system-section-header");

    var heading = findDirectChild(section, "section-heading");
    if (!heading) return null;

    var kicker = findDirectChild(section, "section-kicker") || heading.querySelector(".section-kicker");
    var wrap = document.createElement("div");
    wrap.className = "system-section-header";

    var meta = document.createElement("div");
    meta.className = "system-section-meta";

    var sectionCode = document.createElement("span");
    sectionCode.className = "system-section-code";
    sectionCode.textContent = code;
    meta.appendChild(sectionCode);
    if (kicker) meta.appendChild(kicker);

    heading.classList.remove("centered");
    wrap.appendChild(meta);
    wrap.appendChild(heading);
    section.insertBefore(wrap, section.firstChild);
    section.dataset.systemHeader = "true";
    return wrap;
  }

  function createScorecardFlowMap() {
    var map = document.createElement("aside");
    map.className = "scorecard-flow-map";
    map.setAttribute("aria-label", "Capital mapping flow");
    [
      ["01", "Business signals", "9 inputs"],
      ["02", "Capital fit", "strength + friction"],
      ["03", "Funding lanes", "primary + backup"]
    ].forEach(function (item) {
      var row = document.createElement("div");
      row.className = "scorecard-flow-item";
      row.innerHTML = '<b>' + item[0] + '</b><div><strong>' + item[1] + '</strong><span>' + item[2] + '</span></div><i aria-hidden="true"></i>';
      map.appendChild(row);
    });
    return map;
  }

  function initScorecardSectionSystem() {
    var section = document.querySelector("#scorecard");
    var header = createSystemHeader(section, "02 / CAPITAL MAP");
    if (!header || header.dataset.flowReady === "true") return;
    header.classList.add("has-flow");
    header.appendChild(createScorecardFlowMap());
    header.dataset.flowReady = "true";
  }

  function routeConfigFor(title, index) {
    var normalized = String(title || "").toLowerCase();
    if (normalized.indexOf("working") !== -1) return ["LIQUIDITY", "FAST", "BANK + REVENUE", "SHORT-CYCLE"];
    if (normalized.indexOf("structured") !== -1 || normalized.indexOf("growth") !== -1) return ["GROWTH", "MEDIUM", "HISTORY + FINANCIALS", "PLANNED"];
    if (normalized.indexOf("startup") !== -1 || normalized.indexOf("credit") !== -1) return ["LEVERAGE", "VARIABLE", "CREDIT + SETUP", "EARLY-STAGE"];
    if (normalized.indexOf("equipment") !== -1 || normalized.indexOf("truck") !== -1) return ["ASSET", "MEDIUM", "ASSET + CASH FLOW", "PRODUCTIVE ASSET"];
    if (normalized.indexOf("ecommerce") !== -1 || normalized.indexOf("commerce") !== -1) return ["COMMERCE", "FAST", "SALES + STORE", "INVENTORY"];
    if (normalized.indexOf("real estate") !== -1 || normalized.indexOf("property") !== -1) return ["PROPERTY", "DEAL-BASED", "ASSET + PROJECT", "REAL ESTATE"];
    return ["PATH " + String(index + 1).padStart(2, "0"), "PROFILED", "DOCS + SIGNALS", "REVIEW"];
  }

  function initPathConsole() {
    var section = document.querySelector("#paths");
    if (!section || section.dataset.consoleReady === "true") return;
    createSystemHeader(section, "03 / CAPITAL ROUTING");

    var cards = Array.from(section.querySelectorAll(".path-grid article"));
    cards.forEach(function (card, index) {
      var title = card.querySelector("h3");
      var firstSpan = Array.from(card.children).find(function (child) { return child.tagName === "SPAN"; });
      if (firstSpan) firstSpan.classList.add("legacy-path-icon");

      var config = routeConfigFor(title && title.textContent, index);
      card.classList.add("route-card-console");

      var head = document.createElement("div");
      head.className = "route-card-head";
      head.innerHTML = '<span>' + config[0] + '</span><span>capital lane</span>';
      card.insertBefore(head, card.firstChild);

      var ui = document.createElement("div");
      ui.className = "route-card-ui";
      [
        ["Speed", config[1]],
        ["Signal", config[2]],
        ["Best fit", config[3]]
      ].forEach(function (rowData) {
        var row = document.createElement("div");
        row.className = "route-card-row";
        row.innerHTML = '<span>' + rowData[0] + '</span><strong>' + rowData[1] + '</strong>';
        ui.appendChild(row);
      });
      card.appendChild(ui);
    });

    section.dataset.consoleReady = "true";
  }

  function initFaqConsole() {
    var section = document.querySelector("#faq");
    if (!section || section.dataset.consoleReady === "true") return;
    var header = createSystemHeader(section, "04 / STRAIGHT ANSWERS");
    if (!header) return;

    var layout = document.createElement("div");
    layout.className = "faq-console-layout";
    var intro = document.createElement("div");
    intro.className = "faq-console-intro";
    var stack = document.createElement("div");
    stack.className = "faq-stack";

    intro.appendChild(header);

    var facts = document.createElement("div");
    facts.className = "faq-facts";
    [
      ["ONE INTAKE", "One business profile, not five applications"],
      ["9 SIGNALS", "A compact capital-fit signal set"],
      ["ROUTED OUTPUT", "Capital lanes, friction, and next moves"]
    ].forEach(function (factData) {
      var fact = document.createElement("div");
      fact.className = "faq-fact";
      fact.innerHTML = '<strong>' + factData[0] + '</strong><span>' + factData[1] + '</span>';
      facts.appendChild(fact);
    });
    intro.appendChild(facts);

    Array.from(section.querySelectorAll("details")).forEach(function (detail) {
      stack.appendChild(detail);
    });

    layout.appendChild(intro);
    layout.appendChild(stack);
    section.appendChild(layout);
    section.dataset.consoleReady = "true";
  }

  function initFinalCtaConsole() {
    var section = document.querySelector(".final-cta");
    if (!section || section.dataset.consoleReady === "true") return;

    var copy = document.createElement("div");
    copy.className = "final-cta-copy";
    Array.from(section.children).forEach(function (child) { copy.appendChild(child); });

    var panel = document.createElement("aside");
    panel.className = "final-route-panel";
    panel.setAttribute("aria-label", "Capital enablement sequence");
    [
      ["01", "Business signals", "INPUT"],
      ["02", "Capital lanes", "ROUTE"],
      ["03", "Next move", "ACT"]
    ].forEach(function (item) {
      var step = document.createElement("div");
      step.className = "final-route-step";
      step.innerHTML = '<b>' + item[0] + '</b><strong>' + item[1] + '</strong><span>' + item[2] + '</span>';
      panel.appendChild(step);
    });

    var inner = document.createElement("div");
    inner.className = "final-cta-inner";
    inner.appendChild(copy);
    inner.appendChild(panel);
    section.appendChild(inner);
    section.dataset.consoleReady = "true";
  }

  function initHomepageSectionSystem() {
    if (!document.querySelector(".hero-section")) return;
    ensureHomepageSystemStyles();
    createSystemHeader(document.querySelector("#how-it-works"), "01 / SIGNAL INTAKE");
    initScorecardSectionSystem();
    initPathConsole();
    initFaqConsole();
    initFinalCtaConsole();
  }

  function initHomepagePolish() {
    initHomepageHeroSystem();
    initCapitalMarquee();
    initBentoPolish();
    initHomepageSectionSystem();
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
    cta.textContent = "Map My Options";
    document.body.appendChild(cta);
  }

  function init() {
    if (reduceMotion) document.body.classList.add("reduced-motion");
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    applyCapitalEnablementCopy();
    initHomepagePolish();
    initReveal();
    initGlowCards();
    initStickyMobileCta();
    document.body.classList.add("site-effects-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();