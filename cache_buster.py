import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    text = f.read()

# bust css
text = re.sub(r'href="(../../css/style\.css)(\?v=\d+)?"', r'href="\1?v=2"', text)
text = re.sub(r'href="(../../css/components\.css)(\?v=\d+)?"', r'href="\1?v=2"', text)

# bust js
text = re.sub(r'src="(../../js/main\.js)(\?v=\d+)?"', r'src="\1?v=2"', text)
text = re.sub(r'src="(../../js/nav\.js)(\?v=\d+)?"', r'src="\1?v=2"', text)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(text)

print("Cache busted")
