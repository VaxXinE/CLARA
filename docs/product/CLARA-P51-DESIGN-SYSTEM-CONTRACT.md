---
project: "CLARA"
artifact: "P5.1 Design System Contract"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "design-system-contract"
---

# CLARA P5.1 Design System Contract

Future dashboard shell work must use this contract before porting legacy UI patterns.

## Shell Contract

- Premium dark workspace shell.
- Gold accent.
- Left sidebar with grouped navigation.
- Topbar with account/workspace context.
- Responsive mobile sidebar.
- Card-based workspace surfaces.
- Role-aware navigation labels.
- Backend authorization source of truth.

## Tokens

| Token                      | Intended Use                              |
| -------------------------- | ----------------------------------------- |
| `color.background.primary` | main workspace background                 |
| `color.background.sidebar` | dark sidebar gradient                     |
| `color.surface.card`       | primary card surface                      |
| `color.surface.cardMuted`  | secondary card surface                    |
| `color.accent.gold`        | core gold accent, near `#f0cb73`          |
| `color.accent.goldLight`   | active nav gradient start, near `#f6d98c` |
| `color.accent.goldDark`    | active nav gradient end, near `#c29032`   |
| `color.text.primary`       | primary text                              |
| `color.text.secondary`     | muted text                                |
| `color.text.inverse`       | text on dark surfaces                     |
| `radius.card`              | rounded cards                             |
| `radius.panel`             | rounded panels                            |
| `radius.navItem`           | rounded navigation items                  |
| `shadow.card`              | card elevation                            |
| `shadow.sidebar`           | sidebar elevation                         |
| `layout.sidebarWidth`      | around `292px`                            |
| `layout.topbarHeight`      | top bar height                            |
| `layout.contentMaxWidth`   | bounded content width                     |

## Migration Guardrail

Do not add Tailwind, FontAwesome, or a component framework until a concrete shell PR proves the existing CSS is insufficient.
