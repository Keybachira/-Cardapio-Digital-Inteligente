# Design Tokens

## Colors

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#071812` | Page background |
| `--ink-2` | `#0d241b` | Secondary bg (cards on dark, header) |
| `--ocean` | `#0f2f2a` | Tertiary bg (image gradients) |
| `--ocean-2` | `#1a4740` | Hover variant |
| `--ember` | `#ff5a1f` | Primary action, accent (buttons, active states) |
| `--ember-2` | `#f4915a` | Lighter hover variant |
| `--gold` | `#d4af57` | Star ratings, highlights |
| `--bone` | `#f5e8cf` | Primary text on dark backgrounds |
| `--bone-dim` | `#cbbcac` | Secondary text on dark backgrounds |
| `--line` | `rgba(245,232,207,0.08)` | Subtle borders (dark bg) |
| `--line-strong` | `rgba(245,232,207,0.20)` | Stronger borders |
| `--surface` | `#ffffff` | Card background (on dark page) |
| `--surface-2` | `#f8f6f2` | Input/note bg on white cards |
| `--text-primary` | `#1a1a1a` | Primary text on light surfaces |
| `--text-secondary` | `#7a7a7e` | Secondary text on light surfaces |

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Small elements (badges, inputs) |
| `--radius-md` | `14px` | Dish cards, medium containers |
| `--radius-lg` | `20px` | Promo banners, modals |
| `--radius-xl` | `26px` | Large containers |

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 4px 20px rgba(0,0,0,0.15)` | Resting card shadow |
| `--shadow-card-hover` | `0 8px 32px rgba(0,0,0,0.2)` | Elevated card shadow |

## Typography

| Token | Font stack |
|---|---|
| `--font-display` | `"Fraunces", ui-serif, Georgia, serif` |
| `--font-body` | `"Plus Jakarta Sans", sans-serif` |
| `--font-mono` | `"IBM Plex Mono", monospace` |

## Utility Classes

### `.floating-card`
White bg, rounded-20, card shadow, hover translateY(-2px). Use for any white card on dark bg.

### `.dish-card`
Light-surface card with image header + body. 4:3 image ratio, zoom on hover.

- `.dish-card-img` — image container (4:3 aspect, relative positioning for badges)
- `.dish-card-body` — text area with `--text-primary`
- `.dish-name` — 14px, 600 weight
- `.dish-desc` — 12px, `--text-secondary`
- `.dish-price` — 14px monospace, `--ember` color

### `.glass-header`
Backdrop-blur header with bottom border. Use for sticky nav bars.

### `.bottom-nav`
Centered pill nav fixed at bottom. Max-width 360px, border-radius 999px.

- `.bottom-nav-btn` — individual tab buttons
- `.bottom-nav-btn.active` — highlighted state with ember bg
- `.bottom-nav-badge` — cart count badge (ember circle)

### `.ticket`
Kitchen ticket card with scalloped clip-path border. Bone bg, ink text.

### `.no-scrollbar`
Hides scrollbar while keeping scroll functionality.

## Keyframe Animations

| Class | Animation | Duration |
|---|---|---|
| `.animate-fade-in` | fade-in (opacity + translateY) | 0.5s |
| `.animate-fade-in-up` | fade-in-up (20px) | 0.6s |
| `.animate-scale-in` | scale-in (0.92→1) | 0.4s |
| `.animate-pulse-glow` | pulse-glow | 2s infinite |
| `.animate-slide-up` | slide-up (100%) | 0.35s |
| `.animate-float` | float (translateY) | 3s infinite |
| `.animate-scale-bounce` | scale-bounce | 0.35s |
| `.animate-slide-up-sm` | slide-up (12px) | 0.4s |
| `.animate-slide-down` | slide-down | 0.4s |
