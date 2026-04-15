/**
 * GAZE.ARCH - MASTER SCRIPT (FULL VERSION)
 * Физика, Интерактив, Квиз + Умная кнопка Telegram
 */

document.addEventListener('DOMContentLoaded', () => {

  const getSiteBasePath = () => {
    const scriptEl = document.querySelector('script[src*="js/main.js"]');
    const scriptSrc = scriptEl ? scriptEl.src : '';

    if (scriptSrc) {
      try {
        const scriptUrl = new URL(scriptSrc, window.location.href);
        const match = scriptUrl.pathname.match(/^(.*)\/js\/main\.js$/);
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

  const resetBodyOverflowIfNoOverlay = () => {
    if (document.querySelector('.legal-page')) {
      document.body.style.overflow = '';
      return;
    }

    const hasBlockingLayer = document.querySelector(
      '.nav-overlay.is-active, #quiz-overlay.is-active, #portfolio-lightbox.is-open'
    );

    if (!hasBlockingLayer) {
      document.body.style.overflow = '';
    }
  };

  resetBodyOverflowIfNoOverlay();
  window.addEventListener('pageshow', resetBodyOverflowIfNoOverlay);

  const injectConsentNotes = () => {
    const selectors = [
      '#quiz-tg-btn',
      '#ai-submit-btn',
      '.guide-cta-card__btn',
      '#b-cta',
      '.gift-cta-btn',
      '.article-cta__booking',
      '.blog-cta-btn',
      '.portfolio-lightbox__cta'
    ];

    const noteHtml = `Нажимая кнопку, вы соглашаетесь с <a href="${withBasePath('/pages/privacy/')}">политикой конфиденциальности</a> и <a href="${withBasePath('/pages/offer/')}">условиями оферты</a>.`;
    const targets = new Set();

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => targets.add(el));
    });

    targets.forEach((target) => {
      if (!target || target.dataset.consentBound === 'true') return;

      const parent = target.parentElement;
      const hasButtonGroup = parent && parent.querySelectorAll('a, button').length > 1;
      const anchor = hasButtonGroup ? parent : target;

      if (!anchor || anchor.dataset.consentBound === 'true') return;
      if (anchor.nextElementSibling && anchor.nextElementSibling.classList.contains('legal-consent-note')) {
        anchor.dataset.consentBound = 'true';
        return;
      }

      const note = document.createElement('p');
      note.className = 'legal-consent-note';
      note.innerHTML = noteHtml;
      anchor.insertAdjacentElement('afterend', note);
      anchor.dataset.consentBound = 'true';
      target.dataset.consentBound = 'true';
    });
  };

  injectConsentNotes();

  const isDesktop = window.matchMedia("(min-width: 769px)").matches;

  const educationHeroCta = document.querySelector('.js-scroll-tariffs');
  if (educationHeroCta) {
    educationHeroCta.addEventListener('click', (event) => {
      const target = document.querySelector('#tariffs');
      if (!target) return;

      event.preventDefault();
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10
      ) || 100;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  }

  
  // === 1. ГЛОБАЛЬНЫЙ КАСТОМНЫЙ КУРСОР ===
  const cursor = document.getElementById('gaze-cursor');

  if (isDesktop && cursor) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    const speed = 0.15; 

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const onDarkSurface = hoveredElement && hoveredElement.closest('.footer-main, .soft-dozhym');
      cursor.classList.toggle('gaze-cursor--light', Boolean(onDarkSurface));
    });

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const setupCursorHovers = () => {
      document.querySelectorAll('a, button, [data-hoverable]').forEach(el => {
        if (!el.dataset.hoverBound) {
          el.addEventListener('mouseenter', () => cursor.classList.add('gaze-cursor--hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('gaze-cursor--hover'));
          el.dataset.hoverBound = 'true';
        }
      });
    };
    setupCursorHovers();
    window.updateCursorHover = setupCursorHovers;
  }

  // === 2. HERO CANVAS (ГЕОМЕТРИЯ С ПАРАЛЛАКСОМ) ===
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes = [];
    const nodeCount = isDesktop ? 65 : 25; 
    const connectionDistance = 180;
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize); resize();

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: isDesktop ? (width * 0.4) + Math.random() * (width * 0.6) : Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.8,
        layer: Math.random() > 0.5 ? 1 : 2
      });
    }

    if (isDesktop) {
      window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    }

    const animateCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (isDesktop) {
          if (n.x < width * 0.35) n.vx = Math.abs(n.vx); 
          if (n.x > width) n.vx = -Math.abs(n.vx);
        } else {
          if (n.x < 0 || n.x > width) n.vx *= -1;
        }
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (isDesktop) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            n.x += dx * 0.004 * (n.layer === 1 ? 1 : 0.5);
            n.y += dy * 0.004 * (n.layer === 1 ? 1 : 0.5);
          }
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(224, 199, 192, 0.7)'; ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(224, 199, 192, ${(1 - dist/connectionDistance) * 0.5})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
    setTimeout(() => canvas.style.opacity = '1', 400);
  }

  // === 3. HERO ЭФФЕКТЫ (ТУННЕЛЬ ВНИМАНИЯ) ===
  const quizBtnOpen = document.getElementById('btn-quiz-open');
  const quizOverlay = document.getElementById('quiz-overlay');

  if (quizBtnOpen && isDesktop) {
    quizBtnOpen.addEventListener('mouseenter', () => document.body.classList.add('hero-focus-active'));
    quizBtnOpen.addEventListener('mouseleave', () => {
      if (!quizOverlay.classList.contains('is-active')) document.body.classList.remove('hero-focus-active');
    });
  }

  // === 4. ЛОГИКА КВИЗА (5 ШАГОВ + УМНАЯ КНОПКА TG) ===
  const quizBtnClose = document.getElementById('quiz-close');
  const scanLine = document.getElementById('quiz-scan');
  const stepCounter = document.getElementById('quiz-step-counter');
  const progressFill = document.getElementById('quiz-progress-fill');

  let currentStep = 1;
  const totalSteps = 5; 
  const answers = {};

  const resultsMap = {
    'natural': { 
      title: 'Классическая гармония', 
      services: 'Архитектура бровей + Наращивание (Классика / 1.5D)',
      desc: 'Идеальный выбор для тех, кто ценит естественность и хочет подчеркнуть природную анатомию взгляда без лишнего объема.' 
    },
    'volume_up': { 
      title: 'Выразительный объём', 
      services: 'Наращивание (Объём 2D / 2.5D / 3D)',
      desc: 'Твоим чертам лица подойдет более плотное заполнение, которое сделает взгляд глубоким и уверенным 24/7.' 
    },
    'lifting': { 
      title: 'Архитектурный лифт', 
      services: 'Ламинирование ресниц + Архитектура бровей',
      desc: 'Этот комплекс визуально приподнимет веко и создаст эффект открытого, свежего взгляда за счет правильного изгиба.' 
    },
    'trendy': { 
      title: 'Трендовая геометрия', 
      services: 'Наращивание (Спецэффекты: Лучи / Мокрый эффект)',
      desc: 'Современная техника из прайса, которая подчеркнет твою уникальность и добавит взгляду журнальной текстуры.' 
    },
    'complex': { 
      title: 'Мягкий баланс (Комплекс)', 
      services: 'Ламинирование бровей + Ламинирование ресниц',
      desc: 'Полная перезагрузка образа с упором на здоровье и восстановление формы. Твой взгляд станет чистым и выразительным.' 
    }
  };

  if (quizBtnOpen) {
    quizBtnOpen.addEventListener('click', () => {
      quizOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('hero-focus-active');
    });
  }

  const closeQuiz = () => {
    quizOverlay.classList.remove('is-active');
    document.body.classList.remove('hero-focus-active');
    document.body.style.overflow = '';
    setTimeout(resetQuiz, 500);
  };
  if (quizBtnClose) quizBtnClose.addEventListener('click', closeQuiz);

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const stepNum = parseInt(this.closest('.quiz-step').dataset.step);
      answers[stepNum] = this.dataset.value;
      nextStep();
    });
  });

  function nextStep() {
    if (scanLine) {
      scanLine.classList.remove('animating'); void scanLine.offsetWidth; scanLine.classList.add('animating');
    }
    setTimeout(() => {
      const curr = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
      if (curr) curr.classList.remove('active');
      currentStep++;
      const next = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
      if (next) { next.classList.add('active'); updateUI(); }
      if (currentStep === totalSteps) showResult();
    }, 450);
  }

  function updateUI() {
    const percent = (currentStep / totalSteps) * 100;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (stepCounter) stepCounter.innerText = currentStep < totalSteps ? `ШАГ ${currentStep} ИЗ ${totalSteps}` : `АНАЛИЗ ЗАВЕРШЕН`;
  }

  function showResult() {
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');
    const tgBtn = document.getElementById('quiz-tg-btn');
    
    let key = 'natural';
    if (answers[2] === 'hooded' || answers[2] === 'droopy') key = 'lifting';
    else if (answers[4] === 'special') key = 'trendy';
    else if (answers[4] === 'volume') key = 'volume_up';
    else if (answers[4] === 'lami' || answers[3] === 'thin') key = 'complex';

    const result = resultsMap[key] || resultsMap['natural'];
    if (title) title.innerText = result.title;
    
    // Вывод в карточку на сайте для клиента
    if (desc) {
      desc.innerHTML = `
        <div class="ai-result-heading">
          Услуга: ${result.services}
        </div>
        <div class="ai-result-copy">
          ${result.desc}
        </div>
      `;
    }

    // Сообщение для Ани
    if (tgBtn) {
      const msg = `Привет, Аня! Я прошла диагностику на сайте.%0A%0A` +
                  `✨ Мой результат: *${result.title}*%0A` +
                  `🛠 Рекомендованные услуги: *${result.services}*%0A%0A` +
                  `Подскажи, пожалуйста, когда можно к тебе записаться?`;
      tgBtn.href = `https://t.me/a_annett_a?text=${msg}`;
    }
  }

  function resetQuiz() {
    currentStep = 1;
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    updateUI();
  }

  // === 5. ОБНАРУЖЕНИЕ СКРОЛЛА ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});


// =================================================================
// 📁 ФАЙЛ: js/main.js
// МЕСТО ВСТАВКИ: В самый конец твоего существующего файла main.js
// НАЧАЛО: БЛОК 3 — ВИДЕО ПРИВЕТСТВИЕ (ИСПРАВЛЕНО)
// =================================================================

{
  const teaserVideos = document.querySelectorAll('.video-cover__teaser');

  if (teaserVideos.length > 0) {
    teaserVideos.forEach(video => {
      const cover = video.closest('.video-cover');
      
      if (cover) {
        cover.addEventListener('mouseenter', () => {
          video.play().catch(error => {
            console.log('Автоплей заблокирован браузером:', error);
          });
        });
        
        cover.addEventListener('mouseleave', () => {
          video.pause();
          setTimeout(() => {
            video.currentTime = 0;
          }, 300);
        });
      }
    });
  }
} // Вот эта скобка закрывает блок (строка 284 на скрине)

// Этот код должен идти СРАЗУ после скобки, без лишних знаков вокруг
if (typeof window.updateCursorHover === 'function') {
  window.updateCursorHover();
}

// =================================================================
// КОНЕЦ: БЛОК 3
// =================================================================






// =================================================================
// 📁 ФАЙЛ: js/main.js
// МЕСТО ВСТАВКИ: В самый конец файла (Перезапиши прошлый скрипт 4 блока)
// НАЧАЛО: БЛОК 4 — 3D HOVER + DYNAMIC SPOTLIGHT
// =================================================================

setTimeout(() => {
  const tiltCards = document.querySelectorAll('[data-tilt-card]');
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover && tiltCards.length > 0) {
    tiltCards.forEach(card => {
      const inner = card.querySelector('.card-wide__inner, .flag-card__inner, .article-compare__inner, .article-takeaway__inner, .pain-final__inner');
      
      // ЗАЩИТА: Если элемента нет, прекращаем работу для этой карточки!
      if (!inner) return; 
      
      card.addEventListener('mouseenter', () => {
        inner.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = inner.getBoundingClientRect();
        if(rect.width === 0 || rect.height === 0) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        inner.style.setProperty('--mouse-x', `${x}px`);
        inner.style.setProperty('--mouse-y', `${y}px`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -3; 
        const rotateY = ((x - centerX) / centerX) * 3;
        
        inner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease-out, border-color 0.6s ease';
        inner.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }
  
  if (typeof observer !== 'undefined') {
    document.querySelectorAll('.section-pain .fade-in').forEach(el => observer.observe(el));
  }
}, 500);

// =================================================================
// КОНЕЦ: БЛОК 4
// =================================================================





// =================================================================
// 📁 ФАЙЛ: js/main.js
// ЧТО ДЕЛАТЬ: ЗАМЕНИТЬ JS БЛОКА 5 НА ЭТОТ
// =================================================================

setTimeout(() => {
  
  // 1. SCROLL-TELLING (Фокус на абзацах)
  const chapters = document.querySelectorAll('[data-chapter]');
  if (chapters.length > 0) {
    const chapterOptions = {
      root: null,
      rootMargin: '-20% 0px -30% 0px', 
      threshold: 0
    };

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          entry.target.classList.remove('is-active');
        }
      });
    }, chapterOptions);

    chapters.forEach(ch => chapterObserver.observe(ch));
  }

  // 2. 3D TILT КАРТОЧКИ — «Аня следит за тобой»
  const storyCard = document.querySelector('.story-visual-sticky .story-card');
  const storySection = document.getElementById('story');
  const isDesktopParallax = window.matchMedia("(min-width: 768px)").matches;

  if (isDesktopParallax && storyCard && storySection) {
    let targetRotX = 0;
    let targetRotY = 0;
    let targetScrollY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let currentScrollY = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      currentRotX    = lerp(currentRotX,    targetRotX,    0.07);
      currentRotY    = lerp(currentRotY,    targetRotY,    0.07);
      currentScrollY = lerp(currentScrollY, targetScrollY, 0.06);

      storyCard.style.transform =
        `translateY(${currentScrollY}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;

      // Усиливаем тень по мере наклона
      const tiltAmount = Math.abs(currentRotX) + Math.abs(currentRotY);
      const shadowAlpha = 0.06 + tiltAmount * 0.008;
      storyCard.style.boxShadow =
        `0 ${16 + tiltAmount * 1.5}px ${40 + tiltAmount * 3}px rgba(107, 94, 83, ${shadowAlpha})`;

      requestAnimationFrame(animate);
    };

    // Скролл: карточка чуть «плывёт» при прокрутке страницы
    window.addEventListener('scroll', () => {
      const rect = storySection.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        targetScrollY = (progress - 0.5) * -18; // диапазон ±9px
      }
    }, { passive: true });

    // Мышь: 3D-наклон карточки следует за курсором
    storySection.addEventListener('mousemove', (e) => {
      const r = storyCard.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2); // -1 … +1
      const dy = (e.clientY - cy) / (r.height / 2); // -1 … +1
      targetRotY =  dx * 6;   // max ±6° по горизонтали
      targetRotX = -dy * 4;   // max ±4° по вертикали
    });

    storySection.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });

    animate();
  }

  if (typeof observer !== 'undefined') {
    document.querySelectorAll('.section-story .fade-in').forEach(el => observer.observe(el));
  }
}, 500);

// =================================================================
// КОНЕЦ: БЛОК 5
// =================================================================






// =================================================================
// 📁 ФАЙЛ: js/main.js
// МЕСТО ВСТАВКИ: В самый конец файла (Перезапиши прошлый блок 6)
// НАЧАЛО: БЛОК 6 — 3D MAGNETIC & DYNAMIC GLARE (ФИНАЛ)
// =================================================================

setTimeout(() => {
  const hoverCards = document.querySelectorAll('[data-service-card], [data-bonus-card]');
  const isHoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isHoverable && hoverCards.length > 0) {
    hoverCards.forEach(card => {
      const inner = card.querySelector('.card-service__inner, .services-bonus__inner');
      const glare = card.querySelector('.card-service__glare, .services-bonus__glare');
      
      // ЗАЩИТА: Если элементов нет (например, мы в Гайде), просто пропускаем!
      if (!inner || !glare) return;

      card.addEventListener('mouseenter', () => {
        inner.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = inner.getBoundingClientRect();
        if(rect.width === 0 || rect.height === 0) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        inner.style.setProperty('--mouse-x', `${x}px`);
        inner.style.setProperty('--mouse-y', `${y}px`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -4; 
        const rotateY = ((x - centerX) / centerX) * 4;
        
        inner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease-out, border-color 0.6s ease';
        inner.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }

  if (typeof observer !== 'undefined') {
    document.querySelectorAll('.section-services .fade-in').forEach(el => observer.observe(el));
  }
}, 500);


// =================================================================
// СВЯЗКА КНОПКИ БОНУСА И ГЛАВНОГО КВИЗА В HERO
// =================================================================
setTimeout(() => {
  const bonusQuizBtn = document.getElementById('btn-quiz-open-bonus');
  const mainHeroQuizBtn = document.getElementById('btn-quiz-open'); // ID кнопки в первом блоке

  if (bonusQuizBtn && mainHeroQuizBtn) {
    bonusQuizBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Имитируем клик по главной кнопке в Hero, чтобы открылся тот же самый оверлей
      mainHeroQuizBtn.click();
    });
  }
}, 500);

// =================================================================
// КОНЕЦ: БЛОК 6 — УСЛУГИ И ПРАЙС
// =================================================================





/* ================================================================= */
/* 📁 ФАЙЛ: js/main.js                                               */
/* МЕСТО ВСТАВКИ: В самый конец файла                                */
/* НАЧАЛО: БЛОК 7 — SOCIAL PROOF LOGIC (ИСПРАВЛЕНО)                   */
/* ================================================================= */
{
  const track = document.getElementById('marquee-track');
  const marquee = track ? track.parentElement : null;
  const prevBtn = document.getElementById('proof-prev');
  const nextBtn = document.getElementById('proof-next');
  const statusEl = document.getElementById('proof-status');
  
  if (track && marquee) {
    const reviewImages = [
      { file: 'img_0.PNG', width: 1179, height: 600 },
      { file: 'img_3.PNG', width: 746, height: 427 },
      { file: 'img_4.PNG', width: 1179, height: 953 },
      { file: 'img_5.PNG', width: 422, height: 278 },
      { file: 'img_6.png', width: 502, height: 176 },
      { file: 'img_7.PNG', width: 1179, height: 520 },
      { file: 'img_8.PNG', width: 1179, height: 432 },
      { file: 'img_9.PNG', width: 1179, height: 539 },
      { file: 'img_10.PNG', width: 1179, height: 590 },
      { file: 'img_11.PNG', width: 1179, height: 508 },
      { file: 'img_12.PNG', width: 1040, height: 619 },
      { file: 'img_13.PNG', width: 1069, height: 477 },
      { file: 'img_14.PNG', width: 1179, height: 505 },
      { file: 'img_15.PNG', width: 1102, height: 429 },
      { file: 'img_16.PNG', width: 1076, height: 489 },
      { file: 'img_17.PNG', width: 1053, height: 462 },
      { file: 'img_18.PNG', width: 1081, height: 397 },
      { file: 'img_19.PNG', width: 1046, height: 417 },
      { file: 'img_20.PNG', width: 1040, height: 384 },
      { file: 'img_21.PNG', width: 1087, height: 384 },
      { file: 'img_22.PNG', width: 1074, height: 382 },
      { file: 'img_23.PNG', width: 1094, height: 397 },
      { file: 'img_24.PNG', width: 1075, height: 411 },
      { file: 'img_25.png', width: 508, height: 536 },
      { file: 'img_26.png', width: 694, height: 850 },
      { file: 'img_27.PNG', width: 1172, height: 531 },
      { file: 'img_28.PNG', width: 1179, height: 648 },
      { file: 'img_29.PNG', width: 1179, height: 521 },
      { file: 'img_30.PNG', width: 1179, height: 416 },
      { file: 'img_31.png', width: 656, height: 576 },
      { file: 'img_32.png', width: 582, height: 350 },
      { file: 'img_33.PNG', width: 1164, height: 506 },
      { file: 'img_34.PNG', width: 1179, height: 860 },
      { file: 'img_35.PNG', width: 1179, height: 686 },
      { file: 'img_36.PNG', width: 1179, height: 461 },
      { file: 'img_37.png', width: 972, height: 1082 },
      { file: 'img_38.PNG', width: 1179, height: 693 },
      { file: 'img_39.PNG', width: 1179, height: 743 },
      { file: 'img_40.PNG', width: 1179, height: 441 }
    ];

    const buildCard = (review, idx) => {
      const targetHeight = window.innerWidth <= 768 ? 240 : 320;
      const rawWidth = Math.round((review.width / review.height) * targetHeight);
      const clampedWidth = Math.max(180, Math.min(rawWidth, 420));
      const card = document.createElement('div');
      const img = document.createElement('img');

      card.className = 'proof-review-card';
      card.setAttribute('aria-label', `Скриншот отзыва ${idx + 1}`);
      card.style.setProperty('--review-width', `${clampedWidth}px`);

      img.className = 'proof-review-img';
      img.src = `assets/images/${review.file}`;
      img.alt = `Скриншот отзыва ${idx + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      card.appendChild(img);
      return card;
    };

    const fragment = document.createDocumentFragment();
    const cloneFragment = document.createDocumentFragment();

    reviewImages.forEach((review, idx) => {
      fragment.appendChild(buildCard(review, idx));
      cloneFragment.appendChild(buildCard(review, idx));
    });

    track.innerHTML = '';
    track.appendChild(fragment);
    track.appendChild(cloneFragment);

    const segmentWidth = track.scrollWidth / 2;
    const centerOnInitialCard = () => {
      const initialCard = track.children[reviewImages.length];
      if (!initialCard) {
        marquee.scrollLeft = segmentWidth;
        return;
      }

      marquee.scrollLeft = initialCard.offsetLeft - (marquee.clientWidth - initialCard.offsetWidth) / 2;
      normalizeScrollPosition();
    };

    requestAnimationFrame(centerOnInitialCard);
    window.setTimeout(centerOnInitialCard, 120);

    let animationId = 0;
    let autoPaused = false;
    let resumeTimer = 0;
    let lastTimestamp = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const cardGap = window.innerWidth <= 768 ? 20 : 32;
    const speed = window.innerWidth <= 768 ? 17 : 21;

    const normalizeScrollPosition = () => {
      if (marquee.scrollLeft <= cardGap) {
        marquee.scrollLeft += segmentWidth;
      } else if (marquee.scrollLeft >= track.scrollWidth - marquee.clientWidth - cardGap) {
        marquee.scrollLeft -= segmentWidth;
      }
    };

    const setStatus = (state) => {
      if (!statusEl) return;
      const statusText = statusEl.querySelector('.proof-marquee-status__text');
      statusEl.dataset.state = state;

      if (!statusText) return;

      if (state === 'paused') {
        statusText.textContent = 'Пауза';
      } else if (state === 'dragging') {
        statusText.textContent = 'Листаешь вручную';
      } else {
        statusText.textContent = 'Автопросмотр';
      }
    };

    const stopAutoScroll = () => {
      autoPaused = true;
      setStatus('paused');
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const startAutoScroll = () => {
      if (animationId) return;
      autoPaused = false;
      lastTimestamp = 0;
      setStatus('auto');

      const loop = (timestamp) => {
        if (autoPaused) {
          animationId = 0;
          return;
        }

        if (!lastTimestamp) {
          lastTimestamp = timestamp;
        }

        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        marquee.scrollLeft += (speed * delta) / 1000;
        normalizeScrollPosition();

        animationId = requestAnimationFrame(loop);
      };

      animationId = requestAnimationFrame(loop);
    };

    const scheduleResume = (delay = 5000) => {
      clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        startAutoScroll();
      }, delay);
    };

    const manualStep = (direction) => {
      stopAutoScroll();
      marquee.scrollBy({
        left: direction * Math.min(marquee.clientWidth * 0.72, 320),
        behavior: 'smooth'
      });
      window.setTimeout(normalizeScrollPosition, 420);
      scheduleResume(5000);
    };

    marquee.addEventListener('mouseenter', () => {
      clearTimeout(resumeTimer);
      stopAutoScroll();
    });

    marquee.addEventListener('mouseleave', () => {
      if (!isDragging) {
        scheduleResume(700);
      }
    }, { passive: true });

    marquee.addEventListener('touchstart', () => {
      stopAutoScroll();
      clearTimeout(resumeTimer);
    }, { passive: true });

    marquee.addEventListener('wheel', () => {
      stopAutoScroll();
      scheduleResume(5000);
    }, { passive: true });

    marquee.addEventListener('pointerdown', (event) => {
      isDragging = true;
      dragStartX = event.clientX;
      dragStartScroll = marquee.scrollLeft;
      stopAutoScroll();
      setStatus('dragging');
      clearTimeout(resumeTimer);
      marquee.classList.add('is-dragging');
    });

    marquee.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - dragStartX;
      marquee.scrollLeft = dragStartScroll - deltaX;
      normalizeScrollPosition();
    });

    const endDragging = () => {
      if (!isDragging) return;
      isDragging = false;
      marquee.classList.remove('is-dragging');
      setStatus('paused');
      scheduleResume(5000);
    };

    marquee.addEventListener('pointerup', endDragging);
    marquee.addEventListener('pointercancel', endDragging);
    marquee.addEventListener('pointerleave', endDragging);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        manualStep(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        manualStep(1);
      });
    }

    window.addEventListener('resize', () => {
      clearTimeout(resumeTimer);
      stopAutoScroll();
      requestAnimationFrame(centerOnInitialCard);
      window.setTimeout(centerOnInitialCard, 120);
      scheduleResume(400);
    });

    startAutoScroll();
  }

  // 3. Универсальный CountUp (Топ статы + Платформы)
  const countupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countData = target.getAttribute('data-countup');
        if (!countData) return;

        const endValue = parseFloat(countData);
        const isDecimal = countData.includes('.');
        let startTime = null;

        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / 2000, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          if (isDecimal) {
            const val = (easeOut * endValue).toFixed(1);
            target.innerHTML = val.replace('.', ',');
          } else {
            target.innerHTML = Math.floor(easeOut * endValue).toLocaleString('ru-RU');
          }
          
          if (progress < 1) window.requestAnimationFrame(animate);
        };
        window.requestAnimationFrame(animate);
        countupObserver.unobserve(target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-countup]').forEach(el => countupObserver.observe(el));

  // 4. Связка кнопки квиза
  const proofBtn = document.getElementById('btn-quiz-open-proof');
  const heroBtn = document.getElementById('btn-quiz-open');
  if(proofBtn && heroBtn) {
    proofBtn.addEventListener('click', () => heroBtn.click());
  }
}
/* ================================================================= */
/* КОНЕЦ: БЛОК 7                                                     */
/* ================================================================= */









// =================================================================
// 📁 ФАЙЛ: js/main.js
// НАЧАЛО: БЛОК 9 — FAQ LOGIC
// =================================================================

setTimeout(() => {
  const faqAccordion = document.querySelector('.faq-accordion');
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqAccordion && faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-item__question');
      
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('is-active');

        // Закрываем все остальные (Оставляем открытым только один)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-active');
            otherItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
          }
        });

        // Переключаем текущий
        if (!isActive) {
          item.classList.add('is-active');
          questionBtn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('is-active');
          questionBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Обновляем IntersectionObserver для анимаций появления
  if (typeof observer !== 'undefined') {
    document.querySelectorAll('.section-faq .fade-in').forEach(el => observer.observe(el));
  }
}, 500);

// =================================================================
// КОНЕЦ: БЛОК 9
// =================================================================









// =================================================================
// 📁 ФАЙЛ: js/main.js
// НАЧАЛО: БЛОК 10 — COPY TO CLIPBOARD LOGIC
// =================================================================

setTimeout(() => {
  const copyWrappers = document.querySelectorAll('.js-copy-address');

  if (copyWrappers.length > 0) {
    copyWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const textToCopy = wrapper.querySelector('.js-copy-text').innerText;
        
        // Копируем в буфер обмена
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Показываем сообщение "Скопировано"
          wrapper.classList.add('is-copied');
          
          // Возвращаем обратно через 2 секунды
          setTimeout(() => {
            wrapper.classList.remove('is-copied');
          }, 2000);
        }).catch(err => {
          console.error('Не удалось скопировать текст: ', err);
        });
      });
    });
  }

  // Обновляем IntersectionObserver для анимаций появления
  if (typeof observer !== 'undefined') {
    document.querySelectorAll('.section-contacts .fade-in').forEach(el => observer.observe(el));
  }
}, 500);

// =================================================================
// КОНЕЦ: БЛОК 10
// =================================================================








// =================================================================
// FOCUS READING — растворение текста при скролле (глобально)
// =================================================================

(function () {
  const focusEls = document.querySelectorAll('.js-focus-read');
  if (!focusEls.length) return;

  if (window.matchMedia('(max-width: 768px)').matches) return;

  const FADE_START = window.innerHeight * 0.28;
  const FADE_END   = 60;

  // Sticky-плашка: пульсирует когда первый абзац уходит за край
  const offerAside = document.getElementById('offer-aside');
  const offerCard  = offerAside ? offerAside.querySelector('.offer-card') : null;
  let pulsed = false;

  window.addEventListener('scroll', () => {
    focusEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < FADE_START) {
        const opacity = Math.max(0, Math.min(1, (rect.top - FADE_END) / (FADE_START - FADE_END)));
        el.style.opacity = opacity;
        el.style.transform = `translateY(${(1 - opacity) * -12}px)`;
        el.style.transition = 'none';

        // Один раз пульсировать когда первый абзац полностью улетел
        if (!pulsed && offerCard && opacity < 0.05) {
          pulsed = true;
          offerCard.classList.add('offer-card--pulse');
          offerCard.addEventListener('animationend', () => {
            offerCard.classList.remove('offer-card--pulse');
          }, { once: true });
        }
      } else {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
        if (rect.top > FADE_START + 50) pulsed = false; // сброс при скролле вверх
      }
    });
  }, { passive: true });
}());

// =================================================================
// БЛОК 4 · SOCIAL PROOF — countUp + карусель с typing-курсором
// =================================================================

(function () {

  // ── CountUp для data-count ──
  const statNums = document.querySelectorAll('.social-proof__stat-num[data-count]');
  if (statNums.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const end     = parseInt(el.dataset.count, 10);
        const prefix  = el.dataset.prefix  || '';
        const suffix  = el.dataset.suffix  || '';
        const dur     = 1500;
        let start     = null;

        const tick = (ts) => {
          if (!start) start = ts;
          const p   = Math.min((ts - start) / dur, 1);
          const val = Math.floor((1 - Math.pow(1 - p, 3)) * end);
          el.textContent = prefix + val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.3 });

    statNums.forEach(el => countObserver.observe(el));
  }

  // ── Карусель ──
  const track  = document.getElementById('sp-track');
  const prevBtn= document.getElementById('sp-prev');
  const nextBtn= document.getElementById('sp-next');
  const dotsEl = document.getElementById('sp-dots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards  = track.querySelectorAll('.sp-card');
  const dots   = dotsEl ? dotsEl.querySelectorAll('.sp-carousel__dot') : [];
  let current  = 0;
  let autoTimer;

  const goTo = (idx) => {
    current = (idx + cards.length) % cards.length;
    // Crossfade — без translateX, только класс активной карточки
    cards.forEach((c, i) => {
      c.classList.toggle('sp-card--active', i === current);
    });

    dots.forEach((d, i) => {
      d.classList.toggle('sp-carousel__dot--active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  // Инициализация — активная первая карточка
  goTo(0);

  prevBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); startAuto(); });

  dots.forEach(d => {
    d.addEventListener('click', () => { clearInterval(autoTimer); goTo(+d.dataset.idx); startAuto(); });
  });

  // Автолистание 5s
  const startAuto = () => {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };
  startAuto();

  // Свайп на тач-устройствах
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { clearInterval(autoTimer); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

}());

// =================================================================
// БЛОК 5 · БОЛИ И СТРАХИ — toggle, unblur, mobile swipe
// =================================================================

(function () {
  const cards = document.getElementById('pain-cards');
  if (!cards) return;

  const toggle = document.querySelector('.pain-toggle');
  if (!toggle) return;

  const btns = toggle.querySelectorAll('.pain-toggle__btn');

  function setState(state) {
    const isAfter = state === 'after';

    // Sliding track
    toggle.classList.toggle('pain-toggle--after', isAfter);

    // aria-pressed
    btns.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.state === state ? 'true' : 'false');
      btn.classList.toggle('pain-toggle__btn--active', btn.dataset.state === state);
    });

    // Карточки
    cards.classList.toggle('pain-cards--after', isAfter);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => setState(btn.dataset.state));
  });

  // ── Mobile swipe toggle ──────────────────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;

  cards.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  cards.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // только горизонтальный свайп
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
    setState(dx < 0 ? 'after' : 'now');
  }, { passive: true });

}());

// =================================================================
// ✍️ WORD REVEAL + STRIKETHROUGH · Блоки 4 и 6
// =================================================================
(function () {

  // Разбивает текст внутри .sp-text-reveal на <span class="wrev">-слова
  function wrapWords(el) {
    // Обходим текстовые узлы; <mark>, <span> — не трогаем
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(function (w) {
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(w));
          } else if (w) {
            const s = document.createElement('span');
            s.className = 'wrev';
            s.textContent = w;
            frag.appendChild(s);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.nodeName !== 'MARK' &&
        !node.classList.contains('js-countup')
      ) {
        Array.from(node.childNodes).forEach(processNode);
      }
    }

    Array.from(el.querySelectorAll('p')).forEach(function (p) {
      Array.from(p.childNodes).forEach(processNode);
    });
  }

  // Назначаем --wi каждому .wrev
  function indexWords(el) {
    var i = 0;
    el.querySelectorAll('.wrev').forEach(function (s) {
      s.style.setProperty('--wi', i++);
    });
  }

  // Инициализируем все .sp-text-reveal
  var reveals = document.querySelectorAll('.sp-text-reveal');
  reveals.forEach(function (el) {
    wrapWords(el);
    indexWords(el);
  });

  // CountUp для .js-countup[data-to]
  var countSpans = document.querySelectorAll('.js-countup[data-to]');
  if (countSpans.length) {
    var cuObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el  = entry.target;
        var end = parseInt(el.getAttribute('data-to'), 10);
        var fmt = el.getAttribute('data-format');
        var suf = el.getAttribute('data-suffix') || '';
        var dur = 1600;
        var start = null;

        function tick(ts) {
          if (!start) start = ts;
          var p   = Math.min((ts - start) / dur, 1);
          var val = Math.floor((1 - Math.pow(1 - p, 3)) * end);
          var valStr = fmt === 'space'
            ? val.toLocaleString('ru-RU').replace(/,/g, '\u00a0')
            : String(val);
          el.innerHTML = valStr + suf;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cuObserver.unobserve(el);
      });
    }, { threshold: 0.3 });

    countSpans.forEach(function (el) { cuObserver.observe(el); });
  }

  // Observer для word-reveal
  var wordObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('words-visible');
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function (el) { wordObserver.observe(el); });

  // Observer для strikethrough
  var enemySection = document.querySelector('.section-edu-enemy');
  if (enemySection) {
    var strikeObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        enemySection.classList.add('strike-active');
        strikeObserver.disconnect();
      }
    }, { threshold: 0.2 });
    strikeObserver.observe(enemySection);
  }

}());

// =================================================================
// ⏳ БЛОК 7 · СРОЧНОСТЬ — parallax watermark + мини-календарь
// =================================================================
(function () {

  // ── Мини-календарь (следующий месяц) ──
  var monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var now       = new Date();
  var next      = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  var monthStr  = monthNames[next.getMonth()] + ' ' + next.getFullYear();

  var elMonth = document.getElementById('urgency-month');
  var elSlot  = document.getElementById('urgency-slot-month');
  if (elMonth) elMonth.textContent = monthStr;
  if (elSlot)  elSlot.textContent  = monthStr;

  var grid = document.getElementById('urgency-grid');
  if (grid) {
    var daysInMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    var firstDow    = (next.getDay() + 6) % 7; // 0=Пн

    // Заголовки дней
    ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function (d) {
      var s = document.createElement('span');
      s.className = 'urgency__cal-dow';
      s.textContent = d;
      grid.appendChild(s);
    });

    // Пустые ячейки до первого числа
    for (var i = 0; i < firstDow; i++) {
      var empty = document.createElement('span');
      empty.className = 'urgency__cal-day urgency__cal-day--empty';
      grid.appendChild(empty);
    }

    // Свободные слоты: 3 дня в разных неделях
    var freeDays = [8, 15, 22];

    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement('span');
      cell.textContent = d;
      if (freeDays.indexOf(d) !== -1) {
        cell.className = 'urgency__cal-day urgency__cal-day--free';
        cell.setAttribute('title', 'Свободное место');
      } else {
        cell.className = 'urgency__cal-day urgency__cal-day--busy';
        cell.setAttribute('aria-hidden', 'true');
      }
      grid.appendChild(cell);
    }
  }

  // ── Parallax watermark (только десктоп) ──
  var wm      = document.getElementById('urgency-wm');
  var section = document.querySelector('.section-edu-urgency');
  if (!wm || !section || window.matchMedia('(max-width: 768px)').matches) return;

  function onScroll() {
    var rect     = section.getBoundingClientRect();
    var visible  = rect.height + window.innerHeight;
    var progress = (-rect.top) / visible; // 0 → 1
    wm.style.setProperty('--prl', (progress * 90 - 20) + 'px');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

}());

// =================================================================
// 📍 БЛОК 9 · SCROLL-DRAW ЛИНИЯ ТАЙМЛАЙНА ПРОГРАММЫ
// =================================================================
(function () {
  var fill     = document.getElementById('program-line-fill');
  var timeline = document.getElementById('program-timeline');
  if (!fill || !timeline) return;

  function onScroll() {
    var rect     = timeline.getBoundingClientRect();
    var total    = rect.height;
    var scrolled = Math.max(0, -(rect.top) + window.innerHeight * 0.6);
    var pct      = Math.min(scrolled / total * 100, 100);
    fill.style.height = pct + '%';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

// =================================================================
// 🎓 БЛОК 11 · MAGNETIC TILT НА МОКАПЕ СЕРТИФИКАТА
// =================================================================
(function () {
  var wrap = document.getElementById('cert-mockup');
  if (!wrap) return;
  var card = wrap.querySelector('.cert-mockup__card');
  if (!card) return;

  // Отключаем на тач-устройствах
  if (window.matchMedia('(hover: none)').matches) return;

  wrap.addEventListener('mousemove', function (e) {
    var rect  = wrap.getBoundingClientRect();
    var cx    = rect.left + rect.width  / 2;
    var cy    = rect.top  + rect.height / 2;
    var dx    = (e.clientX - cx) / (rect.width  / 2);
    var dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = 'rotateY(' + (-8 + dx * 5) + 'deg) rotateX(' + (4 - dy * 3) + 'deg)';
  });

  wrap.addEventListener('mouseleave', function () {
    card.style.transform = 'rotateY(-8deg) rotateX(4deg)';
  });
}());

// =================================================================
// 🗓 БЛОК 12 · МЕСЯЦ В ИНДИКАТОРЕ + TELEGRAM PRE-FILL
// =================================================================
(function () {
  // Следующий месяц в винительном падеже (на + Accusative)
  var monthAcc = [
    'январь','февраль','март','апрель','май','июнь',
    'июль','август','сентябрь','октябрь','ноябрь','декабрь'
  ];
  var now  = new Date();
  var next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  var el   = document.querySelector('.js-tariff-month');
  if (el) el.textContent = monthAcc[next.getMonth()];

  // Telegram pre-fill: строим href из data-telegram-text
  document.querySelectorAll('[data-telegram-text]').forEach(function (link) {
    var text = link.getAttribute('data-telegram-text');
    link.href = 'https://t.me/a_annett_a?text=' + encodeURIComponent(text);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
}());

// =================================================================
// 🎫 БЛОК 12 · ТАРИФЫ — месяц в индикаторе + magnetic tilt
// =================================================================
(function () {

  // ── Подставляем следующий месяц в индикатор ──
  var monthNames = ['январь','февраль','март','апрель','май','июнь',
                    'июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  var now  = new Date();
  var next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  var slots = document.querySelectorAll('.js-tariff-month');
  slots.forEach(function (el) {
    el.textContent = monthNames[next.getMonth()];
  });

  // ── Magnetic tilt на карточках ──
  if (window.matchMedia('(hover: none)').matches) return;

  var cards = document.querySelectorAll('.tariff-card[data-tilt]');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      var dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      card.style.transform = 'rotateY(' + (dx * 4) + 'deg) rotateX(' + (-dy * 3) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
    });
  });

}());

// =================================================================
// 📖 SCROLL-DIM · Эффект чтения: текстовые блоки гаснут при прокрутке
// =================================================================
(function () {
  // Выбираем крупные текстовые абзацы во всех секциях обучения
  var selectors = [
    '.section-offer p',
    '.section-social-proof p',
    '.section-edu-enemy p',
    '.section-edu-urgency p',
    '.section-edu-story p',
    '.section-edu-program p',
    '.section-edu-contrast p',
    '.section-edu-cert p',
  ].join(', ');

  var paras = [];
  if (document.querySelector('.section-edu-story, .section-edu-program')) {
    // Только если это страница обучения
    paras = Array.from(document.querySelectorAll(selectors));
  }
  if (!paras.length) return;

  // Навешиваем класс sr-para
  paras.forEach(function (p) { p.classList.add('sr-para'); });

  // Порог: нижняя граница абзаца выше 30% экрана → гаснет
  var THRESHOLD = 0.3;
  var ticking = false;

  function update() {
    var limit = window.innerHeight * THRESHOLD;
    paras.forEach(function (p) {
      var bottom = p.getBoundingClientRect().bottom;
      if (bottom < limit) {
        p.classList.add('sr-past');
      } else {
        p.classList.remove('sr-past');
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}());

// =================================================================
// 🧠 ЛОГИКА ГАЙДА И ИИ-АРХИТЕКТОР GEMINI
// МЕСТО ВСТАВКИ: В самый-самый конец файла main.js
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // ЗАЩИТА: Скрипт работает ТОЛЬКО на странице Гайда. 
  // Твоя Главная страница в полной безопасности.
  const pageGuide = document.querySelector('.page-guide');
  if (!pageGuide) return; 

  // --- 1. Прогресс-бар чтения ---
  const progressBar = document.getElementById('reading-progress-bar');
  if (progressBar) {
    const radius = 16; 
    const circumference = radius * 2 * Math.PI;
    
    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    progressBar.style.strokeDashoffset = circumference;
    
    const updateProgress = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const scrollPercentage = Math.min(window.scrollY / scrollTotal, 1);
        progressBar.style.strokeDashoffset = circumference - (scrollPercentage * circumference);
      }
    };
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }

  // --- 2. Подсветка оглавления (TOC) ---
  const chapters = document.querySelectorAll('.guide-chapter');
  const tocLinks = document.querySelectorAll('.guide-toc__link');
  
  if (chapters.length > 0 && tocLinks.length > 0) {
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    
    chapters.forEach(ch => chapterObserver.observe(ch));
  }

  // --- 3. Focus Reading (Растворение текста) ---
  const fadeElements = document.querySelectorAll('.guide-text-block p, .pull-quote, .guide-lead, .guide-author');
  if (fadeElements.length > 0) {
    window.addEventListener('scroll', () => {
      const fadeStart = window.innerHeight * 0.25; 
      const fadeEnd = 50; 
      
      fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < fadeStart) {
          let opacity = Math.max(0, Math.min(1, (rect.top - fadeEnd) / (fadeStart - fadeEnd)));
          el.style.opacity = opacity;
          el.style.transform = `translateY(${ (1 - opacity) * -15 }px)`; 
          el.style.transition = 'none'; 
        } else {
          el.style.opacity = ''; 
          el.style.transform = ''; 
          el.style.transition = ''; 
        }
      });
    });
  }

  // --- 4. Затемнение фона перед Финалом ---
  const finalChapter = document.getElementById('chapter-4');
  if (finalChapter) {
    window.addEventListener('scroll', () => {
      const rect = finalChapter.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.7;
      
      if (rect.top < triggerPoint) {
        document.body.style.backgroundColor = 'var(--accent-soft)';
      } else {
        document.body.style.backgroundColor = 'var(--cream)';
      }
    });
  }

  // --- 5. ИИ-АРХИТЕКТОР (GEMINI API) ---
  const aiBtn = document.getElementById('ai-submit-btn');
  const aiInput = document.getElementById('ai-user-input');
  const aiLoading = document.getElementById('ai-loading');
  const aiResult = document.getElementById('ai-result');

  // ВНИМАНИЕ: Сюда нужно вставить твой ключ от Google Gemini API
  const apiKey = "AIzaSyCSF4XnSP7EGINXDLGBsNEhBniGxNo4M6s";

  async function fetchGeminiRecommendation(userInput) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    const systemPrompt = "Ты — ИИ-ассистент Анны Казак, Lead Frontend Architect и эксперт по 'архитектуре взгляда' (GAZE Architecture). Твоя тональность: Quiet Luxury, экспертность, математическая точность. Никаких клише салонов красоты (розовые градиенты, слово 'нежный'). Твоя задача: на основе описания глаз и бровей пользователя, дать краткую, точную рекомендацию (2-3 абзаца) по форме ресниц и укладке бровей, чтобы открыть взгляд и не перегрузить лицо (избегая эффекта 'дорого-богато'). Используй HTML теги <p> для абзацев.";

    const finalPrompt = `СИСТЕМНЫЕ ИНСТРУКЦИИ:\n${systemPrompt}\n\nОПИСАНИЕ ВНЕШНОСТИ КЛИЕНТА:\n${userInput}`;

    const payload = {
      contents: [{ parts: [{ text: finalPrompt }] }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        // Вытаскиваем детальную ошибку от Google
        const errorData = await response.json();
        console.error("Детальная ошибка от Google:", errorData);
        throw new Error(errorData.error?.message || `Ошибка сервера: ${response.status}`);
      }
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Пустой ответ от ИИ.";
    } catch (error) {
      console.error("Fetch failed:", error);
      throw error;
    }
  }

  if (aiBtn && aiInput) {
    aiBtn.addEventListener('click', async () => {
      const text = aiInput.value.trim();
      if (!text) return;

      aiBtn.disabled = true;
      aiBtn.style.display = 'none';
      aiLoading.style.display = 'block';
      aiResult.style.display = 'none';

      try {
        const recommendation = await fetchGeminiRecommendation(text);
        aiResult.innerHTML = recommendation;
        aiResult.style.display = 'block';
      } catch (error) {
        // Теперь мы увидим реальную причину прямо на сайте
        aiResult.innerHTML = `<p class="ai-error-title">Ошибка API:</p><p>${error.message}</p><p class="ai-error-note">(Если вы в РФ/РБ, убедитесь, что включен VPN)</p>`;
        aiResult.style.display = 'block';
        aiBtn.style.display = 'inline-block';
        aiBtn.disabled = false;
      } finally {
        aiLoading.style.display = 'none';
      }
    });
  }

  if (aiBtn && aiInput) {
    aiBtn.addEventListener('click', async () => {
      const text = aiInput.value.trim();
      if (!text) return;

      aiBtn.disabled = true;
      aiBtn.style.display = 'none';
      aiLoading.style.display = 'block';
      aiResult.style.display = 'none';

      try {
        const recommendation = await fetchGeminiRecommendation(text);
        aiResult.innerHTML = recommendation;
        aiResult.style.display = 'block';
      } catch (error) {
        aiResult.innerHTML = "<p>Произошла ошибка при соединении с сервером. Пожалуйста, проверьте наличие API-ключа и попробуйте еще раз.</p>";
        aiResult.style.display = 'block';
        aiBtn.style.display = 'inline-block';
        aiBtn.disabled = false;
      } finally {
        aiLoading.style.display = 'none';
      }
    });
  }
});








/* ======================================================================== */
/* 📁 ФАЙЛ: js/main.js                                                      */
/* НАЧАЛО: ПОЛНАЯ ЛОГИКА СТРАНИЦЫ СЕРТИФИКАТОВ                              */
/* ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // 1. ЛОГИКА CANVAS HERO (Искры)
  const giftCanvas = document.getElementById('gift-canvas');
  if (giftCanvas) {
    const ctx = giftCanvas.getContext('2d');
    let width, height, particles = [];
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    let mouse = { x: -1000, y: -1000 };
    
    const resize = () => { width = giftCanvas.width = giftCanvas.offsetWidth; height = giftCanvas.height = giftCanvas.offsetHeight; };
    window.addEventListener('resize', resize); resize();
    if (isDesktop) window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    
    for (let i = 0; i < (isDesktop ? 35 : 15); i++) {
      particles.push({ x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 2.5 + 0.5, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() * -0.4) - 0.1, alpha: Math.random() * 0.5 + 0.1, baseX: Math.random() * width });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.x += (p.baseX - p.x) * 0.001;
        if (isDesktop) { const dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.sqrt(dx*dx + dy*dy); if (dist < 120) { p.x -= (dx/dist)*0.8; p.y -= (dy/dist)*0.8; } }
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; p.baseX = p.x; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(224, 199, 192, ${p.alpha})`; ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
    setTimeout(() => giftCanvas.style.opacity = '1', 400);
  }

  // 2. ЛОГИКА КОНСТРУКТОРА СЕРТИФИКАТА
  const state = { target: 'Подруги', sum: '3 000', name: '' };

  const tabs = document.querySelectorAll('.builder-tab');
  const cards = document.querySelectorAll('.builder-card');
  const customSumInput = document.getElementById('b-custom-sum');
  const nameInput = document.getElementById('b-name');
  const phraseEl = document.getElementById('b-phrase');
  const tgMsgEl = document.getElementById('b-tg-msg');
  const ctaBtn = document.getElementById('b-cta');
  const certSumWrap = document.getElementById('cert-sum-wrap');
  const certNameEl = document.getElementById('cert-name');
  const liveCert = document.getElementById('live-cert');

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const wraps = document.querySelectorAll('.reason-card-wrap, .gift-cta-wrap, .preview-sticky');
    wraps.forEach(wrap => {
      const card = wrap.querySelector('.reason-card, .gift-cta-card, .live-cert');
      if(!card) return;
      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; 
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      wrap.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
      if (typeof window.updateCursorHover === 'function') {
        window.updateCursorHover();
      }
    });
  }

  const updateUI = () => {
    const targetText = state.name ? state.name : state.target;
    const msg = `«Хочу подарить сертификат на ${state.sum} ₽ для ${targetText}.»`;
    if (tgMsgEl) tgMsgEl.innerText = msg;
    if (ctaBtn) ctaBtn.href = `https://t.me/a_annett_a?text=${encodeURIComponent(msg.replace(/[«»]/g, ''))}`;
  };

  const updateCertSum = (newVal) => {
    if(!certSumWrap) return;
    const formatted = `${newVal} ₽`;
    const currentElements = certSumWrap.querySelectorAll('.live-cert__val-sum');
    
    if (currentElements.length > 0 && currentElements[currentElements.length - 1].innerText === formatted) return;

    currentElements.forEach(el => {
      el.style.transform = 'translateY(-15px)';
      el.style.opacity = '0';
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 400); 
    });

    const newEl = document.createElement('span');
    newEl.className = 'live-cert__val-sum is-entering';
    newEl.innerText = formatted;
    certSumWrap.appendChild(newEl);
    void newEl.offsetWidth;
    newEl.classList.remove('is-entering');
  };

  if(tabs) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const val = tab.dataset.val;
        const declensions = { 'Подруге': 'Подруги', 'Маме': 'Мамы', 'Себе': 'Себя', 'Коллеге': 'Коллеги' };
        state.target = declensions[val] || val;
        updateUI();
      });
    });
  }

  if(cards) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if(customSumInput) customSumInput.value = '';
        cards.forEach(c => { c.classList.remove('is-active'); c.classList.add('is-dimmed'); });
        card.classList.remove('is-dimmed'); card.classList.add('is-active');
        
        const sum = card.dataset.sum;
        const formattedSum = sum.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        state.sum = formattedSum;
        
        if(phraseEl) {
          phraseEl.style.opacity = '0';
          setTimeout(() => { phraseEl.innerText = card.dataset.msg; phraseEl.style.opacity = '1'; }, 300);
        }
        updateCertSum(formattedSum);
        updateUI();
      });
    });
  }

  if(customSumInput) {
    customSumInput.addEventListener('input', (e) => {
      let rawValue = e.target.value.replace(/\D/g, ''); 
      if (rawValue.length > 6) rawValue = rawValue.slice(0, 6); 

      if (rawValue) {
        const formattedSum = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        e.target.value = formattedSum;

        cards.forEach(c => { c.classList.remove('is-active'); c.classList.add('is-dimmed'); });
        state.sum = formattedSum;
        
        if(phraseEl) {
          phraseEl.style.opacity = '0';
          setTimeout(() => { phraseEl.innerText = "Индивидуальный подход — как и сам метод ✨"; phraseEl.style.opacity = '1'; }, 300);
        }
        updateCertSum(formattedSum);
      } else {
        e.target.value = '';
        if(cards[1]) cards[1].click(); 
      }
      updateUI();
    });

    customSumInput.addEventListener('blur', (e) => {
      let rawValue = e.target.value.replace(/\D/g, '');
      if (rawValue && parseInt(rawValue) < 1000) {
        e.target.value = "1 000";
        state.sum = "1 000";
        updateCertSum("1 000");
        updateUI();
      }
    });
  }

  if(nameInput && liveCert) {
    nameInput.addEventListener('focus', () => liveCert.classList.add('is-typing'));
    nameInput.addEventListener('blur', () => { if (!nameInput.value) liveCert.classList.remove('is-typing'); });
    nameInput.addEventListener('input', (e) => {
      state.name = e.target.value;
      if(certNameEl) certNameEl.innerText = state.name;
      updateUI();
    });
  }

  // 3. Scroll-draw линия
  const stepsFill = document.getElementById('steps-fill');
  if (stepsFill) {
    const updateLine = () => {
      const timeline = document.querySelector('.steps-timeline');
      if(!timeline) return;
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.6) {
        let progress = ((windowHeight * 0.6) - rect.top) / (rect.height * 0.8);
        progress = Math.max(0, Math.min(1, progress));
        stepsFill.style.height = `${progress * 100}%`;
      } else {
        stepsFill.style.height = '0%';
      }
    };
    window.addEventListener('scroll', updateLine);
    updateLine();
  }

});

/* ======================================================================== */
/* КОНЕЦ: ЛОГИКА СТРАНИЦЫ СЕРТИФИКАТОВ                                      */
/* ======================================================================== */









/* ================================================================= */
/* НАЧАЛО: СТРАНИЦА БЛОГА INDEX (ЛОГИКА)                             */
/* ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Эффект печатной машинки (Hero)
  const typingText = document.getElementById('typing-text');
  if (typingText) {
    const word = "знаний.";
    let i = 0;
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        typingText.textContent += word.charAt(i);
        i++;
        if (i >= word.length) { clearInterval(typeInterval); }
      }, 120); 
    }, 800);
  }

  // 2. Логика фильтрации табов и кнопки "Показать еще"
  const tabs = document.querySelectorAll('.blog-tab');
  const grid = document.getElementById('blog-grid');
  const cards = document.querySelectorAll('.blog-card');
  const btnLoadMore = document.getElementById('btn-load-more');
  const loadMoreContainer = document.getElementById('blog-load-more-container');
  const hiddenItems = document.querySelectorAll('.js-load-more-item');
  
  if (grid && tabs.length > 0) {
    let isAllLoaded = false;

    // Кнопка Load More
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', () => {
        isAllLoaded = true;
        const activeTab = document.querySelector('.blog-tab.is-active');
        const currentFilter = activeTab ? activeTab.dataset.filter : 'all';
        
        hiddenItems.forEach(item => {
          item.classList.remove('js-load-more-item');
          if (currentFilter === 'all' || item.dataset.category === currentFilter) {
            item.classList.remove('is-hidden');
            item.classList.add('fade-in', 'visible'); 
          }
        });
        loadMoreContainer.classList.add('is-hidden');
      });
    }

    // Табы
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const filter = tab.dataset.filter;
        grid.classList.add('is-filtering');
        
        setTimeout(() => {
          let firstVisibleFound = false;
          
          cards.forEach(card => {
            const isWaitingLoad = !isAllLoaded && card.classList.contains('js-load-more-item');
            if (isWaitingLoad) {
              card.classList.add('is-hidden');
              return;
            }

            if (filter === 'all' || card.dataset.category === filter || (filter === 'all' && card.dataset.category === 'guide')) {
              card.classList.remove('is-hidden');
              
              if (!firstVisibleFound) {
                card.classList.add('is-featured');
                firstVisibleFound = true;
              } else {
                card.classList.remove('is-featured');
              }
            } else {
              card.classList.add('is-hidden');
              card.classList.remove('is-featured');
            }
          });

          if (filter !== 'all') {
            loadMoreContainer.style.display = 'none';
          } else if (!isAllLoaded) {
            loadMoreContainer.style.display = 'block';
          }

          grid.classList.remove('is-filtering');
        }, 400); 
      });
    });
  }

  // 3. 3D Hover эффект для CTA-карточки (магнетизм)
  const ctaWrapper = document.querySelector('.blog-cta-wrapper');
  const ctaCard = document.querySelector('.blog-cta-card');
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover && ctaWrapper && ctaCard) {
    ctaWrapper.addEventListener('mousemove', (e) => {
      const rect = ctaCard.getBoundingClientRect();
      if(rect.width === 0 || rect.height === 0) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctaCard.style.setProperty('--mouse-x', `${x}px`);
      ctaCard.style.setProperty('--mouse-y', `${y}px`);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -3; 
      const rotateY = ((x - centerX) / centerX) * 3;
      
      ctaCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    ctaWrapper.addEventListener('mouseleave', () => {
      ctaCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }
});
/* ================================================================= */
/* КОНЕЦ: СТРАНИЦА БЛОГА INDEX (ЛОГИКА)                              */
/* ================================================================= */


/* ================================================================= */
/* НАЧАЛО: ЛОГИКА ШАБЛОНА СТАТЬИ (ARTICLE.HTML)                      */
/* ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ЗАЩИТА: Скрипт работает ТОЛЬКО на странице статьи
  const pageArticle = document.querySelector('.page-article');
  if (!pageArticle) return;

  // --- 1. Прогресс-бар чтения (переиспользуем из гайда) ---
  const progressBar = document.getElementById('reading-progress-bar');
  if (progressBar) {
    const radius = 16;
    const circumference = radius * 2 * Math.PI;
    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    progressBar.style.strokeDashoffset = circumference;

    const updateProgress = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const pct = Math.min(window.scrollY / scrollTotal, 1);
        progressBar.style.strokeDashoffset = circumference - pct * circumference;
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- 2. Подсветка оглавления (TOC) ---
  const articleSections = document.querySelectorAll('[data-article-section]');
  const tocLinks = document.querySelectorAll('.article-toc__link');
  const articleBookingBtn = document.getElementById('article-booking-btn');

  if (articleBookingBtn) {
    const articleTitle = document.querySelector('.article-hero__title')?.innerText.replace(/\s+/g, ' ').trim() || 'статью на сайте';
    const bookingMessage = encodeURIComponent(
      `Привет, Аня! Я прочитала статью «${articleTitle}» на сайте GAZE.ARCH.\n\nХочу записаться к тебе и подобрать подходящую услугу под мои глаза. Подскажи, пожалуйста, с чего лучше начать и когда у тебя есть ближайшее окно?`
    );
    articleBookingBtn.href = `https://t.me/a_annett_a?text=${bookingMessage}`;
  }

  if (articleSections.length > 0 && tocLinks.length > 0) {
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    articleSections.forEach(s => tocObserver.observe(s));
  }

  // --- 3. Focus Reading (Растворение текста при скролле — как в гайде) ---
  const articleFadeElements = document.querySelectorAll('.article-content p, .pull-quote, .article-lead');
  if (articleFadeElements.length > 0) {
    window.addEventListener('scroll', () => {
      const fadeStart = window.innerHeight * 0.25;
      const fadeEnd = 50;

      articleFadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < fadeStart) {
          let opacity = Math.max(0, Math.min(1, (rect.top - fadeEnd) / (fadeStart - fadeEnd)));
          el.style.opacity = opacity;
          el.style.transform = `translateY(${(1 - opacity) * -15}px)`;
          el.style.transition = 'none';
        } else {
          el.style.opacity = '';
          el.style.transform = '';
          el.style.transition = '';
        }
      });
    }, { passive: true });
  }

  // --- 4. Анимации появления ---
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  pageArticle.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // --- 5. Анимация SVG-диаграмм (blueprint-box) ---
  const blueprintObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        blueprintObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.guide-blueprint-box').forEach(el => blueprintObserver.observe(el));

  // --- 6. Анимация разделителей (guide-divider) ---
  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        dividerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.guide-divider').forEach(el => dividerObserver.observe(el));

  // --- 7. Обновляем курсор для новых элементов ---
  if (typeof window.updateCursorHover === 'function') {
    window.updateCursorHover();
  }
});

/* ================================================================= */
/* КОНЕЦ: ЛОГИКА ШАБЛОНА СТАТЬИ (ARTICLE.HTML)                       */
/* ================================================================= */


/* ================================================================= */
/* ПОРТФОЛИО — БЛОК 1: ФИЛЬТР-ТАБЫ                                   */
/* ================================================================= */
{
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');

  if (portfolioTabs.length > 0) {

    portfolioTabs.forEach(tab => {
      tab.addEventListener('click', function () {

        // Сбрасываем все табы
        portfolioTabs.forEach(t => {
          t.classList.remove('portfolio-tab--active');
          t.setAttribute('aria-selected', 'false');
        });

        // Активируем выбранный
        this.classList.add('portfolio-tab--active');
        this.setAttribute('aria-selected', 'true');

        const filter = this.dataset.filter;
        const cells = document.querySelectorAll('.portfolio-cell');

        // Фильтруем ячейки Bento-сетки (Блок 2)
        cells.forEach((cell, i) => {
          const match = filter === 'all' || cell.dataset.category === filter;
          // Staggered задержка только для появляющихся элементов
          cell.style.transitionDelay = match ? `${i * 0.04}s` : '0s';
          cell.classList.toggle('portfolio-cell--hidden', !match);
        });

        // Обновляем курсор для новых элементов
        if (typeof window.updateCursorHover === 'function') {
          window.updateCursorHover();
        }
      });
    });
  }
}
/* ================================================================= */
/* КОНЕЦ: ПОРТФОЛИО БЛОК 1                                           */
/* ================================================================= */


/* ================================================================= */
/* ПОРТФОЛИО — БЛОК 2: BENTO-СЕТКА + КУРСОР-ЛУПА                    */
/* ================================================================= */
{
  const portfolioCells = document.querySelectorAll('.portfolio-cell');
  const cursor = document.getElementById('gaze-cursor');
  const isDesktop = window.matchMedia('(min-width: 769px)').matches;

  if (portfolioCells.length > 0) {

    // ── Курсор-лупа на ячейках ────────────────────────────────────
    if (isDesktop && cursor) {
      portfolioCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
          cursor.classList.remove('gaze-cursor--hover');
          cursor.classList.add('gaze-cursor--loupe');
        });
        cell.addEventListener('mouseleave', () => {
          cursor.classList.remove('gaze-cursor--loupe');
        });
      });
    }

    // ── FLIP-фильтрация по табам ───────────────────────────────────
    // Переопределяем фильтрацию из Блока 1, добавляем FLIP-анимацию
    const tabs = document.querySelectorAll('.portfolio-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => {
          t.classList.remove('portfolio-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('portfolio-tab--active');
        this.setAttribute('aria-selected', 'true');

        const filter = this.dataset.filter;

        // Записываем before-позиции (FLIP: First)
        const rects = new Map();
        portfolioCells.forEach(cell => {
          rects.set(cell, cell.getBoundingClientRect());
        });

        // Применяем фильтр (FLIP: Last)
        portfolioCells.forEach((cell, i) => {
          const match = filter === 'all' || cell.dataset.category === filter;
          cell.classList.toggle('portfolio-cell--hidden', !match);
        });

        // Анимируем stagger-появление видимых ячеек
        const visible = [...portfolioCells].filter(c => !c.classList.contains('portfolio-cell--hidden'));
        visible.forEach((cell, i) => {
          cell.style.transitionDelay = `${i * 0.035}s`;
          // Сброс через 600ms чтобы не блокировать последующие ховеры
          setTimeout(() => { cell.style.transitionDelay = ''; }, 600 + i * 35);
        });

        if (typeof window.updateCursorHover === 'function') {
          window.updateCursorHover();
        }
      });
    });

    // ── IntersectionObserver fade-in для ячеек ─────────────────────
    const cellObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cellObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    portfolioCells.forEach(cell => cellObserver.observe(cell));
  }
}
/* ================================================================= */
/* КОНЕЦ: ПОРТФОЛИО БЛОК 2                                           */
/* ================================================================= */


/* ================================================================= */
/* ПОРТФОЛИО — LIGHTBOX (увеличение по клику)                        */
/* ================================================================= */
{
  const lightbox     = document.getElementById('portfolio-lightbox');
  const lbCard       = document.getElementById('portfolio-lightbox-card');
  const lbCat        = document.getElementById('lightbox-cat');
  const lbTitle      = document.getElementById('lightbox-title');
  const lbDesc       = document.getElementById('lightbox-desc');
  const lbCta        = document.getElementById('lightbox-cta');
  const lbInfo       = document.querySelector('.portfolio-lightbox__info');
  const lbPlaceholder = document.getElementById('lightbox-placeholder');
  const lbClose      = document.getElementById('lightbox-close');
  const portfolioMain = document.getElementById('portfolio-main');
  const modalCursor  = document.getElementById('gaze-cursor');
  const modalCursorHome = modalCursor ? modalCursor.parentElement : null;

  if (lightbox && lbCard) {

    const mountCursorIntoModal = () => {
      if (!modalCursor || modalCursor.parentElement === lightbox) return;
      modalCursor.classList.remove('gaze-cursor--loupe', 'gaze-cursor--hover', 'gaze-cursor--light');
      lightbox.appendChild(modalCursor);
    };

    const restoreCursorHome = () => {
      if (!modalCursor || !modalCursorHome || modalCursor.parentElement === modalCursorHome) return;
      modalCursor.classList.remove('gaze-cursor--loupe');
      modalCursorHome.appendChild(modalCursor);
    };

    const showDialog = () => {
      if (typeof lightbox.showModal === 'function') {
        if (!lightbox.open) lightbox.showModal();
      } else {
        lightbox.setAttribute('open', 'open');
      }
      mountCursorIntoModal();
      requestAnimationFrame(() => lightbox.classList.add('is-open'));
    };

    const hideDialog = () => {
      lightbox.classList.remove('is-open');
      window.setTimeout(() => {
        if (typeof lightbox.close === 'function' && lightbox.open) {
          lightbox.close();
        } else {
          lightbox.removeAttribute('open');
        }
        restoreCursorHome();
      }, 220);
    };

    // Открываем лайтбокс
    window.openPortfolioModal = (dataset) => {
      if (!lightbox) return;

      // Заполняем данными из data-атрибутов ячейки
      if (lbCat)   lbCat.textContent   = dataset.service   || '';
      if (lbTitle) lbTitle.textContent = dataset.title     || '';
      if (lbDesc)  lbDesc.textContent  = dataset.desc      || '';

      if (lbCta) {
        const msg = encodeURIComponent(
          `Привет, Аня! Я посмотрела в портфолио работу «${dataset.title || 'без названия'}» (${dataset.service || 'услуга'}).\n\n` +
          `Очень откликается этот результат: «${dataset.desc || 'хочу похожий эффект'}».\n\n` +
          `Хочу так же, но с учетом моей анатомии. Подскажи, пожалуйста, с чего лучше начать и какие есть ближайшие окна?`
        );
        lbCta.href = `https://t.me/a_annett_a?text=${msg}`;
      }

      // Перекрашиваем placeholder в тот же градиент, что и исходная ячейка
      if (lbPlaceholder) {
        const idx = parseInt(dataset.index || '1');
        const hues = [0, 20, 340, 60, 10, 330, 40, 0, 20, 350, 30, 60];
        const h = hues[(idx - 1) % hues.length];
        lbPlaceholder.style.background =
          `linear-gradient(135deg, hsl(${h+10}, 22%, 88%), hsl(${h}, 18%, 78%))`;
      }

      showDialog();
      if (portfolioMain) portfolioMain.classList.add('lightbox-active');

      // Каждый раз открываем модалку с верхней позиции, чтобы не было кривого старта.
      if (lbInfo) lbInfo.scrollTop = 0;

      // Фокус для доступности
      setTimeout(() => lbClose && lbClose.focus(), 100);
    };

    // Закрываем лайтбокс
    const closeModal = () => {
      if (portfolioMain) portfolioMain.classList.remove('lightbox-active');
      hideDialog();
    };

    if (lbClose) lbClose.addEventListener('click', closeModal);

    // Клик по оверлею (вне карточки)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeModal();
    });

    lightbox.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });

    // Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (lightbox.open || lightbox.classList.contains('is-open'))) closeModal();
    });

    // Подключаем openModal к каждой ячейке (перекрываем старую пустышку)
    document.querySelectorAll('.portfolio-cell').forEach(cell => {
      cell.addEventListener('click', () => window.openPortfolioModal(cell.dataset));
      cell.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openPortfolioModal(cell.dataset);
        }
      });
    });
  }
}
/* ================================================================= */
/* КОНЕЦ: ПОРТФОЛИО LIGHTBOX                                         */
/* ================================================================= */

/* ================================================================= */
/* ПОРТФОЛИО — БЛОК 3: ДО / ПОСЛЕ                                    */
/* ================================================================= */
{
  const sliders = document.querySelectorAll('[data-ba-slider]');

  if (sliders.length > 0) {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const setSplit = (slider, nextValue) => {
      const value = clamp(nextValue, 6, 94);
      slider.style.setProperty('--split', value.toFixed(2));

      const handle = slider.querySelector('.portfolio-ba-handle');
      if (handle) {
        handle.setAttribute('aria-valuenow', String(Math.round(value)));
      }
    };

    const setFromClientX = (slider, clientX) => {
      const rect = slider.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setSplit(slider, percent);
    };

    sliders.forEach((slider, index) => {
      const handle = slider.querySelector('.portfolio-ba-handle');
      if (!handle) return;

      let isDragging = false;

      const onPointerMove = (event) => {
        if (!isDragging) return;
        setFromClientX(slider, event.clientX);
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        slider.classList.remove('is-dragging');
      };

      const startDrag = (event) => {
        isDragging = true;
        slider.classList.add('is-dragging');
        setFromClientX(slider, event.clientX);
      };

      slider.addEventListener('pointerdown', startDrag);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      handle.addEventListener('keydown', (event) => {
        const current = Number(slider.style.getPropertyValue('--split')) || 50;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setSplit(slider, current - 2);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          setSplit(slider, current + 2);
        }
      });

      const runDemo = () => {
        if (slider.dataset.demoDone === 'true') return;
        slider.dataset.demoDone = 'true';

        const delay = index * 220;
        window.setTimeout(() => {
          setSplit(slider, 32);
          window.setTimeout(() => setSplit(slider, 72), 520);
          window.setTimeout(() => setSplit(slider, 50), 1040);
        }, delay);
      };

      const demoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runDemo();
            demoObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.38 });

      demoObserver.observe(slider);
      setSplit(slider, 50);
    });
  }
}
/* ================================================================= */
/* КОНЕЦ: ПОРТФОЛИО БЛОК 3                                           */
/* ================================================================= */

/* ================================================================= */
/* ПОРТФОЛИО — БЛОК 5: CTA                                           */
/* ================================================================= */
{
  const miniTrack = document.getElementById('portfolio-mini-track');
  const quizBtnPortfolio = document.getElementById('btn-quiz-open-portfolio');
  const quizOverlay = document.getElementById('quiz-overlay');
  const tgBtnPortfolio = document.querySelector('.portfolio-cta__tg');

  if (miniTrack && miniTrack.dataset.looped !== 'true') {
    miniTrack.innerHTML = miniTrack.innerHTML + miniTrack.innerHTML;
    miniTrack.dataset.looped = 'true';
  }

  if (quizBtnPortfolio && quizOverlay) {
    quizBtnPortfolio.addEventListener('click', () => {
      quizOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('hero-focus-active');
    });
  }

  if (tgBtnPortfolio) {
    const msg = encodeURIComponent(
      'Привет, Аня! Я посмотрела портфолио GAZE.ARCH.\\n\\n' +
      'Очень откликается подход и натуральный результат. Хочу подобрать форму именно под мою анатомию лица.\\n\\n' +
      'Подскажи, пожалуйста, с чего лучше начать и какие есть ближайшие окна?'
    );
    tgBtnPortfolio.href = `https://t.me/a_annett_a?text=${msg}`;
  }
}
/* ================================================================= */
/* КОНЕЦ: ПОРТФОЛИО БЛОК 5                                           */
/* ================================================================= */

/* ================================================================= */
/* БЛОК 13 · BENTO UNBOXING                                          */
/* ================================================================= */
(function () {
  var cards = document.querySelectorAll('[data-unbox]');
  if (!cards.length) return;

  var unboxObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var card = entry.target;
        var delay = parseFloat(card.getAttribute('data-unbox-delay') || 0);
        setTimeout(function () {
          card.classList.add('unboxed');
        }, delay);
        unboxObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function (card, i) {
    card.setAttribute('data-unbox-delay', i * 80);
    card.style.transition =
      'opacity 0.55s var(--ease-out), transform 0.55s var(--ease-out), box-shadow 0.35s var(--ease-out)';
    unboxObserver.observe(card);
  });
}());
/* ================================================================= */
/* КОНЕЦ: БЛОК 13 · BENTO UNBOXING                                   */
/* ================================================================= */

/* ================================================================= */
/* БЛОК 14 · FAQ АККОРДЕОН                                           */
/* ================================================================= */
(function () {
  var items = document.querySelectorAll('.edu-faq__item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.edu-faq__q');
    var answer = item.querySelector('.edu-faq__a');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Закрываем все
      items.forEach(function (other) {
        var otherBtn = other.querySelector('.edu-faq__q');
        var otherAns = other.querySelector('.edu-faq__a');
        if (otherBtn && otherAns) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.classList.remove('open');
        }
      });

      // Открываем текущий, если был закрыт
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}());
/* ================================================================= */
/* КОНЕЦ: БЛОК 14 · FAQ АККОРДЕОН                                    */
/* ================================================================= */








