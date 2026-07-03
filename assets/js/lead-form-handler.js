/* Public-safe lead form handler with consent checks and graceful fallback. */
(function () {
  "use strict";

  function emailLooksValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function serialize(form) {
    var data = {};
    var formData = new FormData(form);
    formData.forEach(function (value, key) {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });
    data.consent = formData.get("consent") === "on" || formData.get("consent") === "true";
    data.source = form.getAttribute("data-source") || document.title || "Funding Readiness public site";
    data.submittedAt = new Date().toISOString();
    return data;
  }

  function validate(form, payload) {
    var errors = [];
    if (form.querySelector('[name="email"]') && !emailLooksValid(payload.email)) errors.push("Enter a valid email address.");
    if (form.querySelector('[name="leadEmail"]') && !emailLooksValid(payload.leadEmail)) errors.push("Enter a valid email address.");
    if (form.querySelector('[name="consent"]') && !payload.consent) errors.push("Consent is required before requesting follow-up.");
    Array.from(form.querySelectorAll("[required]")).forEach(function (input) {
      if ((input.type === "checkbox" && !input.checked) || (!input.value && input.type !== "checkbox")) {
        var label = input.closest("label");
        errors.push((label ? label.textContent.replace(/\s+/g, " ").trim() : input.name) + " is required.");
      }
    });
    return Array.from(new Set(errors));
  }

  function showMessage(form, type, messages) {
    var target = form.querySelector("[data-form-message]") || document.querySelector('[data-form-message="' + (form.id || "lead") + '"]');
    if (!target) {
      target = document.createElement("p");
      target.setAttribute("data-form-message", "generated");
      form.appendChild(target);
    }
    target.className = "form-message form-message-" + type;
    target.textContent = Array.isArray(messages) ? messages.join(" ") : String(messages || "");
  }

  async function submitPayload(form, payload) {
    var endpoint = form.getAttribute("data-endpoint") || form.getAttribute("action");
    if (!endpoint || endpoint === "#") {
      window.localStorage.setItem("lastFundingReadinessLead", JSON.stringify(payload));
      return { ok: true, localOnly: true };
    }
    var response = await fetch(endpoint, {
      method: form.getAttribute("method") || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return { ok: response.ok, status: response.status, body: await response.text() };
  }

  function initForm(form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var payload = serialize(form);
      var errors = validate(form, payload);
      if (errors.length) {
        showMessage(form, "error", errors);
        return;
      }

      var submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = true;
      showMessage(form, "pending", "Saving your request...");
      try {
        var result = await submitPayload(form, payload);
        form.dispatchEvent(new CustomEvent("fundingReadinessLeadSubmitted", { bubbles: true, detail: { payload: payload, result: result } }));
        showMessage(form, "success", "Request received. Next step: review your readiness summary and prepare the listed documents.");
        var redirect = form.getAttribute("data-success-redirect");
        if (redirect) window.location.href = redirect;
      } catch (error) {
        showMessage(form, "error", "Something blocked the submit action. Your information was not sent; please try again or contact the site owner.");
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  function init() {
    Array.from(document.querySelectorAll("form[data-lead-form], form[data-review-request-form], form[data-public-lead-form]")).forEach(initForm);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
