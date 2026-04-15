import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Reconstruct the original 3 cards, putting the images in the second one
new_block = """<div class="portfolio-before-after__list">

          <article class="portfolio-ba-card conceptual-card fade-in stagger-1">
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

            <h3 class="portfolio-ba-card__title">Классическое наращивание 1.5D</h3>
            <p class="portfolio-ba-card__note"><em>Падающая ось. Эффект «овал» для подъёма внешнего угла. Никакой лисички - только анатомия.</em></p>
          </article>

          <article class="portfolio-ba-card conceptual-card fade-in stagger-2">
            <div class="portfolio-ba-viewport" data-ba-slider style="--split: 50;">
              <div class="portfolio-ba-layer portfolio-ba-layer--before">
                <img src="../../assets/images/До:после/До_1.png" alt="До" class="portfolio-ba-image" style="transform: scale(1.8) rotate(16deg) translate(-2%, 8%); transform-origin: center center;">
                <span class="portfolio-ba-label text-mono">ДО</span>
              </div>

              <div class="portfolio-ba-layer portfolio-ba-layer--after" aria-hidden="true">
                <img src="../../assets/images/До:после/После_1.png" alt="После" class="portfolio-ba-image" style="transform: scale(1.6) translate(-8%, 5%); transform-origin: center center;">
                <span class="portfolio-ba-label text-mono">ПОСЛЕ</span>
              </div>

              <button class="portfolio-ba-handle" type="button" aria-label="Сравнить до и после" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></button>
            </div>

            <h3 class="portfolio-ba-card__title">Архитектура + ламинирование бровей</h3>
            <p class="portfolio-ba-card__note"><em>Асимметрия, разнонаправленный рост. Геометрия с нуля, укладка ламинированием. 4 недели.</em></p>
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

            <h3 class="portfolio-ba-card__title">Комплекс GAZE</h3>
            <p class="portfolio-ba-card__note"><em>Полная перезагрузка. 2D + архитектура. Свежее лицо без косметики.</em></p>
          </article>

        </div>"""

html = re.sub(r'<div class="portfolio-before-after__list".*?</article>\s*</div>', new_block, html, flags=re.DOTALL)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("done")
