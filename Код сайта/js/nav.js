// Инъекция навигации с учетом базового префикса (GitHub Pages / обычный хост)
const getSiteBasePath = () => {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.src) {
    try {
      const scriptUrl = new URL(currentScript.src, window.location.href);
      const match = scriptUrl.pathname.match(/^(.*)\/js\/nav\.js$/);
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

const navHTML = `
  <header class="nav-header" id="nav-header">
    <div class="container nav-header__inner">
      <a href="${withBasePath('/')}" class="nav-header__logo-wrapper" data-hoverable>
        <img src="${withBasePath('/assets/images/logo.png')}" alt="GAZE.ARCH" class="nav-header__logo-img">
        <div class="nav-header__subtitle">метод Анны Казак</div>
      </a>
      
      <nav class="nav-header__tabs">
        <a href="${withBasePath('/pages/portfolio/')}" class="nav-tab" data-hoverable>Портфолио</a>
        <a href="${withBasePath('/pages/education/')}" class="nav-tab" data-hoverable>Обучение</a>
        <a href="${withBasePath('/pages/blog/')}" class="nav-tab" data-hoverable>Блог</a>
        <a href="${withBasePath('/pages/gift/')}" class="nav-tab" data-hoverable>Подарить сертификат</a>
      </nav>

      <a href="https://t.me/a_annett_a" target="_blank" class="btn-primary btn-primary--shimmer nav-header__cta" data-hoverable>Записаться</a>
      
      <button class="nav-header__burger" id="nav-burger" aria-label="Открыть меню" data-hoverable>
        <span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav-overlay" id="nav-overlay">
    <div class="nav-overlay__inner">
      <nav class="nav-overlay__menu">
        <a href="${withBasePath('/pages/portfolio/')}" class="nav-tab">Портфолио</a>
        <a href="${withBasePath('/pages/education/')}" class="nav-tab">Обучение</a>
        <a href="${withBasePath('/pages/blog/')}" class="nav-tab">Блог</a>
        <a href="${withBasePath('/pages/gift/')}" class="nav-tab">Подарить сертификат</a>
      </nav>
      <a href="https://t.me/a_annett_a" target="_blank" class="btn-primary nav-overlay__cta">Записаться</a>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('afterbegin', navHTML);

const header = document.getElementById('nav-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('nav-header--scrolled');
  } else {
    header.classList.remove('nav-header--scrolled');
  }
});

const burger = document.getElementById('nav-burger');
const overlay = document.getElementById('nav-overlay');
if (burger && overlay) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    overlay.classList.toggle('is-active');
    document.body.style.overflow = overlay.classList.contains('is-active') ? 'hidden' : '';
  });
}