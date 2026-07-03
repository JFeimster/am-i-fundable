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
