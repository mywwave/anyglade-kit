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

## Вёрстка

`Box` и `Text` принимают только токены. `className` и `style` закрыты на уровне типов, а тёмная тема работает без `dark:`.

```tsx
import { Box, Text } from "@anyglade/kit";

export function Card() {
  return (
    <Box
      flexDirection="column"
      gap="m"
      padding={{ base: "l", md: "xl" }}
      backgroundColor={{ base: "background-card", hover: "background-secondary" }}
      borderRadius="l"
    >
      <Text as="h3" variant="heading-xs">
        Revenue
      </Text>
      <Text variant="body" tabularNums formatter="number">
        {3290033}
      </Text>
    </Box>
  );
}
```

`Box` по умолчанию `display: flex`, кроме `span`, `label`, `li` и `a`. Элемент меняется через `as`. Значения токенов доступны в JavaScript через `tokens`.

## Линт

Правила oxlint держат проект в рамках системы. Подключение в `vite.config.ts`:

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

Типографика и отступы задаются только через `Text` и `Box`. Утилиты Tailwind вроде `text-sm` или `font-semibold` и компоненты HeroUI берут значения из той же шкалы, поэтому система остаётся единой и без линта.

## Иконки

Набор [Gravity UI Icons](https://gravity-ui.com/icons) подключается отдельным входом, потому что часть имён совпадает с компонентами (`Link`, `Calendar`, `Tag`):

```tsx
import { Button } from "@anyglade/kit";
import { Persons } from "@anyglade/kit/icons";

export function Invite() {
  return (
    <Button>
      <Persons />
      Invite
    </Button>
  );
}
```

В бандл попадают только используемые иконки. Иконка `Box` совпадает с компонентом, поэтому импортируйте её как `Box as BoxIcon`.

## Шрифт

Inter подключён вместе со стилями и раздаётся вашим приложением, запросов к внешним сервисам нет. Заменить его можно токеном Tailwind в CSS приложения:

```css
@theme {
  --font-sans: "Your Font", sans-serif;
}
```

## Тема

По умолчанию тема следует настройке ОС и работает без JavaScript. Зафиксировать её можно на `<html>`:

```html
<html class="dark" data-theme="dark"></html>
```

Токены определены в `src/tokens.ts`. После изменения выполните `bun run generate`: тест проверяет, что CSS совпадает с источником.
