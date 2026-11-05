<img src="packages/kit/assets/logo.svg" alt="" width="96" />

# anyglade-kit

Монорепозиторий UI kit `@anyglade/kit` на HeroUI v3, Tailwind CSS v4 и Vite+.

- `packages/kit` — публикуемый пакет, подключение описано в его [README](packages/kit/README.md).
- `apps/playground` — приложение для проверки компонентов. Берёт kit из исходников, сборка `dist` для него не нужна.

## Разработка

```bash
bun install
vp run dev        # playground
vp run ready      # формат, lint, типы, тесты, сборка
```

## Новый компонент

1. Создать `packages/kit/src/<name>/<name>.tsx`.
2. Экспортировать его из `packages/kit/src/index.ts`.

Вёрстка компонентов и playground строится на `Box` и `Text`. Значения задаются в `packages/kit/src/tokens.ts`, а `styles/tokens.css` и `styles/box.css` генерируются командой `bun run generate`.

Чтобы заменить компонент HeroUI своей обёрткой, экспортируйте её под тем же именем: явный экспорт имеет приоритет над `export *`.

Компонентам с хуками или обработчиками событий нужна директива `"use client"` в первой строке файла. Сборка сохраняет структуру файлов, поэтому директива работает в Next.js.

## Публикация

Нужны вход в npm (`bunx npm login`) и организация `anyglade` на npmjs.com.

```bash
cd packages/kit
bun publish
```

`npm publish` из этого репозитория не сработает: `devEngines` разрешает только bun.
