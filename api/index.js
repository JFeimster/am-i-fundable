import fs from "node:fs";
import { calculateFundingReadiness, getScoreTier } from "../lib/scorecard-engine.js";
import { matchPartners } from "../lib/partner-match-engine.js";
import { buildReadinessReport } from "../lib/api/report-builder.js";
import { assertPublicSafe, sanitizeForPublic } from "../lib/api/public-boundary.js";
import { buildManualReviewPath, toPublicFundingPath, toPublicScoreResult } from "../lib/api/safe-result-presenter.js";
import { normalizeApplicant, validateReviewApplicant, validateScorecardAnswers } from "../lib/api/validate-payload.js";

const PUBLIC_FAMILIES_PATH = new URL("../data/product-families.public.json", import.meta.url);
const PROVIDERS_PATH = new URL("../internal/providers/funding-providers.registry.json", import.meta.url);
const PRODUCTS_PATH = new URL("../internal/products/funding-products.registry.json", import.meta.url);
const EMBED_CONFIG_PATH = new URL("../config/embed.config.json", import.meta.url);

const DATASETS = {
  pages: "../site-data/pages.json",
  navigation: "../site-data/navigation.json",
  ctas: "../site-data/ctas.json",
  faq: "../site-data/faq.json",
  "result-tiers": "../site-data/result-tiers.json",
  "funding-paths": "../site-data/funding-paths.json",
  "document-checklists": "../site-data/document-checklists.json",
  resources: "../site-data/resource-library.json",
  "embed-presets": "../site-data/embed-presets.json",
  seo: "../site-data/seo-pages.json",
  "product-families": "../data/product-families.public.json",
  compliance: "../data/compliance-copy.public.json",
  "lead-field-map": "../config/lead-field-map.public.json"
};

const TIER_DETAILS = {
  highly_fundable: {
    id: "highly_fundable",
    label: "Highly Fundable",
    leadPriority: "hot",
    range: "80-100",
    summary: "Your answers show stronger readiness signals. A fast document review may be the right next step.",
    nextSteps: ["Prepare recent bank statements", "Confirm funding purpose", "Request a funding strategy review"]
  },
  fundable_review: {
    id: "fundable_review",
    label: "Fundable, But Needs Review",
    leadPriority: "warm",
    range: "65-79",
    summary: "Your answers show possible readiness, but a human review should confirm the best path.",
    nextSteps: ["Review caution areas", "Prepare documents", "Request a funding strategy review"]
  },
  selective_programs: {
    id: "selective_programs",
    label: "Possible Fit for Select Programs",
    leadPriority: "nurture",
    range: "45-64",
    summary: "Some paths may be possible, but prep work and context are important before provider-specific direction.",
    nextSteps: ["Strengthen documents", "Review bank activity", "Request manual review if timing is urgent"]
  },
  not_ready_fixable: {
    id: "not_ready_fixable",
    label: "Not Ready Yet — But Fixable",
    leadPriority: "education",
    range: "0-44",
    summary: "Your answers suggest prep work should come before a funding review.",
    nextSteps: ["Complete business setup basics", "Organize bank activity", "Follow a readiness improvement checklist"]
  }
};

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const route = resolveRoute(req);

  try {
    switch (route) {
      case "health":
        requireMethod(req, ["GET"]);
        return send(res, 200, {
          service: "funding-readiness-scorecard",
          status: "healthy",
          apiVersion: "1.0.0",
          runtime: "consolidated-public-api",
          environment: process.env.VERCEL_ENV || "local",
          timestamp: new Date().toISOString()
        });
      case "version":
        requireMethod(req, ["GET"]);
        return send(res, 200, versionPayload());
      case "submit-score":
      case "scorecard/submit-score":
        requireMethod(req, ["POST"]);
        return submitScore(req, res);
      case "match/funding-paths":
      case "match-partners":
      case "lender-match-review":
        requireMethod(req, ["POST"]);
        return fundingPathMatch(req, res);
      case "scorecard/request-review":
      case "match/manual-review":
        requireMethod(req, ["POST"]);
        return requestReview(req, res);
      case "leads/create-lead":
        requireMethod(req, ["POST"]);
        return createLead(req, res);
      case "leads/route-lead":
        requireMethod(req, ["POST"]);
        return routeLead(req, res);
      case "leads/update-lead-status":
        requireMethod(req, ["POST", "PATCH"]);
        return updateLeadStatus(req, res);
      case "public/funding-paths":
        requireMethod(req, ["GET"]);
        return publicFundingPaths(req, res);
      case "public/document-checklist":
        requireMethod(req, ["GET"]);
        return documentChecklist(req, res);
      case "public/result-tier":
        requireMethod(req, ["GET"]);
        return resultTier(req, res);
      case "public/resource-recommendations":
        requireMethod(req, ["POST"]);
        return resourceRecommendations(req, res);
      case "public/embed-config":
        requireMethod(req, ["GET"]);
        return send(res, 200, assertPublicSafe({
          status: "embed_config_loaded",
          config: sanitizeForPublic(readJson(EMBED_CONFIG_PATH, {})),
          disclaimer: "Embed configuration is public-safe and does not contain private routing or provider data."
        }));
      case "public/site-data":
        requireMethod(req, ["GET"]);
        return siteData(req, res);
      case "scorecard/start-session":
        requireMethod(req, ["POST"]);
        return send(res, 201, assertPublicSafe({
          sessionId: createId("session"),
          status: "scorecard_session_started",
          expiresInMinutes: 30,
          message: "Scorecard session created. No approval or funding decision has been made."
        }));
      case "scorecard/get-result":
        requireMethod(req, ["GET", "POST"]);
        return getResult(req, res);
      case "scorecard/generate-readiness-report":
        requireMethod(req, ["POST"]);
        return generateReadinessReport(req, res);
      case "webhooks/scorecard-submitted":
      case "webhooks/review-requested":
      case "webhooks/lead-routed":
        requireMethod(req, ["POST"]);
        return webhookAck(req, res, route);
      default:
        return send(res, 404, {
          ok: false,
          error: { code: "not_found", message: `Public API route /api/${route || ""} was not found.` }
        });
    }
  } catch (error) {
    const statusCode = Number(error?.statusCode || error?.status || 500);
    const publicStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
    return send(res, publicStatus, {
      ok: false,
      error: {
        code: error?.code || (publicStatus === 405 ? "method_not_allowed" : "request_failed"),
        message: publicStatus >= 500 ? "Unable to process the request." : String(error?.message || "Request failed."),
        details: Array.isArray(error?.details) ? error.details : undefined,
        requestId: createId("err")
      }
    });
  }
}

async function submitScore(req, res) {
  const payload = await readBody(req);
  const applicant = normalizeApplicant(payload.applicant || payload.leadContact || {});
  const consent = payload?.applicant?.consent === true || payload?.consent?.contactConsent === true || applicant.consent === true;
  if (!applicant.email || !applicant.phone || !consent) {
    return send(res, 400, { error: "Missing required applicant contact or consent fields." });
  }
  const answers = validateScorecardAnswers(payload.answers || {});
  const scoreResult = calculateFundingReadiness(answers);
  if (!scoreResult.valid) return send(res, 400, { error: "Invalid scorecard answers", details: scoreResult.errors || [] });
  const lead = {
    id: createId("frs"),
    source: String(payload.source || "Funding Readiness Scorecard").slice(0, 120),
    applicant,
    answers,
    scoreResult,
    leadPriority: scoreResult.leadPriority,
    reviewStatus: scoreResult.manualReviewRecommended ? "queued_for_review" : "new",
    createdAt: new Date().toISOString()
  };
  await maybePostWebhook(process.env.N8N_SCORECARD_WEBHOOK_URL, lead);
  return send(res, 200, assertPublicSafe({
    ok: true,
    message: "Score received for review. This is not an approval, offer, or guarantee of funding.",
    leadId: lead.id,
    publicResult: toPublicScoreResult(scoreResult)
  }));
}

async function fundingPathMatch(req, res) {
  const payload = await readBody(req);
  const answers = validateScorecardAnswers(payload.answers || payload.applicant || {});
  const scoreResult = calculateFundingReadiness(answers);
  const applicant = { ...answers, fundingReadinessScore: scoreResult.valid ? scoreResult.score : 0 };
  const providers = readRegistryEntries(PROVIDERS_PATH);
  const products = readRegistryEntries(PRODUCTS_PATH);
  const matchResult = matchPartners(applicant, providers, products, { maxMatches: 5 });
  const recommendations = matchResult.publicRecommendations?.length ? matchResult.publicRecommendations : [buildManualReviewPath("no_public_path_found")];
  return send(res, 200, assertPublicSafe({
    status: "funding_paths_generated",
    score: scoreResult.valid ? scoreResult.score : null,
    tier: scoreResult.valid ? scoreResult.tier : null,
    humanReviewRequired: matchResult.humanReviewRequired === true || scoreResult.manualReviewRecommended === true,
    recommendations: sanitizeForPublic(recommendations),
    nextStep: "Review these public-safe funding path categories with a funding strategist before provider-specific direction is shared.",
    message: "Potential funding paths generated for review. This is not an approval, offer, underwriting decision, or guarantee of funding."
  }));
}

async function requestReview(req, res) {
  const payload = await readBody(req);
  const applicant = validateReviewApplicant(payload.applicant || payload.leadContact || {});
  const answers = validateScorecardAnswers(payload.answers || {});
  const calculated = calculateFundingReadiness(answers);
  if (!calculated.valid) {
    return send(res, 201, assertPublicSafe({
      reviewId: createId("review"),
      status: "needs_answer_review",
      message: "Review request received, but the answers need cleanup before a readiness result can be summarized.",
      errors: calculated.errors || [],
      nextStep: "Confirm the scorecard answers and request review again."
    }));
  }
  return send(res, 201, assertPublicSafe({
    reviewId: createId("review"),
    status: calculated.manualReviewRecommended ? "queued_for_manual_review" : "queued_for_strategy_review",
    applicant: { businessName: applicant.businessName, state: applicant.state },
    result: toPublicScoreResult(calculated),
    nextStep: calculated.manualReviewRecommended
      ? "A funding strategist should review the scorecard details before provider-specific direction is shared."
      : "Prepare documents and review the recommended funding path with a funding strategist.",
    message: "Review request queued. This is not an approval, offer, underwriting decision, or guarantee of funding."
  }));
}

async function createLead(req, res) {
  const payload = await readBody(req);
  const applicant = validateReviewApplicant(payload.applicant || {});
  const answers = validateScorecardAnswers(payload.answers || {});
  const result = calculateFundingReadiness(answers);
  return send(res, 201, assertPublicSafe({
    status: "lead_created_demo",
    leadId: createId("lead"),
    source: String(payload.source || "Funding Readiness Scorecard").slice(0, 120),
    applicant: { businessName: applicant.businessName, state: applicant.state, contactReady: Boolean(applicant.email && applicant.consent) },
    readiness: result.valid ? toPublicScoreResult(result) : null,
    routing: {
      queue: result.manualReviewRecommended ? "funding_strategy_review" : "scorecard_follow_up",
      priority: result.leadPriority || "manual_review",
      nextAction: result.manualReviewRecommended ? "manual_review" : "send_document_checklist"
    },
    message: "Lead record shaped for server-side follow-up. This response uses demo persistence only."
  }));
}

async function routeLead(req, res) {
  const payload = await readBody(req);
  const answers = validateScorecardAnswers(payload.answers || {});
  const result = calculateFundingReadiness(answers);
  return send(res, 200, assertPublicSafe({
    status: "lead_route_created",
    leadId: payload.leadId ? String(payload.leadId).slice(0, 80) : null,
    score: result.valid ? result.score : null,
    tier: result.valid ? result.tier : null,
    route: buildLeadRoute(result, answers),
    message: "Lead route created using public-safe readiness logic only."
  }));
}

async function updateLeadStatus(req, res) {
  const payload = await readBody(req);
  const leadId = String(payload.leadId || "").slice(0, 120);
  const status = String(payload.status || payload.reviewStatus || "new").slice(0, 80);
  if (!leadId) return send(res, 422, { ok: false, error: { code: "validation_error", message: "leadId is required." } });
  return send(res, 200, assertPublicSafe({ accepted: true, leadId, status, updatedAt: new Date().toISOString(), message: "Lead status update accepted for demo workflow processing." }));
}

function publicFundingPaths(req, res) {
  const query = req.query || {};
  const registry = readJson(PUBLIC_FAMILIES_PATH, { id: "product-families-public-fallback", version: "fallback", entries: fallbackFundingPaths() });
  let entries = (registry.entries || []).map(toPublicFundingPath);
  const familyId = valueOf(query.familyId);
  const search = valueOf(query.search).toLowerCase();
  if (familyId) entries = entries.filter((entry) => entry.familyId === familyId || entry.id === familyId);
  if (search) entries = entries.filter((entry) => [entry.label, entry.summary, ...(entry.bestFor || [])].join(" ").toLowerCase().includes(search));
  const limit = clampNumber(query.limit, 1, 25, entries.length || 25);
  return send(res, 200, assertPublicSafe({
    registryId: registry.id || "product-families-public",
    version: registry.version || "1.0.0",
    count: Math.min(entries.length, limit),
    entries: entries.slice(0, limit),
    disclaimer: "These are public-safe funding path categories for review. They are not approvals, offers, or guarantees of funding."
  }));
}

function documentChecklist(req, res) {
  const fundingPurpose = valueOf(req.query?.fundingPurpose) || "not_sure";
  const familyId = valueOf(req.query?.familyId) || purposeToFamilyId(fundingPurpose);
  const registry = readJson(PUBLIC_FAMILIES_PATH, { entries: fallbackFundingPaths() });
  const paths = (registry.entries || []).map(toPublicFundingPath);
  const path = paths.find((entry) => entry.id === familyId || entry.familyId === familyId) || paths.find((entry) => entry.id === "manual-review");
  const checklist = buildChecklist({ familyId, fundingPurpose, path });
  return send(res, 200, assertPublicSafe({
    familyId,
    fundingPurpose,
    title: checklist.title,
    items: checklist.items,
    nextStep: checklist.nextStep,
    disclaimer: "Document checklists are preparation guidance only. Actual requirements depend on review and funding path."
  }));
}

function resultTier(req, res) {
  const score = Number(valueOf(req.query?.score));
  const tierId = valueOf(req.query?.tierId) || (Number.isFinite(score) ? getScoreTier(score).id : "fundable_review");
  return send(res, 200, assertPublicSafe({
    tier: TIER_DETAILS[tierId] || TIER_DETAILS.fundable_review,
    allTiers: Object.values(TIER_DETAILS),
    disclaimer: "Result tiers are readiness categories only. They are not approvals, offers, underwriting decisions, or guarantees of funding."
  }));
}

async function resourceRecommendations(req, res) {
  const payload = await readBody(req);
  const tierId = String(payload.tierId || payload?.result?.tier?.id || "fundable_review");
  const fundingPurpose = String(payload.fundingPurpose || payload?.answers?.fundingPurpose || "not_sure");
  const manualReviewRecommended = payload.manualReviewRecommended === true || payload?.result?.manualReviewRecommended === true;
  const resources = recommendResources({ tierId, fundingPurpose, manualReviewRecommended });
  return send(res, 200, assertPublicSafe({ tierId, fundingPurpose, count: resources.length, resources, disclaimer: "Resources are educational next-step suggestions. They are not funding offers or outcome guarantees." }));
}

function siteData(req, res) {
  const datasetId = valueOf(req.query?.dataset) || "index";
  if (datasetId === "index" || datasetId === "all") {
    return send(res, 200, assertPublicSafe({
      registryId: "public-site-data-index",
      count: Object.keys(DATASETS).length,
      datasets: Object.keys(DATASETS).map((id) => ({ id, visibility: id === "lead-field-map" ? "public_build_time_only" : "public_runtime_browser_safe", endpoint: `/api/public/site-data?dataset=${encodeURIComponent(id)}` })),
      disclaimer: "This endpoint returns public-safe site data only."
    }));
  }
  const relativePath = DATASETS[datasetId];
  if (!relativePath) return send(res, 200, assertPublicSafe({ dataset: datasetId, found: false, data: { id: `${datasetId}-fallback`, entries: [] }, message: "Requested dataset was not found, so a public-safe fallback was returned." }));
  const data = readJson(new URL(relativePath, import.meta.url), { id: `${datasetId}-fallback`, entries: [] });
  return send(res, 200, assertPublicSafe({
    dataset: datasetId,
    visibility: datasetId === "lead-field-map" ? "public_build_time_only" : "public_runtime_browser_safe",
    found: true,
    data: sanitizeForPublic(data),
    disclaimer: "This endpoint returns public-safe site data only."
  }));
}

async function getResult(req, res) {
  const input = req.method === "POST" ? await readBody(req) : req.query || {};
  const score = Number(valueOf(input.score));
  const resultId = input.resultId ? String(valueOf(input.resultId)).slice(0, 80) : null;
  if (!Number.isFinite(score)) {
    return send(res, 200, assertPublicSafe({ status: "result_lookup_not_persisted", resultId, message: "Persistent result lookup is not enabled yet. Provide a score to receive public-safe tier guidance.", nextStep: "Use /api/scorecard/submit-score to compute a fresh readiness result." }));
  }
  const tier = getScoreTier(score);
  return send(res, 200, assertPublicSafe({
    status: "result_tier_resolved",
    resultId,
    score: Math.max(0, Math.min(100, score)),
    tier: { id: tier.id, label: tier.label, summary: tier.summary || TIER_DETAILS[tier.id]?.summary || "Your result should be reviewed with context before choosing a funding path." },
    nextStep: TIER_DETAILS[tier.id]?.nextSteps?.[0] || "Review the scorecard result with a funding strategist.",
    disclaimer: "This result is readiness guidance only. It is not an approval, offer, underwriting decision, or guarantee of funding."
  }));
}

async function generateReadinessReport(req, res) {
  const payload = await readBody(req);
  const applicant = normalizeApplicant(payload.applicant || {});
  const answers = validateScorecardAnswers(payload.answers || {});
  const calculated = calculateFundingReadiness(answers);
  if (!calculated.valid) return send(res, 200, assertPublicSafe({ status: "invalid_answers", errors: calculated.errors || [], message: "A readiness report could not be generated until the scorecard answers are valid." }));
  const report = buildReadinessReport({ applicant, answers, result: calculated, resources: payload.resources || [] });
  return send(res, 200, assertPublicSafe({ status: "report_generated", report, message: "Readiness report generated. This is educational guidance only and not a funding offer." }));
}

async function webhookAck(req, res, route) {
  const payload = await readBody(req);
  return send(res, 200, assertPublicSafe({
    accepted: true,
    eventId: String(payload.eventId || `${route.replaceAll("/", ".")}_${Date.now()}`).slice(0, 120),
    eventType: route.replace("webhooks/", "").replaceAll("-", "."),
    leadId: String(payload.leadId || payload.subjectId || "").slice(0, 120) || null,
    receivedAt: new Date().toISOString(),
    message: "Public-safe workflow event accepted."
  }));
}

function versionPayload() {
  return assertPublicSafe({
    service: "funding-readiness-scorecard",
    project: "am-i-fundable",
    apiVersion: "1.0.0",
    runtime: "consolidated-public-api",
    contract: "public-safe-readiness-api",
    deployment: { environment: process.env.VERCEL_ENV || "local", branch: process.env.VERCEL_GIT_COMMIT_REF || "unknown", commitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown" },
    routes: ["/api/health", "/api/version", "/api/submit-score", "/api/public/funding-paths", "/api/public/document-checklist", "/api/public/result-tier", "/api/public/resource-recommendations", "/api/scorecard/request-review", "/api/scorecard/generate-readiness-report", "/api/match/funding-paths"],
    disclaimer: "Public routes return readiness guidance only. They do not provide approvals, offers, underwriting decisions, or guarantees of funding."
  });
}

function buildLeadRoute(result, answers) {
  if (result.manualReviewRecommended) return { queue: "funding_strategy_review", priority: result.leadPriority || "manual_review", nextAction: "manual_review", nextPage: "/fundable-review.html", tasks: ["Review caution areas", "Confirm funding purpose", "Request recent documents"] };
  if (result.tier?.id === "highly_fundable") return { queue: "fast_follow_up", priority: "hot", nextAction: "document_checklist", nextPage: "/highly-fundable.html", tasks: ["Send document checklist", "Confirm desired funding amount", "Offer funding strategy review"] };
  if (result.tier?.id === "not_ready_fixable") return { queue: "readiness_nurture", priority: "education", nextAction: "readiness_resources", nextPage: "/not-ready.html", tasks: ["Send readiness improvement resources", "Recommend document cleanup", "Invite future review when signals improve"] };
  return { queue: "standard_follow_up", priority: result.leadPriority || "warm", nextAction: "funding_path_summary", nextPage: "/results.html", tasks: ["Summarize public-safe funding path", "Request missing documents", "Offer human review"], fundingPurpose: answers.fundingPurpose };
}

function buildChecklist({ familyId, fundingPurpose, path }) {
  const baseItems = [
    { id: "business-info", label: "Business information", detail: "Legal name, entity type, state, EIN status, and contact details." },
    { id: "bank-statements", label: "Recent business bank statements", detail: "Prepare the most recent 3 to 6 months when available." },
    { id: "funding-purpose", label: "Funding purpose notes", detail: "Summarize how funds would be used and why now." }
  ];
  const familyItems = {
    "equipment-asset-backed": [{ id: "equipment-quote", label: "Equipment quote, invoice, or repair estimate", detail: "Include asset details, vendor information, and expected use." }],
    "real-estate-asset-secured": [{ id: "property-details", label: "Property details or project scope", detail: "Include address, purchase contract, rehab scope, rent roll, or exit plan where relevant." }],
    "ecommerce-marketplace-capital": [{ id: "marketplace-reports", label: "Marketplace or store sales reports", detail: "Prepare platform sales history, store reports, and payout records." }],
    "startup-credit-leverage": [{ id: "credit-income-docs", label: "Credit profile and income documentation", detail: "Prepare income records and review credit-readiness basics." }],
    "business-credit-builder": [{ id: "entity-banking-setup", label: "Entity, EIN, and banking setup records", detail: "Confirm entity formation, EIN confirmation, and business bank account setup." }]
  };
  const purposeItems = {
    business_credit: [{ id: "vendor-account-list", label: "Business credit setup checklist", detail: "List current accounts, vendor accounts, and business identity details." }],
    debt_refi: [{ id: "current-obligations", label: "Current obligation summary", detail: "List balances, payment frequency, and payoff goals." }]
  };
  return { title: `${path?.label || "Funding Path"} Document Prep Checklist`, items: [...(familyItems[familyId] || []), ...(purposeItems[fundingPurpose] || []), ...baseItems].slice(0, 8), nextStep: "Collect the strongest available documents before requesting a funding strategy review." };
}

function recommendResources({ tierId, fundingPurpose, manualReviewRecommended }) {
  const resources = [{ id: "document-prep-checklist", title: "Funding Document Prep Checklist", type: "checklist", path: "/documents.html", summary: "Organize bank statements, business details, and funding-purpose notes before requesting review." }];
  if (["highly_fundable", "fundable_review"].includes(tierId) || manualReviewRecommended) resources.push({ id: "manual-review-guide", title: "Funding Strategy Review Guide", type: "guide", path: "/fundable-review.html", summary: "Understand what a funding strategist should review before provider-specific direction is shared." });
  if (["selective_programs", "not_ready_fixable"].includes(tierId)) resources.push({ id: "readiness-improvement-plan", title: "Funding Readiness Improvement Plan", type: "nurture", path: "/not-ready.html", summary: "Focus on setup, banking, documentation, and timing before a deeper funding review." });
  if (fundingPurpose === "equipment_vehicle") resources.push({ id: "equipment-prep", title: "Equipment Funding Prep Notes", type: "purpose-guide", path: "/documents.html?fundingPurpose=equipment_vehicle", summary: "Prepare quotes, invoices, equipment details, and expected business use." });
  if (fundingPurpose === "ecommerce_growth") resources.push({ id: "marketplace-sales-prep", title: "Marketplace Sales Prep Notes", type: "purpose-guide", path: "/documents.html?fundingPurpose=ecommerce_growth", summary: "Prepare platform sales reports, payout records, and recent bank activity." });
  return resources.slice(0, 5);
}

function purposeToFamilyId(purpose) {
  return ({ working_capital: "fast-working-capital", inventory_materials: "fast-working-capital", growth_marketing: "fast-working-capital", equipment_vehicle: "equipment-asset-backed", real_estate: "real-estate-asset-secured", ecommerce_growth: "ecommerce-marketplace-capital", startup_launch: "startup-credit-leverage", business_credit: "business-credit-builder" })[purpose] || "manual-review";
}

function fallbackFundingPaths() {
  return sanitizeForPublic([
    { id: "fast-working-capital", label: "Fast Working Capital", summary: "Potential path for operators with recurring business deposits and short-term cash-flow needs.", commonDocuments: ["Recent business bank statements", "Funding purpose notes", "Business information"] },
    { id: "manual-review", label: "Manual Funding Strategy Review", summary: "Human review path when the answers need context before suggesting a funding direction.", commonDocuments: ["Bank statements", "Funding purpose details", "Business overview"] }
  ]);
}

function resolveRoute(req) {
  const rewritten = valueOf(req.query?.route);
  if (rewritten) return rewritten.replace(/^\/+|\/+$/g, "");
  return String(req.url || "").split("?")[0].replace(/^\/api\/?/, "").replace(/^index\/?/, "").replace(/^\/+|\/+$/g, "");
}

function requireMethod(req, methods) {
  if (methods.includes(req.method)) return;
  const error = new Error(`Method ${req.method || "UNKNOWN"} is not allowed.`);
  error.statusCode = 405;
  error.code = "method_not_allowed";
  error.details = [{ allowedMethods: methods }];
  throw error;
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return req.body.trim() ? JSON.parse(req.body) : {};
  if (!req || typeof req[Symbol.asyncIterator] !== "function") return {};
  let body = "";
  for await (const chunk of req) body += chunk;
  return body.trim() ? JSON.parse(body) : {};
}

function readJson(url, fallback) { try { return JSON.parse(fs.readFileSync(url, "utf8")); } catch { return fallback; } }
function readRegistryEntries(url) { const registry = readJson(url, { entries: [] }); return Array.isArray(registry.entries) ? registry.entries : []; }
async function maybePostWebhook(url, payload) { if (!url) return { skipped: true }; try { await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return { posted: true }; } catch { return { posted: false }; } }
function setCorsHeaders(res) { res.setHeader("Access-Control-Allow-Origin", process.env.SCORECARD_ALLOWED_ORIGIN || "*"); res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS"); res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); res.setHeader("X-Content-Type-Options", "nosniff"); }
function send(res, statusCode, payload) { return res.status(statusCode).json(payload); }
function valueOf(value) { return Array.isArray(value) ? String(value[0] || "") : String(value || ""); }
function clampNumber(value, min, max, fallback) { const number = Number(valueOf(value)); return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback; }
function createId(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
