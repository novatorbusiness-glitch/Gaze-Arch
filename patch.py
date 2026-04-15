import re

content = ""
with open("Код сайта/pages/portfolio/index.html", "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    '<span>Классика 1.5D</span>': '<img src="../../assets/images/foto_rabot/1.5D.png" alt="" class="mini-img"><span>Классика 1.5D</span>',
    '<span>Архитектура бровей</span>': '<img src="../../assets/images/foto_rabot/2D_брови.png" alt="" class="mini-img"><span>Архитектура бровей</span>',
    '<span>2D объём</span>': '<img src="../../assets/images/foto_rabot/2D.png" alt="" class="mini-img"><span>2D объём</span>',
    '<span>Комплекс GAZE</span>': '<img src="../../assets/images/foto_rabot/Лами_бро_ресницы2.png" alt="" class="mini-img"><span>Комплекс GAZE</span>',
    '<span>Ламинирование бровей</span>': '<img src="../../assets/images/foto_rabot/Лами_бровей.png" alt="" class="mini-img"><span>Ламинирование бровей</span>',
    '<span>Ламинирование ресниц</span>': '<img src="../../assets/images/foto_rabot/ламинирование_ресниц.png" alt="" class="mini-img"><span>Ламинирование ресниц</span>',
    '<span>3D объём</span>': '<img src="../../assets/images/foto_rabot/3D.png" alt="" class="mini-img"><span>3D объём</span>',
    '<span>Брови + ресницы</span>': '<img src="../../assets/images/foto_rabot/3D_брови.png" alt="" class="mini-img"><span>Брови + ресницы</span>',
    '<span>Коррекция асимметрии</span>': '<img src="../../assets/images/foto_rabot/Лами_бровей3.png" alt="" class="mini-img"><span>Коррекция асимметрии</span>',
    '<span>Мокрый эффект</span>': '<img src="../../assets/images/foto_rabot/Мокрый_эффект.png" alt="" class="mini-img"><span>Мокрый эффект</span>',
    '<span>Окрашивание</span>': '<img src="../../assets/images/foto_rabot/Точная_коррекция.png" alt="" class="mini-img"><span>Окрашивание</span>',
    '<span>До и после</span>': '<img src="../../assets/images/foto_rabot/До:После.png" alt="" class="mini-img"><span>До и после</span>'
}

for old_str, new_str in replacements.items():
    content = content.replace(old_str, new_str)

# Also adding a css rule for mini-img inside style.css
with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

if ".mini-img {" not in css:
    css_patch = """
.mini-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 0.3;
  mix-blend-mode: multiply;
  transition: opacity 0.3s ease;
}
.portfolio-mini:hover .mini-img {
  opacity: 0.6;
}
"""
    css = css.replace('.portfolio-mini span {', css_patch + '\n.portfolio-mini span {')
    with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
        f.write(css)

with open("Код сайта/pages/portfolio/index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied for carousel")
