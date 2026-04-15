import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the entire active article
new_article = """<div class="portfolio-before-after__list">

          <article class="portfolio-ba-card conceptual-card fade-in stagger-1" style="max-width: 800px; width: 100%; position: relative;">
            <span class="portfolio-ba-label text-mono" style="position: absolute; top: 14px; left: 14px; z-index: 10;">ДО</span>
            <span class="portfolio-ba-label text-mono" style="position: absolute; top: 14px; right: 14px; z-index: 10;">ПОСЛЕ</span>
            
            <div class="portfolio-ba-viewport" data-ba-slider style="--split: 50;">
              <div class="portfolio-ba-layer portfolio-ba-layer--before">
                <img src="../../assets/images/До:после/До_1.png" alt="До" class="portfolio-ba-image" style="transform: scale(2.0) rotate(14deg) translate(-4%, 18%); transform-origin: center center;">
              </div>

              <div class="portfolio-ba-layer portfolio-ba-layer--after" aria-hidden="true">
                <img src="../../assets/images/До:после/После_1.png" alt="После" class="portfolio-ba-image" style="transform: scale(1.6) translate(-8%, 15%); transform-origin: center center;">
              </div>

              <button class="portfolio-ba-handle" type="button" aria-label="Сравнить до и после" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></button>
            </div>

            <h3 class="portfolio-ba-card__title">Архитектура + ламинирование бровей</h3>
            <p class="portfolio-ba-card__note"><em>Асимметрия, разнонаправленный рост. Геометрия с нуля, укладка ламинированием. 4 недели.</em></p>
          </article>"""

html = re.sub(r'<div class="portfolio-before-after__list">.*?<article class="portfolio-ba-card conceptual-card fade-in stagger-2">', new_article + '\n\n          <article class="portfolio-ba-card conceptual-card fade-in stagger-2">', html, flags=re.DOTALL, count=1)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Make sure CSS layers have correct z-index
css = css.replace(""".portfolio-ba-layer--before {
  width: calc(var(--split) * 1%);
  overflow: hidden;
  border-right: 1px solid var(--blush);
  z-index: 5;
}""", """.portfolio-ba-layer--before {
  width: calc(var(--split) * 1%);
  overflow: hidden;
  border-right: 1px solid var(--blush);
  z-index: 5;
  height: 100%;
}
.portfolio-ba-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface-2);
}""")

with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

import os
os.system("python3 bust.py")
print("Done")
