# Design System Specification: Civic Clarity

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Architect"**

In the realm of civic-tech, "government-grade" often translates to "utilitarian and cold." This design system rejects that premise. Our vision is **The Digital Architect**: a system that feels as structural and permanent as a city’s foundation, yet as light and breathable as its parks. 

We move beyond the "template" look by utilizing **intentional asymmetry** and **tonal depth**. Instead of rigid grids, we use expansive white space and "The Layering Principle" to guide the eye. This creates an editorial experience where data feels like a curated story rather than a spreadsheet. High-contrast typography ensures inclusivity for elderly citizens, while sophisticated glassmorphism keeps the aesthetic firmly in the future.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, authoritative blues, balanced by a sophisticated spectrum of neutral surfaces.

### The Palette
- **Primary (Trust & Authority):** `primary: #00478d` used for high-level branding and primary CTAs.
- **Surface Hierarchy:** 
    - `surface: #f7f9ff` (The Base)
    - `surface_container_low: #f2f3f9` (Secondary areas)
    - `surface_container_highest: #e0e2e8` (Deepest accents)
- **Status System:** 
    - **Alert:** `error: #ba1a1a` 
    - **Pending/Warning:** `secondary: #535e78` (Use for medium priority to avoid "traffic light" fatigue)
    - **Resolved:** `tertiary: #005247`

### The "No-Line" Rule
To achieve a premium, editorial feel, **1px solid borders are prohibited for sectioning.** 
- Define boundaries through background color shifts. A `surface_container_low` sidebar should sit against a `surface` main content area. 
- Use the **Glass & Gradient Rule**: For floating headers or environmental category navigation, use `surface_container_lowest` at 80% opacity with a `backdrop-blur: 12px`. 

---

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance character with extreme legibility.

- **Display & Headlines (Public Sans):** Chosen for its geometric stability. 
    - `display-lg`: 3.5rem. Use sparingly for high-level city metrics.
    - `headline-md`: 1.75rem. The standard for section titles.
- **Body & Labels (Inter):** A tall x-height makes this ideal for elderly accessibility.
    - `body-lg`: 1.0rem (Base size). This is the minimum for any civic information to ensure readability.
    - `title-md`: 1.125rem. Used for card headers and navigation items.

*Note: Use `primary_fixed_variant` for body text on light backgrounds to maintain a softer, more sophisticated contrast than pure black.*

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0" for a modern smart city. We define depth through **Tonal Layering**.

- **The Layering Principle:** Stack `surface_container_lowest` components (the "paper") onto `surface_container_low` backgrounds (the "desk"). This provides a natural, physical lift.
- **Ambient Shadows:** Only use shadows for floating elements (modals/drawers). 
    - Blur: `24px` to `40px`. 
    - Opacity: `4% - 8%`. 
    - Color: Use a tint of `on_surface` (e.g., a very dark navy) rather than grey.
- **The Ghost Border:** If a container sits on an identical color (rare), use `outline_variant` at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Cards & Data Containers
Cards are the heart of this system. 
- **Style:** No borders. Use `surface_container_lowest` for the card body. 
- **Spacing:** Use `spacing-6` (2rem) for internal padding to give data "room to breathe."
- **Nesting:** If a card contains sub-sections (e.g., specific water quality metrics), use a `surface_container` background for the sub-section rather than a divider line.

### Buttons (Touch-Friendly)
Targeted at a diverse demographic, buttons must be substantial.
- **Primary:** `primary` background with `on_primary` text. Use `roundedness-md` (0.375rem).
- **Secondary:** `secondary_container` background.
- **Signature CTA:** For the "Report an Issue" button, use a subtle linear gradient from `primary` to `primary_container` to give it a "glass-topped" finish.

### Environmental Iconography
Icons (Waste, Water, Air, Noise) must be enclosed in circular `tertiary_container` backgrounds. This creates a clear visual anchor for non-native speakers and elderly users who rely on visual cues over text.

### Sidebar Navigation
- Use `surface_container_low` for the sidebar background.
- Active states must not use a box; use a "pill" indicator ( `roundedness-full`) in `primary_fixed` with `on_primary_fixed_variant` text.

---

## 6. Do's and Don'ts

### Do:
- **Use Vertical Rhythm:** Use `spacing-8` (2.75rem) between major sections to prevent the UI from feeling "cluttered."
- **Prioritize Contrast:** Ensure all "On-Surface" text meets AAA standards against its specific container tier.
- **Leverage Asymmetry:** Place large `display-sm` stats offset to the left with descriptive `body-lg` text to the right for an editorial feel.

### Don't:
- **Don't use Dividers:** Never use `<hr>` or 1px lines to separate list items. Use `spacing-3` and subtle background shifts.
- **Don't use Pure Black:** It is too harsh. Use `on_surface` (#191c20) for all text.
- **Don't "Box" everything:** Allow iconography and large headlines to sit directly on the `surface` without a container to maintain a sense of openness.