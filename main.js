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

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  function heroGradientTracking() {
    var hero = document.querySelector(".hero");
    if (!hero || reduceMotion) return;

    hero.addEventListener(
      "mousemove",
      function (e) {
        var r = hero.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        hero.style.setProperty("--hx", x + "%");
        hero.style.setProperty("--hy", y + "%");
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveals();
    heroGradientTracking();
  });
})();
