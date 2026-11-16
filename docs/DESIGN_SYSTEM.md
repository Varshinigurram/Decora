# Décora – Design System Specification

**Document Version:** 1.1.0  
**Phase:** Phase 2 (UI/UX Design & Asset Preparation)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Design Philosophy:** Warm Editorial Architectural Aesthetic  
**Target Platform:** Full-Stack Responsive Web Application

---

## 1. Visual Philosophy & Identity

Décora's visual identity balances **editorial elegance, architectural tactility, and functional clarity**. The design eschews high-saturation commercial sales clutter, synthetic gradient overload, and hyper-rounded mobile cards.

Instead, the interface utilizes:
- A warm, organic neutral palette reflecting natural materials (raw linen, unpolished stone, aged oak, patinated brass, matte iron).
- Structured architectural typography pairing **Cormorant Garamond** (display serif) with **Inter** (neutral, geometric sans-serif for UI, body, and tabular metrics).
- Purposeful whitespace, understated borders, and subtle diffuse elevations that give physical presence to furniture pieces.

---

## 2. Color Palette & Token Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DÉCORA COLOR SYSTEM                             │
├─────────────────┬───────────┬──────────────┬───────────────────────────┤
│ Token Name      │ Hex Code  │ Tailwind Class│ Role / Application        │
├─────────────────┼───────────┼──────────────┼───────────────────────────┤
│ **Ivory**       │ `#F6F3ED` │ `bg-ivory`   │ Primary page canvas, card │
│                 │           │              │ surfaces, input canvas    │
├─────────────────┼───────────┼──────────────┼───────────────────────────┤
│ **Sand**        │ `#D8C8B5` │ `bg-sand`    │ Structural 1px borders,   │
│                 │           │              │ subtle dividers, pill tags│
├─────────────────┼───────────┼──────────────┼───────────────────────────┤
│ **Taupe**       │ `#A58B70` │ `bg-taupe`   │ Secondary accents, warm   │
│                 │           │              │ metal tones, muted badges │
├─────────────────┼───────────┼──────────────┼───────────────────────────┤
│ **Forest**      │ `#35483D` │ `bg-forest`  │ Brand focal accent,       │
│                 │           │              │ active states, primary CTA│
├─────────────────┼───────────┼──────────────┼───────────────────────────┤
│ **Charcoal**    │ `#292824` │ `bg-charcoal`│ Primary headings, buttons,│
│                 │           │              │ high-contrast text        │
└─────────────────┴───────────┴──────────────┴───────────────────────────┘
```

### Extended Functional & Surface Palette
- **Canvas Base Background:** `ivory-base: #F6F3ED`
- **Surface / Card Background:** `ivory-card: #FFFFFF` (pure white for high-definition product cards on ivory canvas)
- **Subtle Surface:** `ivory-subtle: #EDE9E0` (hover layers, input backgrounds)
- **Structural Border:** `sand-border: #D8C8B5` (clean 1px architectural lines)
- **Primary Text:** `charcoal-primary: #292824` (headings, body copy, active labels)
- **Secondary / Muted Text:** `charcoal-muted: #59564F` (metadata, secondary descriptions, table headers)
- **System Accents:**
  - **Success / In Stock:** `accent-success: #35483D` (Forest green badge)
  - **Warning / Low Stock:** `accent-warning: #B46536` (Warm terracotta amber)
  - **Error / Form Invalid:** `accent-error: #9B2C2C` (Deep crimson)
  - **Highlight / Active Selection:** `accent-gold: #C5A059` (Patinated brushed brass)

---

## 3. Accessibility & Contrast Verification Table

To verify accessibility rigor, contrast ratios are calculated based on actual relative luminance values ($L$) under WCAG 2.1 guidelines (Standard AA requires $\ge 4.5:1$ for normal text, $\ge 3:1$ for large text and UI components; AAA requires $\ge 7:1$):

| UI Context | Foreground Element | Background Element | Contrast Ratio | WCAG Compliance Level | Notes & Handling |
|---|---|---|---|---|---|
| **Primary Body & Headings** | Charcoal (`#292824`) | Ivory Canvas (`#F6F3ED`) | **13.2:1** | **Passes AAA** | High legibility for long-form editorial reading. |
| **Primary Headings on White**| Charcoal (`#292824`) | Pure White Card (`#FFFFFF`)| **14.8:1** | **Passes AAA** | Product titles and modal headings. |
| **Secondary / Muted Text** | Charcoal Muted (`#59564F`)| Ivory Canvas (`#F6F3ED`) | **6.5:1** | **Passes AA** (exceeds 4.5:1)| Metadata, metric dimensions, specifications. |
| **Primary Button** | Ivory Text (`#F6F3ED`) | Forest (`#35483D`) | **8.5:1** | **Passes AAA** | High-visibility primary action buttons. |
| **Secondary Button** | Charcoal (`#292824`) | Transparent / Ivory | **13.2:1** | **Passes AAA** | Outlined with 1px Sand border (`#D8C8B5`). |
| **Input Text & Placeholders**| Charcoal (`#292824`) | Input Background (`#FFFFFF`)| **14.8:1** | **Passes AAA** | Input text is crisp. Placeholder is `#59564F` (6.5:1). |
| **Focus Indicator Ring** | Forest (`#35483D`) | Ivory / White Surface | **8.5:1** | **Passes 3:1 UI** | 2px solid focus ring (`ring-2 ring-forest ring-offset-2`). |
| **Active / Selected Swatch** | Forest Ring (`#35483D`) | White offset ring | **8.5:1** | **Passes 3:1 UI** | Unambiguous selected state with inner white border. |
| **Disabled Controls** | Muted Gray (`#9E9B93`) | Ivory Subtle (`#EDE9E0`) | **2.6:1** | **Exempt (Disabled)** | Incompatible options have tooltip explanation. |

*Rule:* Sand (`#D8C8B5`) is strictly utilized for **1px non-text structural borders, subtle divider lines, and card containers**, never for body text on light backgrounds.

---

## 4. Typography Hierarchy

The typography system uses a single, definitive pairing across the entire application:
- **Display Headings:** **`Cormorant Garamond`** (Classic Serif)  
  *Attributes:* Editorial poise, architectural character, high stroke contrast. Used for brand titles, section headings, room names, and editorial intros.
- **Body, UI Controls, Navigation & Numerics:** **`Inter`** (Modern Geometric Sans)  
  *Attributes:* Exceptional x-height, crisp legibility at small sizes, robust tabular figures (`font-variant-numeric: tabular-nums`) for metric dimensions and INR (₹) prices.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TYPOGRAPHIC SCALE                               │
├───────────┬─────────────┬──────────┬────────┬──────────────┬───────────┤
│ Level     │ Size (rem)  │ Pixels   │ Weight │ Line Height  │ Tracking  │
├───────────┼─────────────┼──────────┼────────┼──────────────┼───────────┤
│ Display   │ `3.5rem`    │ 56px     │ 600    │ 1.15         │ -0.02em   │
│ H1        │ `2.5rem`    │ 40px     │ 600    │ 1.2          │ -0.015em  │
│ H2        │ `2.0rem`    │ 32px     │ 600    │ 1.25         │ -0.01em   │
│ H3        │ `1.5rem`    │ 24px     │ 500    │ 1.3          │ 0         │
│ H4        │ `1.25rem`   │ 20px     │ 500    │ 1.4          │ 0         │
│ Subtitle  │ `1.125rem`  │ 18px     │ 400    │ 1.5          │ 0         │
│ Body Base │ `1.0rem`    │ 16px     │ 400    │ 1.6          │ 0         │
│ Body Sm   │ `0.875rem`  │ 14px     │ 400    │ 1.5          │ +0.01em   │
│ Caption   │ `0.75rem`   │ 12px     │ 500    │ 1.4          │ +0.04em   │
│ Overline  │ `0.75rem`   │ 12px     │ 600    │ 1.4          │ +0.08em   │
└───────────┴─────────────┴──────────┴────────┴──────────────┴───────────┘
```

---

## 5. Spacing Scale & Grid System

### Spacing Scale (8px Architectural Base)
- `space-1`: `4px` (micro-spacing, badge padding)
- `space-2`: `8px` (icon gaps, swatch margins)
- `space-3`: `12px` (input padding, compact tags)
- `space-4`: `16px` (standard card padding, element stack)
- `space-6`: `24px` (grid gutters, card internal spacing)
- `space-8`: `32px` (component separation)
- `space-12`: `48px` (section sub-spacing)
- `space-16`: `64px` (major page section margins)
- `space-24`: `96px` (hero and editorial feature padding)

### Responsive Breakpoints
- **Mobile (`xs` to `sm`):** `375px` to `639px` (single column, full-width cards, sliding drawer)
- **Tablet (`md`):** `768px` to `1023px` (2-column grids, collapsible filter sheet)
- **Desktop (`lg`):** `1024px` to `1279px` (3-column catalog, sticky filters, split customizer)
- **Wide Desktop (`xl` to `2xl`):** `1280px` to `1536px+` (4-column catalog, max container width `1280px`)

---

## 6. Shape, Elevation & Borders

### Border Radius (Subtle Architectural Curves)
- **Zero Radius (`rounded-none`):** Architectural image frames, divider lines, and hero blocks.
- **Subtle Curve (`rounded-sm` / `2px`):** Swatches, inputs, and secondary badges.
- **Standard Curve (`rounded` / `4px`):** Product cards, buttons, dropdowns, and modal dialogs.
- **Card Curve (`rounded-md` / `6px`):** Surface panels, price breakdown cards, board containers.
- **Pill (`rounded-full`):** Reserved exclusively for round color swatches and status badges.
- *Strict Rule:* Never use hyper-rounded, bubbled card corners (`rounded-3xl` / `24px`) which undermine the architectural aesthetic.

### Elevations & Shadow Treatments
- **Elevation 0 (Flat):** `border border-sand/40` on surface background. Primary visual language.
- **Elevation 1 (Card Rest):** `box-shadow: 0 1px 3px rgba(41, 40, 36, 0.04), 0 1px 2px rgba(41, 40, 36, 0.02)`
- **Elevation 2 (Card Hover):** `box-shadow: 0 6px 16px rgba(41, 40, 36, 0.06), 0 2px 4px rgba(41, 40, 36, 0.03)` with smooth `-translate-y-0.5` lift.
- **Elevation 3 (Dropdown / Popover):** `box-shadow: 0 10px 24px rgba(41, 40, 36, 0.08)`
- **Elevation 4 (Modal Dialog):** `box-shadow: 0 20px 48px rgba(41, 40, 36, 0.12)` paired with warm backdrop dimming (`bg-charcoal/40`).
