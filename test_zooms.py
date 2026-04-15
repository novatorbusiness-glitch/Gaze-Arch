import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make ДО smaller and lower
# "scale(2.4) rotate(16deg) translate(-3%, 12%)" -> "scale(2.1) rotate(16deg) translate(-3%, 16%)"
html = re.sub(
    r'style="transform: scale\(2\.4\) rotate\(16deg\) translate\(-3%, 12%\); transform-origin: center center;"',
    r'style="transform: scale(2.1) rotate(16deg) translate(-4%, 18%); transform-origin: center center;"',
    html
)

# Make ПОСЛЕ lower
# "scale(2.2) translate(-9%, 8%)" -> "scale(2.2) translate(-9%, 15%)"
html = re.sub(
    r'style="transform: scale\(2\.2\) translate\(-9%, 8%\); transform-origin: center center;"',
    r'style="transform: scale(2.2) translate(-9%, 15%); transform-origin: center center;"',
    html
)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

css = css.replace(".portfolio-ba-label {\n  position: absolute;", ".portfolio-ba-label {\n  position: absolute;\n  z-index: 10;")

with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

import os
os.system("python3 bust.py")
print("Done")
