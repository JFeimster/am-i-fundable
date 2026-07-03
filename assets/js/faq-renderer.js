/* Render FAQ details from public-safe FAQ JSON. */
(function () {
  "use strict";

  var FALLBACK = [
    { question: "Is this a funding approval?", answer: "No. The scorecard provides educational readiness guidance and is not an approval, offer, commitment, or guarantee of funding." },
    { question: "Does the scorecard run credit?", answer: "No. The public scorecard uses the answers you provide and does not run a credit check." },
    { question: "What happens after I get a score?", answer: "You can review potential paths, prepare documents, and request a human review when appropriate." }
  ];

  function normalize(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.faqs)) return data.faqs;
    if (data && Array.isArray(data.items)) return data.items;
    return FALLBACK;
  }

  function createFaq(item, index) {
    var details = document.createElement("details");
    details.className = "faq-item";
    if (index === 0) details.open = true;
    var summary = document.createElement("summary");
    summary.textContent = item.question || item.title || "Question";
    var answer = document.createElement("p");
    answer.textContent = item.answer || item.response || item.description || "Answer pending.";
    details.appendChild(summary);
    details.appendChild(answer);
    return details;
  }

  async function load() {
    try {
      var response = await fetch("/site-data/faq.json", { cache: "no-store" });
      if (!response.ok) throw new Error("FAQ data unavailable");
      return normalize(await response.json());
    } catch (error) {
      return FALLBACK;
    }
  }

  async function init() {
    var targets = Array.from(document.querySelectorAll("[data-faq-list]"));
    if (!targets.length) return;
    var items = await load();
    targets.forEach(function (target) {
      var audience = target.getAttribute("data-audience");
      var filtered = audience ? items.filter(function (item) { return !item.audience || item.audience === audience || (Array.isArray(item.audiences) && item.audiences.indexOf(audience) >= 0); }) : items;
      if (!filtered.length) filtered = items;
      target.innerHTML = "";
      filtered.forEach(function (item, index) { target.appendChild(createFaq(item, index)); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
