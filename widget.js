import {
  buildScoreSubmission,
  calculateBrowserFundingReadiness,
  submitScoreForReview
} from "./lib/browser-scorecard-adapter.js";

(() => {
  const root = document.querySelector("[data-frs-widget]");
  if (!root) return;

  const form = root.querySelector("[data-frs-form]");
  const steps = Array.from(root.querySelectorAll(".frs-step"));
  const nextBtn = root.querySelector("[data-frs-next]");
  const backBtn = root.querySelector("[data-frs-back]");
  const submitBtn = root.querySelector("[data-frs-submit]");
  const progressBar = root.querySelector("[data-frs-progress-bar]");
  const progressLabel = root.querySelector("[data-frs-step-label]");
  const progressPercent = root.querySelector("[data-frs-progress-percent]");
  const resultPanel = root.querySelector("[data-frs-result]");
  const resetBtn = root.querySelector("[data-frs-reset]");

  let currentStep = 0;
  const totalSteps = steps.length;

  const fieldLabels = {
    persona: "business type",
    revenue: "monthly revenue",
    timeInBusiness: "time in business",
    credit: "credit score",
    bankStatus: "business bank activity",
    structure: "business structure",
    purpose: "funding purpose",
    amount: "desired funding amount",
    leadName: "name",
    leadEmail: "email",
    leadPhone: "phone",
    businessName: "business name",
    state: "state",
    consent: "consent"
  };

  function updateStepUI() {
    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === currentStep);
    });

    const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
    progressBar.style.width = `${pct}%`;
    progressLabel.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
    progressPercent.textContent = `${pct}%`;

    backBtn.hidden = currentStep === 0;
    nextBtn.hidden = currentStep === totalSteps - 1;
    submitBtn.hidden = currentStep !== totalSteps - 1;

    clearError();
  }

  function activeStepRequiredFields() {
    return Array.from(steps[currentStep].querySelectorAll("[required]"));
  }

  function validateCurrentStep() {
    const step = steps[currentStep];
    const requiredFields = activeStepRequiredFields();

    for (const field of requiredFields) {
      if (field.type === "radio") {
        const checked = step.querySelector(`input[name="${field.name}"]:checked`);
        if (!checked) {
          showError(`Choose your ${fieldLabels[field.name] || "answer"} to continue.`);
          return false;
        }
      } else if (field.type === "checkbox") {
        if (!field.checked) {
          showError("Please confirm consent to view your score.");
          return false;
        }
      } else if (!field.value.trim()) {
        showError(`Enter your ${fieldLabels[field.name] || "information"} to continue.`);
        field.focus();
        return false;
      }
    }

    if (currentStep === 8 && !form.querySelector('input[name="redFlags"]:checked')) {
      showError("Choose any red flags that apply, or select none.");
      return false;
    }

    return true;
  }

  function showError(message) {
    clearError();
    const err = document.createElement("p");
    err.className = "frs-error";
    err.setAttribute("role", "alert");
    err.textContent = message;
    form.appendChild(err);
  }

  function clearError() {
    const old = form.querySelector(".frs-error");
    if (old) old.remove();
  }

  function getSingle(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "";
  }

  function getMulti(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
  }

  function getValue(name) {
    const field = form.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
  }

  function getAnswers() {
    return {
      businessPersona: getSingle("persona"),
      monthlyRevenue: Number(getSingle("revenue")),
      timeInBusinessMonths: Number(getSingle("timeInBusiness")),
      creditScore: Number(getSingle("credit")),
      bankStatus: getSingle("bankStatus"),
      businessStructure: getSingle("structure"),
      fundingPurpose: getSingle("purpose"),
      desiredFundingAmount: Number(getSingle("amount")),
      redFlags: getMulti("redFlags")
    };
  }

  function getLead() {
    return {
      name: getValue("leadName"),
      email: getValue("leadEmail"),
      phone: getValue("leadPhone"),
      businessName: getValue("businessName"),
      state: getValue("state").toUpperCase(),
      consent: form.querySelector('[name="consent"]')?.checked === true
    };
  }

  function renderList(selector, items) {
    const list = root.querySelector(selector);
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function renderResult(result) {
    const color = result.score >= 80 ? "#18b26b" : result.score >= 65 ? "#8ac441" : result.score >= 45 ? "#d9a321" : "#cf3b35";
    const degrees = Math.round((result.score / 100) * 360);
    const meter = root.querySelector("[data-frs-score-meter]");
    const cta = root.querySelector("[data-frs-cta]");

    root.querySelector("[data-frs-score]").textContent = result.score;
    root.querySelector("[data-frs-score-ring]").textContent = result.score;
    root.querySelector("[data-frs-tier]").textContent = result.tierLabel;
    root.querySelector("[data-frs-copy]").textContent = result.tierCopy;

    meter.style.background = `conic-gradient(${color} ${degrees}deg, #edf3f7 ${degrees}deg)`;

    renderList("[data-frs-paths]", result.fundingPaths);
    renderList("[data-frs-risks]", result.risks);
    renderList("[data-frs-next-steps]", result.nextSteps);

    cta.textContent = result.cta?.label || "Speak With a Funding Strategist";
    if (result.cta?.url && result.cta.url !== "#strategy-review") cta.href = result.cta.url;

    form.hidden = true;
    resultPanel.hidden = false;

    root.dispatchEvent(new CustomEvent("fundingReadinessCalculated", {
      bubbles: true,
      detail: result
    }));

    window.fundingReadinessResult = result;
  }

  async function submitLeadResult(result, lead) {
    const payload = buildScoreSubmission(result, lead, "Funding Readiness Scorecard Widget");
    const submission = await submitScoreForReview(payload);
    result.submission = {
      ok: submission.ok,
      status: submission.status,
      leadId: submission.body?.leadId || null
    };
  }

  root.querySelectorAll("[data-none-option]").forEach((none) => {
    none.addEventListener("change", () => {
      const boxes = Array.from(form.querySelectorAll('input[name="redFlags"]'));
      if (none.checked) {
        boxes.forEach((box) => {
          if (box !== none) box.checked = false;
        });
      }
    });
  });

  form.querySelectorAll('input[name="redFlags"]:not([data-none-option])').forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) {
        const none = form.querySelector("[data-none-option]");
        if (none) none.checked = false;
      }
    });
  });

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    currentStep = Math.min(currentStep + 1, totalSteps - 1);
    updateStepUI();
  });

  backBtn.addEventListener("click", () => {
    currentStep = Math.max(currentStep - 1, 0);
    updateStepUI();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    const result = calculateBrowserFundingReadiness(getAnswers(), {
      source: "Funding Readiness Scorecard Widget"
    });
    if (result.valid === false) {
      showError("Review your answers before viewing the score.");
      return;
    }

    const lead = getLead();
    result.lead = lead;
    renderResult(result);
    await submitLeadResult(result, lead);
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    resultPanel.hidden = true;
    form.hidden = false;
    currentStep = 0;
    updateStepUI();
  });

  updateStepUI();
})();
