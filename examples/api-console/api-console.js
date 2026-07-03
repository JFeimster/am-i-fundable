const form = document.querySelector("#apiForm");
const responseBox = document.querySelector("#responseBox");
const baseUrlInput = document.querySelector("#baseUrl");
const methodInput = document.querySelector("#method");
const routeInput = document.querySelector("#route");
const bodyInput = document.querySelector("#requestBody");
const copyCurlButton = document.querySelector("#copyCurl");
const resetDemoButton = document.querySelector("#resetDemo");

const defaults = {
  method: document.body.dataset.defaultMethod || "GET",
  route: document.body.dataset.defaultRoute || "/api/health",
  body: bodyInput?.value || "{}"
};

methodInput.value = defaults.method;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await runRequest();
});

copyCurlButton.addEventListener("click", async () => {
  const curl = buildCurl();
  await navigator.clipboard.writeText(curl);
  setResponse({
    status: "curl_copied",
    curl
  });
});

resetDemoButton.addEventListener("click", () => {
  methodInput.value = defaults.method;
  routeInput.value = defaults.route;
  bodyInput.value = defaults.body;
  setResponse({ status: "reset", route: defaults.route, method: defaults.method });
});

async function runRequest() {
  const method = methodInput.value;
  const url = joinUrl(baseUrlInput.value, routeInput.value);

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (method !== "GET") {
      const rawBody = bodyInput.value.trim() || "{}";
      JSON.parse(rawBody);
      options.body = rawBody;
    }

    setResponse({ status: "loading", method, url });

    const response = await fetch(url, options);
    const text = await response.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }

    setResponse({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url,
      payload
    });
  } catch (error) {
    setResponse({
      ok: false,
      error: {
        message: error.message,
        note: "Check the route, payload JSON, CORS settings, and whether the endpoint exists in the deployed repo."
      }
    });
  }
}

function buildCurl() {
  const method = methodInput.value;
  const url = joinUrl(baseUrlInput.value, routeInput.value);
  const lines = [`curl -X ${method} "${url}"`];

  if (method !== "GET") {
    lines.push('  -H "Content-Type: application/json"');
    lines.push(`  --data '${bodyInput.value.trim() || "{}"}'`);
  }

  return lines.join(" \\\n");
}

function joinUrl(base, route) {
  const cleanBase = String(base || "").replace(/\/+$/, "");
  const cleanRoute = String(route || "").startsWith("/") ? route : `/${route}`;
  return `${cleanBase}${cleanRoute}`;
}

function setResponse(value) {
  responseBox.textContent = JSON.stringify(value, null, 2);
}
