import registry from '../../../data/product-families.public.json';

export async function onRequest(context) {
  const method = context.request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(context) });
  if (!['GET', 'HEAD'].includes(method)) return json({ ok: false, error: 'Method not allowed' }, 405, context);

  const url = new URL(context.request.url);
  const familyId = url.searchParams.get('familyId');
  const search = (url.searchParams.get('search') || '').trim().toLowerCase();
  const requestedLimit = Number(url.searchParams.get('limit') || registry.entries.length);
  const limit = Math.max(1, Math.min(Number.isFinite(requestedLimit) ? requestedLimit : registry.entries.length, 25));

  let entries = registry.entries.map(toPublicEntry);
  if (familyId) entries = entries.filter((entry) => entry.id === familyId || entry.familyId === familyId);
  if (search) {
    entries = entries.filter((entry) => [entry.label, entry.summary, ...(entry.bestFor || [])].join(' ').toLowerCase().includes(search));
  }

  const body = {
    ok: true,
    registryId: registry.id || 'product-families-public',
    version: registry.version || '1.0.0',
    count: Math.min(entries.length, limit),
    entries: entries.slice(0, limit),
    disclaimer: 'These are public-safe funding path categories for review. They are not approvals, offers, or guarantees of funding.'
  };

  if (method === 'HEAD') return new Response(null, { status: 200, headers: responseHeaders(context) });
  return json(body, 200, context);
}

function toPublicEntry(entry) {
  return {
    id: entry.id,
    familyId: entry.sourceFamilyId || entry.id,
    label: entry.label,
    summary: entry.summary,
    bestFor: entry.bestFor || [],
    watchOutFor: entry.watchOutFor || [],
    commonDocuments: entry.commonDocuments || [],
    typicalSpeedNote: entry.typicalSpeedNote || null,
    primaryCta: entry.primaryCta || null
  };
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
