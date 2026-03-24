/**
 * GAZE. ARCHITECTURE — модалка без canvas/SVG-геометрии (анимации в CSS)
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  function initParallax() {
    var layers = document.querySelectorAll(".parallax-slow");
    if (!layers.length || reduceMotion) return;

    var ticking = false;
    function update() {
      var y = window.scrollY || 0;
      layers.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-parallax") || "0.1", 10);
        var t = Math.round(y * f * 10) / 10;
        el.style.transform = "translate3d(0, " + t + "px, 0)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function initMagnetic() {
    var wraps = document.querySelectorAll(".magnetic");
    wraps.forEach(function (wrap) {
      var strength = parseFloat(wrap.getAttribute("data-magnetic-strength") || "0.3", 10);
      var shift = wrap.querySelector(".btn__shift");
      if (!shift) return;

      wrap.addEventListener(
        "mousemove",
        function (e) {
          if (reduceMotion) return;
          var r = wrap.getBoundingClientRect();
          var cx = r.left + r.width / 2;
          var cy = r.top + r.height / 2;
          var dx = (e.clientX - cx) * strength;
          var dy = (e.clientY - cy) * strength;
          shift.style.transform = "translate3d(" + dx.toFixed(2) + "px, " + dy.toFixed(2) + "px, 0)";
        },
        { passive: true }
      );

      wrap.addEventListener("mouseleave", function () {
        shift.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  function initTransformModal() {
    var openBtn = document.querySelector(".js-open-transform");
    var modal = document.querySelector(".js-transform-modal");
    var backdrop = document.querySelector(".js-modal-backdrop");
    var closeBtn = document.querySelector(".js-modal-close");
    if (!openBtn || !modal || !backdrop || !closeBtn) return;

    var lastFocus = null;

    function getFocusable() {
      return modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    }

    function openModal() {
      lastFocus = document.activeElement;
      backdrop.hidden = false;
      modal.hidden = false;
      backdrop.setAttribute("aria-hidden", "false");
      backdrop.classList.add("is-open");
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";

      window.setTimeout(function () {
        var focusables = getFocusable();
        if (focusables.length) focusables[0].focus();
      }, 0);
    }

    function trapKeydown(e) {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Tab") {
        var focusables = getFocusable();
        if (focusables.length < 2) return;
        var list = Array.prototype.slice.call(focusables);
        var i = list.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (i <= 0) {
            e.preventDefault();
            list[list.length - 1].focus();
          }
        } else {
          if (i === list.length - 1) {
            e.preventDefault();
            list[0].focus();
          }
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    }

    function closeModal() {
      backdrop.classList.remove("is-open");
      modal.classList.remove("is-open");
      document.body.style.overflow = "";

      window.setTimeout(function () {
        backdrop.hidden = true;
        backdrop.setAttribute("aria-hidden", "true");
        modal.hidden = true;
      }, 320);

      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    modal.addEventListener("keydown", trapKeydown);
    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveals();
    initParallax();
    initMagnetic();
    initTransformModal();
  });
})();
