# devignUX Portfolio — Claude Code Implementation Guide

> **Context for Claude Code:** This is a React + TypeScript portfolio site at `devignux.com`. The current site is a single-page React app with a dark/light mode toggle, a list of project cards (screenshot + title + category tag + short description + click-to-live-site), and a floating contact button that opens a modal form. The footer reads "Made in React with ❤️".
>
> This document describes every addition and change needed to transform it into a dual-audience portfolio that appeals to both **UX/Product Design** hiring managers and **Senior Frontend Engineering** hiring managers. Follow every section in order. Do not skip any item. Where component names are suggested, use them — they will be referenced later in this document.

---

## Table of Contents

1. [Remove "Under Construction" Copy](#1-remove-under-construction-copy)
2. [Audience Toggle — Nav Component](#2-audience-toggle--nav-component)
3. [Hero Section — Rewrite & Dual-Mode Copy](#3-hero-section--rewrite--dual-mode-copy)
4. [Project Cards — Add Role Chips](#4-project-cards--add-role-chips)
5. [Project Cards — Add Case Study Trigger](#5-project-cards--add-case-study-trigger)
6. [Case Study Slide-Over Panel Component](#6-case-study-slide-over-panel-component)
7. [Case Study Content — All Four Projects](#7-case-study-content--all-four-projects)
8. [Process Section — UX Audience Only](#8-process-section--ux-audience-only)
9. [Tech Stack Section — Dev Audience Only](#9-tech-stack-section--dev-audience-only)
10. [Impact Metrics Row — Both Audiences (Different Copy)](#10-impact-metrics-row--both-audiences-different-copy)
11. [Testimonial Block](#11-testimonial-block)
12. [Resume Download Strip](#12-resume-download-strip)
13. [Hero Stats Row](#13-hero-stats-row)
14. [Audience Context Banner](#14-audience-context-banner)
15. [Global State — Audience Mode](#15-global-state--audience-mode)
16. [Typography & Font Upgrade](#16-typography--font-upgrade)
17. [Scroll Reveal Animations](#17-scroll-reveal-animations)
18. [Scroll Progress Bar on Panel](#18-scroll-progress-bar-on-panel)
19. [Keyboard Shortcut — ESC to Close Panel](#19-keyboard-shortcut--esc-to-close-panel)
20. [Mobile Responsiveness Rules](#20-mobile-responsiveness-rules)
21. [Copy Fixes & Typos](#21-copy-fixes--typos)
22. [File & Component Structure](#22-file--component-structure)

---

## 1. Remove "Under Construction" Copy

**Location:** Hero section, in the existing introductory paragraph.

**Current copy (approximate):**
> "Hi, I'm Jona. I design and engineer seamless, modern interfaces—bringing ideas from concept to production. My site is currently under construction, but you can explore some past work below. Let's connect if you'd like to talk ideas."

**Action:** Delete the sentence `"My site is currently under construction, but you can explore some past work below."` entirely. Do not replace it with anything. The remaining copy will be rewritten in Section 3.

**Why:** Telling a hiring manager your site is under construction before they've seen a single piece of work signals that you don't ship finished things — the opposite of what a portfolio should communicate.

---

## 2. Audience Toggle — Nav Component

**Location:** Top navigation bar, right side (opposite the logo).

**Component name:** `AudienceToggle`

**What to build:** A pill-shaped toggle with two buttons:
- Button 1: `UX / Product`
- Button 2: `Frontend Dev`

**Behavior:**
- Clicking either button sets a global `audienceMode` state value to either `'ux'` or `'dev'`. See Section 15 for state implementation.
- The active button has a filled background using the active accent color (`--accent-lime: #c9f04d` for UX mode, `--accent-teal: #4df0c6` for Dev mode) with dark text.
- The inactive button is transparent with muted text.
- Default on page load: `'ux'` mode is active.
- The toggle must be visible on both mobile and desktop. On screens narrower than 400px, shorten the labels to `UX` and `Dev`.

**Styling:**
- Outer pill: `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 100px`, `padding: 4px`
- Each button: `border-radius: 100px`, `font-family: monospace`, `font-size: 11px`, `letter-spacing: 0.06em`, `text-transform: uppercase`, `padding: 7px 18px`
- Transition on active state: `all 0.22s ease`

**Do not remove** the existing dark/light mode toggle. Place the `AudienceToggle` to the left of it, separated by `16px` of gap.

---

## 3. Hero Section — Rewrite & Dual-Mode Copy

**Location:** The hero/intro section at the top of the page.

**What to build:** The hero section must display different copy depending on `audienceMode`. All copy swaps must animate with a fade (`opacity 0 → 1, 0.3s ease`).

### UX Mode Copy

**Eyebrow line** (small label above the headline):
> `UX/UI Engineer · Tampa, FL · Open to work`

Style: `font-family: monospace`, `font-size: 11px`, `letter-spacing: 0.14em`, `text-transform: uppercase`, color: `var(--accent-active)`. Prepend a 28px horizontal line in the accent color before the text.

**Headline** (large display text, `font-family: display font`, `font-weight: 800`):
```
I design
& build
interfaces.
```
The `&` or second line should use a ghost/outline text treatment: `-webkit-text-stroke: 1px rgba(255,255,255,0.18)`, `color: transparent`. The word `design` should be colored with `var(--accent-active)`.

**Subheadline:**
> "Jona Ferreira — 8+ years turning Figma files into production React. I'm the designer who codes, and the engineer who designs. No handoff. No translation loss."

Bold `Jona Ferreira` with `font-weight: 500`, everything else `font-weight: 300`. Color: `var(--dim)` (`#9090a0`).

**CTA buttons:**
- Primary (filled): `View Case Studies` — scrolls to `#work` section
- Secondary (outlined): `Download Resume` — links to resume PDF (placeholder `href="#"` until file is provided)

### Dev Mode Copy

**Eyebrow line:**
> `Senior Frontend Engineer · React · TypeScript · Next.js`

**Headline:** Same visual structure, but change the highlighted word from `design` to `build` — swap the ghost/outline treatment to the word `& design` instead.

**Subheadline:**
> "Jona Ferreira — Senior Frontend Engineer with 8+ years in React + TypeScript. I also design at a professional level, which means I ship cleaner, more intentional UI faster than any pure dev."

**CTA buttons:**
- Primary: `View Shipped Projects` — same scroll to `#work`
- Secondary: `Download Resume` — same link

### Persistent visual elements (don't change with mode):
- Grid background: fine 72px grid lines at ~2.5% opacity, masked with a radial gradient so they fade toward the edges
- A soft radial glow orb (no border, no box — just a `radial-gradient` in a `div`) positioned top-right, color matches `var(--accent-active)` at 6% opacity, transitions color when mode changes
- Noise texture overlay on the whole page (see Section 16)

---

## 4. Project Cards — Add Role Chips

**Location:** Inside each project card, between the description text and the card footer.

**Component name:** `RoleChipRow`

**What to build:** A horizontal row of small chips, each showing one role or contribution Jona had on that project.

**Chip anatomy:**
- A 6px filled circle dot (color: `var(--accent-active)`, transitions with mode)
- A text label in monospace, 9px, `letter-spacing: 0.04em`, color: `var(--dim)`
- Background: `var(--surface)`, border: `1px solid var(--border)`, border-radius: `8px`, padding: `5px 11px`
- `display: flex`, `align-items: center`, `gap: 5px`

**Row styling:** `display: flex`, `flex-wrap: wrap`, `gap: 7px`, `padding-top: 10px`, `border-top: 1px solid var(--border)`, `margin-top: auto`

**Role data per project** (hardcode these values into the component data or a `projects.ts` config file):

| Project | Roles |
|---|---|
| URGE Talent | `UX Research`, `UI Design`, `React Dev`, `Component Library`, `Figma Prototyping` |
| Small Wrld Music | `Product Design`, `React Dev`, `Audio UX`, `Mobile-first` |
| Givzey Landing | `Figma Design`, `Next.js Dev`, `Responsive Layout`, `SMTP Integration` |
| El Chancletazo | `Brand Design`, `UI Design`, `React Dev`, `Preorder System` |

**Also add a role pill badge** to the top-left corner of each card's thumbnail image (overlaid, `position: absolute`, `top: 14px`, `left: 14px`):
- URGE Talent: `Design + Code` — style with both accent colors as a gradient border or use neutral styling
- Small Wrld Music: `Design + Code`
- Givzey Landing: `Code · Figma`
- El Chancletazo: `Design + Code`

Pill styling: `backdrop-filter: blur(12px)`, `background: rgba(12,12,14,0.6)`, `border: 1px solid var(--border)`, `border-radius: 100px`, `font-family: monospace`, `font-size: 9px`, `letter-spacing: 0.06em`, `text-transform: uppercase`, `padding: 5px 12px`, `color: var(--dim)`

**Read the Gradum Group Project and add the relevant role pill badges and chips**

---

## 5. Project Cards — Add Case Study Trigger

**Location:** The card footer, replacing or supplementing the current click-to-live-site behavior.

**Current behavior:** Clicking anywhere on the card opens the live site URL in a new tab.

**New behavior:**
- Clicking the card thumbnail opens the **Case Study Slide-Over Panel** (see Section 6). The live site link should still exist but move to a text link in the card footer labeled `Live Site →` that opens in a new tab.
- The hover state on the card thumbnail should show a semi-transparent overlay (`rgba(12,12,14,0.75)`) with two buttons centered:
  - Filled button: `Open Case Study` — triggers the panel
  - Ghost button: `Live Site →` — opens the live URL in a new tab
- The overlay fades in on hover (`opacity: 0 → 1, transition: 0.25s ease`)
- In the card footer, add a text link on the right: `Case study ↕` in monospace, 10px — this also triggers the panel open. This is the fallback for touch devices where hover doesn't exist.

**Impact line:** In the card footer left side, add a one-line impact statement per project in the accent color, monospace, 10px:

| Project | Impact line |
|---|---|
| URGE Talent | `↑ ~40% faster talent selection workflow` |
| Small Wrld Music | `Mobile-first · Inline audio player` |
| Givzey Landing | `Figma → Next.js · SMTP integration` |
| El Chancletazo | `Cultural branding · React preorder system` |

---

## 6. Case Study Slide-Over Panel Component

**Component name:** `CaseStudyPanel`

**What to build:** A right-side drawer panel that slides in from the right edge of the viewport when a project is selected. This is NOT a modal. It is a fixed-position panel that covers the right ~680px of the screen (or full width on mobile), with the page visible (dimmed and slightly scaled down) behind it.

### Panel Structure (top to bottom):

**1. Hero image zone** (`height: 240px`, `overflow: hidden`):
- Displays a representative image or simulated screenshot of the project
- On panel open, the image gently zooms to `scale(1.06)` over 8 seconds (`transition: transform 8s linear`) — a slow Ken Burns effect
- A gradient overlay covers the bottom half: `linear-gradient(to bottom, transparent 0%, rgba(12,12,14,0.5) 50%, rgba(12,12,14,1) 100%)`
- Close button: top-right corner, 36px circle, `background: rgba(12,12,14,0.7)`, `backdrop-filter: blur(12px)`, `border: 1px solid var(--border)`. Contains an `✕` character. On click, closes the panel.
- Tag pills at the bottom-left of the hero image (overlaid) — pulled from project data: technology tags and category. Styled with `backdrop-filter: blur(12px)`, dark semi-transparent background.

**2. Scrollable body** (`overflow-y: auto`, `padding: 24px 28px 48px`):
- Custom scrollbar: `width: 4px`, `background: transparent`, thumb `background: var(--border)`, `border-radius: 2px`
- Contains all case study narrative content (see Section 7)

**3. Sticky footer** (always visible at bottom of panel, `position: sticky` or `flex-shrink: 0`):
- Left: impact statement in accent color, monospace, 11px
- Right: two buttons — `Live Site →` (ghost) and `View on GitHub` (filled, placeholder href for now)
- `border-top: 1px solid var(--border)`, `padding: 16px 28px`, `background: var(--surface)`

### Panel Open/Close Behavior:

**Opening:**
1. Panel translates from `translateX(100%)` to `translateX(0)` — `transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)`
2. A scrim div covers the rest of the page: `position: fixed`, `inset: 0`, `z-index: 100`, semi-transparent but invisible — just captures clicks to close
3. The page content behind dims: `filter: blur(3px) brightness(0.4)` and `transform: scale(0.97)` — `transition: filter 0.5s ease, transform 0.5s ease`
4. `document.body.style.overflow = 'hidden'` to prevent background scroll

**Closing:**
1. Panel translates back to `translateX(100%)`
2. Page restores: remove blur, brightness, scale
3. `document.body.style.overflow = ''` restores scroll
4. Triggered by: close button click, scrim click, or `ESC` key (see Section 19)

**On open, scroll the panel body to the top** — `panelBodyRef.current.scrollTop = 0`

### Panel width:
- Desktop: `min(680px, 100vw)` — caps at 680px on wide screens
- Mobile (below 640px): `100vw`, full width, becomes a full-screen sheet

### Z-index layering:
- Scrim: `z-index: 100`
- Panel: `z-index: 200`
- Everything else: below 100

---

## 7. Case Study Content — All Four Projects

**Structure inside every panel body:** Each section uses:
- A section label: monospace, 9px, `letter-spacing: 0.14em`, `text-transform: uppercase`, color: `var(--accent-active)`, with a thin horizontal line extending to the right (use `::after` with `flex: 1; height: 1px; background: var(--border)`) and `display: flex; align-items: center; gap: 8px`
- Body text: 14px, color `var(--dim)`, `line-height: 1.75`
- Bullet lists: no default bullets, each item `display: flex; gap: 10px`, with `→` in accent color as the bullet (via `::before`)
- Metric blocks: 2-column grid, each block has a large number (`font-size: 32px`, accent color, display font, `font-weight: 800`) and a descriptor in `var(--dim)`, 11px

---

### URGE Talent Case Study

**Title:** URGE Talent
**Category:** Web Application · 2023
**Impact (footer):** ↑ ~40% faster talent selection workflow
**Role chips:** UX Research, UI Design, React Dev, Component Library, Figma Prototyping
**Tags (hero pills):** Featured, React, TypeScript, Figma, UX Research

**Section: Overview**
> URGE is a talent search and curation platform built for agencies and casting directors. The brief: replace a spreadsheet-and-email workflow with a visual, filterable interface that lets agents build and export talent packages in one session — without switching tools.

**Section: The Problem** (bullet list)
- Talent agents were managing rosters across disconnected spreadsheets, email chains, and external photo drives
- No visual way to filter by physical attributes, skills, or availability simultaneously
- Package creation (selecting talent for a client pitch) required manually exporting each profile and assembling PDFs
- Zero searchable history — every new job started from scratch

**Section: Research**
> I interviewed 4 talent agents across two agencies to map their current workflow end-to-end. The key insight: the bottleneck wasn't finding talent — it was building the client-facing package. Agents spent 60–70% of their time on formatting and assembly, not on curation decisions.

**Image strip** (horizontal scrollable row of 200px-wide panels — placeholder boxes until real Figma screenshots are inserted):
- Slot 1: Label `Journey Map v1 workflow`
- Slot 2: Label `Wireframe — Filter sidebar`
- Slot 3: Label `Figma Hi-fi — Grid view`
- Slot 4: Label `Figma Hi-fi — Package builder`

These are `div` placeholders with `background: var(--card)`, `border: 1px solid var(--border)`, `border-radius: 8px`, `width: 200px`, `aspect-ratio: 4/3`, `flex-shrink: 0`. Add a centered label in monospace 10px. **When Jona provides real screenshots, replace these divs with `<img>` tags.**

**Section: What I Designed & Built** (bullet list)
- Grid/list toggle with persistent multi-attribute filter sidebar — height, weight, hair, eye color, skills, availability filterable simultaneously
- Slide-out profile panel with photo carousel and stats — no page navigation needed, stays in context
- Package builder flow — drag-select multiple talents, name the package, export to PDF or shareable link
- Figma → React, no handoff — designed the component spec and implemented it, so the final product matched the prototype exactly

**Section: Outcome** (2-column metric blocks)
- Block 1: `~40%` / Reduction in time-to-package vs. previous spreadsheet workflow
- Block 2: `0` / Design/dev discrepancies at launch — I was both designer and engineer

**Closing paragraph:**
> The biggest win wasn't speed — it was confidence. Agents told us they were willing to pitch more clients because assembling a package no longer felt like a chore.

---

### Small Wrld Music Case Study

**Title:** Small Wrld Music
**Category:** Music Platform · 2022
**Impact (footer):** Mobile-first · Inline audio · Editorial UI
**Role chips:** Product Design, React Dev, Audio UX, Mobile-first
**Tags (hero pills):** Music Platform, React, Web Audio API, Dark UI

**Section: Overview**
> A music discovery platform designed for independent artists to showcase beats and original songs. The design brief required something that felt editorial and brand-worthy — not the cluttered grid of SoundCloud or BeatStars.

**Section: The Challenge** (bullet list)
- Independent artists lacked a visually compelling storefront that felt like their brand, not a commodity marketplace
- Existing platforms (SoundCloud, BeatStars) optimize for volume, not curation — leading to visual noise and no brand identity
- 80%+ of music discovery happens on mobile — existing tools were desktop-first afterthoughts on small screens

**Section: Design Decisions** (bullet list)
- Dark editorial aesthetic — pulled reference from streaming platforms like Apple Music and Tidal, not SaaS dashboards
- Cover art as the primary UI — large, full-bleed imagery with typography treatment over the artwork, not below it
- Persistent mini-player — audio plays inline without interrupting browsing; built with the Web Audio API and a custom React player hook
- Mobile-first layout — designed at 375px wide first, then scaled up; every interaction (play, swipe, scroll) validated on physical device

**Section: Outcome** (2-column metric blocks)
- Block 1: `80%+` / Target sessions on mobile — built mobile-first from day one
- Block 2: `0 reloads` / Audio plays inline without navigation — custom React audio hook

---

### Givzey Landing Case Study

**Title:** Givzey Landing Page
**Category:** Marketing Site · 2023
**Impact (footer):** Figma → Next.js · SMTP form integration
**Role chips:** Figma Design, Next.js Dev, Responsive Layout, SMTP Integration
**Tags (hero pills):** Marketing Site, Next.js, Figma, Nonprofit Tech

**Section: Context**
> Givzey needed a complete redesign of their marketing site to launch the VEO — a new AI fundraising product aimed at nonprofit development officers. The previous site was generic SaaS template energy. The new one needed to communicate "autonomous AI" while feeling trustworthy to a nonprofit audience that's skeptical of tech hype.

**Section: My Role** (bullet list)
- Received design direction and content, then built the full visual design in Figma from scratch
- Implemented in Next.js — every section responsive from 320px to 1440px+
- Integrated Nodemailer via SMTP for the contact/demo request form — no third-party form service
- Accessible: semantic HTML, keyboard navigable, color contrast passing WCAG AA

**Section: Key Design Decision**
> The colorful paint-explosion visual was the client's brand metaphor for "AI creating new capacity." The challenge was using it without making the page feel chaotic. I treated it as a background texture with heavy use of white space and structured card layouts to keep the reading flow clean and hierarchical — emotion via the visual, clarity via the layout.

**Section: Outcome** (2-column metric blocks)
- Block 1: `100%` / Pixel-matched to Figma spec — no deviation between design and build
- Block 2: `WCAG AA` / Accessibility pass — semantic HTML, keyboard nav, contrast ratios

---

### El Chancletazo Case Study

**Title:** El Chancletazo
**Category:** Restaurant Website · 2023
**Impact (footer):** Cultural branding · React preorder system
**Role chips:** Brand Design, UI Design, React Dev, Preorder System
**Tags (hero pills):** Restaurant, React, Brand Design, E-commerce

**Section: Context**
> El Chancletazo is a Dominican comfort food business run out of Tampa. They needed a web presence that felt like an extension of their cultural identity — warm, bold, unapologetically Dominican — not a generic restaurant template. The secondary requirement: a preorder system for limited meal drops.

**Section: Design Approach** (bullet list)
- Color as identity — warm browns, deep blacks, and lime accent carry the cultural warmth without resorting to red-and-yellow fast food clichés
- Photography art direction — the food photography needed to evoke home cooking, not food-styled restaurant shoots; editorial compositions with real textures
- Typography pairing — serif headlines (warmth, tradition) against monospace subtext (modern, digital) to bridge old-school food culture with contemporary web

**Section: The Preorder System**
> Meal drops are time-limited — when a batch is announced, customers preorder within a window. I built this in React with:

(bullet list)
- Availability state managed per dish (available / limited / sold out)
- Order form with SMTP email confirmation to both the customer and the operator
- Countdown timer component for meal drop windows
- Mobile-first — the majority of orders come through Instagram DMs, so the site had to feel as native as a social app

**Section: Outcome** (2-column metric blocks)
- Block 1: `5.0 ★` / Google Reviews rating — reflected on the site as social proof
- Block 2: `Mobile` / Orders primarily via mobile — entire UX optimized for one-thumb use

---

### Gradum Group Case Study

**Title:** Gradum Group  
**Category:** Corporate Platform · 2024  
**Impact (footer):** Structured advisory platform with transparent project visibility  
**Role chips:** Product Design, UX Architecture, Brand System, React Dev, Web Strategy  
**Tags (hero pills):** Consulting Platform, UX Strategy, React, Figma, Systems Design
### Section: Overview

> Gradum Group is a consulting and advisory platform designed to help mid-market companies navigate complex engineering, infrastructure, and technology initiatives. The goal of the project was to create a digital presence that communicates credibility and technical leadership while introducing a transparent project-execution philosophy typically missing from traditional consulting firms.
>
> Instead of a typical “agency brochure site,” the platform positions Gradum as a structured execution partner — combining advisory strategy with real engineering delivery.

### Section: The Problem

- Most consulting firms rely on static marketing sites that describe services but fail to communicate *how work actually gets executed*
- Clients typically lack real-time visibility into project progress once an engagement begins
- Engineering consulting is often presented with vague language and generic visuals rather than clear systems thinking
- Existing consulting experiences rely heavily on meetings and emails instead of structured collaboration frameworks

### Section: Research

> The design process focused on understanding how consulting firms present technical expertise online and where trust breaks down in the client journey.
>
> A key insight was that most consulting websites stop at marketing — they rarely explain the execution methodology. Gradum’s positioning required the opposite approach: showing the **structured thinking behind delivery** so potential clients could immediately understand how projects move from strategy to implementation.

### Image strip

(horizontal scrollable row of 200px-wide panels — placeholder boxes until real Figma screenshots are inserted)

- Slot 1: `Wireframe — Hero architecture`
- Slot 2: `Figma Hi-fi — Platform overview`
- Slot 3: `Figma Hi-fi — Services architecture`
- Slot 4: `Figma Hi-fi — Advisory flow diagram`

These are `div` placeholders with:
background: var(--card)
border: 1px solid var(--border)
border-radius: 8px
width: 200px
aspect-ratio: 4/3
flex-shrink: 0


Add centered label in **monospace 10px**.

When real screenshots are available, replace these placeholders with `<img>` elements.

### Section: What I Designed & Built

- Designed the overall **information architecture** that frames Gradum as an engineering-driven advisory platform rather than a generic consulting agency
- Built a **clear service framework** explaining how Gradum bridges strategy, engineering leadership, and execution
- Created a **minimal, systems-driven visual language** emphasizing structure, typography, and clarity over marketing noise
- Designed modular page sections that can expand as the company adds new services, case studies, and client portals
- Defined UX patterns that support Gradum’s long-term vision of **transparent project dashboards and execution visibility for clients**

### Section: Outcome

**Block 1:**  
`Clear positioning`  
Consulting platform positioned as **engineering-led execution**, not generic advisory

**Block 2:**  
`Scalable foundation`  
Website architecture designed to support future client portal and project-tracking features

### Closing paragraph

> Gradum’s biggest differentiator is transparency. Instead of hiding the execution process behind consulting language, the platform communicates how work actually gets done — giving clients confidence that projects will move from strategy to real implementation.

---

### Gravyty Template Manager Case Study

**Title:** Template Manager
**Category:** Enterprise SaaS · 2024
**Impact (footer):** Self-serve email templates · TinyMCE editor · React + Django
**Role chips:** Product Design, UX Engineering, React Dev, API Integration, TinyMCE Customization
**Tags (hero pills):** Enterprise SaaS, React, TinyMCE, UX Systems, Django API

**Section: Overview**
> Template Manager is a self-serve email template system built for fundraising teams using the Raise platform. The goal was to replace a legacy workflow where templates were edited directly in HTML or managed by support teams. The new system allowed fundraisers to create, edit, categorize, and share templates directly within the platform — reducing support dependency and enabling faster campaign execution.

**Section: The Problem** (bullet list)
- Fundraisers relied on customer support to modify email templates
- Editing HTML manually was error-prone and inaccessible for non-technical users
- Templates were scattered across user accounts with no structured organization
- No way to share templates across teams or enforce consistent messaging

**Section: Research**
> Internal interviews with fundraising teams revealed that templates were one of the most frequently requested support changes. The main friction wasn't writing the message — it was editing the HTML structure safely. The opportunity was to create a controlled editing environment that preserved email formatting while giving users full control over content.

**Image strip** (horizontal scrollable row of 200px-wide panels — placeholder boxes until real Figma screenshots are inserted):
- Slot 1: Label `Wireframe — Template list`
- Slot 2: Label `Figma Hi-fi — Editor layout`
- Slot 3: Label `Figma Hi-fi — Category accordion`
- Slot 4: Label `TinyMCE customization`

These are `div` placeholders with `background: var(--card)`, `border: 1px solid var(--border)`, `border-radius: 8px`, `width: 200px`, `aspect-ratio: 4/3`, `flex-shrink: 0`. Add a centered label in monospace 10px. **When Jona provides real screenshots, replace these divs with `<img>` tags.**

**Section: What I Designed & Built** (bullet list)
- Category-based template organization using collapsible accordion navigation
- Full TinyMCE integration for editing subject, body, and HTML email layout
- React component architecture connected to Django REST APIs for CRUD operations
- Shared template system allowing managers to assign templates to fundraisers
- Real-time template preview using an email rendering modal
- Template conflict detection and selection flow to prevent duplicate default templates

**Section: Outcome** (2-column metric blocks)
- Block 1: `Self-serve` / Fundraisers could create and manage templates without support intervention
- Block 2: `System consistency` / Shared templates ensured consistent messaging across teams

**Closing paragraph:**
> The biggest impact of Template Manager was shifting template control from internal support teams to the end users themselves. By combining a structured editor with controlled formatting, fundraisers could focus on communication instead of technical implementation.

---

### Donor Directory Case Study

**Title:** Donor Directory
**Category:** Enterprise SaaS · 2024
**Impact (footer):** High-performance search · Data grid UX · Fundraiser workflow
**Role chips:** UX Design, React Dev, Data Grid Architecture, Search UX
**Tags (hero pills):** React, Data Grid, Enterprise UX, Search Interface

**Section: Overview**
> The Donor Directory is a searchable database of donor profiles used by fundraising teams to track engagement and identify outreach opportunities. The goal of the project was to transform a static list of donor records into a dynamic interface where users could filter, search, and analyze donor data in real time.

**Section: The Problem** (bullet list)
- Existing donor lists were difficult to navigate with hundreds or thousands of records
- Filtering donors by multiple attributes required complex query tools outside the UI
- Important donor insights were buried across multiple profile pages
- Slow search workflows created friction during active fundraising campaigns

**Section: Research**
> Conversations with fundraisers showed that donor discovery happens quickly during outreach planning. Users needed to identify donors by attributes such as giving history, engagement status, or geographic location within seconds. The challenge was designing a UI that supported both quick scanning and deeper exploration of donor profiles.

**Image strip** (horizontal scrollable row of 200px-wide panels — placeholder boxes until real Figma screenshots are inserted):
- Slot 1: Label `Wireframe — Table layout`
- Slot 2: Label `Figma Hi-fi — Filter toolbar`
- Slot 3: Label `Donor profile drawer`
- Slot 4: Label `Search interaction flow`

These are `div` placeholders with `background: var(--card)`, `border: 1px solid var(--border)`, `border-radius: 8px`, `width: 200px`, `aspect-ratio: 4/3`, `flex-shrink: 0`. Add a centered label in monospace 10px. **When Jona provides real screenshots, replace these divs with `<img>` tags.**

**Section: What I Designed & Built** (bullet list)
- Interactive donor data grid with sortable columns and flexible filtering
- Global search bar for quick donor discovery
- Slide-out donor profile panel allowing users to inspect donor data without leaving the list view
- Persistent filters to refine donor segments during campaign planning
- React UI connected to backend APIs delivering paginated donor data

**Section: Outcome** (2-column metric blocks)
- Block 1: `Fast discovery` / Fundraisers could locate relevant donors within seconds using search and filters
- Block 2: `Workflow efficiency` / Slide-out profile view reduced navigation friction between list and profile pages

**Closing paragraph:**
> The redesigned Donor Directory transformed donor discovery from a static list into an active decision-making tool. Fundraisers could move quickly between scanning large datasets and reviewing individual donor profiles, making the platform more effective during time-sensitive campaigns.

---

## 8. Process Section — UX Audience Only

**Location:** Below the projects grid, before the metrics row.
**Visibility:** Only visible when `audienceMode === 'ux'`. Use conditional rendering in React, not CSS `display:none`.

**Component name:** `ProcessSection`

**Section header:**
- Kicker: `Design Process`
- Title: `How I Work`
- Subtitle: `Research-grounded. Systems-minded. Every design ends in working code.`

**What to build:** A 4-column grid (2-column on mobile) of step cards. Each card has:
- A faint large step number in the top-right corner (`font-size: 56px`, `font-weight: 800`, `color: rgba(255,255,255,0.03)`, `position: absolute`, non-interactive)
- An emoji icon (`font-size: 24px`, `margin-bottom: 14px`)
- A step title (`font-family: display`, `font-weight: 700`, `font-size: 16px`)
- A description paragraph (`font-size: 12px`, `color: var(--dim)`, `line-height: 1.65`)

**Card styling:** `background: var(--card)`, `padding: 28px 24px`, `position: relative`, `overflow: hidden`. The 4 cards share a 1px border between them (use `gap: 1px` on the grid with `background: var(--border)` on the grid container, and `border: 1px solid var(--border)` + `border-radius: 22px` on the outer wrapper, `overflow: hidden`).

**Steps:**

| # | Icon | Title | Description |
|---|---|---|---|
| 01 | 🔍 | Discover | User interviews, competitive audits, journey mapping. I validate the problem before picking up a pen. |
| 02 | ✏️ | Define | Wireframes, flows, IA — all in Figma. I align stakeholders at low-fi before investing in hi-fi. |
| 03 | 🧱 | Systematize | Design tokens, component libraries, interaction specs. Built for scale from day one. |
| 04 | 🚀 | Ship | I implement what I design in React + TypeScript. Zero handoff friction — I am the handoff. |

---

## 9. Tech Stack Section — Dev Audience Only

**Location:** Same position as the Process Section, but only rendered when `audienceMode === 'dev'`.
**Component name:** `StackSection`

**Section header:**
- Kicker: `Technical Stack`
- Title: `What I Build With`
- Subtitle: `8 years of production React. I also design, which means I ship better UI faster.`

**What to build:** A 3-column grid (2-col on tablet, 1-col on mobile) of stack cards.

**Card anatomy:**
- Category label: monospace, 9px, `color: var(--muted)`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `margin-bottom: 8px`
- Tech name: display font, `font-weight: 700`, `font-size: 17px`, `margin-bottom: 10px`
- Proficiency bar: `height: 2px`, `background: var(--border)`, fill in `--accent-teal` (`#4df0c6`), `border-radius: 2px`, `margin-bottom: 8px`
- Note: `font-size: 11px`, `color: var(--muted)`

**Card styling:** `background: var(--card)`, `border: 1px solid var(--border)`, `border-radius: 14px`, `padding: 20px`. On hover: `border-color: rgba(77, 240, 198, 0.3)`

**Stack items:**

| Category | Name | Bar Width | Note |
|---|---|---|---|
| Core | React + TypeScript | 95% | 8+ yrs · hooks, context, custom libs, perf optimization |
| Framework | Next.js | 85% | App router · SSR/SSG · API routes · Edge |
| State | Redux Toolkit | 88% | RTK Query · slices · normalized state |
| Design ↔ Code | Figma + Tokens | 94% | Automated token pipeline · zero handoff |
| Backend | Python / Django | 70% | REST APIs · DRF · Django ORM |
| DX / Testing | Storybook + Vitest | 78% | Component-driven dev · unit + integration |

---

## 10. Impact Metrics Row — Both Audiences (Different Copy)

**Location:** Below the Process Section (UX mode) or Stack Section (Dev mode).
**Component name:** `MetricsRow`

**What to build:** A 3-column grid (1-col on mobile) of metric cards.

**Card anatomy:**
- Large number/value: display font, `font-weight: 800`, `font-size: 42px`, `letter-spacing: -0.05em`, `color: var(--accent-active)`, `line-height: 1`, `margin-bottom: 8px`
- Description: `font-size: 13px`, `color: var(--dim)`, `line-height: 1.5`, `margin-bottom: 6px`
- Context: monospace, `font-size: 10px`, `color: var(--muted)`, `letter-spacing: 0.04em`

**Card styling:** `background: var(--card)`, `border: 1px solid var(--border)`, `border-radius: 14px`, `padding: 28px`

**UX Mode metrics:**

| Value | Description | Context |
|---|---|---|
| 35% | Reduction in task completion time after gift officer dashboard redesign | Gravyty Raise · 2022 |
| 200+ | Nonprofit organizations using products I designed and built | Gravyty Platform · 2019–2024 |
| 0 | Handoff errors — I design and build the same component spec | Every project · Every time |

**Dev Mode metrics:**

| Value | Description | Context |
|---|---|---|
| 8+ | Years shipping React to production environments | TypeScript · Hooks · Redux · Next.js |
| 60% | Faster component development via reusable design system | Gravyty Design System · 2021 |
| 1× | Engineer who also designs — no translation layer, ever | My differentiator vs. every other dev |

Use conditional rendering to swap metric data based on `audienceMode`. The component itself doesn't change, only the data passed to it as props.

---

## 11. Testimonial Block

**Location:** Below the MetricsRow, inside the UX-only section. Only render when `audienceMode === 'ux'`.
**Component name:** `TestimonialBlock`

**Styling:**
- `background: var(--card)`, `border: 1px solid var(--border)`, `border-left: 3px solid var(--accent-active)` — the left border color transitions with mode
- `border-radius: 14px`, `padding: 36px`, `margin-top: 24px`
- Left border color transition: `border-color var(--speed) var(--ease)`

**Quote:**
> "Jona is a one-of-a-kind designer and teammate. His code is always done with best practices and his designing skills are impeccable and keep getting better with each project."

Style: `font-size: clamp(14px, 2vw, 17px)`, `line-height: 1.75`, `font-style: italic`, `color: var(--text)`, `margin-bottom: 20px`

**Attribution:**
> — Colleague, Gravyty · 2.5 years collaborating directly on the Raise product

Style: monospace, `font-size: 11px`, `color: var(--muted)`, `font-style: normal`, `letter-spacing: 0.04em`

---

## 12. Resume Download Strip

**Location:** Between the last content section and the footer.
**Component name:** `ResumeStrip`

**Styling:** `background: var(--surface)`, `border-top: 1px solid var(--border)`, `border-bottom: 1px solid var(--border)`, `padding: 28px clamp(20px, 5vw, 56px)`, `display: flex`, `flex-wrap: wrap`, `align-items: center`, `justify-content: space-between`, `gap: 16px`

**Left side:**
- Title (changes with mode):
  - UX mode: `Resume · UX/UI Engineer`
  - Dev mode: `Resume · Senior Frontend Engineer`
- Subtitle (static): `8 years · Gravyty · React · TypeScript · Figma · Next.js` — `font-size: 13px`, `color: var(--muted)`

**Right side:** Two buttons:
- Primary (filled): `Download PDF` — links to resume PDF (placeholder `href="#"`)
- Secondary (outlined): `LinkedIn →` — links to LinkedIn profile

---

## 13. Hero Stats Row

**Location:** At the bottom of the hero section, separated from the copy above by a `border-top: 1px solid var(--border)`, `padding-top: 40px`, `margin-top: 56px`.
**Component name:** `HeroStats`

**What to build:** A horizontal row of 3 stats. On mobile, allow wrapping.

**Stat anatomy:**
- Number/value: display font, `font-weight: 800`, `font-size: clamp(28px, 4vw, 40px)`, `letter-spacing: -0.04em`, `color: var(--accent-active)` (transitions with mode)
- Label: monospace, `font-size: 10px`, `color: var(--muted)`, `letter-spacing: 0.07em`, `text-transform: uppercase`, `margin-top: 2px`

**Stat data** (Stat 3 changes with mode):

| Mode | Stat 1 | Stat 2 | Stat 3 |
|---|---|---|---|
| UX | `8+` / Years shipped | `4` / Products featured | `Figma → React` / Full pipeline |
| Dev | `8+` / Years shipped | `4` / Products featured | `Design-to-Ship` / Full pipeline |

---

## 14. Audience Context Banner

**Location:** Between the hero section and the projects grid (`#work` section).
**Component name:** `ContextBanner`

**Purpose:** Tells the viewer what they're currently seeing so they understand the toggle they just walked past.

**Styling:** `padding: 18px 24px`, `border: 1px dashed rgba(201,240,77,0.3)` in UX mode / `rgba(77,240,198,0.3)` in Dev mode, `border-radius: 14px`, `background: rgba(201,240,77,0.05)` in UX / `rgba(77,240,198,0.05)` in Dev. Margin: `0 clamp(20px, 5vw, 56px) 0`.

**Content:**
- A small icon on the left: `🎨` in UX mode, `⚙️` in Dev mode
- A paragraph in monospace, `font-size: 11px`, `color: rgba(201,240,77,0.7)` / teal equivalent

**UX mode text:**
> **Viewing: UX & Product Design mode.** Showing research process, design systems, and user impact. Toggle above to see the engineering view.

**Dev mode text:**
> **Viewing: Frontend Engineering mode.** Showing tech stack, code architecture, and engineering metrics. Toggle above to see the design view.

All content and border/background colors transition smoothly when the mode switches.

---

## 15. Global State — Audience Mode

**Implementation approach:** Use React Context so that `audienceMode` is accessible anywhere in the tree without prop drilling.

**Create file:** `src/context/AudienceContext.tsx`

```tsx
// AudienceContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type AudienceMode = 'ux' | 'dev';

interface AudienceContextType {
  audienceMode: AudienceMode;
  setAudienceMode: (mode: AudienceMode) => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('ux');
  return (
    <AudienceContext.Provider value={{ audienceMode, setAudienceMode }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used within AudienceProvider');
  return ctx;
}
```

**Wrap the app:** In `src/App.tsx` (or `src/main.tsx`), wrap the root component with `<AudienceProvider>`.

**CSS variable approach for colors:** On the `<body>` element, apply a data attribute or class that changes with `audienceMode`:
- UX mode: `document.body.setAttribute('data-mode', 'ux')` → CSS: `body[data-mode="ux"] { --accent-active: #c9f04d; }`
- Dev mode: `document.body.setAttribute('data-mode', 'dev')` → CSS: `body[data-mode="dev"] { --accent-active: #4df0c6; }`

This allows all CSS `var(--accent-active)` usages to automatically transition when mode changes without any JS logic in individual components.

**Transition:** Add to the root CSS: `* { transition: color 0.4s ease, background-color 0.4s ease, border-color 0.4s ease; }` — but exclude transitions on elements where it would cause jank (images, layout properties). Use this selectively if needed.

---

## 16. Typography & Font Upgrade

**Current fonts:** Whatever is currently loaded (likely system fonts or a generic sans-serif).

**New font stack:** Load from Google Fonts in the HTML `<head>` or via `@import` in the global CSS file:

```
https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:ital,wght@0,300;0,400;1,300&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap
```

**CSS variables to add to `:root`:**
```css
--font-disp: 'Syne', sans-serif;       /* headlines, logo, large numbers */
--font-body: 'IBM Plex Sans', sans-serif; /* body copy, descriptions */
--font-mono: 'IBM Plex Mono', monospace;  /* kickers, tags, labels, code */
```

**Apply globally:**
- `body`: `font-family: var(--font-body)`, `font-weight: 300`
- All `h1, h2, h3`: `font-family: var(--font-disp)`
- All tag chips, kicker labels, nav items, stat labels, role chips, section labels: `font-family: var(--font-mono)`

**Noise texture overlay:** Add a full-page pseudo-element to create a subtle film grain:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,..."); /* SVG feTurbulence noise */
  opacity: 0.35;
}
```
Use an inline SVG with `feTurbulence` (`baseFrequency: 0.75`, `numOctaves: 4`, `stitchTiles: stitch`) as the background-image value. This is a purely visual texture that adds depth to the dark background.

---

## 17. Scroll Reveal Animations

**What to build:** Elements fade in and slide up as they enter the viewport.

**Implementation:** Use `IntersectionObserver` in a custom hook.

**Create file:** `src/hooks/useScrollReveal.ts`

```ts
import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed'); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}
```

**CSS:**
```css
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-on-scroll.revealed {
  opacity: 1;
  transform: none;
}
```

**Apply to:** `ContextBanner`, the projects grid, `ProcessSection`, `StackSection`, `MetricsRow`, `TestimonialBlock`, `ResumeStrip`. Do NOT apply to the nav or the hero — those should be visible immediately on load.

**Stagger on the projects grid:** Add `transition-delay: calc(index * 80ms)` to each card so they reveal in sequence left-to-right.

---

## 18. Scroll Progress Bar on Panel

**Location:** At the very top of the `CaseStudyPanel`, inside the panel container (not the page).

**What to build:** A 2px horizontal bar that fills left-to-right as the user scrolls the panel body.

**Implementation:**
```tsx
const handlePanelScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  setScrollProgress(Math.min(pct, 100));
};
```

**Styling:**
- Container: `position: absolute`, `top: 0`, `left: 0`, `right: 0`, `height: 2px`, `background: var(--border)`, `z-index: 10`
- Fill: `height: 100%`, `background: var(--accent-active)`, `width: ${scrollProgress}%`, `transition: width 0.1s linear`

---

## 19. Keyboard Shortcut — ESC to Close Panel

**Location:** Global `keydown` event listener, added when the panel is open and removed when it closes.

**Implementation:**
```tsx
useEffect(() => {
  if (!isPanelOpen) return;
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closePanel();
  };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [isPanelOpen]);
```

**Hint UI:** When the panel is open, show a small hint at the bottom-left corner of the screen: `Press ESC to close`. Style: monospace, 10px, `color: var(--muted)`. This hint fades in with the panel and fades out when the panel closes. `position: fixed`, `bottom: 20px`, `left: 20px`, `z-index: 300`.

---

## 20. Mobile Responsiveness Rules

The site must be fully usable on screens as small as 375px. The following rules apply:

**Nav:**
- Toggle labels shorten to `UX` and `Dev` below 400px viewport width
- Logo stays left, toggle stays right — no nav links needed (there are none currently)

**Hero:**
- Headline `font-size`: use `clamp(40px, 10vw, 112px)` — never smaller than 40px, never larger than 112px
- Stats row: `flex-wrap: wrap`, `gap: 20px`

**Project cards:**
- Grid: `grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr))` — single column on mobile automatically
- Featured card (URGE Talent) spans 2 columns on desktop only; on mobile it's the same width as others: `@media (max-width: 800px) { grid-column: span 1; }`

**Case Study Panel:**
- Below 640px: `width: 100vw`, panel slides up from the bottom instead of from the right (`translateY(100%)` → `translateY(0)`, positioned `bottom: 0; left: 0; right: 0; height: 92svh`)
- Hero image zone reduces to `height: 180px` on mobile
- Body padding reduces to `16px`

**Process / Stack sections:**
- Process grid: 2 columns on mobile (2×2 instead of 4×1)
- Stack grid: 1 column on mobile

**Metrics row:**
- 1 column on mobile, each card full width

**Resume strip:**
- Stacks vertically on mobile: title/subtitle above, buttons below

**Thumbnail hover overlay:**
- On touch devices, hover doesn't work reliably. The `Case study ↕` text link in the card footer is the primary tap target for opening the panel on mobile. Keep it clearly visible at all times (not just on hover).

---

## 21. Copy Fixes & Typos

Fix the following in the existing project cards:

- **Givzey Landing** card: `MARKTING SITE` → `MARKETING SITE` (typo in the current category tag)
- **Hero paragraph**: Remove the "under construction" sentence entirely (see Section 1)
- **Logo**: The current `devignUX` treatment — `devign` in regular weight, `UX` in lighter or different style — should be updated so `devign` is in the display font (`Syne`, `font-weight: 800`) and `UX` is colored with `var(--accent-active)` and transitions with mode.

---

## 22. File & Component Structure

After all additions, the project should have at minimum these new or modified files:

```
src/
├── context/
│   └── AudienceContext.tsx          ← NEW: global audience mode state
├── hooks/
│   └── useScrollReveal.ts           ← NEW: IntersectionObserver reveal hook
├── components/
│   ├── nav/
│   │   └── AudienceToggle.tsx       ← NEW: UX/Dev toggle pill
│   ├── hero/
│   │   ├── HeroSection.tsx          ← MODIFIED: dual-mode copy
│   │   └── HeroStats.tsx            ← NEW: stats row
│   ├── projects/
│   │   ├── ProjectCard.tsx          ← MODIFIED: add role chips, overlay, impact line
│   │   ├── RoleChipRow.tsx          ← NEW: role chips component
│   │   └── projects.ts         ← NEW: all project data including case study content
│   ├── panel/
│   │   ├── CaseStudyPanel.tsx       ← NEW: slide-over panel
│   │   └── CaseStudyContent.tsx     ← NEW: content sections within panel
│   ├── sections/
│   │   ├── ContextBanner.tsx        ← NEW: audience context banner
│   │   ├── ProcessSection.tsx       ← NEW: UX process steps
│   │   ├── StackSection.tsx         ← NEW: Dev tech stack
│   │   ├── MetricsRow.tsx           ← NEW: impact metrics
│   │   ├── TestimonialBlock.tsx     ← NEW: testimonial
│   │   └── ResumeStrip.tsx          ← NEW: resume CTA strip
│   └── ui/
│       ├── Button.tsx               ← NEW or MODIFIED: reusable button variants
│       └── SectionHeader.tsx        ← NEW: kicker + title + subtitle pattern
├── styles/
│   └── globals.css                  ← MODIFIED: add CSS tokens, noise texture, font vars
└── App.tsx                          ← MODIFIED: wrap with AudienceProvider, add new sections
```

**Data file:** All project data (titles, descriptions, tags, roles, case study content, impact lines, live URLs) should live in `src/components/projects/projects.ts` as a typed array. This keeps content separate from presentation and makes it easy to update projects without touching component code.

**Example type shape:**
```ts
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  roles: string[];
  rolePillLabel: string;
  impactLine: string;
  liveUrl: string;
  githubUrl?: string;
  caseStudy: {
    heroBackground: string; // CSS string or image path
    footerImpact: string;
    sections: Array<{
      label: string;
      type: 'paragraph' | 'bullets' | 'metrics' | 'imagestrip';
      content: string | string[] | Array<{ value: string; description: string }>;
    }>;
  };
}
```

---

## Implementation Order (Recommended)

Follow this sequence to avoid rework:

1. **Section 15** — Set up `AudienceContext` and CSS variable system first. Everything depends on it.
2. **Section 16** — Load fonts and set up global CSS tokens.
3. **Section 22** — Set up file structure and `projects.ts` with all content.
4. **Section 2** — Build `AudienceToggle` in nav so you can test mode switching immediately.
5. **Section 3** — Rewrite hero with dual-mode copy.
6. **Section 13** — Add `HeroStats`.
7. **Section 14** — Add `ContextBanner`.
8. **Section 4** — Add `RoleChipRow` and role pill badge to existing project cards.
9. **Section 5** — Add hover overlay and impact line to project cards.
10. **Section 6** — Build `CaseStudyPanel` component (structure only, no content yet).
11. **Section 7** — Wire case study content from `projects.ts` into the panel.
12. **Section 18 & 19** — Add scroll progress bar and ESC handler to panel.
13. **Section 8** — Build `ProcessSection`.
14. **Section 9** — Build `StackSection`.
15. **Section 10** — Build `MetricsRow` with dual-mode data.
16. **Section 11** — Build `TestimonialBlock`.
17. **Section 12** — Build `ResumeStrip`.
18. **Section 17** — Add `useScrollReveal` and apply to all new sections.
19. **Section 20** — Mobile responsiveness audit and fixes.
20. **Section 21** — Copy fixes (typo, logo, hero cleanup).
21. **Section 1** — Final: delete "under construction" copy if not already handled.

---

*End of implementation guide. Every section is a discrete, independently buildable unit. Claude Code should be able to execute each section in sequence without ambiguity.*
