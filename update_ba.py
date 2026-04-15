import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the portfolio-before-after__list block
new_block = """<div class="portfolio-before-after__list" style="display: flex; justify-content: center;">

          <article class="portfolio-ba-card conceptual-card fade-in stagger-1" style="max-width: 800px; width: 100%;">
            <div class="portfolio-ba-viewport" data-ba-slider style="--split: 50;">
              <div class="portfolio-ba-layer portfolio-ba-layer--before">
                <img src="../../assets/images/До:после/До_1.png" alt="До" class="portfolio-ba-image">
                <span class="portfolio-ba-label text-mono">ДО</span>
              </div>

              <div class="portfolio-ba-layer portfolio-ba-layer--after" aria-hidden="true">
                <img src="../../assets/images/До:после/После_1.png" alt="После" class="portfolio-ba-image">
                <span class="portfolio-ba-label text-mono">ПОСЛЕ</span>
              </div>

              <button class="portfolio-ba-handle" type="button" aria-label="Сравнить до и после" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></button>
            </div>

            <h3 class="portfolio-ba-card__title">Архитектура + ламинирование бровей</h3>
            <p class="portfolio-ba-card__note"><em>Асимметрия, разнонаправленный рост. Геометрия с нуля, укладка ламинированием. 4 недели.</em></p>
          </article>

        </div>"""

html = re.sub(r'<div class="portfolio-before-after__list">.*?(<section class="section-portfolio-principles" id="portfolio-principles">)', new_block + r'\n      </div>\n    </section>\n\n\n    <!-- ═══════════════════════════════════════════════════════════════ -->\n    <!-- БЛОК 4: ПРИНЦИПЫ РЕЗУЛЬТАТА                                    -->\n    <!-- ═══════════════════════════════════════════════════════════════ -->\n    \g<1>', html, flags=re.DOTALL)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

if ".portfolio-ba-image {" not in css:
    css += """
.portfolio-ba-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
"""
    with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
        f.write(css)

import os
os.system("python3 bust.py")

print("Updated BA section")
