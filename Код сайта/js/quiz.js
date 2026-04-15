/**
 * GAZE.ARCH — КВИЗ-ИНЖЕКТОР
 * Вставляет HTML квиза в <body> на любой странице, если его ещё нет.
 * Логика квиза живёт в main.js.
 */
(function () {
  if (document.getElementById('quiz-overlay')) return; // гард: уже есть в DOM

  const quizHTML = `
<div class="quiz-overlay" id="quiz-overlay">
  <div class="quiz-overlay__close" id="quiz-close" data-hoverable aria-label="Закрыть">×</div>

  <div class="quiz-card conceptual-card">
    <div class="quiz-progress">
      <div class="quiz-progress__bar" id="quiz-progress-bar">
        <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
      </div>
      <div class="quiz-progress__text text-mono" id="quiz-step-counter">ШАГ 1 ИЗ 5</div>
    </div>

    <div class="quiz-steps" id="quiz-steps-container">

      <div class="quiz-step active" data-step="1">
        <h3 class="quiz-step__question">Как бы ты описала форму своего лица?</h3>
        <div class="quiz-options">
          <button class="quiz-option" data-value="oval">Овальная <small>Плавные линии, гармоничные пропорции</small></button>
          <button class="quiz-option" data-value="round">Круглая <small>Мягкие черты, ширина почти равна длине</small></button>
          <button class="quiz-option" data-value="square">Квадратная / Прямоугольная <small>Выразительная линия челюсти</small></button>
          <button class="quiz-option" data-value="triangle">Треугольная / Сердечком <small>Широкий лоб, узкий подбородок</small></button>
        </div>
      </div>

      <div class="quiz-step" data-step="2">
        <h3 class="quiz-step__question">Какая у тебя посадка глаз?</h3>
        <div class="quiz-options">
          <button class="quiz-option" data-value="classic">Классическая миндалевидная <small>Сбалансированная форма, открытый взгляд</small></button>
          <button class="quiz-option" data-value="deep">Глубоко посаженные глаза <small>Хочется визуально добавить больше открытости</small></button>
          <button class="quiz-option" data-value="hooded">Нависшее веко <small>Требуется архитектурный эффект лифтинга</small></button>
          <button class="quiz-option" data-value="droopy">Опущенные внешние уголки <small>Хочется визуально приподнять линию взгляда</small></button>
        </div>
      </div>

      <div class="quiz-step" data-step="3">
        <h3 class="quiz-step__question">Какое состояние твоих родных бровей?</h3>
        <div class="quiz-options">
          <button class="quiz-option" data-value="bushy">Густые и непослушные <small>Нужна строгая долговременная укладка</small></button>
          <button class="quiz-option" data-value="normal">Нормальные <small>Не хватает только четкой формы и архитектуры</small></button>
          <button class="quiz-option" data-value="thin">Тонкие / перещипанные <small>Нужно визуально восстановить объем</small></button>
          <button class="quiz-option" data-value="light">Светлые или с пробелами <small>Необходим плотный цвет и четкий контур</small></button>
        </div>
      </div>

      <div class="quiz-step" data-step="4">
        <h3 class="quiz-step__question">Какой акцент на ресницах добавим в твой образ?</h3>
        <div class="quiz-options">
          <button class="quiz-option" data-value="natural">Натуральный <small>Классика или 1.5D: эффект «свои, только лучше»</small></button>
          <button class="quiz-option" data-value="volume">Эффект туши (Объём) <small>Техника 2D / 2.5D: более плотный цвет и густота</small></button>
          <button class="quiz-option" data-value="special">Трендовые спецэффекты <small>Лучики или мокрый эффект из прайса</small></button>
          <button class="quiz-option" data-value="lami">Только уход (Lami) <small>Здоровье, блеск и изгиб без наращивания</small></button>
        </div>
      </div>

      <div class="quiz-step" data-step="5" id="quiz-final">
        <div class="quiz-final__content">
          <div class="hero-badge hero-badge--compact">Я вижу твою геометрию ✨</div>
          <h3 id="result-title" class="quiz-final__title">Анализ завершен</h3>

          <div class="quiz-result-box">
            <p id="result-desc">Подбираем идеальное сочетание для твоего типа...</p>
          </div>

          <p class="quiz-final__note">
            Я уже сохранила твой тип. Нажми кнопку ниже — откроется чат со мной,
            где <strong>уже будет написан твой результат</strong>. Просто нажми «Отправить»!
          </p>

          <a href="https://t.me/a_annett_a" id="quiz-tg-btn" target="_blank"
             class="btn-primary btn-full" data-hoverable>Написать Ане в Telegram</a>
        </div>
      </div>

    </div>

    <div class="quiz-scan-line" id="quiz-scan"></div>
  </div>
</div>`;

  document.body.insertAdjacentHTML('beforeend', quizHTML);
}());
