import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the specific transforms for До and После images
old_before = r'<img src="../../assets/images/До:после/До_1.png" alt="До" class="portfolio-ba-image" style="transform: scale\(1\.8\) rotate\(16deg\) translate\(-2%, 8%\); transform-origin: center center;">'
new_before = '<img src="../../assets/images/До:после/До_1.png" alt="До" class="portfolio-ba-image" style="transform: scale(2.4) rotate(16deg) translate(-3%, 12%); transform-origin: center center;">'

old_after = r'<img src="../../assets/images/До:после/После_1.png" alt="После" class="portfolio-ba-image" style="transform: scale\(1\.6\) translate\(-8%, 5%\); transform-origin: center center;">'
new_after = '<img src="../../assets/images/До:после/После_1.png" alt="После" class="portfolio-ba-image" style="transform: scale(2.2) translate(-9%, 8%); transform-origin: center center;">'

html = re.sub(old_before, new_before, html)
html = re.sub(old_after, new_after, html)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Give label a z-index and white background to be safe
if "z-index: 10;" not in css and ".portfolio-ba-label {" in css:
    css = re.sub(r'(\.portfolio-ba-label \{[^}]+)(text-transform: uppercase;)', r'\1\2\n  z-index: 10;\n  background: rgba(255, 255, 255, 0.85);', css)

with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

import os
os.system("python3 bust.py")
print("Slider updated")
