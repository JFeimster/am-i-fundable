import registry from '../../../data/product-families.public.json';

export async function onRequest(context) {
  const method = context.request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(context) });
  if (!['GET', 'HEAD'].includes(method)) return json({ ok: false, error: 'Method not allowed' }, 405, context);

  const url = new URL(context.request.url);
  const fundingPurpose = url.searchParams.get('fundingPurpose') || 'not_sure';
  const familyId = url.searchParams.get('familyId') || purposeToFamilyId(fundingPurpose);
  const path = registry.entries.find((entry) => entry.id === familyId || entry.sourceFamilyId === familyId)
    || registry.entries.find((entry) => entry.id === 'manual-review');
  const checklist = buildChecklist({ familyId, fundingPurpose, path });

  const body = {
    ok: true,
    familyId,
    fundingPurpose,
    title: checklist.title,
    items: checklist.items,
    nextStep: checklist.nextStep,
    disclaimer: 'Document checklists are preparation guidance only. Actual requirements depend on review and funding path.'
  };

  if (method === 'HEAD') return new Response(null, { status: 200, headers: responseHeaders(context) });
  return json(body, 200, context);
}

function buildChecklist({ familyId, fundingPurpose, path }) {
  const baseItems = [
    { id: 'business-info', label: 'Business information', detail: 'Legal name, entity type, state, EIN status, and contact details.' },
    { id: 'bank-statements', label: 'Recent business bank statements', detail: 'Prepare the most recent 3 to 6 months when available.' },
    { id: 'funding-purpose', label: 'Funding purpose notes', detail: 'Summarize how funds would be used and why now.' }
  ];

  const familyItems = {
    'equipment-asset-backed': [{ id: 'equipment-quote', label: 'Equipment quote, invoice, or repair estimate', detail: 'Include asset details, vendor information, and expected use.' }],
    'real-estate-asset-secured': [{ id: 'property-details', label: 'Property details or project scope', detail: 'Include address, purchase contract, rehab scope, rent roll, or exit plan where relevant.' }],
    'ecommerce-marketplace-capital': [{ id: 'marketplace-reports', label: 'Marketplace or store sales reports', detail: 'Prepare platform sales history, store reports, and payout records.' }],
    'startup-credit-leverage': [{ id: 'credit-income-docs', label: 'Credit profile and income documentation', detail: 'Prepare income records and review credit-readiness basics.' }],
    'business-credit-builder': [{ id: 'entity-banking-setup', label: 'Entity, EIN, and banking setup records', detail: 'Confirm entity formation, EIN confirmation, and business bank account setup.' }]
  };

  const purposeItems = {
    business_credit: [{ id: 'vendor-account-list', label: 'Business credit setup checklist', detail: 'List current accounts, vendor accounts, and business identity details.' }],
    debt_refi: [{ id: 'current-obligations', label: 'Current obligation summary', detail: 'List balances, payment frequency, and payoff goals.' }]
  };

  return {
    title: `${path?.label || 'Funding Path'} Document Prep Checklist`,
    items: [...(familyItems[familyId] || []), ...(purposeItems[fundingPurpose] || []), ...baseItems].slice(0, 8),
    nextStep: 'Collect the strongest available documents before requesting a funding strategy review.'
  };
}

function purposeToFamilyId(purpose) {
  return ({
    working_capital: 'fast-working-capital',
    inventory_materials: 'fast-working-capital',
    growth_marketing: 'fast-working-capital',
    equipment_vehicle: 'equipment-asset-backed',
    real_estate: 'real-estate-asset-secured',
    ecommerce_growth: 'ecommerce-marketplace-capital',
    startup_launch: 'startup-credit-leverage',
    business_credit: 'business-credit-builder'
  })[purpose] || 'manual-review';
}

function corsHeaders(context) {
  return {
    'Access-Control-Allow-Origin': context.env?.SCORECARD_ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

function responseHeaders(context) {
  return {
    ...corsHeaders(context),
    'Cache-Control': 'public, max-age=300',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function json(body, status = 200, context = { env: {} }) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(context) });
}
