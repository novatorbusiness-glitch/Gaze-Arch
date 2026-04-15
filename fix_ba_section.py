import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

clean_section = """<section class="section-portfolio-before-after" id="portfolio-before-after">
      <div class="container">

        <div class="portfolio-before-after__head">
          <h2 class="portfolio-before-after__title fade-in">Разница, которую видно без фильтров</h2>
          <p class="portfolio-before-after__sub fade-in stagger-1">Проведи ползунком. Все фото при естественном свете, без ретуши.</p>
        </div>

        <div class="portfolio-before-after__list">

          <article class="portfolio-ba-card conceptual-card fade-in stagger-1">
            <div class="portfolio-ba-viewport" data-ba-slider style="--split: 50;">
              <div class="portfolio-ba-layer portfolio-ba-layer--before">
                <img src="../../assets/images/До:после/До_1.png" alt="До" class="portfolio-ba-image" style="transform: scale(2.4) rotate(16deg) translate(-3%, 12%); transform-origin: center center;">
                <span class="portfolio-ba-label text-mono">ДО</span>
              </div>

              <div class="portfolio-ba-layer portfolio-ba-layer--after" aria-hidden="true">
                <img src="../../assets/images/До:после/После_1.png" alt="После" class="portfolio-ba-image" style="transform: scale(2.2) translate(-9%, 8%); transform-origin: center center;">
                <span class="portfolio-ba-label text-mono">ПОСЛЕ</span>
              </div>

              <button class="portfolio-ba-handle" type="button" aria-label="Сравнить до и после" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></button>
            </div>

            <h3 class="portfolio-ba-card__title">Архитектура + ламинирование бровей</h3>
            <p class="portfolio-ba-card__note"><em>Асимметрия, разнонаправленный рост. Геометрия с нуля, укладка ламинированием. 4 недели.</em></p>
          </article>

          <article class="portfolio-ba-card conceptual-card fade-in stagger-2">
            <div class="portfolio-ba-viewport" data-ba-slider style="--split: 50;">
              <div class="portfolio-ba-layer portfolio-ba-layer--before">
                <div class="portfolio-ba-blueprint portfolio-ba-blueprint--before"></div>
                <span class="portfolio-ba-label text-mono">ДО</span>
              </div>

              <div class="portfolio-ba-layer portfolio-ba-layer--after" aria-hidden="true">
                <div class="portfolio-ba-blueprint portfolio-ba-blueprint--after"></div>
                <span class="portfolio-ba-label text-mono">ПОСЛЕ</span>
              </div>

              <button class="portfolio-ba-handle" type="button" aria-label="Сравнить до и после" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></button>
            </div>

            <h3 class="portfolio-ba-card__title">Заготовка под 2 карточку</h3>
            <p class="portfolio-ba-card__note"><em>Скоро здесь появится новая работа...</em></p>
          </article>

          <article class="portfolio-ba-card conceptual-card fade-in stagger-3">
            <div class="portfolio-ba-viewport" data-ba-slider style="--split: 50;">
              <div class="portfolio-ba-layer portfolio-ba-layer--before">
                <div class="portfolio-ba-blueprint portfolio-ba-blueprint--before"></div>
                <span class="portfolio-ba-label text-mono">ДО</span>
              </div>

              <div class="portfolio-ba-layer portfolio-ba-layer--after" aria-hidden="true">
                <div class="portfolio-ba-blueprint portfolio-ba-blueprint--after"></div>
                <span class="portfolio-ba-label text-mono">ПОСЛЕ</span>
              </div>

              <button class="portfolio-ba-handle" type="button" aria-label="Сравнить до и после" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></button>
            </div>

            <h3 class="portfolio-ba-card__title">Заготовка под 3 карточку</h3>
            <p class="portfolio-ba-card__note"><em>Скоро здесь появится новая работа...</em></p>
          </article>

        </div>
      </div>
    </section>"""

# Using robust regex replacement
html = re.sub(r'<section class="section-portfolio-before-after" id="portfolio-before-after">.*?</section>', clean_section, html, flags=re.DOTALL, count=1)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)
