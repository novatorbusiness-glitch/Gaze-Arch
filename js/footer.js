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
            <img src="${withBasePath('/assets/images/brand/gaze-anna-logo-light.svg')}?v=2" alt="GAZE · Анна Новицкая" class="footer-brand-logo">
            <nav class="footer-links">
              <a href="${withBasePath('/#services')}" data-hoverable>Услуги и цены</a>
              <a href="${withBasePath('/pages/portfolio/')}" data-hoverable>Результаты</a>
              <!-- «Блог» скрыт 08.10.2026: статьи вернём позже, переписанными -->
              <!-- «Обучение» скрыто 08.10.2026: Анна сейчас обучает редко, страница лежит в pages/education -->
              <a href="${withBasePath('/pages/guide/')}" class="link-guide" data-hoverable>Гайд</a>
              <a href="${withBasePath('/pages/gift/')}" data-hoverable>Сертификаты</a>
            </nav>
          </div>

          <div class="footer-col footer-col--viz fade-in stagger-1">
            <div class="footer-philosophy">
              <h3 class="footer-philosophy__title">Ресницы и брови<br>под твоё лицо</h3>
            </div>
          </div>

          <div class="footer-col footer-col--contacts fade-in stagger-2">
             <a href="tel:89199625522" class="footer-phone text-mono" data-hoverable>8 (919) 962-55-22</a>
             <div class="footer-addr">г. Люберцы, ул. Лётчика Ларюшина, 6, корп. 2</div>
             <a href="https://t.me/a_annett_a" target="_blank" class="footer-tg-btn" data-hoverable>Написать в Telegram</a>
          </div>
        </div>

        <div class="footer-bottom fade-in stagger-3">
          <div class="footer-legal text-mono">
            <span>НПД: Новицкая Анна</span>
            <span class="footer-dot"></span>
            <span>ИНН: 771543781105</span>
            <span class="footer-dot"></span>
            <a href="${withBasePath('/pages/offer/')}" class="footer-link-small" data-hoverable>Оферта</a>
            <span class="footer-dot"></span>
            <a href="${withBasePath('/pages/privacy/')}" class="footer-link-small" data-hoverable>Политика конфиденциальности</a>
            <span class="footer-dot"></span>
            <a href="#" class="footer-link-small" onclick="window.gazeCookieSettings && window.gazeCookieSettings(); return false;" data-hoverable>Настройки cookie</a>
          </div>
          <div class="footer-copyright text-mono">© 2026 GAZE · Анна Новицкая</div>
        </div>

        <div class="footer-disclaimer fade-in stagger-4">
          Информация, размещённая на сайте, носит ознакомительный характер и не является публичной офертой (Ст. 437 ГК РФ).<br>
          Любое копирование контента без согласия правообладателя запрещено.
        </div>

      </div>
    </footer>

  `;

  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Даем время на рендер и запускаем обсерверы
  setTimeout(() => {
    const footer = document.getElementById('footer-main');
    
    // Анимация появления элементов футера
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.footer-main .fade-in').forEach(el => footerObserver.observe(el));
  }, 100);
});