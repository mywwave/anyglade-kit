const params = new URLSearchParams(location.search);
localStorage.setItem("heroui-theme", params.get("theme") || "light");

const MAX_FIELD_WIDTH = 480;
const SPACING = new Set([0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96]);
const FIELD_SELECTOR = "input, textarea, select, [data-slot], .input, .textarea, .select__trigger";
const SCROLLABLE = "[class*=scroll], [data-slot=table-scroll-container]";

function isAlpha(color) {
  const match = color.match(/\/\s*([\d.]+)\s*\)|rgba\([^)]*,\s*([\d.]+)\)/);
  const alpha = match ? Number(match[1] ?? match[2]) : 1;
  return alpha > 0 && alpha < 1;
}

function hideOtherBlocks(ids) {
  for (const article of document.querySelectorAll("article")) {
    if (!ids.includes(article.id)) article.style.display = "none";
  }
  for (const section of document.querySelectorAll("section")) {
    const visible = [...section.querySelectorAll("article")].some(
      (article) => article.style.display !== "none",
    );
    if (!section.closest("article") && !visible) section.style.display = "none";
  }
  document.querySelector("main header").style.display = "none";
}

function inspect(article) {
  const issues = new Set();
  const signals = { borders: 0, separators: 0, tags: 0, alpha: 0, italic: 0, numbering: 0 };
  const box = article.getBoundingClientRect();
  const preview = article.querySelector(":scope > div") ?? article;

  for (const element of preview.querySelectorAll("*")) {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 1 || element.closest("svg")) continue;
    const style = getComputedStyle(element);
    const className = String(element.className);

    if (rect.right > box.right + 1 && !element.closest(SCROLLABLE)) {
      issues.add(
        `переполнение ${element.tagName.toLowerCase()} на ${Math.round(rect.right - box.right)}px`,
      );
    }
    for (const property of ["paddingTop", "paddingLeft", "marginTop", "rowGap", "columnGap"]) {
      const isGap = property.endsWith("Gap");
      if (isGap && !/flex|grid/.test(style.display)) continue;
      const value = Math.abs(parseFloat(style[property])) || 0;
      if (!SPACING.has(Math.round(value * 100) / 100)) {
        issues.add(`${property}=${value} ${className.split(" ")[0].slice(0, 24)}`);
      }
    }

    if (
      parseFloat(style.borderTopWidth) > 0 &&
      style.borderTopStyle !== "none" &&
      !element.matches(FIELD_SELECTOR)
    )
      signals.borders += 1;
    if (
      element.matches("input:not([type=range], [type=checkbox], [type=radio]), textarea") &&
      rect.width > MAX_FIELD_WIDTH
    ) {
      issues.add(`поле шире ${MAX_FIELD_WIDTH}px: ${Math.round(rect.width)}px`);
    }
    if (element.matches("hr, [role=separator], .separator")) signals.separators += 1;
    if (element.matches(".chip, .badge")) signals.tags += 1;
    if (isAlpha(style.backgroundColor) || isAlpha(style.color)) signals.alpha += 1;
    if (style.fontStyle === "italic") signals.italic += 1;
    const text = [...element.childNodes]
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent)
      .join("")
      .trim();
    if (/^0\d\b/.test(text) || /^шаг \d/i.test(text)) signals.numbering += 1;
  }

  return { issues: [...issues].slice(0, 6), signals };
}

function openBlocksView() {
  const tab = [...document.querySelectorAll("nav button")].find(
    (button) => button.textContent.trim() === "Блоки",
  );
  tab?.click();
}

window.addEventListener("load", () => setTimeout(openBlocksView, 500));

window.addEventListener("load", () =>
  setTimeout(() => {
    const only = params.get("only");
    if (only) {
      hideOtherBlocks(only.split(","));
      return;
    }
    const blocks = {};
    for (const article of document.querySelectorAll("article")) {
      blocks[article.id] = inspect(article);
    }
    const output = document.createElement("pre");
    output.id = "probe";
    output.style.display = "none";
    output.textContent = JSON.stringify({
      width: innerWidth,
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
      blocks,
    });
    document.body.append(output);
  }, 1500),
);
