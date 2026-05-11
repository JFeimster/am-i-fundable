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
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
  }

  function getValue(name) {
    const field = form.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
  }

  function getAnswers() {
    return {
      persona: getSingle("persona"),
      monthlyRevenue: Number(getSingle("revenue")),
      timeInBusinessMonths: Number(getSingle("timeInBusiness")),
      creditScore: Number(getSingle("credit")),
      bankStatus: getSingle("bankStatus"),
      structure: getSingle("structure"),
      purpose: getSingle("purpose"),
      desiredFundingAmount: Number(getSingle("amount")),
      redFlags: getMulti("redFlags").filter(flag => flag !== "none"),
      lead: {
        name: getValue("leadName"),
        email: getValue("leadEmail"),
        phone: getValue("leadPhone"),
        businessName: getValue("businessName"),
        state: getValue("state").toUpperCase()
      }
    };
  }

  function scoreRevenue(revenue) {
    if (revenue >= 100000) return 25;
    if (revenue >= 20000) return 23;
    if (revenue >= 15000) return 19;
    if (revenue >= 8500) return 14;
    if (revenue >= 3000) return 8;
    return 2;
  }

  function scoreTimeInBusiness(months) {
    if (months >= 24) return 20;
    if (months >= 12) return 17;
    if (months >= 6) return 13;
    if (months >= 4) return 9;
    if (months > 0) return 5;
    return 4;
  }

  function scoreCredit(credit) {
    if (credit >= 700) return 20;
    if (credit >= 680) return 19;
    if (credit >= 660) return 17;
    if (credit >= 600) return 14;
    if (credit >= 580) return 10;
    if (credit >= 500) return 6;
    return 1;
  }

  function scoreBank(status) {
    const map = {
      none: 2,
      inconsistent: 6,
      consistent: 12,
      strong_clean: 15,
      nsf_recent: 4
    };
    return map[status] ?? 0;
  }

  function scoreStructure(structure) {
    const map = {
      none: 1,
      sole_prop: 5,
      entity_no_bank: 6,
      entity_bank: 8,
      entity_bank_ein_clean: 10
    };
    return map[structure] ?? 0;
  }

  function scorePurpose(purpose) {
    const map = {
      working_capital: 8,
      inventory: 8,
      growth: 8,
      equipment: 9,
      real_estate: 8,
      ecommerce: 10,
      startup: 6,
      debt_consolidation: 5,
      business_credit: 7,
      not_sure: 4
    };
    return map[purpose] ?? 0;
  }

  function redFlagPenalty(flags) {
    const penalties = {
      open_bankruptcy: 25,
      tax_lien: 15,
      recent_late_payments: 10,
      recent_nsfs: 10,
      new_bank_account: 8,
      existing_mca: 10,
      marketplace_suspended: 15,
      no_revenue: 20
    };
    return flags.reduce((sum, flag) => sum + (penalties[flag] || 0), 0);
  }

  function getTier(score) {
    if (score >= 80) return "Highly Fundable";
    if (score >= 65) return "Fundable, But Needs Review";
    if (score >= 45) return "Possible Fit for Select Programs";
    return "Not Ready Yet — But Fixable";
  }

  function getLeadPriority(score) {
    if (score >= 80) return "hot";
    if (score >= 65) return "warm";
    if (score >= 45) return "nurture";
    return "education";
  }

  function determinePrimaryFamily(a) {
    if (a.purpose === "ecommerce" || a.persona === "ecommerce") return "Ecommerce / Marketplace Seller Capital";
    if (a.purpose === "equipment" || a.persona === "equipment_heavy") return "Equipment / Truck / Asset-Backed Funding";
    if (a.purpose === "real_estate" || a.persona === "real_estate") return "Real Estate / Asset-Secured Capital";
    if (a.timeInBusinessMonths < 6 && a.creditScore >= 680) return "Startup / Credit-Leverage Funding";
    if (a.monthlyRevenue >= 10000 && a.timeInBusinessMonths >= 6) return "Fast Working Capital";
    if (a.monthlyRevenue >= 20000 && a.timeInBusinessMonths >= 12 && a.creditScore >= 600) return "Structured Growth Capital";
    if (a.purpose === "business_credit") return "Business Credit Builder / Funding Prep";
    return "Manual Funding Strategy Review";
  }

  function determineSecondaryFamilies(a, primary) {
    const families = new Set();

    if (a.monthlyRevenue >= 15000 && a.timeInBusinessMonths >= 12 && a.creditScore >= 600) {
      families.add("Business Line of Credit");
    }
    if (a.monthlyRevenue >= 10000 && a.timeInBusinessMonths >= 6) {
      families.add("Revenue-Based Funding");
    }
    if (a.creditScore >= 680 && a.timeInBusinessMonths < 12) {
      families.add("Startup / Credit-Leverage Funding");
    }
    if (a.purpose === "inventory" || a.purpose === "growth") {
      families.add("Structured Growth Capital");
    }
    if (a.creditScore < 600 || a.monthlyRevenue < 8500) {
      families.add("Business Credit Builder / Funding Prep");
    }

    families.delete(primary);
    return Array.from(families).slice(0, 3);
  }

  function getStrengths(a) {
    const strengths = [];
    if (a.monthlyRevenue >= 20000) strengths.push("Strong monthly revenue signal");
    else if (a.monthlyRevenue >= 8500) strengths.push("Revenue may support selected alternative funding paths");

    if (a.timeInBusinessMonths >= 24) strengths.push("Two or more years in business");
    else if (a.timeInBusinessMonths >= 6) strengths.push("Enough operating history for some revenue-first paths");

    if (a.creditScore >= 680) strengths.push("Strong personal credit profile");
    else if (a.creditScore >= 600) strengths.push("Fair-credit profile may support selected programs");

    if (a.bankStatus === "strong_clean" || a.bankStatus === "consistent") strengths.push("Bank activity may support revenue validation");
    if (a.structure === "entity_bank_ein_clean") strengths.push("Clean business structure and banking foundation");

    return strengths.length ? strengths : ["You completed the scorecard, which is already better than guessing and panic-applying."];
  }

  function getRisks(a, score) {
    const risks = [];

    if (a.monthlyRevenue < 3000) risks.push("Low current revenue may limit business funding options");
    if (a.timeInBusinessMonths < 6) risks.push("Limited time in business may push you toward startup or credit-leverage paths");
    if (a.creditScore < 600) risks.push("Credit profile may limit prime or unsecured options");
    if (a.bankStatus === "none") risks.push("No business bank account may slow or limit funding review");
    if (a.bankStatus === "nsf_recent") risks.push("Recent NSFs/overdrafts may reduce approval odds");
    if (a.structure === "none") risks.push("No formal business structure may limit business funding paths");
    if (a.desiredFundingAmount >= 500000 && score < 75) risks.push("Requested amount may be high relative to current readiness score");

    const redFlagCopy = {
      open_bankruptcy: "Open bankruptcy may be a major blocker",
      tax_lien: "Recent tax liens may require manual review",
      recent_late_payments: "Recent missed payments may limit credit-sensitive products",
      recent_nsfs: "Recent NSFs may limit fast-capital options",
      new_bank_account: "A newly opened bank account may reduce usable deposit history",
      existing_mca: "Existing MCA/daily payment obligations may affect cash-flow review",
      marketplace_suspended: "Suspended marketplace accounts may block platform-based funding",
      no_revenue: "No current revenue may require a startup, credit-building, or prep path"
    };

    a.redFlags.forEach(flag => {
      if (redFlagCopy[flag]) risks.push(redFlagCopy[flag]);
    });

    return risks.length ? Array.from(new Set(risks)).slice(0, 5) : ["No major blockers detected from your answers"];
  }

  function getNextSteps(score, primary, risks) {
    const steps = [];

    if (score >= 65) {
      steps.push("Review your best-fit funding paths before submitting applications");
      steps.push("Prepare recent bank statements and basic business documentation");
      steps.push("Speak with a funding strategist to avoid chasing the wrong product");
    } else if (score >= 45) {
      steps.push("Get a manual readiness review before applying");
      steps.push("Clean up the biggest blocker first: revenue, credit, bank activity, or structure");
      steps.push("Consider a funding prep or business credit path if immediate funding is limited");
    } else {
      steps.push("Build a cleaner funding foundation before applying");
      steps.push("Open or strengthen a business bank account if needed");
      steps.push("Use a prep checklist before risking denials or wasted applications");
    }

    if (primary.includes("Ecommerce")) steps.push("Have marketplace/platform sales records ready");
    if (primary.includes("Equipment")) steps.push("Gather equipment invoices, specs, or vehicle details");
    if (primary.includes("Real Estate")) steps.push("Prepare property details, project scope, equity, and rent/ARV assumptions");

    return Array.from(new Set(steps)).slice(0, 5);
  }

  function getResultCopy(score, tier) {
    if (score >= 80) {
      return "You appear highly fundable based on your answers. You may have multiple paths available if your documentation supports the numbers.";
    }
    if (score >= 65) {
      return "You may be fundable, but the best option depends on the details. This is where smart routing matters.";
    }
    if (score >= 45) {
      return "You may have options, but they are likely selective. Your file may depend heavily on deposits, credit history, business structure, and funding purpose.";
    }
    return "You may not be ready for most funding products yet — but this is fixable. The next move is preparation, not random applications.";
  }

  function getCTA(score) {
    if (score >= 65) {
      return {
        label: "Speak With a Funding Strategist",
        url: "https://www.distilledfunding.com/apply"
      };
    }
    if (score >= 45) {
      return {
        label: "Request a Funding Readiness Review",
        url: "https://www.distilledfunding.com/apply"
      };
    }
    return {
      label: "Get the Funding Prep Checklist",
      url: "https://www.distilledfunding.com/"
    };
  }

  function calculateFundingReadiness(a) {
    const rawScore =
      scoreRevenue(a.monthlyRevenue) +
      scoreTimeInBusiness(a.timeInBusinessMonths) +
      scoreCredit(a.creditScore) +
      scoreBank(a.bankStatus) +
      scoreStructure(a.structure) +
      scorePurpose(a.purpose);

    const score = Math.max(0, Math.min(100, rawScore - redFlagPenalty(a.redFlags)));
    const tier = getTier(score);
    const primaryFamily = determinePrimaryFamily(a);
    const secondaryFamilies = determineSecondaryFamilies(a, primaryFamily);
    const risks = getRisks(a, score);

    return {
      score,
      tier,
      leadPriority: getLeadPriority(score),
      primaryFamily,
      secondaryFamilies,
      strengths: getStrengths(a),
      risks,
      nextSteps: getNextSteps(score, primaryFamily, risks),
      cta: getCTA(score),
      answers: a,
      source: "Funding Readiness Scorecard Widget",
      createdAt: new Date().toISOString()
    };
  }

  function renderList(selector, items) {
    const list = root.querySelector(selector);
    list.innerHTML = "";
    items.forEach(item => {
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
    root.querySelector("[data-frs-tier]").textContent = result.tier;
    root.querySelector("[data-frs-copy]").textContent = getResultCopy(result.score, result.tier);

    meter.style.background = `conic-gradient(${color} ${degrees}deg, #edf3f7 ${degrees}deg)`;

    renderList("[data-frs-paths]", [result.primaryFamily, ...result.secondaryFamilies]);
    renderList("[data-frs-risks]", result.risks);
    renderList("[data-frs-next-steps]", result.nextSteps);

    cta.textContent = result.cta.label;
    cta.href = result.cta.url;

    form.hidden = true;
    resultPanel.hidden = false;

    // Dispatch a custom event so future HubSpot/Notion/n8n integrations can listen without rewriting the widget.
    root.dispatchEvent(new CustomEvent("fundingReadinessCalculated", {
      bubbles: true,
      detail: result
    }));

    // For easy debugging while embedding. Remove if desired.
    window.fundingReadinessResult = result;
  }

  root.querySelectorAll("[data-none-option]").forEach(none => {
    none.addEventListener("change", () => {
      const boxes = Array.from(form.querySelectorAll('input[name="redFlags"]'));
      if (none.checked) {
        boxes.forEach(box => {
          if (box !== none) box.checked = false;
        });
      }
    });
  });

  form.querySelectorAll('input[name="redFlags"]:not([data-none-option])').forEach(box => {
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

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    const answers = getAnswers();
    const result = calculateFundingReadiness(answers);
    renderResult(result);
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
