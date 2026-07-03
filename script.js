import {
  buildScoreSubmission,
  calculateBrowserFundingReadiness,
  submitScoreForReview
} from "./lib/browser-scorecard-adapter.js";

(function () {
  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const form = document.querySelector("[data-quiz-form]");
  const leadGate = document.querySelector("[data-lead-gate]");
  const leadForm = document.querySelector("[data-lead-form]");
  const resultPanel = document.querySelector("[data-result-panel]");
  const nextBtn = document.querySelector("[data-next]");
  const prevBtn = document.querySelector("[data-prev]");
  const submitBtn = document.querySelector("[data-submit]");
  const restartBtn = document.querySelector("[data-restart]");
  const progressFill = document.querySelector("[data-progress-fill]");
  const stepLabel = document.querySelector("[data-step-label]");
  const scorePreview = document.querySelector("[data-score-preview]");

  if (!form || !leadForm || !resultPanel) return;

  let currentStep = 0;
  let pendingResult = null;

  function getCheckedValue(name) {
    const checked = form.querySelector(`[name="${name}"]:checked`);
    return checked ? checked.value : "";
  }

  function getCheckedValues(name) {
    return Array.from(form.querySelectorAll(`[name="${name}"]:checked`)).map((item) => item.value);
  }

  function parseAnswers() {
    return {
      businessPersona: getCheckedValue("persona"),
      monthlyRevenue: Number(getCheckedValue("monthlyRevenue")),
      timeInBusinessMonths: Number(getCheckedValue("timeInBusiness")),
      creditScore: Number(getCheckedValue("creditScore")),
      bankStatus: getCheckedValue("bankStatus"),
      businessStructure: getCheckedValue("businessStructure"),
      fundingPurpose: getCheckedValue("fundingPurpose"),
      desiredFundingAmount: Number(getCheckedValue("desiredAmount")),
      redFlags: getCheckedValues("redFlags")
    };
  }

  function updateStep() {
    steps.forEach((step, index) => step.classList.toggle("is-active", index === currentStep));
    const pct = ((currentStep + 1) / steps.length) * 100;
    progressFill.style.width = `${pct}%`;
    stepLabel.textContent = `Question ${currentStep + 1} of ${steps.length}`;
    prevBtn.disabled = currentStep === 0;
    prevBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";
    nextBtn.classList.toggle("is-hidden", currentStep === steps.length - 1);
    submitBtn.classList.toggle("is-hidden", currentStep !== steps.length - 1);
  }

  function validateCurrentStep() {
    const step = steps[currentStep];
    const inputs = Array.from(step.querySelectorAll("input"));
    const radios = inputs.filter((input) => input.type === "radio");
    const checkboxes = inputs.filter((input) => input.type === "checkbox");

    if (radios.length) {
      const groupName = radios[0].name;
      if (!step.querySelector(`[name="${groupName}"]:checked`)) return false;
    }
    if (checkboxes.length) return checkboxes.some((input) => input.checked);
    return true;
  }

  function renderList(selector, items) {
    const element = document.querySelector(selector);
    element.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      element.appendChild(li);
    });
  }

  function renderResult(result) {
    document.querySelector("[data-result-score]").textContent = result.score;
    document.querySelector("[data-result-tier]").textContent = result.tierLabel;
    document.querySelector("[data-result-copy]").textContent = result.tierCopy;
    renderList("[data-result-paths]", result.fundingPaths);
    renderList("[data-result-risks]", result.risks);
    renderList("[data-result-next]", result.nextSteps);

    const docsList = document.querySelector(".accent-card ul");
    if (docsList && Array.isArray(result.recommendedDocuments)) {
      docsList.innerHTML = "";
      result.recommendedDocuments.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc;
        docsList.appendChild(li);
      });
    }

    const cta = document.querySelector("[data-result-cta]");
    if (cta && result.cta?.label) cta.textContent = result.cta.label;

    const ring = document.querySelector("[data-score-ring]");
    const degrees = Math.round((result.score / 100) * 360);
    const color = result.score >= 80 ? "#2ed47a" : result.score >= 65 ? "#a6e75c" : result.score >= 45 ? "#ffd166" : "#ff6b6b";
    ring.style.background = `conic-gradient(${color} 0deg, ${color} ${degrees}deg, #e3eaf2 ${degrees}deg, #e3eaf2 360deg)`;
    scorePreview.textContent = `${result.score}/100 · ${result.tierLabel}`;
  }

  function readLead() {
    const formData = new FormData(leadForm);
    const lead = Object.fromEntries(formData.entries());
    lead.consent = formData.get("consent") === "on";
    return lead;
  }

  async function submitLeadResult(result, lead) {
    const payload = buildScoreSubmission(result, lead, "Funding Readiness Scorecard Landing Page");
    const submission = await submitScoreForReview(payload);
    result.submission = {
      ok: submission.ok,
      status: submission.status,
      leadId: submission.body?.leadId || null
    };
  }

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      scorePreview.textContent = "Pick an option to continue";
      return;
    }
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    scorePreview.textContent = "Score pending";
    updateStep();
  });

  prevBtn.addEventListener("click", () => {
    currentStep = Math.max(currentStep - 1, 0);
    updateStep();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCurrentStep()) {
      scorePreview.textContent = "Pick at least one red flag option";
      return;
    }

    pendingResult = calculateBrowserFundingReadiness(parseAnswers(), {
      source: "Funding Readiness Scorecard Landing Page"
    });

    if (pendingResult.valid === false) {
      scorePreview.textContent = "Review your answers";
      return;
    }

    form.classList.add("is-hidden");
    leadGate.classList.remove("is-hidden");
    progressFill.style.width = "100%";
    stepLabel.textContent = "Score ready";
    scorePreview.textContent = "Lead gate";
  });

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const lead = readLead();
    pendingResult.lead = lead;

    window.fundingReadinessResult = pendingResult;
    window.dispatchEvent(new CustomEvent("fundingReadinessCalculated", { detail: pendingResult }));

    leadGate.classList.add("is-hidden");
    resultPanel.classList.remove("is-hidden");
    renderResult(pendingResult);
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    await submitLeadResult(pendingResult, lead);
  });

  restartBtn.addEventListener("click", () => {
    currentStep = 0;
    pendingResult = null;
    form.reset();
    leadForm.reset();
    form.classList.remove("is-hidden");
    leadGate.classList.add("is-hidden");
    resultPanel.classList.add("is-hidden");
    scorePreview.textContent = "Score pending";
    updateStep();
    document.querySelector("#scorecard").scrollIntoView({ behavior: "smooth" });
  });

  form.addEventListener("change", (event) => {
    if (event.target.name === "redFlags" && event.target.value === "none" && event.target.checked) {
      form.querySelectorAll('[name="redFlags"]').forEach((input) => {
        if (input.value !== "none") input.checked = false;
      });
    }
    if (event.target.name === "redFlags" && event.target.value !== "none" && event.target.checked) {
      const none = form.querySelector('[name="redFlags"][value="none"]');
      if (none) none.checked = false;
    }
  });

  updateStep();
})();
