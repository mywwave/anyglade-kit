<img src="https://unpkg.com/@anyglade/kit/assets/logo.svg" alt="" width="96" />

# @anyglade/kit

React UI kit на HeroUI v3: все компоненты HeroUI, своя тема и собственные компоненты из одного пакета.

Требования: React 19+, Tailwind CSS 4+.

## Установка

```bash
bun add @anyglade/kit
```

HeroUI и React Aria ставятся вместе с пакетом. Отдельный Provider не нужен.

## Подключение

В главном CSS-файле приложения, строго в таком порядке:

```css
@import "tailwindcss";
@import "@anyglade/kit/styles.css";
```

Использование:

```tsx
import { Button, PageHeader } from "@anyglade/kit";

export function Page() {
  return <PageHeader title="Orders" actions={<Button>Create</Button>} />;
}
```

Импортируйте компоненты только из `@anyglade/kit`, а не из `@heroui/react`, иначе обёртки и замены kit не применятся.

## Тема

Светлая и тёмная темы переключаются на `<html>`:

```html
<html class="dark" data-theme="dark"></html>
```

Токены можно переопределить в приложении после импорта стилей:

```css
:root {
  --accent: oklch(0.6 0.2 260);
  --radius: 0.75rem;
}
```

Список токенов: [HeroUI Theming](https://heroui.com/docs/react/getting-started/theming).
