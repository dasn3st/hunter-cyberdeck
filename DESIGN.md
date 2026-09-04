---
name: HUNTER Editorial System
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#2ae500'
  on-tertiary: '#053900'
  tertiary-container: '#000000'
  on-tertiary-container: '#168800'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#79ff5b'
  tertiary-fixed-dim: '#2ae500'
  on-tertiary-fixed: '#022100'
  on-tertiary-fixed-variant: '#095300'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 110px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 60px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 38px
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  quote-editorial:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
spacing:
  grid-margin: 40px
  grid-gutter: 1px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
  section-padding: 120px
---

## Brand & Style

The design system is rooted in the "Berlin Underground" aesthetic—a synthesis of raw industrial brutalism and high-fashion editorial polish. It targets a culturally savvy, independent audience that values authenticity over mass-market polish. 

The visual language is defined by **Neo-Brutalism** and **Technical Editorial** styles. It rejects soft affordances in favor of sharp edges, high-contrast typography, and a "printed matter" digital experience. The emotional response should be one of urgency, exclusivity, and uncompromising modernism.

Key stylistic pillars:
- **Structural Integrity:** Visible grid lines and borders that reference blueprint aesthetics.
- **Intentional Friction:** Asymmetric layouts that demand attention rather than passive scrolling.
- **Analog Textures:** Subtle film grain overlays and "ink-heavy" black surfaces to mimic luxury independent print magazines.

## Colors

The palette is strictly functional, utilizing a high-contrast dark mode to emphasize the "underground" nature of the content.

- **Deep Black (#000000):** The primary canvas. Used for the deepest background layers to ensure the "Electric Neon Green" vibrates against it.
- **Charcoal Tiers (#121212, #1A1A1A):** Used for structural depth and surface containers. These should be paired with 1px borders rather than shadows.
- **Off-White (#F5F5F5):** The primary typographic color. Softened slightly from pure white to reduce eye strain and feel more like premium paper.
- **Electric Neon Green (#39FF14):** The "Pulse." Use sparingly for high-priority calls to action, active navigation states, and category tags.
- **Muted Grey (#999999):** Reserved for technical metadata, timestamps, and secondary labels to maintain a clear information hierarchy.

## Typography

Typography is the primary driver of the brand's voice. 

1.  **Headlines (Anton):** Always uppercase. These should feel heavy and impactful. On desktop, large display sizes should use tight leading to create a "wall of text" effect for article titles.
2.  **Body (Inter):** Highly legible and neutral. It provides a necessary "quiet" space amidst the aggressive headline styling.
3.  **Metadata & Captions (JetBrains Mono):** Introduces a technical, "coded" feel. Used for dates, category tags (Kategorie), and image credits (Bildnachweis).
4.  **Language:** All interface labels and system text must be in German (e.g., "MEHR LESEN" instead of "READ MORE").

## Layout & Spacing

This design system utilizes a **Technical Grid Model**. Layouts are bound by visible 1px lines (`#1A1A1A` or `#F5F5F5` at low opacity) that define content blocks.

- **Grid:** A 12-column fluid grid on desktop, transitioning to a 4-column grid on mobile. 
- **Margins:** Large 40px external margins create a "framed" magazine look.
- **Asymmetry:** Content should rarely be perfectly centered. Shift body columns to the right or left, leaving one or two columns empty to create "white space" (which is actually "black space" in this system).
- **Breakpoints:**
    - Desktop: 1440px+
    - Tablet: 768px - 1439px (Reflow 12 columns to 8)
    - Mobile: <767px (Reflow to 4 columns, remove horizontal gutters in favor of vertical stacking).

## Elevation & Depth

This system is strictly **Flat & Layered**. It avoids shadows and blurs entirely.

- **Tonal Layering:** Depth is conveyed by shifting from `#000000` (Background) to `#121212` (Surface) to `#1A1A1A` (Hover/Active states).
- **The "Rule of Lines":** Instead of using shadows to lift an element, use a 1px solid border. 
- **Z-Index Strategy:** Overlays (like menus or pop-ups) should use a hard 100% opaque black background with a neon green border.
- **Grain:** A global fixed-position overlay with a 3% opacity grain texture should sit atop the entire UI to give it a tactile, "printed" feel.

## Shapes

The shape language is **Zero-Radius**. 

- All buttons, input fields, images, and containers must have perfectly sharp 90-degree corners. 
- **Exceptions:** No exceptions. Even "pills" or "chips" are rendered as sharp rectangles.
- **Decorative Elements:** Use 45-degree diagonal lines to "cut" the corners of image containers or as separators to break the monotony of the vertical/horizontal grid.

## Components

### Buttons
- **Primary:** Sharp black rectangle, 2px neon green border, neon green text (Anton, Uppercase). 
- **Hover State:** Invert to solid neon green background with black text.
- **Secondary:** Transparent with 1px off-white border.

### Chips / Category Labels
- Use `label-technical` typography. Always prefixed with a hash or a square bullet (e.g., "■ FASHION"). 
- Background: Solid `#1A1A1A` with neon green text.

### Input Fields
- Underline style only (1px off-white). Label sits above in `label-technical`.
- Error state: Replace neon green highlights with a high-contrast Signal Red (#FF3131).

### Cards (Editorial)
- No padding inside cards; images should be edge-to-edge within their assigned grid columns. 
- Headlines sit directly below the image, separated by a 1px technical line.
- Use "Brush Stroke" textures as background elements for featured articles to emphasize the "Raw" aesthetic.

### Lists
- Standardize on a "News Ticker" style list. Each item is separated by a horizontal 1px line. 
- Bullet points are replaced with small neon green diagonal slashes (//).

### Navigation
- Vertical navigation on the left-hand side for desktop. 
- Mobile navigation is a full-screen opaque black overlay with massive `display-xl` links.