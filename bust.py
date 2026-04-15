import re

with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    text = f.read()

text = re.sub(r'href="(../../css/style\.css\?v=)\d+"', r'href="\g<1>3"', text)
text = re.sub(r'href="(../../css/components\.css\?v=)\d+"', r'href="\g<1>3"', text)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(text)
print("done")
