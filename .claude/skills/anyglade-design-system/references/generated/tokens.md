# Токены

Файл создан автоматически. Не правьте его вручную.

## Отступы

Пропсы `Box`: `padding*`, `margin*`, `gap`.

| Имя | Значение |
| --- | --- |
| none | 0 |
| 2xs | 2px |
| xs | 4px |
| s | 8px |
| m | 12px |
| l | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |
| 4xl | 64px |
| 5xl | 96px |

## Скругления

Проп `borderRadius`.

| Имя | Значение |
| --- | --- |
| none | 0 |
| s | 8px |
| m | 12px |
| l | 16px |
| frame | 20px |
| xl | 32px |
| full | 9999px |

## Тени

Проп `boxShadow`.

| Имя |
| --- |
| none |
| s |
| m |
| l |
| xl |

## Ширины

Значения `tokens.widths`, пиксели.

| Имя | Значение |
| --- | --- |
| form | 400 |
| content | 720 |
| wide | 880 |

## Точки перелома

Условия `sm`, `md`, `lg`, `xl` в пропсах `Box`.

| Имя | Значение |
| --- | --- |
| sm | 40rem |
| md | 48rem |
| lg | 64rem |
| xl | 80rem |

## Роли текста

Проп `variant` у `Text`. Размер указан как базовый и от `md`.

| Роль | Размер | Интерлиньяж | Вес |
| --- | --- | --- | --- |
| default | 0.875rem | 1.5 | 450 |
| title | 0.875rem | 1.5 | 500 |
| body | 1rem | 1.5 | 450 |
| label | 0.75rem | 1.375 | 500 |
| caption | 0.75rem | 1.375 | 450 |
| heading-2xl | 3.75rem / 6rem | 1 | 400 |
| heading-xl | 3rem / 4.5rem | 1 | 400 |
| heading-l | 2.25rem / 3rem | 1.25 | 400 |
| heading-m | 1.875rem / 2.25rem | 1.25 | 400 |
| heading-s | 1.5rem / 1.875rem | 1.375 | 400 |
| heading-xs | 1.25rem / 1.5rem | 1.375 | 400 |
| heading-xxs | 1.125rem / 1.25rem | 1.375 | 400 |

## Веса

Проп `weight` у `Text`.

| Имя | Значение |
| --- | --- |
| light | 300 |
| book | 350 |
| regular | 400 |
| body | 450 |
| medium | 500 |
| strong | 550 |
| semibold | 600 |

## Цвета текста

Проп `color` у `Text`.

| Имя | Токен |
| --- | --- |
| default | text-primary |
| muted | text-secondary |
| subtle | text-tertiary |
| disabled | text-disabled |
| inverse | text-inverse |
| accent | text-accent |
| success | text-success |
| warning | text-warning |
| danger | text-danger |

## Семантические цвета

Пропсы `backgroundColor`, `color` и `borderColor` у `Box`.

| Токен | Светлая | Тёмная |
| --- | --- | --- |
| background-canvas | oklch(0.967 0.003 264.542) | hsl(0 0% 3.5%) |
| background-panel | #ffffff | hsl(0 0% 6.5%) |
| background-primary | #ffffff | hsl(0 0% 3.5%) |
| background-secondary | oklch(0.985 0.002 247.839) | hsl(0 0% 6.5%) |
| background-card | oklch(0.967 0.003 264.542) | hsl(0 0% 9.5%) |
| background-emphasis | oklch(0.707 0.022 261.325) | hsl(0 0% 46%) |
| background-inverse | oklch(0.21 0.034 264.665) | hsl(0 0% 88%) |
| background-warning | oklch(0.987 0.022 95.277) | oklch(0.279 0.077 45.635) |
| background-success | oklch(0.979 0.021 166.113) | oklch(0.262 0.051 172.552) |
| background-danger | oklch(0.971 0.013 17.38) | oklch(0.258 0.092 26.042) |
| text-primary | #000000 | hsl(0 0% 88%) |
| text-secondary | oklch(0.551 0.027 264.364) | hsl(0 0% 52%) |
| text-tertiary | oklch(0.707 0.022 261.325) | hsl(0 0% 46%) |
| text-disabled | oklch(0.872 0.01 258.338) | hsl(0 0% 16%) |
| text-inverse | #ffffff | #000000 |
| text-accent | oklch(0.546 0.245 262.881) | oklch(0.707 0.165 254.624) |
| text-success | oklch(0.696 0.17 162.48) | oklch(0.696 0.17 162.48) |
| text-danger | oklch(0.637 0.237 25.331) | oklch(0.637 0.237 25.331) |
| text-warning | oklch(0.769 0.188 70.08) | oklch(0.769 0.188 70.08) |
| border-primary | oklch(0.928 0.006 264.531) | hsl(0 0% 13%) |
| border-secondary | oklch(0.967 0.003 264.542) | hsl(0 0% 9.5%) |
| border-control | oklch(0.872 0.01 258.338) | hsl(0 0% 16%) |
| border-warning | oklch(0.879 0.169 91.605) | oklch(0.555 0.163 48.998) |
| chart-primary | oklch(0.21 0.034 264.665) | hsl(0 0% 88%) |
| chart-secondary | oklch(0.707 0.022 261.325) | hsl(0 0% 52%) |
| chart-tertiary | oklch(0.928 0.006 264.531) | hsl(0 0% 16%) |

## Длительности

CSS-переменные `--ag-duration-*`.

| Имя | Значение |
| --- | --- |
| instant | 0ms |
| fast | 120ms |
| base | 200ms |
| slow | 320ms |
| slower | 480ms |
| shimmer | 2000ms |
| stagger | 60ms |

## Кривые

CSS-переменные `--ag-ease-*`.

| Имя | Значение |
| --- | --- |
| standard | cubic-bezier(0.2, 0, 0, 1) |
| decelerate | cubic-bezier(0, 0, 0, 1) |
| accelerate | cubic-bezier(0.3, 0, 1, 1) |

## Темп обратной связи

Значения `tokens.timings`, миллисекунды.

| Имя | Значение |
| --- | --- |
| loaderDelay | 150 |
| loaderMinimum | 400 |
| confirmation | 1500 |
