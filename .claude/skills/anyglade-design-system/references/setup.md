# Подключение kit

Требования: React 19+, Tailwind CSS 4+.

```bash
bun add @anyglade/kit
```

HeroUI и React Aria ставятся вместе с пакетом, Provider не нужен. Полная документация лежит в `node_modules/@anyglade/kit/README.md`.

## Стили

В главном CSS-файле, строго в таком порядке:

```css
@import "tailwindcss";
@import "@anyglade/kit/styles.css";
```

Порядок важен: kit подменяет шкалу текста, веса и трекинг Tailwind, поэтому утилиты и компоненты HeroUI идут по той же шкале.

## Входы

| Импорт                 | Что даёт                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `@anyglade/kit`        | Все компоненты HeroUI, `Box`, `Text`, паттерны kit, `tokens`                                          |
| `@anyglade/kit/icons`  | Gravity UI Icons. Отдельный вход, потому что имена `Link`, `Calendar`, `Tag` совпадают с компонентами |
| `@anyglade/kit/charts` | Графики. Отдельно, чтобы Recharts не попадал в бандл без нужды                                        |
| `@anyglade/kit/ai`     | Интерфейс с агентом                                                                                   |

Никогда не импортируйте напрямую из `@heroui/react`: тогда не применятся замены kit, например `Button` со встроенным лоадером. Иконку `Box` импортируйте как `Box as BoxIcon`.

## Линт

Правила публикуются вместе с kit и держат проект в рамках системы. Подключите их сразу, в `vite.config.ts` для Vite+ или в конфиге oxlint:

```ts
lint: {
  jsPlugins: [{ name: "anyglade", specifier: "@anyglade/kit/oxlint" }],
  rules: {
    "anyglade/no-raw-layout": "error",
    "anyglade/no-raw-text": "error",
    "anyglade/no-typography-utility": "error",
    "anyglade/no-spacing-utility": "error",
    "anyglade/no-foreign-import": "error",
    "anyglade/no-dark-variant": "error",
    "anyglade/no-arbitrary-value": "error",
  },
},
```

## Тема

По умолчанию тема следует настройке ОС и работает без JavaScript через `light-dark()`. Зафиксировать её можно на `<html>`:

```html
<html class="dark" data-theme="dark"></html>
```

Пользовательский переключатель это `useTheme()`. Обе темы равноправны, проверяйте каждый экран в обеих.

## Бренд

Настройки задаются CSS-переменными после импорта kit. Готовый CSS удобнее всего получить в панели «Тема» витрины kit: она сама выводит читаемые значения из одного цвета.

- Акцент: `--accent`, `--accent-foreground`, `--ag-accent-control`, `--ag-accent-control-foreground`, `--focus`, `--link`, `--ag-text-accent`, `--ag-chart-primary`. Правила в [color.md](color.md).
- Форма кнопок: `--ag-button-radius`.
- Плотность: `--spacing` и `--ag-space-*`.
- Шрифт: `@theme { --font-sans: "Your Font", sans-serif; }`. По умолчанию Inter и Geist Mono, они раздаются приложением, внешних запросов нет.

## Серверные компоненты

`Box` и `Text` работают в серверных компонентах и не вставляют стили при рендере. Компоненты с поведением помечены `"use client"`.
