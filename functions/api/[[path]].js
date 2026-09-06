export async function onRequest(context) {
  const pathParts = Array.isArray(context.params.path)
    ? context.params.path
    : context.params.path
      ? [context.params.path]
      : [];

  const route = `/api/${pathParts.join('/')}`;

  return new Response(JSON.stringify({
    ok: false,
    error: 'API route not available during Cloudflare migration',
    route,
    migratedRoutes: ['/api/health', '/api/version', '/api/submit-score']
  }), {
    status: 503,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Retry-After': '3600'
    }
  });
}
