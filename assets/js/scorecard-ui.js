/*
 * Scorecard UI controller for public-facing static pages.
 * This file intentionally uses public-safe scoring estimates only.
 */
(function () {
  "use strict";

  var FIELD_WEIGHTS = {
    monthlyRevenue: 24,
    timeInBusiness: 18,
    creditScore: 18,
    bankStatus: 16,
    businessStructure: 12,
    desiredAmount: 6,
    redFlags: -24
  };

  function q(root, selector) { return root.querySelector(selector); }
  function qa(root, selector) { return Array.from(root.querySelectorAll(selector)); }

  function checkedValue(form, name) {
    var input = q(form, '[name="' + name + '"]:checked');
    return input ? input.value : "";
  }

  function checkedValues(form, name) {
    return qa(form, '[name="' + name + '"]:checked').map(function (input) { return input.value; });
  }

  function scoreRevenue(value) {
    var revenue = Number(value || 0);
    if (revenue >= 100000) return 24;
    if (revenue >= 50000) return 22;
    if (revenue >= 20000) return 19;
    if (revenue >= 15000) return 16;
    if (revenue >= 8500) return 12;
    if (revenue >= 3000) return 7;
    return 1;
  }

  function scoreTime(value) {
    var months = Number(value || 0);
    if (months >= 24) return 18;
    if (months >= 12) return 15;
    if (months >= 6) return 10;
    if (months >= 4) return 7;
    if (months > 0) return 4;
    return 1;
  }

  function scoreCredit(value) {
    var score = Number(value || 0);
    if (score >= 700) return 18;
    if (score >= 680) return 16;
    if (score >= 660) return 14;
    if (score >= 600) return 10;
    if (score >= 580) return 7;
    if (score >= 500) return 4;
    return 1;
  }

  function scoreBankStatus(value) {
    return {
      strong_clean: 16,
      consistent: 13,
      inconsistent: 7,
      nsf_recent: 4,
      none: 1
    }[value] || 4;
  }

  function scoreStructure(value) {
    return {
      entity_bank_ein_clean: 12,
      entity_bank: 10,
      entity_no_bank: 5,
      sole_prop: 4,
      none: 1
    }[value] || 3;
  }

  function scoreAmount(value, revenueValue) {
    var amount = Number(value || 0);
    var revenue = Number(revenueValue || 0);
    if (!amount) return 2;
    if (amount <= 25000) return 6;
    if (amount <= 75000 && revenue >= 15000) return 6;
    if (amount <= 150000 && revenue >= 50000) return 5;
    if (amount <= 500000 && revenue >= 100000) return 5;
    return 3;
  }

  function classify(score) {
    if (score >= 80) {
      return {
        id: "highly_fundable",
        label: "Highly Fundable",
        page: "highly-fundable.html",
        summary: "Your answers suggest a stronger funding-readiness profile. A strategy review may help identify the cleanest next step."
      };
    }
    if (score >= 62) {
      return {
        id: "review_ready",
        label: "Fundable Review Recommended",
        page: "fundable-review.html",
        summary: "Your answers show possible funding paths, but a human review should confirm fit and documentation needs."
      };
    }
    if (score >= 42) {
      return {
        id: "selective_fit",
        label: "Selective Fit",
        page: "fundable-review.html",
        summary: "You may have a path, but the file likely needs careful positioning before any application conversation."
      };
    }
    return {
      id: "prep_first",
      label: "Prep First",
      page: "not-ready.html",
      summary: "Your answers suggest the best next move is preparation before seeking funding. That is not failure; it is a fixable map."
    };
  }

  function fundingPaths(answers) {
    var purpose = answers.fundingPurpose;
    var paths = [];
    if (["working_capital", "inventory", "growth"].indexOf(purpose) >= 0) paths.push("Working capital readiness review");
    if (purpose === "equipment") paths.push("Equipment or asset funding preparation");
    if (purpose === "real_estate") paths.push("Real estate funding path review");
    if (purpose === "ecommerce") paths.push("Marketplace or ecommerce capital review");
    if (purpose === "startup") paths.push("Startup setup and credit-leverage preparation");
    if (purpose === "business_credit") paths.push("Business credit foundation checklist");
    if (!paths.length) paths.push("General funding readiness review");
    return paths;
  }

  function blockers(answers) {
    var flags = [];
    if (Number(answers.monthlyRevenue || 0) < 8500) flags.push("Revenue may limit certain working-capital paths.");
    if (Number(answers.timeInBusiness || 0) < 6) flags.push("Short operating history may require startup or prep-first positioning.");
    if (Number(answers.creditScore || 0) < 600) flags.push("Credit profile may narrow options and increase documentation importance.");
    if (["none", "nsf_recent"].indexOf(answers.bankStatus) >= 0) flags.push("Bank activity may need cleanup before stronger options are realistic.");
    if (answers.redFlags.some(function (flag) { return flag !== "none"; })) flags.push("Selected red flags should be reviewed before next steps are recommended.");
    if (!flags.length) flags.push("No major readiness blockers were flagged from your answers.");
    return flags;
  }

  function nextSteps(classification) {
    if (classification.id === "highly_fundable") {
      return ["Gather recent bank statements and business details.", "Request a strategy review.", "Compare fit across potential funding families before applying."];
    }
    if (classification.id === "prep_first") {
      return ["Clean up business structure and banking basics.", "Build a simple document folder.", "Retake the scorecard after the main blockers improve."];
    }
    return ["Prepare revenue, bank, and business setup documents.", "Request manual review before choosing a path.", "Avoid shotgun applications until the file is positioned."];
  }

  function calculate(answers) {
    var score = 0;
    score += scoreRevenue(answers.monthlyRevenue);
    score += scoreTime(answers.timeInBusiness);
    score += scoreCredit(answers.creditScore);
    score += scoreBankStatus(answers.bankStatus);
    score += scoreStructure(answers.businessStructure);
    score += scoreAmount(answers.desiredAmount, answers.monthlyRevenue);
    if (answers.redFlags.some(function (flag) { return flag !== "none"; })) {
      score -= Math.min(24, answers.redFlags.length * 6);
    }
    score = Math.max(0, Math.min(100, Math.round(score)));
    var tier = classify(score);
    return {
      score: score,
      tier: tier,
      fundingPaths: fundingPaths(answers),
      blockers: blockers(answers),
      nextSteps: nextSteps(tier),
      disclaimer: "This is a funding-readiness estimate, not an approval, offer, or guarantee of funding."
    };
  }

  function readAnswers(form) {
    return {
      businessPersona: checkedValue(form, "persona"),
      monthlyRevenue: checkedValue(form, "monthlyRevenue") || checkedValue(form, "revenue"),
      timeInBusiness: checkedValue(form, "timeInBusiness"),
      creditScore: checkedValue(form, "creditScore") || checkedValue(form, "credit"),
      bankStatus: checkedValue(form, "bankStatus"),
      businessStructure: checkedValue(form, "businessStructure") || checkedValue(form, "structure"),
      fundingPurpose: checkedValue(form, "fundingPurpose") || checkedValue(form, "purpose"),
      desiredAmount: checkedValue(form, "desiredAmount") || checkedValue(form, "amount"),
      redFlags: checkedValues(form, "redFlags")
    };
  }

  function renderResult(root, result) {
    var payload = encodeURIComponent(JSON.stringify(result));
    window.sessionStorage.setItem("fundingReadinessResult", JSON.stringify(result));
    qa(root, "[data-score-output]").forEach(function (el) { el.textContent = String(result.score); });
    qa(root, "[data-tier-output]").forEach(function (el) { el.textContent = result.tier.label; });
    qa(root, "[data-result-summary]").forEach(function (el) { el.textContent = result.tier.summary; });
    qa(root, "[data-result-link]").forEach(function (el) { el.href = result.tier.page + "?result=" + payload; });
    root.dispatchEvent(new CustomEvent("fundingReadinessCalculated", { bubbles: true, detail: result }));
  }

  function initScorecard(root) {
    var form = q(root, "form");
    if (!form) return;
    var steps = qa(form, "[data-step]");
    var current = 0;
    var next = q(root, "[data-next], [data-frs-next]");
    var back = q(root, "[data-prev], [data-frs-back]");
    var submit = q(root, "[data-submit], [data-frs-submit]");
    var label = q(root, "[data-step-label], [data-frs-step-label]");
    var progress = q(root, "[data-progress-fill], [data-frs-progress-bar]");

    function showStep(index) {
      current = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach(function (step, i) {
        step.classList.toggle("is-active", i === current);
        step.hidden = i !== current && step.tagName.toLowerCase() === "section";
      });
      if (label) label.textContent = "Question " + (current + 1) + " of " + steps.length;
      if (progress) progress.style.width = Math.round(((current + 1) / steps.length) * 100) + "%";
      if (back) back.hidden = current === 0;
      if (next) next.hidden = current === steps.length - 1;
      if (submit) submit.hidden = current !== steps.length - 1;
    }

    function isStepValid() {
      var inputs = qa(steps[current], "input[required], input[type='radio'], input[type='checkbox']");
      var groups = {};
      inputs.forEach(function (input) {
        if (input.type === "radio" || input.type === "checkbox") groups[input.name] = true;
      });
      return Object.keys(groups).every(function (name) {
        return !!q(steps[current], '[name="' + name + '"]:checked');
      });
    }

    if (next) next.addEventListener("click", function () {
      if (steps.length && !isStepValid()) {
        root.setAttribute("data-validation-message", "Select an option to continue.");
        return;
      }
      showStep(current + 1);
    });

    if (back) back.addEventListener("click", function () { showStep(current - 1); });

    form.addEventListener("change", function (event) {
      if (event.target.name === "redFlags" && event.target.value === "none" && event.target.checked) {
        qa(form, '[name="redFlags"]').forEach(function (input) {
          if (input.value !== "none") input.checked = false;
        });
      }
      if (event.target.name === "redFlags" && event.target.value !== "none" && event.target.checked) {
        var none = q(form, '[name="redFlags"][value="none"]');
        if (none) none.checked = false;
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var result = calculate(readAnswers(form));
      renderResult(root, result);
      var redirect = form.getAttribute("data-result-redirect");
      if (redirect) window.location.href = redirect + "?tier=" + encodeURIComponent(result.tier.id) + "&score=" + encodeURIComponent(result.score);
    });

    if (steps.length) showStep(0);
  }

  window.AmIFundableScorecard = {
    calculate: calculate,
    classify: classify,
    readAnswers: readAnswers
  };

  function init() {
    qa(document, "[data-scorecard-runtime], [data-scorecard]").forEach(initScorecard);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
