/**
 * GAZE. ARCHITECTURE — главный скрипт
 * Анимации: transform / opacity · rAF для геометрии
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PHI = (1 + Math.sqrt(5)) / 2;
  var NS = "http://www.w3.org/2000/svg";

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

  function buildGoldenLayer(group) {
    while (group.firstChild) group.removeChild(group.firstChild);
    var x = 0;
    var y = (100 - 100 / PHI) / 2;
    var w = 100;
    var h = 100 / PHI;
    var i = 0;
    while (i < 8 && w > 0.4 && h > 0.4) {
      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", String(x + 0.15 * i));
      rect.setAttribute("y", String(y + 0.15 * i));
      rect.setAttribute("width", String(Math.max(0.2, w - 0.2 * i)));
      rect.setAttribute("height", String(Math.max(0.2, h - 0.2 * i)));
      rect.setAttribute("fill", "none");
      rect.setAttribute("stroke", "#2C2724");
      rect.setAttribute("stroke-width", "0.07");
      rect.setAttribute("opacity", String(0.45 - i * 0.05));
      group.appendChild(rect);
      if (w >= h) {
        x += h;
        w -= h;
      } else {
        y += w;
        h -= w;
      }
      i++;
    }
  }

  /** Точки в левой половине; правая — зеркало */
  var NODE_BASE = [
    { x: 34, y: 36 },
    { x: 40, y: 50 },
    { x: 30, y: 58 },
    { x: 44, y: 68 },
  ];

  function initTransformModal() {
    var openBtn = document.querySelector(".js-open-transform");
    var modal = document.querySelector(".js-transform-modal");
    var backdrop = document.querySelector(".js-modal-backdrop");
    var closeBtn = document.querySelector(".js-modal-close");
    var stage = document.querySelector(".js-geometry-stage");
    if (!openBtn || !modal || !backdrop || !closeBtn) return;

    var lastFocus = null;
    var geoState = null;

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

      if (!geoState) geoState = startGeometry(modal, stage);
      else geoState.resume();

      var focusables = getFocusable();
      if (focusables.length) focusables[0].focus();
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
      if (geoState) geoState.pause();

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

    function startGeometry(rootModal, stageEl) {
      var svg = rootModal.querySelector(".js-geometry-svg");
      var golden = rootModal.querySelector(".js-golden-layer");
      var linesLayer = rootModal.querySelector(".js-lines-layer");
      var nodesLayer = rootModal.querySelector(".js-nodes-layer");
      if (!stageEl || !svg || !golden || !linesLayer || !nodesLayer) {
        return { pause: function () {}, resume: function () {} };
      }

      buildGoldenLayer(golden);

      var nodeEls = [];
      var lineEls = [];

      function addNode(cx, cy) {
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("r", "0.65");
        c.setAttribute("fill", "#2C2724");
        c.setAttribute("opacity", "0.65");
        c.setAttribute("stroke", "#D4B8AD");
        c.setAttribute("stroke-width", "0.18");
        nodesLayer.appendChild(c);
        nodeEls.push(c);
        return c;
      }

      function addLine() {
        var line = document.createElementNS(NS, "line");
        line.setAttribute("stroke", "#2C2724");
        line.setAttribute("stroke-width", "0.22");
        line.setAttribute("opacity", "0.55");
        linesLayer.appendChild(line);
        lineEls.push(line);
        return line;
      }

      NODE_BASE.forEach(function () {
        addNode(0, 0);
        addNode(0, 0);
      });

      for (var li = 0; li < NODE_BASE.length - 1; li++) {
        addLine();
        addLine();
      }
      for (var ci = 0; ci < NODE_BASE.length; ci++) {
        addLine();
        addLine();
      }

      var smoothMx = 50;
      var smoothMy = 50;
      var targetMx = 50;
      var targetMy = 50;
      var running = false;
      var rafId = 0;

      function clientToSvg(clientX, clientY) {
        var rect = svg.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2 || !isFinite(clientX) || !isFinite(clientY)) {
          return { x: 50, y: 50 };
        }
        var px = (clientX - rect.left) / rect.width;
        var py = (clientY - rect.top) / rect.height;
        return {
          x: Math.max(0, Math.min(100, px * 100)),
          y: Math.max(0, Math.min(100, py * 100)),
        };
      }

      function onPointer(e) {
        var x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX) || 50;
        var y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY) || 50;
        var p = clientToSvg(x, y);
        targetMx = p.x;
        targetMy = p.y;
      }

      stageEl.addEventListener("mousemove", onPointer, { passive: true });
      stageEl.addEventListener("touchstart", onPointer, { passive: true });
      stageEl.addEventListener("touchmove", onPointer, { passive: true });
      stageEl.addEventListener("mouseleave", function () {
        targetMx = 50;
        targetMy = 50;
      });

      function tick() {
        if (!running) return;
        var now = performance.now() * 0.001;
        var idleX = 50 + Math.sin(now * 1.05) * 4.2;
        var idleY = 50 + Math.cos(now * 0.78) * 3.2;
        var useIdle = reduceMotion ? 0 : 0.38;
        var aimX = targetMx * (1 - useIdle) + idleX * useIdle;
        var aimY = targetMy * (1 - useIdle) + idleY * useIdle;
        smoothMx += (aimX - smoothMx) * 0.11;
        smoothMy += (aimY - smoothMy) * 0.11;

        var axisPull = Math.exp(-Math.pow((smoothMx - 50) / 22, 2));
        var magnet = 0.18 + axisPull * 0.42;
        var driftX = (smoothMx - 50) * 0.1;
        var driftY = (smoothMy - 50) * 0.075;

        var leftPts = [];
        NODE_BASE.forEach(function (base, i) {
          var lx =
            base.x +
            driftX * (0.6 + i * 0.1) +
            (50 - base.x) * magnet * 0.35;
          var ly = base.y + driftY * (0.7 + i * 0.05) + (50 - base.y) * axisPull * 0.06;
          leftPts.push({ x: lx, y: ly });
        });

        var li = 0;
        leftPts.forEach(function (p, i) {
          nodeEls[i * 2].setAttribute("cx", String(p.x));
          nodeEls[i * 2].setAttribute("cy", String(p.y));
          var pr = { x: 100 - p.x, y: p.y };
          nodeEls[i * 2 + 1].setAttribute("cx", String(pr.x));
          nodeEls[i * 2 + 1].setAttribute("cy", String(pr.y));
        });

        var k = 0;
        for (var a = 0; a < leftPts.length - 1; a++) {
          lineEls[k].setAttribute("x1", String(leftPts[a].x));
          lineEls[k].setAttribute("y1", String(leftPts[a].y));
          lineEls[k].setAttribute("x2", String(leftPts[a + 1].x));
          lineEls[k].setAttribute("y2", String(leftPts[a + 1].y));
          k++;
          var ra = { x: 100 - leftPts[a].x, y: leftPts[a].y };
          var rb = { x: 100 - leftPts[a + 1].x, y: leftPts[a + 1].y };
          lineEls[k].setAttribute("x1", String(ra.x));
          lineEls[k].setAttribute("y1", String(ra.y));
          lineEls[k].setAttribute("x2", String(rb.x));
          lineEls[k].setAttribute("y2", String(rb.y));
          k++;
        }

        for (var b = 0; b < leftPts.length; b++) {
          lineEls[k].setAttribute("x1", String(leftPts[b].x));
          lineEls[k].setAttribute("y1", String(leftPts[b].y));
          lineEls[k].setAttribute("x2", "50");
          lineEls[k].setAttribute("y2", String(leftPts[b].y * 0.92 + 4));
          k++;
          var rb2 = { x: 100 - leftPts[b].x, y: leftPts[b].y };
          lineEls[k].setAttribute("x1", String(rb2.x));
          lineEls[k].setAttribute("y1", String(rb2.y));
          lineEls[k].setAttribute("x2", "50");
          lineEls[k].setAttribute("y2", String(rb2.y * 0.92 + 4));
          k++;
        }

        var pulse = 0.48 + axisPull * 0.22;
        linesLayer.setAttribute("opacity", String(Math.min(0.95, pulse)));

        rafId = requestAnimationFrame(tick);
      }

      return {
        resume: function () {
          if (running) return;
          running = true;
          tick();
        },
        pause: function () {
          running = false;
          cancelAnimationFrame(rafId);
        },
      };
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveals();
    initParallax();
    initMagnetic();
    initTransformModal();
  });
})();
