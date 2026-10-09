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

/**
 * Метки и цели (09.10.2026, решение Ильи): чтобы в Метрике было видно, откуда приходят записи.
 * • Ссылки на DIKIDI получают UTM: utm_source=gaze-arch.ru, utm_medium=site, utm_campaign=booking,
 *   utm_content=<место кнопки>, utm_term=<страница>. Ставятся в момент клика, поэтому работают
 *   и для кнопок, которые рисует JS (меню).
 * • Каждый клик по записи и контактам — цель Метрики (reachGoal) и параметр визита.
 *   Цели: booking_dikidi, contact_telegram, contact_max, contact_phone, map_open, contact_whatsapp,
 *   gift_order (сертификат), quiz_lead (результат квиза).
 *   Метрика работает только после «Принять» на плашке cookie.
 * • Метки визита (utm_*) запоминаются на время визита и уходят параметром вместе с целью.
 */
(function () {
  const METRIKA_ID = 108526032;
  const RULES = [
    [/dikidi\.net/, 'booking_dikidi'],
    [/t\.me\//, 'contact_telegram'],
    [/max\.ru\//, 'contact_max'],
    [/^tel:/, 'contact_phone'],
    [/wa\.me|whatsapp/, 'contact_whatsapp'],
    [/yandex\.[a-z]+\/maps/, 'map_open'],
  ];

  const page = () => {
    const p = location.pathname.replace(/\/index\.html$/, '/').replace(/^\/|\/$/g, '');
    return p ? p.replace(/^pages\//, '').replace(/\//g, '-') : 'home';
  };

  // Метки, с которыми человек пришёл на сайт (Авито, Telegram, визитка…) — на время визита
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('utm_source')) {
      sessionStorage.setItem('gaze-utm', JSON.stringify({
        source: q.get('utm_source'), medium: q.get('utm_medium') || '', campaign: q.get('utm_campaign') || '',
      }));
    }
  } catch (e) { /* приватный режим */ }
  const arrived = () => { try { return JSON.parse(sessionStorage.getItem('gaze-utm') || 'null'); } catch (e) { return null; } };

  const place = (a) => {
    if (a.dataset.place) return a.dataset.place;
    const box = a.closest('[data-place], header, nav, footer, section, .modal, [id]');
    if (!box) return 'page';
    if (box.dataset && box.dataset.place) return box.dataset.place;
    const tag = box.tagName.toLowerCase();
    if (tag === 'header' || tag === 'nav' || tag === 'footer') return tag;
    return box.id || (box.className && String(box.className).split(' ')[0]) || tag;
  };

  const withUtm = (href, where) => {
    try {
      const u = new URL(href, location.href);
      if (u.searchParams.get('utm_source')) return href;
      u.searchParams.set('utm_source', 'gaze-arch.ru');
      u.searchParams.set('utm_medium', 'site');
      u.searchParams.set('utm_campaign', 'booking');
      u.searchParams.set('utm_content', where);
      u.searchParams.set('utm_term', page());
      return u.toString();
    } catch (e) { return href; }
  };

  const onClick = (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const rule = RULES.find(([re]) => re.test(href));
    if (!rule) return;
    const where = place(a);
    let goal = rule[1];
    // Отдельные цели для заявок: сертификат и результат квиза
    if (goal === 'contact_telegram' && page() === 'gift' && where !== 'footer') goal = 'gift_order';
    if (goal === 'contact_telegram' && where === 'quiz-tg-btn') goal = 'quiz_lead';
    if (goal === 'booking_dikidi') a.href = withUtm(a.href, where);
    if (typeof window.ym === 'function') {
      const from = arrived();
      const params = { click: { [goal]: { place: where, page: page() } } };
      if (from) params.click[goal].came_from = from.source + (from.medium ? ' / ' + from.medium : '');
      window.ym(METRIKA_ID, 'reachGoal', goal, params);
      window.ym(METRIKA_ID, 'params', params);
    }
    if (typeof window.gtag === 'function') window.gtag('event', goal, { place: where, page: page() });
  };
  document.addEventListener('click', onClick, true);
  // средняя кнопка мыши / «открыть в новой вкладке»
  document.addEventListener('auxclick', onClick, true);
})();
