with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
css = re.sub(r'opacity: 0\.3;\s*mix-blend-mode: multiply;', 'opacity: 0.8; mix-blend-mode: normal;', css)

with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("CSS Fixed")
