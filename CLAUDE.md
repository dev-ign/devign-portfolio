# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # dev server (uses craco, not react-scripts directly)
npm run build    # production build
npm test         # run tests (craco test)
npm test -- --testPathPattern=App  # run a single test file
```

TypeScript type checking: `npx tsc --noEmit`

## Path Alias

`@/` maps to `src/` via `craco.config.js`. All internal imports use this alias — never use relative `../` paths.

## Routing

React Router v7 (`react-router-dom`). Routes defined in `src/App.tsx`:

| URL | Page | File |
|-----|------|------|
| `/` | Gateway — two-card entry point | `src/pages/GatewayPage.tsx` |
| `/portfolio` | Story / hiring-manager landing | `src/pages/StoryPage.tsx` |
| `/projects` | Card stack showcase | `src/pages/ProjectsPage.tsx` |
| `/projects/:slug` | Case study detail | `src/pages/ProjectDetailPage.tsx` |
| `/work-with-me` | Agency page (8 sections) | `src/pages/WorkWithMePage.tsx` |

The slug matches `Project.id` values from `src/data/projects.ts`.

## Architecture

**No traditional navigation bar** — the Story page has the brand name as a link to `/projects`, and the Projects page header links back to `/`. The old `Navigation.tsx` / `AppBar` is part of the legacy code only.

**Dual-context system** — wraps the entire router in `src/App.tsx`:
- `ThemeContext` — light/dark mode, persisted to localStorage, default dark. Wraps `MuiThemeProvider` from `@mui/material`. MUI theme objects are defined in `src/theme/theme.ts`. Sets `body[data-theme]` on change.
- `AudienceContext` — `"ux"` | `"dev"` mode. Sets `body[data-mode]` on change, which drives `--accent-active` CSS variable.

**Per-page body attribute** — each page sets `body[data-page]` on mount and removes it on unmount. CSS token overrides target this attribute:
- `body[data-page='story']` / `body[data-page='projects']` / `body[data-page='project-detail']` / `body[data-page='work-with-me']` → warm off-white canvas (`--bg: #E8E7E1`)
- `body[data-page='gateway']` → near-black canvas (`--bg: #0C0C0E`), `overflow: hidden`

**Project data** (`src/data/projects.ts`) is the single source of truth for all three pages. The `Project` interface includes typed `CaseStudySection` variants (`paragraph` | `bullets` | `metrics` | `imagestrip`) and `accentColor: string` used by the ambient orb on the Projects page.

**Current projects** (7 total, in display order):
`gravyty-template-manager`, `gravyty-donor-directory`, `urge-talent`, `small-wrld-music`, `givzey-landing`, `el-chancletazo`, `gradum-group`

## Page Breakdown

### StoryPage (`/`)
- Off-white background, centered 560px column, no nav chrome
- "devign" wordmark top-right links to `/projects`
- Sequential animation order: logo → typewriter heading → staggered paragraphs → "projects →" link → ControlBar
- Typewriter: `motion` staggerChildren on `<h1>` with per-character `<motion.span>` (each char `opacity: 0 → 1`)
- Body animation starts via `onAnimationComplete` on the heading container (`headingDone` state)
- ControlBar appears after last paragraph animates (`bodyDone` state)

### ProjectsPage (`/projects`)
- Locks `document.body.style.overflow = 'hidden'` while mounted
- State: `activeIndex`, `direction` (1 = forward, -1 = backward), `isAnimating` ref with 680ms lock
- Events: `wheel` (desktop), `touchstart`/`touchend` (mobile), `keydown` (arrow keys)
- Card flip: `AnimatePresence mode="wait"` on the active card with custom direction variants
- Peeking cards behind active: rendered with decreasing `scale` and `opacity` via `animate` prop
- Dot indicators and thumbnail tabs both call `jumpTo(index)`

### ProjectDetailPage (`/projects/:slug`)
- Reads slug from `useParams`, finds project in `projects` array
- Ken Burns hero image (CSS `transform: scale` transition on mount)
- Reuses `CaseStudyContent` component from the legacy panel for section rendering

## Component Organization

```
src/
  pages/
    GatewayPage.tsx         # full-screen two-card entry point
    StoryPage.tsx           # /portfolio — typewriter + sequential animations
    ProjectsPage.tsx        # card stack showcase — owns scroll/swipe state
    ProjectDetailPage.tsx   # case study full page
    WorkWithMePage.tsx      # /work-with-me — 8-section agency page
  components/
    gateway/
      GatewayCard.tsx       # dark/warm themed card with orb hover (gsap.quickTo)
    work-with-me/
      Hero.tsx              # full-viewport hero, GSAP entrance, ghost outline headline
      Services.tsx          # 6 service cards with Solar icons, GSAP stagger
      WhyWorkWithMe.tsx     # 4 ruled statements, GSAP scrub opacity
      Process.tsx           # 4 steps — pinned desktop (GSAP matchMedia), stacked mobile (Motion)
      ProjectStartingPoints.tsx  # 3 pricing tiers, GSAP fade stagger
      BusinessOutcomes.tsx  # dark contrast section, Motion whileInView
      InquiryForm.tsx       # 5-step form, direction-aware slide transitions, EmailJS, success state
      FAQ.tsx               # AnimatePresence accordion, + rotates to ×
    story/
      ControlBar.tsx        # fixed bottom pill bar (Work together / Resume)
      ProjectOrb.tsx        # fixed-position orbital ring of project images
    showcase/
      CardStack.tsx         # visual card stack renderer (receives props from ProjectsPage)
      ShowcaseCard.tsx      # individual project card (dark glass, 4:3, navigate on click)
      ShowcaseHeader.tsx    # top header (brand + subtitle + thumbnail tabs)
      AmbientOrb.tsx        # animated blurred color orb behind cards
    panel/                  # CaseStudyPanel + CaseStudyContent (used by detail page)
    hero/ nav/ projects/ sections/  # legacy components, preserved
    ui/
      SectionHeader.tsx     # kicker + title + subtitle pattern (legacy)
  animations/
    gatewayAnimations.ts    # entrance timeline + orb quickTo hover
    workWithMeAnimations.ts # hero reveal, services stagger, why scrub, process pin, fade stagger
  context/
    ThemeContext.tsx         # light/dark mode + MuiThemeProvider wrapper
    AudienceContext.tsx      # ux/dev mode + body[data-mode] attribute
  data/
    projects.ts             # all project data + case study content + typed interfaces
  hooks/
    useGSAPContext.ts        # re-exports useGSAP from @gsap/react
    useLenis.ts             # Lenis init + gsap.ticker sync + ScrollTrigger.update
    useScrollReveal.ts      # IntersectionObserver reveal hook
    useMediaQuery.ts        # exports useIsMobile() — true when viewport < 640px
  theme/
    theme.ts                # MUI lightTheme / darkTheme objects
```

## Styling Conventions

- Off-white pages use `#E8E7E1` background set directly on the root div — not via MUI theme
- `var(--bg)`, `var(--text)`, `var(--border)` CSS vars automatically update via `body[data-page]` attribute
- `var(--accent-active)` transitions between `#c9f04d` (UX mode) and `#4df0c6` (Dev mode) via `body[data-mode]`
- Animation library: `motion` package v12, imported from `motion/react` — **not** `framer-motion`
- Framer Motion ease arrays must be typed `as [number, number, number, number]` for TypeScript compatibility
- `AnimatePresence mode="wait"` is used for card transitions; `mode="sync"` is NOT used as it causes overlap issues during the flip
- `AmbientOrb` animates `backgroundColor` (not gradients — `motion` doesn't interpolate CSS gradient strings)
- Icons: `@iconify/react` — usage `<Icon icon="solar:..." />`

## Animation Architecture

Three libraries with distinct roles — never mix them on the same element:

| Library | Role |
|---------|------|
| `motion/react` (v12, NOT framer-motion) | Hovers, FAQ accordion, InquiryForm step transitions, success state |
| GSAP + ScrollTrigger | Entrance sequences, scroll-driven scrubs, process section pin |
| Lenis | Smooth scroll on `/work-with-me` only |

- `ScrollTrigger` registered once globally in `src/index.tsx`
- All GSAP timelines live in `src/animations/` — never inline in components
- `useGSAPContext` (re-exports `useGSAP` from `@gsap/react`) handles `gsap.context()` cleanup on unmount
- `useLenis` drives Lenis via `gsap.ticker` so ScrollTrigger stays in sync with smoothed scroll position; active on `/work-with-me` only
- Process section: GSAP `matchMedia` pin on `≥640px`, Motion `whileInView` stagger on mobile
- Ease arrays typed `as [number, number, number, number]` for TypeScript compatibility

## Environment Variables

`src/.env` holds `REACT_APP_EMAILJS_PUBLIC_KEY` — used by `InquiryForm.tsx` on `/work-with-me` (service `portfolio-gmail`, template `template_mzi5nzb`). Also referenced by the legacy contact form in `LegacyAppContent` (commented out in `App.tsx`).

## Legacy Code

The old single-page layout (dark theme, HeroSection, ProjectCard grid, CaseStudyPanel, EmailJS contact form) is preserved as a multi-line comment block at the bottom of `src/App.tsx`. All components it referenced remain in `src/components/`. The `devignux-portfolio-upgrade.md` file at the repo root is the original implementation spec that drove the current refactor.
