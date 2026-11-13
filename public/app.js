(function () {
  "use strict";

  var root = document.documentElement;

  /* Theme ------------------------------------------------------------ */
  var toggle = document.querySelector("[data-theme-toggle]");

  function syncToggle() {
    if (!toggle) return;
    var dark = root.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    toggle.setAttribute("title", dark ? "Light mode" : "Dark mode");
  }

  if (toggle) {
    syncToggle();
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("inkora-theme", next);
      } catch (err) {
        /* storage unavailable (private mode) - theme stays for this page view */
      }
      syncToggle();
    });
  }

  /* Mobile navigation ------------------------------------------------ */
  var burger = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "false" : "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.setAttribute("data-open", "false");
        burger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }

  /* Reading progress ------------------------------------------------- */
  var bar = document.querySelector("[data-progress]");

  if (bar) {
    var ticking = false;

    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.setProperty("--progress", ratio.toFixed(4));
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  /* Editor: live word + reading time counter -------------------------- */
  var body = document.querySelector("[data-editor-body]");
  var counter = document.querySelector("[data-editor-counter]");

  if (body && counter) {
    var count = function () {
      var words = body.value.trim().split(/\s+/).filter(Boolean).length;
      var minutes = Math.max(1, Math.round(words / 200));
      counter.textContent = words + " words \u00b7 about " + minutes + " min read";
    };
    body.addEventListener("input", count);
    count();
  }

  /* Search: clear button --------------------------------------------- */
  var searchInput = document.querySelector("[data-search-input]");
  var searchClear = document.querySelector("[data-search-clear]");

  if (searchInput && searchClear) {
    searchClear.addEventListener("click", function () {
      window.location.href = searchInput.getAttribute("data-reset-href") || "/";
    });
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && searchInput.value) {
        event.preventDefault();
        window.location.href = searchInput.getAttribute("data-reset-href") || "/";
      }
    });
  }

  /* Destructive actions ---------------------------------------------- */
  document.querySelectorAll("[data-confirm]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!window.confirm(form.getAttribute("data-confirm"))) {
        event.preventDefault();
      }
    });
  });

  /* In-page anchor scrolling ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Keyboard shortcut: "/" focuses search ----------------------------- */
  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || !searchInput) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  });
})();
