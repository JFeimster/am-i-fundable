export async function onRequest(context) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(context.request.method)) {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(context)
    });
  }

  return json({
    ok: true,
    service: 'funding-readiness-scorecard',
    project: 'am-i-fundable',
    status: 'healthy',
    apiVersion: '1.0.0',
    runtime: 'cloudflare-pages-functions',
    timestamp: new Date().toISOString()
  }, 200, context);
}

function corsHeaders(context) {
  return {
    'Access-Control-Allow-Origin': context.env?.SCORECARD_ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
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
