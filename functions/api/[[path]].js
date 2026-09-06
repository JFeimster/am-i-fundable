const LEGACY_API_ORIGIN = "https://am-i-fundable.vercel.app";

export async function onRequest(context) {
  const incomingUrl = new URL(context.request.url);
  const pathParts = Array.isArray(context.params.path)
    ? context.params.path
    : context.params.path
      ? [context.params.path]
      : [];

  const targetUrl = new URL(`/api/${pathParts.join("/")}${incomingUrl.search}`, LEGACY_API_ORIGIN);
  const headers = new Headers(context.request.headers);
  headers.delete("host");

  const init = {
    method: context.request.method,
    headers,
    redirect: "manual"
  };

  if (!['GET', 'HEAD'].includes(context.request.method)) {
    init.body = context.request.body;
  }

  const upstream = await fetch(new Request(targetUrl.toString(), init));
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  responseHeaders.set("X-Am-I-Fundable-Backend", "vercel-legacy-api");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}
