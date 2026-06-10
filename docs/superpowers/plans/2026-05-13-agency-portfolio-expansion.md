# Agency + Portfolio Dual Experience — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GatewayPage at `/` routing visitors to `/portfolio` or `/work-with-me`, and build a conversion-focused agency page at `/work-with-me` with 8 sections and a 5-step inquiry form.

**Architecture:** Additive — nothing in the existing portfolio routes changes. New pages live alongside existing ones. GSAP handles scroll/entrance animations; Motion v12 handles component-level micro-interactions; Lenis provides smooth scroll on the agency page only.

**Tech Stack:** React 19, TypeScript, GSAP 3 + ScrollTrigger + @gsap/react, Lenis, motion/react v12, @iconify/react, EmailJS

---

## File Structure

### New files
- `src/pages/GatewayPage.tsx` — full-screen gateway with two cards
- `src/pages/WorkWithMePage.tsx` — 8-section agency page shell
- `src/components/gateway/GatewayCard.tsx` — reusable card (dark/warm themes)
- `src/components/work-with-me/Hero.tsx`
- `src/components/work-with-me/Services.tsx`
- `src/components/work-with-me/WhyWorkWithMe.tsx`
- `src/components/work-with-me/Process.tsx`
- `src/components/work-with-me/ProjectStartingPoints.tsx`
- `src/components/work-with-me/BusinessOutcomes.tsx`
- `src/components/work-with-me/InquiryForm.tsx`
- `src/components/work-with-me/FAQ.tsx`
- `src/hooks/useGSAPContext.ts` — re-exports useGSAP from @gsap/react
- `src/hooks/useLenis.ts` — Lenis + GSAP ticker integration
- `src/animations/gatewayAnimations.ts` — entrance timeline + orb quickTo
- `src/animations/workWithMeAnimations.ts` — hero reveal, services stagger, process pin, scrubs

### Modified files
- `package.json` — add gsap, @gsap/react, lenis
- `src/index.tsx` — gsap.registerPlugin(ScrollTrigger)
- `src/App.tsx` — new routes (/, /portfolio, /work-with-me)
- `src/index.css` — body[data-page] tokens for 'gateway' and 'work-with-me'
- `src/components/showcase/ShowcaseHeader.tsx` — update `to="/"` → `to="/portfolio"`
- `CLAUDE.md` — Phase 2 documentation

---

## Phase 1: Foundation

### Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install GSAP, @gsap/react, Lenis**

```bash
cd devign && npm install gsap @gsap/react lenis
```

Expected: packages added, no peer-dep errors.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add gsap, @gsap/react, lenis dependencies"
```

---

### Task 2: Register plugin + update routing + fix internal links

**Files:**
- Modify: `src/index.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `src/components/showcase/ShowcaseHeader.tsx`

- [ ] **Step 1: Register ScrollTrigger in src/index.tsx**

Add after existing imports in `src/index.tsx`:
```tsx
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

- [ ] **Step 2: Create stub pages so the app compiles**

`src/pages/GatewayPage.tsx`:
```tsx
import React from 'react';
const GatewayPage: React.FC = () => (
  <div style={{ minHeight: '100dvh', background: '#0C0C0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>Gateway — coming soon</p>
  </div>
);
export default GatewayPage;
```

`src/pages/WorkWithMePage.tsx`:
```tsx
import React from 'react';
const WorkWithMePage: React.FC = () => (
  <div style={{ minHeight: '100dvh', background: '#E8E7E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ color: '#0C0C0E', fontFamily: 'var(--font-mono)' }}>Work With Me — coming soon</p>
  </div>
);
export default WorkWithMePage;
```

- [ ] **Step 3: Update App.tsx routes**

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AudienceProvider } from '@/context/AudienceContext';
import GatewayPage from '@/pages/GatewayPage';
import StoryPage from '@/pages/StoryPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import WorkWithMePage from '@/pages/WorkWithMePage';

const App: React.FC = () => (
  <ThemeProvider>
    <AudienceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GatewayPage />} />
          <Route path="/portfolio" element={<StoryPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/work-with-me" element={<WorkWithMePage />} />
        </Routes>
      </BrowserRouter>
    </AudienceProvider>
  </ThemeProvider>
);

export default App;
// (legacy comment block below is preserved)
```

- [ ] **Step 4: Fix ShowcaseHeader link — `to="/"` → `to="/portfolio"`**

In `src/components/showcase/ShowcaseHeader.tsx` line 41.

- [ ] **Step 5: Add CSS tokens for new pages in src/index.css**

Add after the `body[data-page='story']` block:
```css
/* ── Gateway — full-dark viewport ── */
body[data-page='gateway'] {
  --bg: #0C0C0E;
  --surface: #0C0C0E;
  --card: #18181c;
  --border: rgba(255, 255, 255, 0.08);
  --text: rgba(255, 255, 255, 0.87);
  --dim: rgba(255, 255, 255, 0.45);
  --muted: rgba(255, 255, 255, 0.28);
}
body[data-page='gateway']::after {
  opacity: 0.18;
}

/* ── Work With Me — warm editorial ── */
body[data-page='work-with-me'] {
  --bg: #E8E7E1;
  --surface: #E8E7E1;
  --card: #DDDCD6;
  --border: rgba(0, 0, 0, 0.07);
  --text: #1A1A1A;
  --dim: #6B6B65;
  --muted: rgba(0, 0, 0, 0.35);
}
body[data-page='work-with-me']::after {
  opacity: 0.04;
}
```

- [ ] **Step 6: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Smoke test**

```bash
npm start
```

Verify:
- `/` shows the dark stub page
- `/portfolio` shows StoryPage (typewriter animation works)
- `/projects` works unchanged
- `/work-with-me` shows warm stub

- [ ] **Step 8: Commit**

```bash
git add src/index.tsx src/App.tsx src/index.css src/pages/GatewayPage.tsx src/pages/WorkWithMePage.tsx src/components/showcase/ShowcaseHeader.tsx
git commit -m "feat: add routing for gateway + work-with-me, register ScrollTrigger, fix portfolio link"
```

---

### Task 3: Create shared hooks

**Files:**
- Create: `src/hooks/useGSAPContext.ts`
- Create: `src/hooks/useLenis.ts`

- [ ] **Step 1: Create useGSAPContext.ts**

```ts
// src/hooks/useGSAPContext.ts
// Re-export useGSAP from @gsap/react under the project-preferred name.
// All GSAP animations/ScrollTriggers created inside the callback are killed
// automatically on component unmount via gsap.context(). Pass scope for
// selector scoping to a container ref.
export { useGSAP as useGSAPContext } from '@gsap/react';
```

- [ ] **Step 2: Create useLenis.ts**

```ts
// src/hooks/useLenis.ts
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis();

    // Keep ScrollTrigger in sync with Lenis-driven scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for consistent timing
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useGSAPContext.ts src/hooks/useLenis.ts
git commit -m "feat: add useGSAPContext and useLenis hooks"
```

---

## Phase 2: GatewayPage

### Task 4: Create gatewayAnimations.ts

**Files:**
- Create: `src/animations/gatewayAnimations.ts`

- [ ] **Step 1: Create src/animations/gatewayAnimations.ts**

```ts
// src/animations/gatewayAnimations.ts
import { gsap } from 'gsap';

export function runGatewayEntrance(
  wordmark: HTMLElement,
  tagline: HTMLElement,
  leftCard: HTMLElement,
  rightCard: HTMLElement
) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .from(wordmark, { autoAlpha: 0, y: 14, duration: 0.75 })
    .from(tagline, { autoAlpha: 0, y: 10, duration: 0.6 }, '-=0.45')
    .from(leftCard, { autoAlpha: 0, x: -48, duration: 0.75 }, '-=0.35')
    .from(rightCard, { autoAlpha: 0, x: 48, duration: 0.75 }, '<');
  return tl;
}

// Attaches smooth orb tracking to a card/orb pair using gsap.quickTo.
// Returns a cleanup function to remove the event listeners.
export function attachOrbHover(card: HTMLElement, orb: HTMLElement) {
  const xTo = gsap.quickTo(orb, 'x', { duration: 0.8, ease: 'power3.out' });
  const yTo = gsap.quickTo(orb, 'y', { duration: 0.8, ease: 'power3.out' });

  const onMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    xTo(e.clientX - rect.left - rect.width / 2);
    yTo(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);

  return () => {
    card.removeEventListener('mousemove', onMove);
    card.removeEventListener('mouseleave', onLeave);
  };
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/animations/gatewayAnimations.ts
git commit -m "feat: add gateway entrance animation + quickTo orb hover"
```

---

### Task 5: Create GatewayCard.tsx

**Files:**
- Create: `src/components/gateway/GatewayCard.tsx`

- [ ] **Step 1: Create GatewayCard.tsx**

```tsx
// src/components/gateway/GatewayCard.tsx
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attachOrbHover } from '@/animations/gatewayAnimations';

export interface GatewayCardProps {
  title: string;
  description: string;
  cta: string;
  destination: string;
  theme: 'dark' | 'warm';
}

const GatewayCard: React.FC<GatewayCardProps> = ({
  title, description, cta, destination, theme,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!cardRef.current || !orbRef.current) return;
    return attachOrbHover(cardRef.current, orbRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => navigate(destination)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(destination)}
      aria-label={`Go to ${title}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        padding: 'clamp(36px, 5vw, 56px) clamp(28px, 4vw, 44px)',
        cursor: 'pointer',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: isDark ? 'rgba(16, 16, 20, 0.92)' : '#DDDCD6',
        border: isDark
          ? '1px solid rgba(255,255,255,0.07)'
          : '1px solid rgba(0,0,0,0.1)',
        backdropFilter: isDark ? 'blur(24px)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(24px)' : undefined,
        transition: 'border-color 0.35s ease, transform 0.35s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.borderColor = isDark
          ? 'rgba(255,255,255,0.14)'
          : 'rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.borderColor = isDark
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(0,0,0,0.1)';
      }}
    >
      {/* Ambient hover orb */}
      <div
        ref={orbRef}
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(77,240,198,0.09) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(176,110,243,0.11) 0%, transparent 65%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.3)',
          marginBottom: '20px',
        }}>
          devignUX /
        </div>
        <h2 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(32px, 4vw, 48px)',
          color: isDark ? '#fff' : '#0C0C0E',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: '0 0 14px',
        }}>
          {title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
          lineHeight: 1.65,
          margin: 0,
          maxWidth: '260px',
        }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '32px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: isDark ? 'var(--accent-teal)' : '#0C0C0E',
        }}>
          {cta}
        </span>
      </div>
    </div>
  );
};

export default GatewayCard;
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/gateway/GatewayCard.tsx
git commit -m "feat: add GatewayCard with hover orb animation"
```

---

### Task 6: Build GatewayPage

**Files:**
- Modify: `src/pages/GatewayPage.tsx` — replace stub with full implementation

- [ ] **Step 1: Replace GatewayPage stub with full implementation**

```tsx
// src/pages/GatewayPage.tsx
import React, { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runGatewayEntrance } from '@/animations/gatewayAnimations';
import GatewayCard from '@/components/gateway/GatewayCard';

const GatewayPage: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute('data-page', 'gateway');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.removeAttribute('data-page');
      document.body.style.overflow = '';
    };
  }, []);

  useGSAPContext(() => {
    if (headerRef.current && taglineRef.current && leftRef.current && rightRef.current) {
      runGatewayEntrance(
        headerRef.current,
        taglineRef.current,
        leftRef.current,
        rightRef.current
      );
    }
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0C0C0E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)',
      gap: '48px',
    }}>
      {/* Header */}
      <div ref={headerRef} style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(26px, 3.5vw, 38px)',
          color: '#fff',
          letterSpacing: '-0.03em',
        }}>
          devign<span style={{ color: 'var(--accent-teal)' }}>UX</span>
        </div>
        <p ref={taglineRef} style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(13px, 1.4vw, 15px)',
          color: 'rgba(255,255,255,0.38)',
          marginTop: '10px',
          marginBottom: 0,
          fontWeight: 300,
          maxWidth: '420px',
        }}>
          Design-driven digital experiences for brands, businesses, and modern products.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '16px',
        width: '100%',
        maxWidth: '880px',
      }}>
        <div ref={leftRef}>
          <GatewayCard
            title="Portfolio"
            description="Product design, UX engineering, and frontend systems for modern teams."
            cta="View Work →"
            destination="/portfolio"
            theme="dark"
          />
        </div>
        <div ref={rightRef}>
          <GatewayCard
            title="Work With Me"
            description="Premium websites and digital experiences built to help businesses grow."
            cta="Start a Project →"
            destination="/work-with-me"
            theme="warm"
          />
        </div>
      </div>
    </div>
  );
};

export default GatewayPage;
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Browser verify**

Navigate to `http://localhost:3000`:
- Wordmark + tagline fade in, cards slide in from left/right
- Hover each card — orb tracks cursor position smoothly
- Click Portfolio → `/portfolio` (StoryPage loads)
- Click Work With Me → `/work-with-me` (stub loads)

- [ ] **Step 4: Commit**

```bash
git add src/pages/GatewayPage.tsx
git commit -m "feat: implement GatewayPage with GSAP entrance and card hover orbs"
```

---

## Phase 3: WorkWithMePage — Hero + Services

### Task 7: Create workWithMeAnimations.ts

**Files:**
- Create: `src/animations/workWithMeAnimations.ts`

- [ ] **Step 1: Create workWithMeAnimations.ts**

```ts
// src/animations/workWithMeAnimations.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Hero headline lines stagger up + fade in on load
export function runHeroReveal(elements: HTMLElement[]) {
  gsap.from(elements, {
    autoAlpha: 0,
    y: 56,
    stagger: 0.12,
    duration: 0.9,
    ease: 'power3.out',
  });
}

// Service cards fade+rise when section enters viewport
export function runServicesStagger(cards: HTMLElement[]) {
  if (!cards.length) return;
  gsap.from(cards, {
    autoAlpha: 0,
    y: 28,
    stagger: 0.07,
    duration: 0.65,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: cards[0].parentElement!,
      start: 'top 82%',
      once: true,
    },
  });
}

// Why Work With Me: each statement scrubs from dim to full opacity
export function initWhyScrub(statements: HTMLElement[]) {
  statements.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0.08 },
      {
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1.2,
        },
      }
    );
  });
}

// Generic stagger fade-up: used for project tiers and business outcomes
export function runFadeStagger(elements: HTMLElement[], triggerEl: HTMLElement) {
  gsap.from(elements, {
    autoAlpha: 0,
    y: 20,
    stagger: 0.09,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top 80%',
      once: true,
    },
  });
}

// Process pin (desktop ≥640px only): section stays fixed, steps reveal sequentially.
// Returns the matchMedia instance — call mm.revert() in useGSAPContext cleanup.
export function initProcessPin(section: HTMLElement, stepEls: HTMLElement[]) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 640px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${stepEls.length * 420}`,
        pin: true,
        scrub: 0.6,
      },
    });

    stepEls.forEach((step, i) => {
      if (i === 0) return;
      const offset = i * 0.25;
      tl.from(step, { autoAlpha: 0, y: 32, duration: 0.25 }, offset);
      tl.to(stepEls[i - 1], { autoAlpha: 0.25, duration: 0.2 }, offset);
    });

    return () => {};
  });

  return mm;
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/animations/workWithMeAnimations.ts
git commit -m "feat: add WorkWithMe animation utilities"
```

---

### Task 8: WorkWithMePage shell + Hero

**Files:**
- Create: `src/components/work-with-me/Hero.tsx`
- Modify: `src/pages/WorkWithMePage.tsx`

- [ ] **Step 1: Create Hero.tsx**

```tsx
// src/components/work-with-me/Hero.tsx
import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runHeroReveal } from '@/animations/workWithMeAnimations';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    const els = [line1Ref, line2Ref, subRef, ctaRef]
      .map(r => r.current)
      .filter((el): el is HTMLElement => el !== null);
    runHeroReveal(els);
  }, { scope: containerRef, dependencies: [] });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#E8E7E1',
        position: 'relative',
      }}
    >
      {/* Eyebrow */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.36)',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'currentColor' }} />
        devignUX · Web Design & Development · Tampa, FL
      </div>

      {/* Headline line 1 */}
      <div ref={line1Ref}>
        <h1 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(48px, 9vw, 108px)',
          color: '#0C0C0E',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          margin: 0,
        }}>
          Let's build something
        </h1>
      </div>

      {/* Headline line 2 — ghost/outline treatment */}
      <div ref={line2Ref}>
        <h1 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(48px, 9vw, 108px)',
          color: 'transparent',
          WebkitTextStroke: '1.5px #0C0C0E',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          margin: '0 0 36px',
        }}>
          great together.
        </h1>
      </div>

      {/* Subheadline */}
      <p ref={subRef} style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 300,
        fontSize: 'clamp(15px, 1.8vw, 19px)',
        color: 'rgba(0,0,0,0.5)',
        lineHeight: 1.65,
        maxWidth: '460px',
        margin: '0 0 44px',
      }}>
        I help businesses create digital experiences that convert, retain, and grow.
      </p>

      {/* CTAs */}
      <div ref={ctaRef} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={() => scrollTo('inquiry')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: '#0C0C0E',
            color: '#E8E7E1',
            border: 'none',
            borderRadius: '100px',
            padding: '15px 30px',
            cursor: 'pointer',
          }}
        >
          Start a Project
        </button>
        <button
          onClick={() => scrollTo('services')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: 'transparent',
            color: '#0C0C0E',
            border: '1px solid rgba(0,0,0,0.18)',
            borderRadius: '100px',
            padding: '15px 30px',
            cursor: 'pointer',
          }}
        >
          See My Work ↓
        </button>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Update WorkWithMePage.tsx (replace stub, add Hero + useLenis)**

```tsx
// src/pages/WorkWithMePage.tsx
import React, { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Hero from '@/components/work-with-me/Hero';

const WorkWithMePage: React.FC = () => {
  useLenis();

  useEffect(() => {
    document.body.setAttribute('data-page', 'work-with-me');
    return () => document.body.removeAttribute('data-page');
  }, []);

  return (
    <div style={{ background: '#E8E7E1', minHeight: '100dvh' }}>
      <Hero />
      {/* Services, WhyWorkWithMe, Process, ProjectStartingPoints, BusinessOutcomes, InquiryForm, FAQ — added in Phases 3–5 */}
    </div>
  );
};

export default WorkWithMePage;
```

- [ ] **Step 3: Type check + browser verify**

```bash
npx tsc --noEmit
```

Visit `/work-with-me` — hero text staggers in, scroll feels smooth (Lenis).

- [ ] **Step 4: Commit**

```bash
git add src/pages/WorkWithMePage.tsx src/components/work-with-me/Hero.tsx
git commit -m "feat: add WorkWithMePage with Lenis + Hero GSAP reveal"
```

---

### Task 9: Services section

**Files:**
- Create: `src/components/work-with-me/Services.tsx`

- [ ] **Step 1: Create Services.tsx**

```tsx
// src/components/work-with-me/Services.tsx
import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runServicesStagger } from '@/animations/workWithMeAnimations';

const SERVICES = [
  { icon: 'solar:rocket-2-bold', name: 'Landing Pages', description: 'Fast, conversion-focused pages that turn visitors into leads.' },
  { icon: 'solar:buildings-bold', name: 'Business Websites', description: 'Professional multi-page marketing sites that build trust and credibility.' },
  { icon: 'solar:refresh-circle-bold', name: 'Website Redesigns', description: 'Modernize outdated experiences with current UX standards.' },
  { icon: 'solar:cart-large-bold', name: 'E-Commerce', description: 'Online stores and checkout experiences optimized for mobile.' },
  { icon: 'solar:calendar-add-bold', name: 'Booking Experiences', description: 'Streamlined booking and scheduling flows that reduce friction.' },
  { icon: 'solar:settings-bold', name: 'Ongoing Support', description: 'Monthly maintenance, updates, and feature additions.' },
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(() => {
    if (!sectionRef.current) return;
    const cards = Array.from(
      sectionRef.current.querySelectorAll<HTMLElement>('.service-card')
    );
    runServicesStagger(cards);
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section id="services" ref={sectionRef} style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#E8E7E1',
    }}>
      <div style={{ marginBottom: '52px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
          marginBottom: '12px',
        }}>
          What I Build
        </div>
        <h2 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(30px, 5vw, 52px)',
          color: '#0C0C0E',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          Services
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '1px',
        background: 'rgba(0,0,0,0.09)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.09)',
      }}>
        {SERVICES.map((s) => (
          <div key={s.name} className="service-card" style={{
            background: '#E8E7E1',
            padding: '32px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon icon={s.icon} style={{ width: 19, height: 19, color: '#0C0C0E' }} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-disp)',
                fontWeight: 700,
                fontSize: '16px',
                color: '#0C0C0E',
                marginBottom: '6px',
              }}>
                {s.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(0,0,0,0.48)',
                lineHeight: 1.65,
                fontWeight: 300,
              }}>
                {s.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
```

- [ ] **Step 2: Add Services to WorkWithMePage.tsx**

Add import and `<Services />` after `<Hero />`:
```tsx
import Services from '@/components/work-with-me/Services';
// ...
<Hero />
<Services />
```

- [ ] **Step 3: Type check + browser verify**

Scroll down — 6 service cards stagger in with GSAP as section enters viewport.

- [ ] **Step 4: Commit**

```bash
git add src/components/work-with-me/Services.tsx src/pages/WorkWithMePage.tsx
git commit -m "feat: add Services section with ScrollTrigger stagger"
```

---

## Phase 4: WWM Sections 3–6

### Task 10: WhyWorkWithMe section

**Files:**
- Create: `src/components/work-with-me/WhyWorkWithMe.tsx`

- [ ] **Step 1: Create WhyWorkWithMe.tsx**

```tsx
// src/components/work-with-me/WhyWorkWithMe.tsx
import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initWhyScrub } from '@/animations/workWithMeAnimations';

const STATEMENTS = [
  {
    headline: 'Design + engineering in one place.',
    body: 'No handoffs. No miscommunication. I design it and I build it — the same person, start to finish.',
  },
  {
    headline: 'Built for business outcomes.',
    body: 'Not just beautiful sites — experiences designed to convert, retain, and grow the businesses I work with.',
  },
  {
    headline: 'Enterprise-level thinking, boutique attention.',
    body: '8+ years shipping production software for companies serving 200+ organizations. That discipline comes to every project.',
  },
  {
    headline: "You'll always know where we are.",
    body: 'Transparent process, clear milestones, direct communication. No black-box freelancing.',
  },
];

const WhyWorkWithMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(() => {
    if (!sectionRef.current) return;
    const els = Array.from(
      sectionRef.current.querySelectorAll<HTMLElement>('.why-statement')
    );
    initWhyScrub(els);
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#E8E7E1',
    }}>
      <div style={{ marginBottom: '64px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
          marginBottom: '12px',
        }}>
          Why Work With Me
        </div>
        <h2 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(30px, 5vw, 52px)',
          color: '#0C0C0E',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          The difference is in the details.
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STATEMENTS.map((s, i) => (
          <div
            key={i}
            className="why-statement"
            style={{
              borderTop: '1px solid rgba(0,0,0,0.1)',
              padding: 'clamp(32px, 4vw, 48px) 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.8vw, 30px)',
              color: '#0C0C0E',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {s.headline}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: 'rgba(0,0,0,0.5)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {s.body}
            </p>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
```

- [ ] **Step 2: Add to WorkWithMePage.tsx**

```tsx
import WhyWorkWithMe from '@/components/work-with-me/WhyWorkWithMe';
// After <Services />:
<WhyWorkWithMe />
```

- [ ] **Step 3: Type check + browser verify**

Scroll through WhyWorkWithMe — each row scrubs from near-invisible to full opacity.

- [ ] **Step 4: Commit**

```bash
git add src/components/work-with-me/WhyWorkWithMe.tsx src/pages/WorkWithMePage.tsx
git commit -m "feat: add WhyWorkWithMe with ScrollTrigger opacity scrub"
```

---

### Task 11: Process section

**Files:**
- Create: `src/components/work-with-me/Process.tsx`

- [ ] **Step 1: Create Process.tsx**

```tsx
// src/components/work-with-me/Process.tsx
import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initProcessPin } from '@/animations/workWithMeAnimations';
import { useIsMobile } from '@/hooks/useMediaQuery';

const STEPS = [
  { number: '01', title: 'Discover', body: 'Understand your goals, audience, and competitive landscape before touching a single pixel.' },
  { number: '02', title: 'Design', body: 'Craft a modern, conversion-focused experience in Figma. You see and approve before development begins.' },
  { number: '03', title: 'Build', body: 'Clean, fast React + TypeScript. Every screen responsive from 375px to 1440px+.' },
  { number: '04', title: 'Launch', body: 'Deploy, optimize, and hand off with documentation. Ongoing support available.' },
];

const sectionHeaderStyle: React.CSSProperties = {
  marginBottom: '56px',
};

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useGSAPContext(() => {
    if (isMobile || !sectionRef.current) return;
    const steps = Array.from(
      sectionRef.current.querySelectorAll<HTMLElement>('.process-step')
    );
    const mm = initProcessPin(sectionRef.current, steps);
    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [isMobile] });

  const header = (
    <div style={sectionHeaderStyle}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.35)',
        marginBottom: '12px',
      }}>
        Process
      </div>
      <h2 style={{
        fontFamily: 'var(--font-disp)',
        fontWeight: 800,
        fontSize: 'clamp(30px, 5vw, 52px)',
        color: '#0C0C0E',
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        margin: 0,
      }}>
        How we get there.
      </h2>
    </div>
  );

  if (isMobile) {
    return (
      <section ref={sectionRef} style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#E8E7E1',
      }}>
        {header}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="process-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                delay: i * 0.07,
              }}
              style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'var(--accent-active)',
                paddingTop: '4px',
                flexShrink: 0,
              }}>
                {step.number}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 700,
                  fontSize: '20px',
                  color: '#0C0C0E',
                  marginBottom: '8px',
                }}>
                  {step.title}
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: '14px',
                  color: 'rgba(0,0,0,0.48)',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: GSAP pins this section and reveals steps via ScrollTrigger
  return (
    <section ref={sectionRef} style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#E8E7E1',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {header}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        background: 'rgba(0,0,0,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
      }}>
        {STEPS.map((step) => (
          <div key={step.number} className="process-step" style={{
            background: '#E8E7E1',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--accent-active)',
            }}>
              {step.number}
            </div>
            <div style={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              color: '#0C0C0E',
              letterSpacing: '-0.02em',
            }}>
              {step.title}
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '13px',
              color: 'rgba(0,0,0,0.48)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;
```

- [ ] **Step 2: Add to WorkWithMePage.tsx**

```tsx
import Process from '@/components/work-with-me/Process';
// After <WhyWorkWithMe />:
<Process />
```

- [ ] **Step 3: Type check + browser verify**

Desktop: process section pins while scrolling, steps reveal sequentially.
Mobile (resize to <640px): stacked layout, Motion fade-up per step.

- [ ] **Step 4: Commit**

```bash
git add src/components/work-with-me/Process.tsx src/pages/WorkWithMePage.tsx
git commit -m "feat: add Process section — pinned desktop, Motion stacked mobile"
```

---

### Task 12: ProjectStartingPoints + BusinessOutcomes

**Files:**
- Create: `src/components/work-with-me/ProjectStartingPoints.tsx`
- Create: `src/components/work-with-me/BusinessOutcomes.tsx`

- [ ] **Step 1: Create ProjectStartingPoints.tsx**

```tsx
// src/components/work-with-me/ProjectStartingPoints.tsx
import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runFadeStagger } from '@/animations/workWithMeAnimations';

const TIERS = [
  { name: 'Landing Pages', price: 'Starting at $2k+' },
  { name: 'Business Websites', price: 'Starting at $5k+' },
  { name: 'Premium Experiences', price: 'Custom Quote' },
];

const ProjectStartingPoints: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(() => {
    if (!sectionRef.current) return;
    const rows = Array.from(
      sectionRef.current.querySelectorAll<HTMLElement>('.tier-row')
    );
    runFadeStagger(rows, sectionRef.current);
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#E8E7E1',
    }}>
      <div style={{ marginBottom: '52px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
          marginBottom: '12px',
        }}>
          Investment
        </div>
        <h2 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(30px, 5vw, 52px)',
          color: '#0C0C0E',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          Project starting points.
        </h2>
      </div>

      <div>
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className="tier-row"
            style={{
              borderTop: i === 0 ? '1px solid rgba(0,0,0,0.1)' : undefined,
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              padding: 'clamp(22px, 3vw, 32px) 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: '#0C0C0E',
              letterSpacing: '-0.02em',
            }}>
              {t.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(12px, 1.4vw, 14px)',
              letterSpacing: '0.06em',
              color: 'rgba(0,0,0,0.45)',
              whiteSpace: 'nowrap',
            }}>
              {t.price}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'rgba(0,0,0,0.38)',
        fontWeight: 300,
        fontStyle: 'italic',
        margin: '20px 0 0',
      }}>
        Every project is tailored to your goals, timeline, and scope.
      </p>
    </section>
  );
};

export default ProjectStartingPoints;
```

- [ ] **Step 2: Create BusinessOutcomes.tsx**

```tsx
// src/components/work-with-me/BusinessOutcomes.tsx
import React from 'react';
import { motion } from 'motion/react';

const OUTCOMES = [
  { label: 'More trust', description: 'A sharper first impression for new customers.' },
  { label: 'More leads', description: 'Clearer paths to contact, book, buy, or inquire.' },
  { label: 'Less friction', description: 'Fast, mobile-first experiences that feel easy to use.' },
];

const BusinessOutcomes: React.FC = () => (
  <section style={{
    padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
    background: '#0C0C0E',
  }}>
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{
        fontFamily: 'var(--font-disp)',
        fontWeight: 700,
        fontSize: 'clamp(22px, 3.5vw, 38px)',
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: '-0.025em',
        lineHeight: 1.25,
        margin: '0 0 clamp(48px, 7vw, 80px)',
      }}
    >
      Built for businesses that need more than "just a website."
    </motion.p>

    <div>
      {OUTCOMES.map((o, i) => (
        <motion.div
          key={o.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            delay: i * 0.08,
          }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: 'clamp(20px, 2.8vw, 28px) 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 700,
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            color: '#fff',
            letterSpacing: '-0.02em',
          }}>
            {o.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
          }}>
            {o.description}
          </span>
        </motion.div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
    </div>
  </section>
);

export default BusinessOutcomes;
```

- [ ] **Step 3: Add both to WorkWithMePage.tsx**

```tsx
import ProjectStartingPoints from '@/components/work-with-me/ProjectStartingPoints';
import BusinessOutcomes from '@/components/work-with-me/BusinessOutcomes';
// After <Process />:
<ProjectStartingPoints />
<BusinessOutcomes />
```

- [ ] **Step 4: Type check + verify**

Tier rows stagger in. BusinessOutcomes dark section contrasts with off-white above.

- [ ] **Step 5: Commit**

```bash
git add src/components/work-with-me/ProjectStartingPoints.tsx src/components/work-with-me/BusinessOutcomes.tsx src/pages/WorkWithMePage.tsx
git commit -m "feat: add ProjectStartingPoints and BusinessOutcomes sections"
```

---

## Phase 5: InquiryForm + FAQ

### Task 13: FAQ accordion

**Files:**
- Create: `src/components/work-with-me/FAQ.tsx`

- [ ] **Step 1: Create FAQ.tsx**

```tsx
// src/components/work-with-me/FAQ.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    q: 'How long does a project take?',
    a: "Landing pages typically take 2–3 weeks. Multi-page business websites range from 4–8 weeks depending on scope. We'll establish a clear timeline in our first conversation.",
  },
  {
    q: 'Can I edit the website after launch?',
    a: "Yes. I can build with a CMS (like Sanity or Contentful) so you can update text, images, and content without touching code. We'll discuss what level of control you need upfront.",
  },
  {
    q: 'Do you offer hosting or maintenance?',
    a: 'I can recommend and set up hosting (Vercel, Netlify, or traditional). Monthly maintenance packages are available for content updates, security patches, and feature additions.',
  },
  {
    q: 'Do you work with businesses outside Tampa?',
    a: 'Absolutely. I work remotely with businesses across the US. All communication, design reviews, and handoffs happen over video calls, Figma, and async tools.',
  },
  {
    q: 'What do I need to provide to get started?',
    a: "A brief description of your business, what you're looking to build, your timeline, and any branding you already have (logo, colors, fonts). I'll handle the rest.",
  },
  {
    q: 'Do you offer SEO?',
    a: 'Every site I build is SEO-conscious: semantic HTML, fast load times, proper meta tags, and accessible structure. Dedicated SEO campaigns and ongoing content strategy are available as add-ons.',
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#E8E7E1',
    }}>
      <div style={{ marginBottom: '52px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
          marginBottom: '12px',
        }}>
          FAQ
        </div>
        <h2 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(30px, 5vw, 52px)',
          color: '#0C0C0E',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          Common questions.
        </h2>
      </div>

      <div style={{ maxWidth: '720px' }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              borderTop: i === 0 ? '1px solid rgba(0,0,0,0.1)' : undefined,
              borderBottom: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: 'clamp(18px, 2.5vw, 24px) 0',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-disp)',
                fontWeight: 600,
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: '#0C0C0E',
                lineHeight: 1.3,
              }}>
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '20px',
                  color: 'rgba(0,0,0,0.35)',
                  flexShrink: 0,
                  display: 'inline-block',
                  lineHeight: 1,
                }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    fontSize: 'clamp(13px, 1.5vw, 15px)',
                    color: 'rgba(0,0,0,0.55)',
                    lineHeight: 1.75,
                    paddingBottom: '20px',
                    margin: 0,
                  }}>
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
```

- [ ] **Step 2: Add to WorkWithMePage.tsx**

```tsx
import FAQ from '@/components/work-with-me/FAQ';
// After <BusinessOutcomes />:
<FAQ />
```

- [ ] **Step 3: Type check + browser verify**

Click FAQ items — accordion opens/closes with height animation. `+` rotates to `×`.

- [ ] **Step 4: Commit**

```bash
git add src/components/work-with-me/FAQ.tsx src/pages/WorkWithMePage.tsx
git commit -m "feat: add FAQ accordion with AnimatePresence height animation"
```

---

### Task 14: InquiryForm — 5 steps + navigation + EmailJS

**Files:**
- Create: `src/components/work-with-me/InquiryForm.tsx`

- [ ] **Step 1: Create InquiryForm.tsx**

```tsx
// src/components/work-with-me/InquiryForm.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type ProjectType = 'Landing Page' | 'Business Website' | 'Website Redesign' | 'E-Commerce' | 'Booking Experience' | 'Not Sure Yet';
type Budget = 'Under $2k' | '$2k–$5k' | '$5k–$10k' | '$10k+' | 'Not sure yet';
type Timeline = 'ASAP' | '2–4 Weeks' | '1–2 Months' | 'Flexible';

interface FormData {
  name: string;
  email: string;
  businessName: string;
  website: string;
  projectType: ProjectType | '';
  budget: Budget | '';
  timeline: Timeline | '';
  details: string;
}

const PROJECT_TYPES: ProjectType[] = ['Landing Page', 'Business Website', 'Website Redesign', 'E-Commerce', 'Booking Experience', 'Not Sure Yet'];
const BUDGETS: Budget[] = ['Under $2k', '$2k–$5k', '$5k–$10k', '$10k+', 'Not sure yet'];
const TIMELINES: Timeline[] = ['ASAP', '2–4 Weeks', '1–2 Months', 'Flexible'];

const TOTAL_STEPS = 5;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '10px',
  padding: '13px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: '#0C0C0E',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.4)',
  display: 'block',
  marginBottom: '8px',
};

const InquiryForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', businessName: '', website: '',
    projectType: '', budget: '', timeline: '', details: '',
  });

  const set = (field: keyof FormData) => (val: string) =>
    setFormData(prev => ({ ...prev, [field]: val }));

  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
  const goBack = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const canAdvance = () => {
    if (step === 1) return formData.name.trim() !== '' && formData.email.trim() !== '';
    if (step === 2) return formData.projectType !== '';
    if (step === 3) return formData.budget !== '';
    if (step === 4) return formData.timeline !== '';
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const emailjs = (await import('@emailjs/browser')).default;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
      if (!publicKey) throw new Error('EmailJS not configured');

      emailjs.init(publicKey);
      await emailjs.send('portfolio-gmail', 'template_mzi5nzb', {
        to_email: 'jonathanferreiradev@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: `[Work With Me] ${formData.projectType || 'Inquiry'} — ${formData.businessName || formData.name}`,
        message: [
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Business: ${formData.businessName || '—'}`,
          `Website/Social: ${formData.website || '—'}`,
          `Project type: ${formData.projectType}`,
          `Budget: ${formData.budget}`,
          `Timeline: ${formData.timeline}`,
          `\nDetails:\n${formData.details || '(no details provided)'}`,
        ].join('\n'),
        name: formData.name,
        email: formData.email,
      });
    } catch (err) {
      console.error('InquiryForm submit error:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const PillButton = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        fontWeight: selected ? 500 : 300,
        padding: '12px 20px',
        borderRadius: '100px',
        border: selected ? '1.5px solid #0C0C0E' : '1px solid rgba(0,0,0,0.14)',
        background: selected ? 'rgba(0,0,0,0.06)' : 'transparent',
        color: '#0C0C0E',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#0C0C0E', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Let's start with you.
          </h3>
          <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={formData.name} onChange={e => set('name')(e.target.value)} placeholder="Your name" /></div>
          <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={formData.email} onChange={e => set('email')(e.target.value)} placeholder="your@email.com" /></div>
          <div><label style={labelStyle}>Business name (optional)</label><input style={inputStyle} value={formData.businessName} onChange={e => set('businessName')(e.target.value)} placeholder="Your business" /></div>
          <div><label style={labelStyle}>Current website or Instagram (optional)</label><input style={inputStyle} value={formData.website} onChange={e => set('website')(e.target.value)} placeholder="yoursite.com or @handle" /></div>
        </div>
      );
      case 2: return (
        <div>
          <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#0C0C0E', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
            What are you looking to build?
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {PROJECT_TYPES.map(pt => <PillButton key={pt} label={pt} selected={formData.projectType === pt} onClick={() => set('projectType')(pt)} />)}
          </div>
        </div>
      );
      case 3: return (
        <div>
          <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#0C0C0E', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
            Do you have a budget range in mind?
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {BUDGETS.map(b => <PillButton key={b} label={b} selected={formData.budget === b} onClick={() => set('budget')(b)} />)}
          </div>
        </div>
      );
      case 4: return (
        <div>
          <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#0C0C0E', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
            When are you looking to get started?
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {TIMELINES.map(t => <PillButton key={t} label={t} selected={formData.timeline === t} onClick={() => set('timeline')(t)} />)}
          </div>
        </div>
      );
      case 5: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#0C0C0E', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Tell me about your project.
          </h3>
          <div>
            <label style={labelStyle}>Project details — A few sentences are helpful.</label>
            <textarea
              value={formData.details}
              onChange={e => set('details')(e.target.value)}
              rows={5}
              placeholder="What does your business do? What's not working about your current online presence? What would a win look like?"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
            />
          </div>
        </div>
      );
      default: return null;
    }
  };

  if (submitted) {
    return (
      <section id="inquiry" style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#E8E7E1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50dvh',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          style={{ textAlign: 'center', maxWidth: '480px' }}
        >
          <motion.div
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '28px', marginBottom: '28px', color: 'var(--accent-active)' }}
          >
            ✦
          </motion.div>
          <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 38px)', color: '#0C0C0E', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            You're all set.
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '15px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.75, margin: 0 }}>
            I'll review your project details and reach out soon with next steps.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="inquiry" style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#E8E7E1',
    }}>
      <div style={{ marginBottom: '56px', maxWidth: '560px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '12px' }}>
          Start a Project
        </div>
        <h2 style={{ fontFamily: 'var(--font-disp)', fontWeight: 800, fontSize: 'clamp(30px, 5vw, 52px)', color: '#0C0C0E', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 14px' }}>
          Let's start something.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '15px', color: 'rgba(0,0,0,0.45)', lineHeight: 1.7, margin: 0 }}>
          Tell me about your project and I'll reach out with next steps.
        </p>
      </div>

      <div style={{ maxWidth: '560px' }}>
        {/* Step indicator dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '40px' }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i + 1 === step ? 28 : 8,
                background: i + 1 <= step ? '#0C0C0E' : 'rgba(0,0,0,0.15)',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ height: '4px', borderRadius: '2px' }}
            />
          ))}
        </div>

        {/* Step content */}
        <div style={{ position: 'relative', minHeight: '240px' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px' }}>
          {step > 1 ? (
            <button onClick={goBack} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', color: 'rgba(0,0,0,0.4)', cursor: 'pointer', padding: 0 }}>
              ← Back
            </button>
          ) : <span />}

          {step < TOTAL_STEPS ? (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                background: canAdvance() ? '#0C0C0E' : 'rgba(0,0,0,0.12)',
                color: canAdvance() ? '#E8E7E1' : 'rgba(0,0,0,0.3)',
                border: 'none', borderRadius: '100px', padding: '13px 28px',
                cursor: canAdvance() ? 'pointer' : 'default',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                background: '#0C0C0E', color: '#E8E7E1', border: 'none', borderRadius: '100px',
                padding: '13px 28px', cursor: 'pointer', opacity: submitting ? 0.6 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {submitting ? 'Sending…' : 'Start the Conversation →'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
```

- [ ] **Step 2: Add InquiryForm to WorkWithMePage.tsx (before FAQ)**

```tsx
import InquiryForm from '@/components/work-with-me/InquiryForm';
// After <BusinessOutcomes />:
<InquiryForm />
<FAQ />
```

- [ ] **Step 3: Type check + browser verify**

```bash
npx tsc --noEmit
```

Fill all 5 steps — verify advance/retreat with slide transitions, step dots animate width. Submit → success state shows pulsing ✦.

- [ ] **Step 4: Commit**

```bash
git add src/components/work-with-me/InquiryForm.tsx src/pages/WorkWithMePage.tsx
git commit -m "feat: add InquiryForm — 5-step motion transitions + EmailJS submit + success state"
```

---

## Phase 6: Final

### Task 15: CLAUDE.md update + final verification

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add Phase 2 section to CLAUDE.md**

Append to `devign/CLAUDE.md`:

```markdown
## Phase 2: Agency + Portfolio Expansion

**Route changes:**
- `/` → `GatewayPage` — full-screen two-card gateway
- `/portfolio` → `StoryPage` (moved from `/`)
- `/work-with-me` → `WorkWithMePage` — 8-section agency page

**New dependencies:** `gsap`, `@gsap/react`, `lenis`

**New `body[data-page]` values:** `'gateway'` (dark, overflow hidden), `'work-with-me'` (same off-white palette as story/projects)

**Animation separation:**
- `motion/react` → hovers, FAQ accordion, InquiryForm step transitions, success state
- GSAP + ScrollTrigger → hero entrance, services stagger, why-work-with-me scrub, process pin
- Lenis → smooth scroll on `/work-with-me` only (not active on ProjectsPage which manages overflow itself)

**GSAP registration:** `ScrollTrigger` registered once in `src/index.tsx`.

**Hooks:** `useGSAPContext` re-exports `useGSAP` from `@gsap/react`; `useLenis` drives Lenis via `gsap.ticker` for ScrollTrigger sync.

**Animation files:** All GSAP timelines live in `src/animations/` — never inline in components.
```

- [ ] **Step 2: Final type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Full spec verification checklist**

```bash
npm start
```

- [ ] `/portfolio`, `/projects`, `/projects/:slug` all load correctly
- [ ] `/` shows GatewayPage — both cards navigate to correct routes, orb hover smooth
- [ ] `/work-with-me` — all 8 sections render, scroll animations fire
- [ ] InquiryForm — all 5 steps advance/retreat correctly, success state displays on submit
- [ ] Navigate to `/projects` — ProjectsPage overflow lock is not broken by Lenis
- [ ] GSAP contexts clean up on route change (navigate to `/portfolio` and back, animations re-fire cleanly)
- [ ] Process section: pinned on desktop ≥640px, stacked Motion fade-up on mobile

- [ ] **Step 4: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with Phase 2 agency + portfolio expansion"
```
