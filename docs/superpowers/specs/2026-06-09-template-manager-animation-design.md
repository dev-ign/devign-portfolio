# Template Manager Animation — Design Spec

**Date:** 2026-06-09
**Component:** `src/components/showcase/TemplateManagerAnimation.tsx`
**Mirrors:** `src/components/showcase/DonorDirectoryAnimation.tsx`

---

## Context

The ProjectCarousel already uses `DonorDirectoryAnimation` as a custom animated SVG in place of a static screenshot for the Donor Directory project. Template Manager (`gravyty-template-manager`) currently shows `template-manager-project.svg` as a static image. This spec describes a looping animated SVG component that replaces it, communicating the product's core workflow: selecting a template, copying it to a library category, and receiving a success confirmation.

---

## Visual Story

> "I designed a workflow for organizing, copying, and managing shared fundraising templates."

The animation walks through one complete copy-to-library action:

1. **Idle** — Template list at rest, sidebar visible
2. **Row activates** — One template row highlights with accent border
3. **Action menu opens** — Small dropdown: Copy / Move / Set Default
4. **Destination folder highlights** — "Annual Fund" folder in sidebar pulses
5. **Template ghost slides to folder** — Semi-transparent copy moves from row to folder and fades in
6. **Success pill appears** — "Copied to Annual Fund" confirmation near the folder
7. **Hold + reset** — State held briefly, then everything fades for the next loop

---

## Implementation

**Pattern:** React component, pure inline SVG + `motion/react` animated props. No new dependencies. Identical architecture to `DonorDirectoryAnimation.tsx`.

**File:** `src/components/showcase/TemplateManagerAnimation.tsx`

**SVG:**
- ViewBox: `900 × 560`
- Background: `#0f0f1a`
- Accent color: `#7B8CDE` (matches `Project.accentColor` for `gravyty-template-manager`)
- Loop duration: `8s`, `repeat: Infinity`

---

## Layout

```
┌─────────────────────────────────────────────────────────┐
│  Top nav bar — full width, y 0–50                       │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │ Toolbar  (y 50–94)                           │
│ x 0–188  ├──────────────────────────────────────────────┤
│          │ Table header  (y 94–130)                     │
│ Libraries├──────────────────────────────────────────────┤
│          │ Row 1 — static idle                          │
│ Annual   │ Row 2 — static idle                          │
│  Fund ←  │ Row 3 — ACTIVE (y 226–274)  ← animated      │
│ Year-End │ Row 4 — static idle                          │
│ Events   │ Row 5 — static idle                          │
│ Steward. │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Sidebar** (x 0–188, y 50–560):
- Background: `#0d0d1e`, right border `#2a2a44`
- "Libraries" section label
- Five folder items: Annual Fund (y 140–170), Year-End, Events, Stewardship, Major Gifts
- Each folder: small icon rect + label rect

**Main content** (x 189–900):
- Toolbar (y 50–94): page title, filter pills, "New Template" CTA button
- Table header (y 94–130): Name / Category / Modified / Status column labels
- Rows (y 130+): five rows of 48px height each; Row 3 (y 226–274) is the animated row
- Row content: template icon + name + category pill + modified date + status badge + action dots

---

## Animated Elements

All five are `motion` elements; everything else is static `<rect>` / `<circle>`.

### 1. `row-highlight`
- `motion.rect` at y=226, full width of main area
- Tinted background (`#1e1638`) + `motion.rect` 3px accent bar on left edge
- Fade in at 1s, hold, fade out at 7.5s

### 2. `action-menu`
- `motion.g` positioned at x≈720, y≈205 (above the row's action button)
- Rounded rect background + three label rects (Copy / Move / Set Default)
- "Copy" item has accent-tinted background to show it's highlighted
- Scale from 0.88→1 + opacity 0→1 at 2s; fade out at 7.5s

### 3. `folder-highlight`
- `motion.rect` background behind Annual Fund folder item (x=1, y=140, w=186, h=30)
- 3px accent bar on left edge (`motion.rect`)
- Fade in at 3s, hold, fade out at 7.5s

### 4. `template-ghost`
- `motion.g` containing a small semi-transparent template card (icon + two label rects)
- Starts at `x=400, y=230` (center of active row)
- Animates to `x=20, y=148` (inside Annual Fund folder) over 1 second
- opacity: 0 → 0.7 → 0 (appears, moves, fades into folder)
- Active window: 4s–5s only

### 5. `success-pill`
- `motion.g` at x=14, y=172 (just below Annual Fund folder)
- Rounded rect background with accent border + "Copied to Annual Fund" label rect
- Small checkmark icon (two small rects forming a tick)
- Fade in + slide up 6px at 5s; hold until 7s; fade out by 7.5s

---

## Timing Table

| Event | Time | `t` (÷8) |
|---|---|---|
| Idle | 0–1s | 0–0.125 |
| Row highlight in | 1s | 0.125 |
| Action menu in | 2s | 0.250 |
| Folder highlight in | 3s | 0.375 |
| Ghost appear + move | 4–5s | 0.500–0.625 |
| Success pill in | 5s | 0.625 |
| Hold | 6–7s | 0.750–0.875 |
| Reset (all fade out) | 7–8s | 0.875–1.0 |

---

## Wire-up in ProjectCarousel

Add one condition alongside the existing Donor Directory check:

```tsx
project.id === 'gravyty-template-manager' ? (
  <TemplateManagerAnimation className="h-full w-full" />
) : project.id === 'gravyty-donor-directory' ? (
  <DonorDirectoryAnimation className="h-full w-full" />
) : (
  <img ... />
)
```

---

## What is NOT animated

- Every other template row
- The sidebar nav items above "Libraries"
- Column headers
- Pagination / toolbar buttons

---

## Verification

1. `npm start` — navigate to `/projects`, switch to "Code" tab
2. Template Manager card appears and loops the 8-second animation
3. Animation timing matches the spec table above
4. No console errors from `motion/react` or TypeScript (`npx tsc --noEmit`)
5. The ghost element does not visually overflow the card boundary (`overflow-hidden` is on the article wrapper in `ProjectCarousel`)
