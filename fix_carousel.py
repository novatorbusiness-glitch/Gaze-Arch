import re

with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Desktop dimensions & align text to bottom
css = css.replace("""
.portfolio-mini {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 176px;
  height: 94px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  background: var(--white);
  overflow: hidden;
}""", """
.portfolio-mini {
  position: relative;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  min-width: 180px;
  height: 240px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  background: var(--white);
  overflow: hidden;
}""")

# Mobile dimensions
css = css.replace("""
  .portfolio-mini {
    min-width: 154px;
    height: 86px;
  }""", """
  .portfolio-mini {
    min-width: 140px;
    height: 180px;
  }""")

# Remove opacity & adjust the image style (add hover scale)
css = css.replace("""
.mini-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 0.8; mix-blend-mode: normal;
  transition: opacity 0.3s ease;
}
.portfolio-mini:hover .mini-img {
  opacity: 0.6;
}""", """
.mini-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 1;
  transition: transform 0.4s ease;
}
.portfolio-mini:hover .mini-img {
  transform: scale(1.05);
}""")

# Text styling
css = css.replace("""
.portfolio-mini span {
  position: relative;
  z-index: 2;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.09em;
  color: var(--warm);
  text-transform: uppercase;
  text-align: center;
}""", """
.portfolio-mini span {
  position: relative;
  z-index: 2;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--dark);
  text-transform: uppercase;
  text-align: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 8px;
  border-radius: 8px;
}""")

with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("CSS dimensions updated")
