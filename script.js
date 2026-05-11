(function () {
  const steps = Array.from(document.querySelectorAll('[data-step]'));
  const form = document.querySelector('[data-quiz-form]');
  const leadGate = document.querySelector('[data-lead-gate]');
  const leadForm = document.querySelector('[data-lead-form]');
  const resultPanel = document.querySelector('[data-result-panel]');
  const nextBtn = document.querySelector('[data-next]');
  const prevBtn = document.querySelector('[data-prev]');
  const submitBtn = document.querySelector('[data-submit]');
  const restartBtn = document.querySelector('[data-restart]');
  const progressFill = document.querySelector('[data-progress-fill]');
  const stepLabel = document.querySelector('[data-step-label]');
  const scorePreview = document.querySelector('[data-score-preview]');

  let currentStep = 0;
  let pendingResult = null;

  function getCheckedValue(name) {
    const checked = form.querySelector(`[name="${name}"]:checked`);
    return checked ? checked.value : '';
  }

  function getCheckedValues(name) {
    return Array.from(form.querySelectorAll(`[name="${name}"]:checked`)).map(item => item.value);
  }

  function parseAnswers() {
    return {
      persona: getCheckedValue('persona'),
      monthlyRevenue: Number(getCheckedValue('monthlyRevenue')),
      timeInBusinessMonths: Number(getCheckedValue('timeInBusiness')),
      creditScore: Number(getCheckedValue('creditScore')),
      bankStatus: getCheckedValue('bankStatus'),
      businessStructure: getCheckedValue('businessStructure'),
      fundingPurpose: getCheckedValue('fundingPurpose'),
      desiredAmount: Number(getCheckedValue('desiredAmount')),
      redFlags: getCheckedValues('redFlags').filter(flag => flag !== 'none')
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
    if (months >= 1) return 5;
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

  function scoreBankActivity(status) {
    const map = {
      none: 2,
      inconsistent: 6,
      consistent: 12,
      strong_clean: 15,
      nsf_recent: 4
    };
    return map[status] || 0;
  }

  function scoreBusinessStructure(structure) {
    const map = {
      none: 1,
      sole_prop: 5,
      entity_no_bank: 6,
      entity_bank: 8,
      entity_bank_ein_clean: 10
    };
    return map[structure] || 0;
  }

  function scoreFundingPurpose(purpose) {
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
    return map[purpose] || 0;
  }

  function redFlagPenalty(flags) {
    let penalty = 0;
    if (flags.includes('open_bankruptcy')) penalty += 25;
    if (flags.includes('tax_lien')) penalty += 15;
    if (flags.includes('recent_late_payments')) penalty += 10;
    if (flags.includes('recent_nsfs')) penalty += 10;
    if (flags.includes('new_bank_account')) penalty += 8;
    if (flags.includes('existing_mca')) penalty += 10;
    if (flags.includes('marketplace_suspended')) penalty += 15;
    if (flags.includes('no_revenue')) penalty += 20;
    return penalty;
  }

  function getTier(score) {
    if (score >= 80) return 'Highly Fundable';
    if (score >= 65) return 'Fundable, But Needs Review';
    if (score >= 45) return 'Possible Fit for Select Programs';
    return 'Not Ready Yet — But Fixable';
  }

  function getTierCopy(score) {
    if (score >= 80) {
      return 'You appear highly fundable based on the information provided. You may have multiple funding paths available, especially if your bank activity and documentation support the numbers.';
    }
    if (score >= 65) {
      return 'You may be fundable, but the best option depends on details like recent deposits, credit history, documentation, and funding purpose. This is where smart routing matters.';
    }
    if (score >= 45) {
      return 'You may have options, but they are likely more selective. Your path may depend heavily on deposits, business structure, credit history, or the exact funding purpose.';
    }
    return 'You may need to strengthen revenue, bank activity, credit, or business structure before applying. That is fixable, but blindly applying right now may waste time.';
  }

  function getFundingPaths(answers) {
    const paths = [];

    if (answers.fundingPurpose === 'ecommerce' || answers.persona === 'ecommerce_seller') {
      paths.push('E-commerce / Marketplace Seller Capital');
    }
    if (answers.fundingPurpose === 'equipment' || answers.persona === 'equipment_heavy') {
      paths.push('Equipment / Truck / Asset-Backed Funding');
    }
    if (answers.fundingPurpose === 'real_estate' || answers.persona === 'real_estate_investor') {
      paths.push('Real Estate / Asset-Secured Capital');
    }
    if (answers.timeInBusinessMonths < 6 && answers.creditScore >= 680) {
      paths.push('Startup / Credit-Leverage Funding');
    }
    if (answers.monthlyRevenue >= 10000 && answers.timeInBusinessMonths >= 6 && answers.creditScore >= 500) {
      paths.push('Fast Working Capital');
      paths.push('Revenue-Based Funding');
    }
    if (answers.monthlyRevenue >= 15000 && answers.timeInBusinessMonths >= 12 && answers.creditScore >= 600) {
      paths.push('Business Line of Credit');
    }
    if (answers.monthlyRevenue >= 20000 && answers.timeInBusinessMonths >= 12 && answers.creditScore >= 600) {
      paths.push('Structured Growth Capital');
    }
    if (answers.fundingPurpose === 'business_credit' || (answers.monthlyRevenue < 3000 && answers.creditScore < 680)) {
      paths.push('Business Credit Builder / Funding Prep');
    }

    if (!paths.length) paths.push('Manual Funding Strategy Review');
    return [...new Set(paths)].slice(0, 5);
  }

  function getRisks(answers) {
    const risks = [];
    if (answers.monthlyRevenue < 3000) risks.push('Low or no current revenue may limit business funding options.');
    if (answers.timeInBusinessMonths < 6) risks.push('Limited time in business may push you toward startup, credit-leverage, or prep options.');
    if (answers.creditScore < 580) risks.push('Credit profile may restrict prime or line-of-credit options.');
    if (answers.bankStatus === 'none') risks.push('No business bank account may make revenue validation harder.');
    if (answers.bankStatus === 'nsf_recent') risks.push('Recent NSFs or overdrafts may limit fast-funding options.');
    if (answers.businessStructure === 'none') risks.push('No formal business structure may reduce business funding readiness.');
    if (answers.redFlags.includes('open_bankruptcy')) risks.push('Open bankruptcy is a major review issue for many funding paths.');
    if (answers.redFlags.includes('tax_lien')) risks.push('Recent tax liens may require manual review before routing.');
    if (answers.redFlags.includes('existing_mca')) risks.push('Existing MCA or daily-payment obligations can affect cash-flow review.');
    if (answers.redFlags.includes('marketplace_suspended')) risks.push('Marketplace suspension may block platform-based seller capital.');
    if (!risks.length) risks.push('No major blockers based on your answers. Documentation still matters.');
    return risks.slice(0, 5);
  }

  function getNextSteps(score, paths) {
    if (score >= 80) {
      return [
        'Review funding amount and intended use.',
        'Prepare recent bank statements and business documentation.',
        'Speak with a funding strategist before submitting an application.'
      ];
    }
    if (score >= 65) {
      return [
        'Confirm your strongest funding lane before applying.',
        'Gather bank statements and revenue proof.',
        'Review any credit or bank activity concerns with a strategist.'
      ];
    }
    if (score >= 45) {
      return [
        'Request a funding readiness review before applying.',
        'Focus on the most realistic path: ' + paths[0] + '.',
        'Clean up bank activity, structure, or documentation gaps where possible.'
      ];
    }
    return [
      'Start with business credit, banking, and revenue-readiness basics.',
      'Avoid shotgun applications until your profile is stronger.',
      'Use the scorecard as a funding prep checklist.'
    ];
  }

  function getLeadPriority(score) {
    if (score >= 80) return 'hot';
    if (score >= 65) return 'warm';
    if (score >= 45) return 'nurture';
    return 'education';
  }

  function calculateFundingReadiness(answers) {
    const rawScore =
      scoreRevenue(answers.monthlyRevenue) +
      scoreTimeInBusiness(answers.timeInBusinessMonths) +
      scoreCredit(answers.creditScore) +
      scoreBankActivity(answers.bankStatus) +
      scoreBusinessStructure(answers.businessStructure) +
      scoreFundingPurpose(answers.fundingPurpose);

    const score = Math.max(0, Math.min(100, rawScore - redFlagPenalty(answers.redFlags)));
    const paths = getFundingPaths(answers);

    return {
      score,
      tier: getTier(score),
      tierCopy: getTierCopy(score),
      fundingPaths: paths,
      risks: getRisks(answers),
      nextSteps: getNextSteps(score, paths),
      leadPriority: getLeadPriority(score),
      answers,
      createdAt: new Date().toISOString(),
      source: 'Funding Readiness Scorecard Landing Page'
    };
  }

  function updateStep() {
    steps.forEach((step, index) => step.classList.toggle('is-active', index === currentStep));
    const pct = ((currentStep + 1) / steps.length) * 100;
    progressFill.style.width = `${pct}%`;
    stepLabel.textContent = `Question ${currentStep + 1} of ${steps.length}`;
    prevBtn.disabled = currentStep === 0;
    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    nextBtn.classList.toggle('is-hidden', currentStep === steps.length - 1);
    submitBtn.classList.toggle('is-hidden', currentStep !== steps.length - 1);
  }

  function validateCurrentStep() {
    const step = steps[currentStep];
    const inputs = Array.from(step.querySelectorAll('input'));
    const radios = inputs.filter(input => input.type === 'radio');
    const checkboxes = inputs.filter(input => input.type === 'checkbox');

    if (radios.length) {
      const groupName = radios[0].name;
      if (!step.querySelector(`[name="${groupName}"]:checked`)) return false;
    }
    if (checkboxes.length) {
      return checkboxes.some(input => input.checked);
    }
    return true;
  }

  function renderList(selector, items) {
    const element = document.querySelector(selector);
    element.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      element.appendChild(li);
    });
  }

  function renderResult(result) {
    document.querySelector('[data-result-score]').textContent = result.score;
    document.querySelector('[data-result-tier]').textContent = result.tier;
    document.querySelector('[data-result-copy]').textContent = result.tierCopy;
    renderList('[data-result-paths]', result.fundingPaths);
    renderList('[data-result-risks]', result.risks);
    renderList('[data-result-next]', result.nextSteps);

    const ring = document.querySelector('[data-score-ring]');
    const degrees = Math.round((result.score / 100) * 360);
    const color = result.score >= 80 ? '#2ed47a' : result.score >= 65 ? '#a6e75c' : result.score >= 45 ? '#ffd166' : '#ff6b6b';
    ring.style.background = `conic-gradient(${color} 0deg, ${color} ${degrees}deg, #e3eaf2 ${degrees}deg, #e3eaf2 360deg)`;
    scorePreview.textContent = `${result.score}/100 · ${result.tier}`;
  }

  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) {
      scorePreview.textContent = 'Pick an option to continue';
      return;
    }
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    scorePreview.textContent = 'Score pending';
    updateStep();
  });

  prevBtn.addEventListener('click', () => {
    currentStep = Math.max(currentStep - 1, 0);
    updateStep();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateCurrentStep()) {
      scorePreview.textContent = 'Pick at least one red flag option';
      return;
    }
    pendingResult = calculateFundingReadiness(parseAnswers());
    form.classList.add('is-hidden');
    leadGate.classList.remove('is-hidden');
    progressFill.style.width = '100%';
    stepLabel.textContent = 'Score ready';
    scorePreview.textContent = 'Lead gate';
  });

  leadForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const lead = Object.fromEntries(formData.entries());
    pendingResult.lead = lead;

    window.fundingReadinessResult = pendingResult;
    window.dispatchEvent(new CustomEvent('fundingReadinessCalculated', { detail: pendingResult }));

    leadGate.classList.add('is-hidden');
    resultPanel.classList.remove('is-hidden');
    renderResult(pendingResult);
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  restartBtn.addEventListener('click', () => {
    currentStep = 0;
    pendingResult = null;
    form.reset();
    leadForm.reset();
    form.classList.remove('is-hidden');
    leadGate.classList.add('is-hidden');
    resultPanel.classList.add('is-hidden');
    scorePreview.textContent = 'Score pending';
    updateStep();
    document.querySelector('#scorecard').scrollIntoView({ behavior: 'smooth' });
  });

  form.addEventListener('change', event => {
    if (event.target.name === 'redFlags' && event.target.value === 'none' && event.target.checked) {
      form.querySelectorAll('[name="redFlags"]').forEach(input => {
        if (input.value !== 'none') input.checked = false;
      });
    }
    if (event.target.name === 'redFlags' && event.target.value !== 'none' && event.target.checked) {
      const none = form.querySelector('[name="redFlags"][value="none"]');
      if (none) none.checked = false;
    }
  });

  updateStep();
})();
