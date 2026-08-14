/**
 * Генерирует public/og-image.png (1200x630) в редакционном стиле сайта.
 *
 *   node scripts/generate-og.js
 *
 * Шрифт Cormorant Garamond скачивается во временный кэш (scripts/.cache)
 * и не коммитится — в репозиторий попадает только готовый PNG.
 */

const fs = require("node:fs");
const path = require("node:path");
const React = require("react");

const WIDTH = 1200;
const HEIGHT = 630;

const CREAM = "#FAF8F3";
const NAVY = "#1B2B4B";
const GOLD = "#C9963A";
const SLATE = "#5A6478";

// Легаси-API Google Fonts отдаёт статический TTF (satori не читает вариативные шрифты).
const FONT_CSS_URL =
  "https://fonts.googleapis.com/css?family=Cormorant+Garamond:400&subset=cyrillic,latin";
const LEGACY_UA = "Mozilla/4.0";

const CACHE_DIR = path.join(__dirname, ".cache");
const FONT_PATH = path.join(CACHE_DIR, "CormorantGaramond-400.ttf");
const OUTPUT = path.join(__dirname, "..", "public", "og-image.png");

async function loadFont() {
  if (fs.existsSync(FONT_PATH)) {
    return fs.readFileSync(FONT_PATH);
  }

  process.stdout.write("Скачиваем Cormorant Garamond...\n");

  const cssResponse = await fetch(FONT_CSS_URL, {
    headers: { "User-Agent": LEGACY_UA },
  });
  if (!cssResponse.ok) {
    throw new Error(`Google Fonts вернул HTTP ${cssResponse.status}`);
  }

  const css = await cssResponse.text();
  const match = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
  if (!match) {
    throw new Error("В ответе Google Fonts не нашлась ссылка на TTF");
  }

  const fontResponse = await fetch(match[1]);
  if (!fontResponse.ok) {
    throw new Error(`Шрифт не скачался: HTTP ${fontResponse.status}`);
  }

  const buffer = Buffer.from(await fontResponse.arrayBuffer());
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(FONT_PATH, buffer);
  return buffer;
}

const h = React.createElement;

function rule(width) {
  return h("div", {
    style: { width, height: 2, backgroundColor: GOLD },
  });
}

function buildElement() {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: CREAM,
        fontFamily: "Cormorant Garamond",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 24,
          letterSpacing: 10,
          color: GOLD,
          marginBottom: 30,
        },
      },
      "ПЕРСОНАЛЬНЫЙ РАСЧЁТ"
    ),
    rule(600),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 290,
          lineHeight: 1.1,
          color: NAVY,
          paddingTop: 10,
          paddingBottom: 30,
        },
      },
      "7"
    ),
    rule(600),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 64,
          color: NAVY,
          marginTop: 36,
        },
      },
      "Нумерология — Число судьбы"
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 28,
          color: SLATE,
          marginTop: 16,
        },
      },
      "Бесплатный расчёт по дате рождения и имени"
    )
  );
}

async function main() {
  const fontData = await loadFont();
  const { ImageResponse } = await import("next/og.js");

  const image = new ImageResponse(buildElement(), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Cormorant Garamond",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const buffer = Buffer.from(await image.arrayBuffer());
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, buffer);

  process.stdout.write(
    `Готово: ${path.relative(process.cwd(), OUTPUT)} (${WIDTH}x${HEIGHT}, ${buffer.length} байт)\n`
  );
}

main().catch((error) => {
  process.stderr.write(`Ошибка генерации OG-изображения: ${error.message}\n`);
  process.exit(1);
});
