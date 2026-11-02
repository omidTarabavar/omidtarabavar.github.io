(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  /* ---------- theme ---------- */

  var themeButton = document.querySelector(".theme-toggle");
  var themeLabel = document.querySelector(".theme-label");

  function effectiveTheme() {
    var set = root.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return systemDark.matches ? "dark" : "light";
  }

  function syncThemeUI() {
    var dark = effectiveTheme() === "dark";
    root.classList.toggle("is-dark", dark);
    if (themeLabel) themeLabel.textContent = dark ? "Light theme" : "Dark theme";
    if (themeButton) themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncThemeUI();
    });
  }
  if (systemDark.addEventListener) systemDark.addEventListener("change", syncThemeUI);
  syncThemeUI();

  /* ---------- mobile menu ---------- */

  var menuButton = document.querySelector(".menu-button");
  var sidebar = document.getElementById("sidebar");
  var menuLabel = document.querySelector(".menu-label");

  function setMenu(open) {
    if (!menuButton || !sidebar) return;
    sidebar.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    if (menuLabel) menuLabel.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("is-open")) {
      setMenu(false);
      menuButton.focus();
    }
  });

  if (sidebar) {
    sidebar.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  /* ---------- evidence chips: jump to the work and mark it ---------- */

  function flash(target) {
    if (!target || reduceMotion.matches) return;
    target.classList.remove("is-target");
    void target.offsetWidth; // restart the animation
    target.classList.add("is-target");
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href").length < 2) return;
    var target = document.querySelector(link.getAttribute("href"));
    if (target && target.classList.contains("entry")) {
      window.setTimeout(function () { flash(target); }, reduceMotion.matches ? 0 : 350);
    }
  });

  // Arriving from another page with a #fragment (e.g. a research-interest link).
  if (location.hash.length > 1) {
    var initial = null;
    try { initial = document.querySelector(decodeURIComponent(location.hash)); } catch (e) {}
    if (initial && initial.classList.contains("entry")) {
      window.setTimeout(function () { flash(initial); }, 150);
    }
  }

  /* ---------- copy email ---------- */

  var toast = document.querySelector(".toast");
  var toastTimer;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 1800);
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(area);
    return ok;
  }

  Array.prototype.forEach.call(document.querySelectorAll(".copy"), function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "Copied";
        showToast("Copied " + text);
        window.setTimeout(function () { btn.textContent = "Copy"; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          if (fallbackCopy(text)) done(); else showToast("Copy failed. Select the address instead.");
        });
      } else if (fallbackCopy(text)) {
        done();
      } else {
        showToast("Copy failed. Select the address instead.");
      }
    });
  });
})();
