import urgeProjectImage from '@/assets/urge-project.png';
import chancletazoProjectImage from '@/assets/chancletazo-project.png';
import swProjectImage from '@/assets/sw-project.png';
import givzeyProjectImage from '@/assets/givzey-project.png';
import gradumProjectImage from '@/assets/gradum-project.png';
import templateManagerImage from '@/assets/template-manager-project.svg';
import donorDirectoryImage from '@/assets/donor-directory-project.svg';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CaseStudySection =
  | { label: string; type: 'paragraph'; content: string }
  | { label: string; type: 'bullets'; content: string[] }
  | { label: string; type: 'metrics'; content: Array<{ value: string; description: string }> }
  | { label: string; type: 'imagestrip'; content: Array<{ label: string }> };

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  roles: string[];
  rolePillLabel: string;
  impactLine: string;
  liveUrl: string;
  githubUrl?: string;
  caseStudy: {
    heroBackground: string;
    footerImpact: string;
    sections: CaseStudySection[];
  };
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'gravyty-template-manager',
    title: 'Template Manager',
    category: 'Enterprise SaaS · 2024',
    description:
      'Self-serve email template system for fundraising teams — replacing support-dependent HTML editing with a structured TinyMCE editor and category-based organization.',
    image: templateManagerImage,
    tags: ['Enterprise SaaS', 'React', 'TinyMCE', 'UX Systems', 'Django API'],
    roles: ['Product Design', 'UX Engineering', 'React Dev', 'API Integration', 'TinyMCE Customization'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Self-serve templates · TinyMCE editor · React + Django',
    liveUrl: '',
    caseStudy: {
      heroBackground: templateManagerImage,
      footerImpact: 'Self-serve email templates · TinyMCE editor · React + Django',
      sections: [
        {
          label: 'Overview',
          type: 'paragraph',
          content:
            'Template Manager is a self-serve email template system built for fundraising teams using the Raise platform. The goal was to replace a legacy workflow where templates were edited directly in HTML or managed by support teams. The new system allowed fundraisers to create, edit, categorize, and share templates directly within the platform — reducing support dependency and enabling faster campaign execution.',
        },
        {
          label: 'The Problem',
          type: 'bullets',
          content: [
            'Fundraisers relied on customer support to modify email templates',
            'Editing HTML manually was error-prone and inaccessible for non-technical users',
            'Templates were scattered across user accounts with no structured organization',
            'No way to share templates across teams or enforce consistent messaging',
          ],
        },
        {
          label: 'Research',
          type: 'paragraph',
          content:
            'Internal interviews with fundraising teams revealed that templates were one of the most frequently requested support changes. The main friction wasn\'t writing the message — it was editing the HTML structure safely. The opportunity was to create a controlled editing environment that preserved email formatting while giving users full control over content.',
        },
        {
          label: 'Process',
          type: 'imagestrip',
          content: [
            { label: 'Wireframe — Template list' },
            { label: 'Figma Hi-fi — Editor layout' },
            { label: 'Figma Hi-fi — Category accordion' },
            { label: 'TinyMCE customization' },
          ],
        },
        {
          label: 'What I Designed & Built',
          type: 'bullets',
          content: [
            'Category-based template organization using collapsible accordion navigation',
            'Full TinyMCE integration for editing subject, body, and HTML email layout',
            'React component architecture connected to Django REST APIs for CRUD operations',
            'Shared template system allowing managers to assign templates to fundraisers',
            'Real-time template preview using an email rendering modal',
            'Template conflict detection and selection flow to prevent duplicate default templates',
          ],
        },
        {
          label: 'Outcome',
          type: 'metrics',
          content: [
            { value: 'Self-serve', description: 'Fundraisers could create and manage templates without support intervention' },
            { value: 'System consistency', description: 'Shared templates ensured consistent messaging across teams' },
          ],
        },
        {
          label: 'Closing',
          type: 'paragraph',
          content:
            'The biggest impact of Template Manager was shifting template control from internal support teams to the end users themselves. By combining a structured editor with controlled formatting, fundraisers could focus on communication instead of technical implementation.',
        },
      ],
    },
  },
  {
    id: 'gravyty-donor-directory',
    title: 'Donor Directory',
    category: 'Enterprise SaaS · 2024',
    description:
      'High-performance searchable donor database with real-time filtering, sortable data grid, and a slide-out profile panel for fundraiser workflow.',
    image: donorDirectoryImage,
    tags: ['React', 'Data Grid', 'Enterprise UX', 'Search Interface'],
    roles: ['UX Design', 'React Dev', 'Data Grid Architecture', 'Search UX'],
    rolePillLabel: 'Design + Code',
    impactLine: 'High-performance search · Data grid UX · Fundraiser workflow',
    liveUrl: '',
    caseStudy: {
      heroBackground: donorDirectoryImage,
      footerImpact: 'High-performance search · Data grid UX · Fundraiser workflow',
      sections: [
        {
          label: 'Overview',
          type: 'paragraph',
          content:
            'The Donor Directory is a searchable database of donor profiles used by fundraising teams to track engagement and identify outreach opportunities. The goal was to transform a static list of donor records into a dynamic interface where users could filter, search, and analyze donor data in real time.',
        },
        {
          label: 'The Problem',
          type: 'bullets',
          content: [
            'Existing donor lists were difficult to navigate with hundreds or thousands of records',
            'Filtering donors by multiple attributes required complex query tools outside the UI',
            'Important donor insights were buried across multiple profile pages',
            'Slow search workflows created friction during active fundraising campaigns',
          ],
        },
        {
          label: 'Research',
          type: 'paragraph',
          content:
            'Conversations with fundraisers showed that donor discovery happens quickly during outreach planning. Users needed to identify donors by attributes such as giving history, engagement status, or geographic location within seconds. The challenge was designing a UI that supported both quick scanning and deeper exploration of donor profiles.',
        },
        {
          label: 'Process',
          type: 'imagestrip',
          content: [
            { label: 'Wireframe — Table layout' },
            { label: 'Figma Hi-fi — Filter toolbar' },
            { label: 'Donor profile drawer' },
            { label: 'Search interaction flow' },
          ],
        },
        {
          label: 'What I Designed & Built',
          type: 'bullets',
          content: [
            'Interactive donor data grid with sortable columns and flexible filtering',
            'Global search bar for quick donor discovery',
            'Slide-out donor profile panel allowing users to inspect donor data without leaving the list view',
            'Persistent filters to refine donor segments during campaign planning',
            'React UI connected to backend APIs delivering paginated donor data',
          ],
        },
        {
          label: 'Outcome',
          type: 'metrics',
          content: [
            { value: 'Fast discovery', description: 'Fundraisers could locate relevant donors within seconds using search and filters' },
            { value: 'Workflow efficiency', description: 'Slide-out profile view reduced navigation friction between list and profile pages' },
          ],
        },
        {
          label: 'Closing',
          type: 'paragraph',
          content:
            'The redesigned Donor Directory transformed donor discovery from a static list into an active decision-making tool. Fundraisers could move quickly between scanning large datasets and reviewing individual donor profiles, making the platform more effective during time-sensitive campaigns.',
        },
      ],
    },
  },
  {
    id: 'urge-talent',
    title: 'URGE Talent',
    category: 'Web Application · 2023',
    description:
      'Talent search and curation platform with advanced filtering and profile management.',
    image: urgeProjectImage,
    tags: ['Featured', 'React', 'TypeScript', 'Figma', 'UX Research'],
    roles: ['UX Research', 'UI Design', 'React Dev', 'Component Library', 'Figma Prototyping'],
    rolePillLabel: 'Design + Code',
    impactLine: '↑ ~40% faster talent selection workflow',
    liveUrl: 'https://www.allbooked.co/',
    caseStudy: {
      heroBackground: urgeProjectImage,
      footerImpact: '↑ ~40% faster talent selection workflow',
      sections: [
        {
          label: 'Overview',
          type: 'paragraph',
          content:
            'URGE is a talent search and curation platform built for agencies and casting directors. The brief: replace a spreadsheet-and-email workflow with a visual, filterable interface that lets agents build and export talent packages in one session — without switching tools.',
        },
        {
          label: 'The Problem',
          type: 'bullets',
          content: [
            'Talent agents were managing rosters across disconnected spreadsheets, email chains, and external photo drives',
            'No visual way to filter by physical attributes, skills, or availability simultaneously',
            'Package creation required manually exporting each profile and assembling PDFs',
            'Zero searchable history — every new job started from scratch',
          ],
        },
        {
          label: 'Research',
          type: 'paragraph',
          content:
            'I interviewed 4 talent agents across two agencies to map their current workflow end-to-end. The key insight: the bottleneck wasn\'t finding talent — it was building the client-facing package. Agents spent 60–70% of their time on formatting and assembly, not on curation decisions.',
        },
        {
          label: 'Process',
          type: 'imagestrip',
          content: [
            { label: 'Journey Map v1 workflow' },
            { label: 'Wireframe — Filter sidebar' },
            { label: 'Figma Hi-fi — Grid view' },
            { label: 'Figma Hi-fi — Package builder' },
          ],
        },
        {
          label: 'What I Designed & Built',
          type: 'bullets',
          content: [
            'Grid/list toggle with persistent multi-attribute filter sidebar — height, weight, hair, eye color, skills, availability filterable simultaneously',
            'Slide-out profile panel with photo carousel and stats — no page navigation needed, stays in context',
            'Package builder flow — drag-select multiple talents, name the package, export to PDF or shareable link',
            'Figma → React, no handoff — designed the component spec and implemented it, so the final product matched the prototype exactly',
          ],
        },
        {
          label: 'Outcome',
          type: 'metrics',
          content: [
            { value: '~40%', description: 'Reduction in time-to-package vs. previous spreadsheet workflow' },
            { value: '0', description: 'Design/dev discrepancies at launch — I was both designer and engineer' },
          ],
        },
        {
          label: 'Closing',
          type: 'paragraph',
          content:
            'The biggest win wasn\'t speed — it was confidence. Agents told us they were willing to pitch more clients because assembling a package no longer felt like a chore.',
        },
      ],
    },
  },
  {
    id: 'small-wrld-music',
    title: 'Small Wrld Music',
    category: 'Music Platform · 2026',
    description:
      'Music discovery platform with featured tracks, beats, and interactive player.',
    image: swProjectImage,
    tags: ['Music Platform', 'React', 'Web Audio API', 'Dark UI'],
    roles: ['Product Design', 'React Dev', 'Audio UX', 'Mobile-first'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Mobile-first · Inline audio player',
    liveUrl: 'https://swsmusicgroup.com/',
    caseStudy: {
      heroBackground: swProjectImage,
      footerImpact: 'Mobile-first · Inline audio · Editorial UI',
      sections: [
        {
          label: 'Overview',
          type: 'paragraph',
          content:
            'A music discovery platform designed for independent artists to showcase beats and original songs. The design brief required something that felt editorial and brand-worthy — not the cluttered grid of SoundCloud or BeatStars.',
        },
        {
          label: 'The Challenge',
          type: 'bullets',
          content: [
            'Independent artists lacked a visually compelling storefront that felt like their brand, not a commodity marketplace',
            'Existing platforms (SoundCloud, BeatStars) optimize for volume, not curation — leading to visual noise and no brand identity',
            '80%+ of music discovery happens on mobile — existing tools were desktop-first afterthoughts on small screens',
          ],
        },
        {
          label: 'Design Decisions',
          type: 'bullets',
          content: [
            'Dark editorial aesthetic — pulled reference from streaming platforms like Apple Music and Tidal, not SaaS dashboards',
            'Cover art as the primary UI — large, full-bleed imagery with typography treatment over the artwork, not below it',
            'Persistent mini-player — audio plays inline without interrupting browsing; built with the Web Audio API and a custom React player hook',
            'Mobile-first layout — designed at 375px wide first, then scaled up; every interaction validated on physical device',
          ],
        },
        {
          label: 'Outcome',
          type: 'metrics',
          content: [
            { value: '80%+', description: 'Target sessions on mobile — built mobile-first from day one' },
            { value: '0 reloads', description: 'Audio plays inline without navigation — custom React audio hook' },
          ],
        },
      ],
    },
  },
  {
    id: 'givzey-landing',
    title: 'Givzey Landing',
    category: 'Marketing Site · 2026',
    description:
      'A marketing landing page for Givzey. An AI-powered platform for fundraising.',
    image: givzeyProjectImage,
    tags: ['Marketing Site', 'Wix', 'Figma', 'Nonprofit Tech'],
    roles: ['Figma Design', 'UX Design', 'Responsive Layout', 'Wix Implementation'],
    rolePillLabel: 'Wix · Figma',
    impactLine: 'Figma → Wix · Responsive marketing platform',
    liveUrl: '',
    caseStudy: {
      heroBackground: givzeyProjectImage,
      footerImpact: 'Figma → Wix · Responsive marketing platform',
      sections: [
        {
          label: 'Context',
          type: 'paragraph',
          content:
            'Givzey needed a complete redesign of their marketing site to launch VEO — a new AI fundraising product aimed at nonprofit development officers. The previous site felt like a generic SaaS template. The new one needed to communicate "autonomous AI" while still feeling credible and trustworthy to a nonprofit audience that tends to be skeptical of overly technical messaging.',
        },
        {
          label: 'My Role',
          type: 'bullets',
          content: [
            'Received initial design direction and content, then created the full visual design system in Figma',
            'Designed responsive layouts covering breakpoints from mobile (320px) through large desktop (1440px+)',
            'Implemented the full site in Wix based on the client\'s platform requirement',
            'Built reusable sections and layout patterns inside Wix to maintain consistency across pages',
            'Ensured accessible typography hierarchy and color contrast aligned with WCAG AA standards',
          ],
        },
        {
          label: 'Key Design Decision',
          type: 'paragraph',
          content:
            'The colorful paint-explosion visual was the client\'s metaphor for "AI creating new capacity." The challenge was incorporating this expressive visual without making the page feel chaotic or overly tech-centric. I treated the paint effect as a background texture and balanced it with structured layout blocks, generous white space, and strong typography hierarchy — allowing the visual to add emotion while keeping the reading flow clear and professional.',
        },
        {
          label: 'Outcome',
          type: 'metrics',
          content: [
            { value: '100%', description: 'Pixel-matched to the original Figma design during Wix implementation' },
            { value: 'Responsive', description: 'Fully optimized layout across mobile, tablet, and desktop breakpoints' },
          ],
        },
        {
          label: 'Closing',
          type: 'paragraph',
          content:
            'The final site successfully balanced a bold AI-forward visual identity with the clarity and trust required for nonprofit audiences. By designing in Figma first and translating the layout into Wix\'s component system, the project delivered a flexible marketing site that the client could easily maintain moving forward.',
        },
      ],
    },
  },
  {
    id: 'el-chancletazo',
    title: 'El Chancletazo',
    category: 'Restaurant Website · 2026',
    description:
      'Dominican food restaurant website featuring menu items and preorder functionality.',
    image: chancletazoProjectImage,
    tags: ['Restaurant', 'React', 'Brand Design', 'E-commerce'],
    roles: ['Brand Design', 'UI Design', 'React Dev', 'Preorder System'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Cultural branding · React preorder system',
    liveUrl: '',
    caseStudy: {
      heroBackground: chancletazoProjectImage,
      footerImpact: 'Cultural branding · React preorder system',
      sections: [
        {
          label: 'Context',
          type: 'paragraph',
          content:
            'El Chancletazo is a Dominican comfort food business run out of Tampa. They needed a web presence that felt like an extension of their cultural identity — warm, bold, unapologetically Dominican — not a generic restaurant template. The secondary requirement: a preorder system for limited meal drops.',
        },
        {
          label: 'Design Approach',
          type: 'bullets',
          content: [
            'Color as identity — warm browns, deep blacks, and lime accent carry the cultural warmth without resorting to red-and-yellow fast food clichés',
            'Photography art direction — the food photography needed to evoke home cooking, not food-styled restaurant shoots; editorial compositions with real textures',
            'Typography pairing — serif headlines (warmth, tradition) against monospace subtext (modern, digital) to bridge old-school food culture with contemporary web',
          ],
        },
        {
          label: 'The Preorder System',
          type: 'paragraph',
          content:
            'Meal drops are time-limited — when a batch is announced, customers preorder within a window. I built this in React with availability state managed per dish, an order form with SMTP email confirmation to both customer and operator, a countdown timer component for meal drop windows, and a mobile-first layout optimized for one-thumb use.',
        },
        {
          label: 'Preorder Features',
          type: 'bullets',
          content: [
            'Availability state managed per dish (available / limited / sold out)',
            'Order form with SMTP email confirmation to both the customer and the operator',
            'Countdown timer component for meal drop windows',
            'Mobile-first — the majority of orders come through Instagram DMs, so the site had to feel as native as a social app',
          ],
        },
        {
          label: 'Outcome',
          type: 'metrics',
          content: [
            { value: '5.0 ★', description: 'Google Reviews rating — reflected on the site as social proof' },
            { value: 'Mobile', description: 'Orders primarily via mobile — entire UX optimized for one-thumb use' },
          ],
        },
      ],
    },
  },
  {
    id: 'gradum-group',
    title: 'Gradum Group',
    category: 'Marketing Site · Lead Gen',
    description:
      'Engineering-led advisory and execution platform for technical, operational, and infrastructure complexity.',
    image: gradumProjectImage,
    tags: ['Marketing Site', 'Next.js', 'Brand', 'Lead Gen'],
    roles: ['Brand Design', 'UI Design', 'Next.js Dev', 'Copy Architecture'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Engineering advisory · Lead gen platform',
    liveUrl: 'https://www.gradumgroup.com/',
    caseStudy: {
      heroBackground: gradumProjectImage,
      footerImpact: 'Engineering advisory · Lead gen platform',
      sections: [
        {
          label: 'Overview',
          type: 'paragraph',
          content:
            'Gradum Group needed a brand identity and marketing site that positioned them as a premium, engineering-led advisory firm — not a generic consulting agency. The design language needed to communicate depth, precision, and confidence to technical and executive audiences simultaneously.',
        },
        {
          label: 'My Role',
          type: 'bullets',
          content: [
            'Built the full brand identity from scratch — wordmark, color system, typography scale',
            'Architected the copy structure to speak to both technical and C-suite audiences on the same page',
            'Implemented in Next.js — fully responsive, performance-optimized',
            'Designed the lead generation flow end-to-end',
          ],
        },
      ],
    },
  },
];
