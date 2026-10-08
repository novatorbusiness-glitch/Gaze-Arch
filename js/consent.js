/**
 * Согласие на cookie (08.10.2026).
 * Сервисы статистики подключаются только после «Принять».
 * «Только необходимые» — сайт работает без статистики.
 * Выбор хранится в браузере; изменить — ссылка «Настройки cookie» в подвале.
 */
(function () {
  const KEY = 'gaze-cookie-consent'; // 'all' | 'necessary'
  const METRIKA_ID = 108526032;
  const GTAG_ID = 'G-1PXMP189SF';

  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* приватный режим */ } };

  let loaded = false;
  const loadAnalytics = () => {
    if (loaded) return;
    loaded = true;

    // Яндекс Метрика (код счётчика без изменений)
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym');
    window.ym(METRIKA_ID, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer', referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });

    // gtag
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GTAG_ID);
  };

  const privacyHref = () => (location.pathname.includes('/pages/') ? '../privacy/' : 'pages/privacy/');

  let banner = null;
  const hide = () => { if (banner) { banner.classList.remove('is-visible'); } };
  const show = () => {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Согласие на cookie');
      banner.innerHTML =
        '<p class="cookie-banner__text">Сайт использует cookie и сервисы статистики, чтобы становиться удобнее. ' +
        'Подробнее в <a href="' + privacyHref() + '">политике конфиденциальности</a>.</p>' +
        '<div class="cookie-banner__actions">' +
        '<button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-choice="necessary">Только необходимые</button>' +
        '<button type="button" class="cookie-banner__btn" data-choice="all">Принять</button>' +
        '</div>';
      banner.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-choice]');
        if (!btn) return;
        const choice = btn.dataset.choice;
        save(choice);
        if (choice === 'all') loadAnalytics();
        hide();
      });
      document.body.appendChild(banner);
    }
    void banner.offsetWidth; // применить стартовое положение, чтобы сработала плавная анимация
    banner.classList.add('is-visible');
  };

  // ссылка «Настройки cookie» в подвале
  window.gazeCookieSettings = () => show();

  const choice = read();
  if (choice === 'all') loadAnalytics();

  const start = () => { if (!choice) setTimeout(show, 800); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
