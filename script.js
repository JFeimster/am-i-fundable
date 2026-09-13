import "./assets/js/page-metadata.js";
import "./assets/js/site-nav.js";
import "./assets/js/site-footer.js";
import "./assets/js/site-effects.js";
import "./assets/js/scorecard-effects.js";

import {
  buildScoreSubmission,
  calculateBrowserFundingReadiness,
  submitScoreForReview
} from "./lib/browser-scorecard-adapter.js";
import { normalizeScorecardResult } from "./lib/scorecard-result-view-model.js";

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
  const leadStatus = document.querySelector("[data-lead-status]");
  const leadStatusMessage = document.querySelector("[data-lead-status-message]");
  const retryLeadBtn = document.querySelector("[data-retry-lead]");
  const leadSubmitBtn = leadForm.querySelector('button[type="submit"]');

  if (!form || !leadForm || !resultPanel) return;

  let currentStep = 0;
  let pendingResult = null;
  let submissionPayload = null;
  let leadDelivered = false;
  let submissionInFlight = false;

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
    if (!element) return;
    element.innerHTML = "";
    (Array.isArray(items) ? items : []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = typeof item === "string" ? item : String(item?.label || item?.name || item || "");
      element.appendChild(li);
    });
  }

  function renderRecommendations(cards) {
    const container = document.querySelector("[data-result-recommendations]");
    if (!container) return;
    container.innerHTML = "";

    cards.forEach((card, index) => {
      const item = document.createElement("article");
      item.className = index === 0 ? "recommendation-primary" : "recommendation-secondary";

      if (index === 0) {
        const label = document.createElement("span");
        label.className = "recommendation-label";
        label.textContent = "Primary recommendation";
        item.appendChild(label);
      }

      const heading = document.createElement("h5");
      heading.textContent = card.label || "Funding Path Review";
      item.appendChild(heading);

      const summary = document.createElement("p");
      summary.textContent = card.summary || "Potential path for review.";
      item.appendChild(summary);

      const nextStep = document.createElement("p");
      nextStep.className = "recommendation-next-step";
      nextStep.textContent = `Next step: ${card.nextStep || "Review this path with a funding strategist."}`;
      item.appendChild(nextStep);

      container.appendChild(item);
    });
  }

  function revealResultContent() {
    resultPanel.querySelectorAll("[data-reveal], .result-card").forEach((item) => item.classList.add("is-visible"));
  }

  function renderResult(rawResult) {
    const result = normalizeScorecardResult(rawResult);
    document.querySelector("[data-result-score]").textContent = result.score;
    document.querySelector("[data-result-tier]").textContent = result.tierLabel;
    document.querySelector("[data-result-copy]").textContent = result.tierCopy;
    renderList("[data-result-strengths]", result.strengths);
    renderList("[data-result-risks]", result.risks);
    renderList("[data-result-next]", result.nextSteps);
    renderList("[data-result-docs]", result.recommendedDocuments);
    renderRecommendations(result.recommendationCards);

    const cta = document.querySelector("[data-result-cta]");
    if (cta) {
      cta.textContent = result.cta.label;
      cta.href = result.cta.url;
    }

    const manualReview = document.querySelector("[data-manual-review]");
    if (manualReview) manualReview.classList.toggle("is-hidden", !result.manualReviewRecommended);

    const ring = document.querySelector("[data-score-ring]");
    const degrees = Math.round((result.score / 100) * 360);
    const color = result.score >= 80 ? "#2ed47a" : result.score >= 65 ? "#a6e75c" : result.score >= 45 ? "#ffd166" : "#ff6b6b";
    if (ring) ring.style.background = `conic-gradient(${color} 0deg, ${color} ${degrees}deg, #e3eaf2 ${degrees}deg, #e3eaf2 360deg)`;
    scorePreview.textContent = `${result.score}/100 · ${result.tierLabel}`;
    return result;
  }

  function readLead() {
    const formData = new FormData(leadForm);
    const lead = Object.fromEntries(formData.entries());
    lead.consent = formData.get("consent") === "on";
    return lead;
  }

  function setLeadStatus(message, { retry = false, state = "" } = {}) {
    if (!leadStatus || !leadStatusMessage) return;
    leadStatus.classList.remove("is-hidden", "is-success", "is-error", "is-pending");
    if (state) leadStatus.classList.add(`is-${state}`);
    leadStatusMessage.textContent = message;
    if (retryLeadBtn) retryLeadBtn.classList.toggle("is-hidden", !retry);
  }

  async function submitLeadResult(result, lead) {
    if (leadDelivered || submissionInFlight) return;
    submissionInFlight = true;
    if (leadSubmitBtn) leadSubmitBtn.disabled = true;
    setLeadStatus("Submitting your review request…", { state: "pending" });

    try {
      submissionPayload ||= buildScoreSubmission(result, lead, "Funding Readiness Scorecard Landing Page");
      const submission = await submitScoreForReview(submissionPayload);
      const delivery = submission.body?.leadDelivery;
      leadDelivered = submission.ok === true && delivery?.delivered === true;
      result.submission = {
        ok: submission.ok,
        status: submission.status,
        leadId: submission.body?.leadId || null,
        leadDelivery: delivery || null
      };

      if (leadDelivered) {
        setLeadStatus(`Your information was received. Reference: ${submission.body.leadId}`, { state: "success" });
      } else {
        setLeadStatus("Your score is ready, but we could not submit your review request. You can retry below.", { retry: true, state: "error" });
      }
    } finally {
      submissionInFlight = false;
      if (leadSubmitBtn) leadSubmitBtn.disabled = false;
    }
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

    leadGate.classList.add("is-hidden");
    resultPanel.classList.remove("is-hidden");
    pendingResult = renderResult(pendingResult);
    revealResultContent();
    window.fundingReadinessResult = pendingResult;
    window.dispatchEvent(new CustomEvent("fundingReadinessCalculated", { detail: pendingResult }));
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    await submitLeadResult(pendingResult, lead);
  });

  retryLeadBtn?.addEventListener("click", () => {
    if (pendingResult?.lead) submitLeadResult(pendingResult, pendingResult.lead);
  });

  restartBtn.addEventListener("click", () => {
    currentStep = 0;
    pendingResult = null;
    submissionPayload = null;
    leadDelivered = false;
    submissionInFlight = false;
    form.reset();
    leadForm.reset();
    form.classList.remove("is-hidden");
    leadGate.classList.add("is-hidden");
    resultPanel.classList.add("is-hidden");
    if (leadStatus) leadStatus.classList.add("is-hidden");
    if (retryLeadBtn) retryLeadBtn.classList.add("is-hidden");
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
