import { getScoreTier } from '../../../lib/scorecard-engine.js';

const TIER_DETAILS = {
  highly_fundable: {
    id: 'highly_fundable', label: 'Highly Fundable', leadPriority: 'hot', range: '80-100',
    summary: 'Your answers show stronger readiness signals. A fast document review may be the right next step.',
    nextSteps: ['Prepare recent bank statements', 'Confirm funding purpose', 'Request a funding strategy review']
  },
  fundable_review: {
    id: 'fundable_review', label: 'Fundable, But Needs Review', leadPriority: 'warm', range: '65-79',
    summary: 'Your answers show possible readiness, but a human review should confirm the best path.',
    nextSteps: ['Review caution areas', 'Prepare documents', 'Request a funding strategy review']
  },
  selective_programs: {
    id: 'selective_programs', label: 'Possible Fit for Select Programs', leadPriority: 'nurture', range: '45-64',
    summary: 'Some paths may be possible, but prep work and context are important before provider-specific direction.',
    nextSteps: ['Strengthen documents', 'Review bank activity', 'Request manual review if timing is urgent']
  },
  not_ready_fixable: {
    id: 'not_ready_fixable', label: 'Not Ready Yet — But Fixable', leadPriority: 'education', range: '0-44',
    summary: 'Your answers suggest prep work should come before a funding review.',
    nextSteps: ['Complete business setup basics', 'Organize bank activity', 'Follow a readiness improvement checklist']
  }
};

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers() });
  if (context.request.method !== 'GET') return json({ ok: false, error: 'Method not allowed' }, 405);

  const url = new URL(context.request.url);
  const score = Number(url.searchParams.get('score'));
  const requestedTier = url.searchParams.get('tierId');
  const tierId = requestedTier || (Number.isFinite(score) ? getScoreTier(score).id : 'fundable_review');
  const tier = TIER_DETAILS[tierId] || TIER_DETAILS.fundable_review;

  return json({
    ok: true,
    tier,
    allTiers: Object.values(TIER_DETAILS),
    disclaimer: 'Result tiers are readiness categories only. They are not approvals, offers, underwriting decisions, or guarantees of funding.'
  });
}

function headers() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive'
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers(), 'Content-Type': 'application/json; charset=utf-8' }
  });
}
