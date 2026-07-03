/* Lightweight iframe embed loader for public scorecard placements. */
(function () {
  "use strict";

  function makeId(index) { return "am-i-fundable-embed-" + index; }

  function buildSrc(host) {
    var src = host.getAttribute("data-src") || host.getAttribute("data-embed-src") || "/widget.html";
    var preset = host.getAttribute("data-preset");
    var partner = host.getAttribute("data-partner");
    var params = new URLSearchParams();
    if (preset) params.set("preset", preset);
    if (partner) params.set("partner", partner);
    var glue = src.indexOf("?") >= 0 ? "&" : "?";
    return params.toString() ? src + glue + params.toString() : src;
  }

  function createFrame(host, index) {
    var iframe = document.createElement("iframe");
    iframe.id = host.id || makeId(index);
    iframe.title = host.getAttribute("data-title") || "Funding Readiness Scorecard";
    iframe.src = buildSrc(host);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.style.width = "100%";
    iframe.style.minHeight = host.getAttribute("data-height") || "760px";
    iframe.style.border = "0";
    iframe.style.borderRadius = host.getAttribute("data-radius") || "24px";
    iframe.setAttribute("data-am-i-fundable-frame", "true");
    return iframe;
  }

  function listenForResize() {
    window.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "amIFundableResize") return;
      var frame = document.getElementById(event.data.frameId || "");
      if (frame && Number(event.data.height) > 320) frame.style.minHeight = Number(event.data.height) + "px";
    });
  }

  function init() {
    Array.from(document.querySelectorAll("[data-am-i-fundable-embed]")).forEach(function (host, index) {
      if (host.querySelector("iframe")) return;
      host.appendChild(createFrame(host, index));
    });
    listenForResize();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
