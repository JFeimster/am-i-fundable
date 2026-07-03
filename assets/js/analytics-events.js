/* Public-safe analytics event helper. Does not collect borrower PII. */
(function () {
  "use strict";

  var SAFE_EVENT_PREFIX = "funding_readiness_";
  var BLOCKED_KEYS = ["name", "email", "phone", "leadEmail", "leadPhone", "businessName", "ssn", "taxId"];

  function sanitize(details) {
    var clean = {};
    Object.keys(details || {}).forEach(function (key) {
      if (BLOCKED_KEYS.indexOf(key) === -1) clean[key] = details[key];
    });
    return clean;
  }

  function track(name, details) {
    var eventName = name.indexOf(SAFE_EVENT_PREFIX) === 0 ? name : SAFE_EVENT_PREFIX + name;
    var payload = sanitize(details || {});
    payload.event = eventName;
    payload.path = window.location.pathname;
    payload.timestamp = new Date().toISOString();

    window.dispatchEvent(new CustomEvent("fundingReadinessAnalytics", { detail: payload }));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (window.console && document.documentElement.dataset.debugAnalytics === "true") {
      window.console.info("Analytics event", payload);
    }
  }

  function initClickTracking() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-analytics-event]");
      if (!target) return;
      track(target.getAttribute("data-analytics-event"), {
        label: target.getAttribute("data-analytics-label") || target.textContent.trim().slice(0, 80),
        href: target.getAttribute("href") || "",
        component: target.getAttribute("data-analytics-component") || "link"
      });
    });
  }

  function initFormTracking() {
    document.addEventListener("submit", function (event) {
      var form = event.target.closest("form");
      if (!form || !form.matches("[data-track-form], [data-lead-form], [data-quiz-form]")) return;
      track(form.getAttribute("data-analytics-event") || "form_submit", {
        formId: form.id || form.getAttribute("data-source") || "public_form"
      });
    }, true);
  }

  window.FundingReadinessAnalytics = { track: track, sanitize: sanitize };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { initClickTracking(); initFormTracking(); });
  } else {
    initClickTracking();
    initFormTracking();
  }
})();
