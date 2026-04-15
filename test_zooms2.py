import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Adjust to center the brows better
html = re.sub(
    r'style="transform: scale\(2\.1\) rotate\(16deg\) translate\(-4%, 18%\); transform-origin: center center;"',
    r'style="transform: scale(2.0) rotate(16deg) translate(-2%, 22%); transform-origin: center center;"',
    html
)

html = re.sub(
    r'style="transform: scale\(2\.2\) translate\(-9%, 15%\); transform-origin: center center;"',
    r'style="transform: scale(2.0) translate(-7%, 20%); transform-origin: center center;"',
    html
)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(html)

import os
os.system("python3 bust.py")
print("Done")
