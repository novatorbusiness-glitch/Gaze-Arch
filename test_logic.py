import re

with open("Код сайта/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's fix the CSS so that the BEFORE layer is the expanding left half,
# and the AFTER layer is the background right half.
# Swap the width and overflow rules:
css = css.replace(""".portfolio-ba-layer--after {
  width: calc(var(--split) * 1%);
  overflow: hidden;
  border-right: 1px solid var(--blush);
}""", """.portfolio-ba-layer--before {
  width: calc(var(--split) * 1%);
  overflow: hidden;
  border-right: 1px solid var(--blush);
  z-index: 5;
}
.portfolio-ba-layer--after {
  position: absolute;
  inset: 0;
  z-index: 1;
}""")

with open("Код сайта/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)
print("CSS fixed")
