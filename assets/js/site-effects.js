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

  function initStickyMobileCta() {
    if (document.querySelector(".frs-mobile-sticky-cta")) return;
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
