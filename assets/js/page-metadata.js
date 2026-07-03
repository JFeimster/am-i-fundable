/* Public page metadata helper for Am I Fundable. */
(function () {
  "use strict";

  var CSS_FILES = [
    "/assets/css/base.css",
    "/assets/css/components.css",
    "/assets/css/site-pages.css",
    "/assets/css/sizzle.css"
  ];

  function ensureStylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function getPageName() {
    var path = window.location.pathname || "/";
    var file = path.split("/").pop() || "index.html";
    return file.replace(/\.html$/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
  }

  function init() {
    CSS_FILES.forEach(ensureStylesheet);
    var pageName = getPageName();
    document.documentElement.dataset.page = pageName;
    document.body.classList.add("page-" + pageName);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
