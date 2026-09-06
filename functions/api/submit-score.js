import { calculateFundingReadiness } from '../../lib/scorecard-engine.js';

export async function onRequest(context) {
  const method = context.request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(context) });
  }

  if (method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405, context);
  }

  try {
    const payload = await context.request.json();
    const applicant = payload?.applicant || {};
    const answers = payload?.answers || {};

    if (!applicant.email || !applicant.phone || applicant.consent !== true) {
      return json({ ok: false, error: 'Missing required applicant contact or consent fields.' }, 400, context);
    }

    const scoreResult = calculateFundingReadiness(answers);
    if (scoreResult.valid === false) {
      return json({ ok: false, error: 'Invalid scorecard answers', details: scoreResult.errors }, 400, context);
    }

    const lead = {
      id: `frs_${Date.now()}`,
      source: payload?.source || 'Funding Readiness Scorecard',
      applicant: sanitizeApplicant(applicant),
      answers,
      scoreResult,
      leadPriority: scoreResult.leadPriority,
      reviewStatus: scoreResult.manualReviewRecommended ? 'queued_for_review' : 'new',
      createdAt: new Date().toISOString()
    };

    // Optional provider-neutral delivery hook. Leave unset until a destination
    // (Tally, Zapier, Make, n8n, custom API, etc.) is deliberately chosen.
    const delivery = await maybePostWebhook(context.env?.LEAD_WEBHOOK_URL, lead);

    return json({
      ok: true,
      message: 'Score received for review. This is not an approval, offer, or guarantee of funding.',
      leadId: lead.id,
      delivery,
      publicResult: {
        score: scoreResult.score,
        tier: scoreResult.tier,
        primaryFundingFamily: scoreResult.primaryFundingFamily,
        leadPriority: scoreResult.leadPriority,
        manualReviewRecommended: scoreResult.manualReviewRecommended
      }
    }, 200, context);
  } catch (error) {
    return json({
      ok: false,
      error: 'Unable to process score submission',
      requestId: `err_${Date.now()}`
    }, 500, context);
  }
}

function sanitizeApplicant(applicant = {}) {
  return {
    firstName: applicant.firstName || '',
    lastName: applicant.lastName || '',
    email: applicant.email || '',
    phone: applicant.phone || '',
    businessName: applicant.businessName || '',
    state: applicant.state || '',
    consent: applicant.consent === true
  };
}

async function maybePostWebhook(url, payload) {
  if (!url) return { skipped: true, reason: 'no_delivery_destination_configured' };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { posted: response.ok, status: response.status };
  } catch {
    return { posted: false };
  }
}

function corsHeaders(context) {
  return {
    'Access-Control-Allow-Origin': context.env?.SCORECARD_ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive'
  };
}

function json(body, status = 200, context = { env: {} }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(context),
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
