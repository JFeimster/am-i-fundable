import { calculateFundingReadiness } from '../../lib/scorecard-engine.js';
import { toPublicScoreResult } from '../../lib/api/safe-result-presenter.js';
import { buildLeadWebhookPayload, deliverLeadWebhook, toPublicLeadDelivery } from '../../internal/api/lead-webhook.js';

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

    const webhookDelivery = await deliverLeadWebhook({
      env: context.env || {},
      payload: buildLeadWebhookPayload({ lead })
    });

    return json({
      ok: true,
      scoreCalculated: true,
      leadAccepted: true,
      message: 'Score received for review. This is not an approval, offer, or guarantee of funding.',
      leadId: lead.id,
      leadDelivery: toPublicLeadDelivery(webhookDelivery),
      publicResult: toPublicScoreResult(scoreResult)
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
