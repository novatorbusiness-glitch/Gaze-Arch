/* ================================================================= */
/* 📁 ФАЙЛ: js/footer.js                                             */
/* МЕСТО ВСТАВКИ: Полная замена кода в файле footer.js               */
/* ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const getSiteBasePath = () => {
    const scriptEl = document.querySelector('script[src*="js/footer.js"]');
    const scriptSrc = scriptEl ? scriptEl.src : '';

    if (scriptSrc) {
      try {
        const scriptUrl = new URL(scriptSrc, window.location.href);
        const match = scriptUrl.pathname.match(/^(.*)\/js\/footer\.js$/);
        if (match && match[1]) {
          return `${match[1].replace(/\/+$/, '')}/`;
        }
      } catch (error) {
        // fallback ниже
      }
    }

    const { hostname, pathname } = window.location;

    if (hostname.endsWith('github.io')) {
      const firstSegment = pathname.split('/').filter(Boolean)[0];
      return firstSegment ? `/${firstSegment}/` : '/';
    }

    return '/';
  };

  const siteBasePath = getSiteBasePath();
  const withBasePath = (path) => {
    if (!path || !path.startsWith('/')) return path;
    return `${siteBasePath}${path.replace(/^\/+/, '')}`;
  };

  const footerHTML = `
    <footer class="footer-main" id="footer-main">
      <div class="container">
        
        <div class="footer-content">
          <div class="footer-col footer-col--nav fade-in">
            <img src="${withBasePath('/assets/images/logo.png')}" alt="GAZE.ARCH" class="footer-brand-logo">
            <nav class="footer-links">
              <a href="${withBasePath('/#services')}" data-hoverable>Услуги и цены</a>
              <a href="${withBasePath('/pages/portfolio/')}" data-hoverable>Результаты</a>
              <a href="${withBasePath('/pages/education/')}" data-hoverable>Обучение</a>
              <a href="${withBasePath('/pages/guide/')}" class="link-guide" data-hoverable>Гайд</a>
              <a href="${withBasePath('/pages/gift/')}" data-hoverable>Сертификаты</a>
            </nav>
          </div>

          <div class="footer-col footer-col--viz fade-in stagger-1">
            <div class="footer-blueprint-wrap">
              <svg viewBox="0 0 200 100" class="footer-svg">
                <line x1="100" y1="0" x2="100" y2="100" stroke="rgba(249, 248, 246, 0.1)" stroke-dasharray="2 2" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(249, 248, 246, 0.1)" stroke-dasharray="2 2" />
                <path d="M 50,50 Q 100,10 150,50 Q 100,90 50,50 Z" fill="none" stroke="rgba(224, 199, 192, 0.3)" stroke-width="1" />
                <circle cx="100" cy="50" r="2" fill="var(--blush)" />
              </svg>
            </div>
            <div class="footer-philosophy">
              <span class="text-mono">МЕТОД АННЫ КАЗАК</span>
              <h3 class="footer-philosophy__title">Инженерия взгляда<br>Без шаблонов</h3>
            </div>
          </div>

          <div class="footer-col footer-col--contacts fade-in stagger-2">
             <a href="tel:89199625522" class="footer-phone text-mono" data-hoverable>8 (919) 962-55-22</a>
             <div class="footer-addr">г. Люберцы, ул. Летчика Ларюшина, 6/2</div>
             <a href="https://t.me/a_annett_a" target="_blank" class="footer-tg-btn" data-hoverable>Написать в Telegram</a>
          </div>
        </div>

        <div class="footer-bottom fade-in stagger-3">
          <div class="footer-legal text-mono">
            <span>НПД: Казак Анна</span>
            <span class="footer-dot"></span>
            <span>ИНН: 502727402636</span>
            <span class="footer-dot"></span>
            <a href="${withBasePath('/pages/offer/')}" class="footer-link-small" data-hoverable>Оферта</a>
            <span class="footer-dot"></span>
            <a href="${withBasePath('/pages/privacy/')}" class="footer-link-small" data-hoverable>Политика конфиденциальности</a>
          </div>
          <div class="footer-copyright text-mono">© 2026 GAZE.ARCH.</div>
        </div>

        <div class="footer-disclaimer fade-in stagger-4">
          Информация, размещённая на сайте, носит ознакомительный характер и не является публичной офертой (Ст. 437 ГК РФ).<br>
          Любое копирование контента без согласия правообладателя запрещено.
        </div>

      </div>
    </footer>

    <div class="soft-dozhym" id="soft-dozhym">
      <div class="soft-dozhym__inner">
        <span class="soft-dozhym__text">Хочешь, я подберу форму под тебя?</span>
        <a href="https://t.me/a_annett_a" target="_blank" class="btn-primary btn-primary--shimmer soft-dozhym__btn" data-hoverable>Написать Ане</a>
        <button class="soft-dozhym__close" id="dozhym-close" aria-label="Закрыть" data-hoverable>×</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Даем время на рендер и запускаем обсерверы
  setTimeout(() => {
    const footer = document.getElementById('footer-main');
    const dozhym = document.getElementById('soft-dozhym');
    const closeBtn = document.getElementById('dozhym-close');
    
    // Анимация появления элементов футера
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.footer-main .fade-in').forEach(el => footerObserver.observe(el));

    // Логика появления окна "мягкого дожима"
    if (footer && dozhym && !sessionStorage.getItem('gaze-dozhym-closed')) {
      const dozhymObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (!sessionStorage.getItem('gaze-dozhym-closed')) {
                dozhym.classList.add('is-visible');
              }
            }, 2500);
          }
        });
      }, { threshold: 0.1 });
      dozhymObserver.observe(footer);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dozhym.classList.remove('is-visible');
        sessionStorage.setItem('gaze-dozhym-closed', 'true');
      });
    }
  }, 100);
});