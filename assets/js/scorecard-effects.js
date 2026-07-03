/* Scorecard visual polish. Does not change scoring logic. */
(function () {
  "use strict";

  function tierSlug(result) {
    var label = String(result && result.tierLabel ? result.tierLabel : "").toLowerCase();
    if (label.indexOf("high") !== -1) return "highly-fundable";
    if (label.indexOf("review") !== -1) return "review-ready";
    if (label.indexOf("select") !== -1) return "selective-fit";
    return "prep-first";
  }

  function animateNumber(node, endValue) {
    if (!node) return;
    var start = 0;
    var end = Math.max(0, Math.min(100, Number(endValue) || 0));
    var startedAt = performance.now();
    var duration = 700;
    function tick(now) {
      var pct = Math.min(1, (now - startedAt) / duration);
      var eased = 1 - Math.pow(1 - pct, 3);
      node.textContent = Math.round(start + (end - start) * eased);
      if (pct < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function applyScorecardState(result) {
    var shell = document.querySelector("[data-scorecard]");
    if (!shell || !result) return;
    var slug = tierSlug(result);
    shell.dataset.tier = slug;
    shell.classList.add("scorecard-has-result");

    var resultPanel = document.querySelector("[data-result-panel]");
    if (resultPanel) resultPanel.dataset.resultTier = slug;

    var scoreNode = document.querySelector("[data-result-score]");
    animateNumber(scoreNode, result.score);

    var ring = document.querySelector("[data-score-ring]");
    if (ring) {
      ring.setAttribute("aria-label", "Funding readiness score " + result.score + " out of 100");
      ring.dataset.score = String(result.score);
    }
  }

  function decorateOptions() {
    document.querySelectorAll(".option-grid label").forEach(function (label, index) {
      if (label.querySelector(".option-index")) return;
      var badge = document.createElement("small");
      badge.className = "option-index";
      badge.textContent = String(index + 1).padStart(2, "0");
      label.appendChild(badge);
    });
  }

  function init() {
    decorateOptions();
    window.addEventListener("fundingReadinessCalculated", function (event) {
      applyScorecardState(event.detail);
    });
    document.body.classList.add("scorecard-effects-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
