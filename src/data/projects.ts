import urgeProjectImage from '../assets/urge-project.png';
import chancletazoProjectImage from '../assets/chancletazo-project.png';
import swProjectImage from '../assets/sw-project.png';
import givzeyProjectImage from '../assets/givzey-project.png';
import gradumProjectImage from '../assets/gradum-project.png';
import templateManagerImage from '../assets/template-manager-project.svg';
import donorDirectoryImage from '../assets/donor-directory-project.svg';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CaseStudySection =
  | { label: string; type: 'paragraph'; content: string }
  | { label: string; type: 'bullets'; content: string[] }
  | { label: string; type: 'metrics'; content: Array<{ value: string; description: string }> }
  | { label: string; type: 'imagestrip'; content: Array<{ label: string }> };

export type ProjectType = 'code' | 'design' | 'videos';

export interface CaseStudyNarrativeSection {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  principle?: string;
}

export interface TemplateManagerCaseStudyNarrative {
  hero: {
    title: string;
    subtitle: string;
    summary: Array<{ label: string; value: string }>;
    confidentiality: string;
  };
  opportunity: CaseStudyNarrativeSection & { designChallenge: string };
  workflow: CaseStudyNarrativeSection & {
    tension: string;
    roles: Array<{ title: string; responsibilities: string[] }>;
    conclusion: string;
  };
  decisions: {
    id: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      initialHeading: string;
      explored: string;
      problemHeading: string;
      problem: string;
      finalHeading: string;
      final: string;
      principle: string;
    }>;
  };
  organization: CaseStudyNarrativeSection;
  editing: CaseStudyNarrativeSection;
  sharing: CaseStudyNarrativeSection;
  discovery: CaseStudyNarrativeSection & {
    filters: string[];
    navigationPaths: Array<{ label: string; value: string }>;
  };
  errors: CaseStudyNarrativeSection;
  implementation: CaseStudyNarrativeSection & { responsibilities: string[] };
  impact: {
    id: string;
    title: string;
    metrics: Array<{ value: string; label: string }>;
    outcomeTitle: string;
    outcomes: Array<{ title: string; description: string }>;
  };
  reflection: {
    id: string;
    title: string;
    body: string[];
  };
}

export interface Project {
  id: string;
  title: string;
  category: string;
  projectType: ProjectType;
  description: string;
  image: string;
  tags: string[];
  roles: string[];
  rolePillLabel: string;
  impactLine: string;
  liveUrl: string;
  githubUrl: string;
  accentColor: string;
  caseStudy: {
    heroBackground: string;
    footerImpact: string;
    sections: CaseStudySection[];
    narrative?: TemplateManagerCaseStudyNarrative;
  };
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'gravyty-template-manager',
    title: 'Template Manager',
    category: 'Enterprise SaaS · 2025',
    projectType: 'code',
    description:
      'Self-serve email template system for fundraising teams — replacing support-dependent HTML editing with a structured TinyMCE editor and category-based organization.',
    image: templateManagerImage,
    tags: ['Enterprise SaaS', 'React', 'TinyMCE', 'UX Systems', 'Django API'],
    roles: ['Product Design', 'UX Engineering', 'React Dev', 'API Integration', 'TinyMCE Customization'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Self-serve templates · TinyMCE editor · React + Django',
    liveUrl: '',
    githubUrl: '',
    accentColor: '#7B8CDE',
    caseStudy: {
      heroBackground: templateManagerImage,
      footerImpact: 'Self-serve email templates · TinyMCE editor · React + Django',
      narrative: {
        hero: {
          title: 'Templates Manager',
          subtitle:
            'Turning a support-dependent content workflow into a scalable self-service system for fundraising teams.',
          summary: [
            { label: 'Role', value: 'Lead Product Designer & Frontend Engineer' },
            {
              label: 'Responsibilities',
              value: 'Product discovery, UX strategy, interaction design, prototyping, UI design, usability testing, frontend implementation',
            },
            { label: 'Team', value: 'Product Manager, 4 Engineers, sole Product Designer' },
            { label: 'Platform', value: 'B2B SaaS / React / Material UI / Django REST Framework' },
            { label: 'Users', value: 'Fundraising managers, gift officers, fundraisers' },
            {
              label: 'Outcome',
              value: 'Converted support-managed template workflows into a scalable self-service experience.',
            },
          ],
          confidentiality:
            'The original product is protected by NDA. Interface examples in this case study have been recreated to represent the underlying workflows, interaction patterns, and design decisions without exposing proprietary information.',
        },
        opportunity: {
          id: 'opportunity',
          title: 'Opportunity',
          subtitle: 'From support tickets to self-service',
          paragraphs: [
            'Routine template management had become an operational bottleneck. Fundraising teams could not independently create or modify templates, so even basic content updates moved through support engineers.',
            'The existing workflow exposed raw HTML to non-technical users, creating risk for email integrity. At the same time, organizations still needed control over messaging consistency, ownership, and who could create, share, or change content.',
          ],
          designChallenge:
            'How might we give fundraising teams control over creating, editing, organizing, and sharing templates without sacrificing messaging consistency, permissions, or email integrity?',
        },
        workflow: {
          id: 'workflow',
          title: 'Understanding the Workflow',
          subtitle: 'Designing around real user roles',
          paragraphs: [
            'The core problem was not simply deciding who could edit a template. I mapped how organizational governance and individual ownership could coexist without making permissions feel complicated.',
          ],
          tension: 'Managers needed control. Fundraisers needed flexibility.',
          roles: [
            {
              title: 'Managers',
              responsibilities: [
                'View templates across all managed fundraisers',
                'Create shared templates',
                'Assign templates to individual team members',
                'Maintain messaging consistency',
              ],
            },
            {
              title: 'Fundraisers',
              responsibilities: [
                'Create personal templates',
                'Access manager-assigned templates',
                'Customize and organize their own library',
                'Quickly select templates while composing emails',
              ],
            },
          ],
          conclusion: 'This permission model became the foundation for the entire experience.',
        },
        decisions: {
          id: 'decisions',
          title: 'Key Design Decisions',
          subtitle: 'Choosing the system, not just the screens',
          items: [
            {
              title: 'One unified library',
              initialHeading: 'Separate libraries',
              explored: 'Separate areas for personal, shared, and assigned templates.',
              problemHeading: 'Why it didn’t work',
              problem:
                'That model fragmented discovery and forced users to understand where a template originated before they could find it.',
              finalHeading: 'Unified library',
              final:
                'One library, with ownership and access communicated contextually through labels, filters, permissions, and categories.',
              principle:
                'Let users find templates based on what they need to accomplish, not where the template came from.',
            },
            {
              title: 'Structured editing instead of raw HTML',
              initialHeading: 'Raw HTML or a custom editor',
              explored: 'Continue exposing HTML, or build a completely custom editor.',
              problemHeading: 'Why neither option worked',
              problem:
                'Raw HTML was unsafe for non-technical users, while a custom editor would add implementation cost without improving the core workflow.',
              finalHeading: 'Structured editing',
              final:
                'Customize TinyMCE to provide familiar formatting controls while protecting the underlying email structure.',
              principle:
                'Balance user confidence, formatting control, implementation feasibility, and email integrity.',
            },
          ],
        },
        organization: {
          id: 'organization',
          title: 'Organizing a Growing Library',
          subtitle: 'Making large template libraries easy to navigate',
          paragraphs: [
            'Large template libraries needed hierarchy, but a full folder tree would introduce unnecessary depth and management overhead.',
            'I used collapsible categories to keep the structure visible, make template names easy to scan, and reduce visual noise as libraries grew.',
          ],
          principle: 'Use the lightest hierarchy that keeps a growing content library understandable.',
        },
        editing: {
          id: 'editing',
          title: 'Safe Editing Without HTML',
          subtitle: 'A familiar editing experience',
          paragraphs: [
            'I integrated and customized TinyMCE so non-technical users could update subjects, body content, formatting, links, and images through familiar controls.',
            'The editing surface deliberately constrained what could change, preserving the underlying email structure and giving users confidence to work independently.',
          ],
          principle:
            'Users gained editing flexibility without gaining the ability to accidentally break the underlying email structure.',
        },
        sharing: {
          id: 'sharing',
          title: 'Sharing Across Teams',
          subtitle: 'Collaboration built into the workflow',
          paragraphs: [
            'Shared templates were not simply copied files. They represented organizational content that managers could distribute while fundraisers still maintained their own personal libraries.',
            'The assignment model let teams begin with approved messaging without removing the individual flexibility fundraisers needed in their day-to-day work.',
          ],
          principle: 'Central consistency and individual flexibility had to coexist in the same workflow.',
        },
        discovery: {
          id: 'discovery',
          title: 'Find the Right Template, Fast',
          subtitle: 'Browse when exploring, search when the target is known',
          paragraphs: [
            'As libraries grew, navigation could not rely on hierarchy alone. Search and filters created a second path for users who already knew what they were looking for.',
          ],
          filters: [
            'Assigned fundraiser (Managers)',
            'Favorites',
            'Shared vs. personal templates',
            'Engagement rate',
            'Template categories',
            'Search by template name or keywords',
          ],
          navigationPaths: [
            { label: 'Browse', value: 'Categories' },
            { label: 'Find', value: 'Search + filters' },
          ],
        },
        errors: {
          id: 'errors',
          title: 'Preventing User Errors',
          subtitle: 'Designing for edge cases',
          paragraphs: [
            'Default templates introduced a business-rule conflict: more than one template could unintentionally compete for the same organization-wide default state.',
            'The validation flow checked the rule before committing changes, explained the conflict clearly, and directed the manager to the existing default so they could resolve it in context.',
          ],
          principle: 'Prevent invalid configurations before users create them.',
        },
        implementation: {
          id: 'implementation',
          title: 'Technical Implementation',
          subtitle: 'From design to production',
          paragraphs: [
            'Because I also owned frontend implementation, I was able to carry the interaction model directly into production and resolve permission, state-management, editor, and API constraints without losing the intended UX.',
          ],
          responsibilities: [
            'UX flows',
            'Interaction design',
            'React architecture',
            'Django REST API integration',
            'CRUD operations',
            'TinyMCE customization',
            'Permission-based rendering',
            'State management',
            'Template preview',
          ],
        },
        impact: {
          id: 'impact',
          title: 'Outcome',
          metrics: [
            { value: '0', label: 'Raw HTML required for routine editing' },
            { value: '100', label: 'Users supported' },
            { value: 'Self-service', label: 'Creation and updates moved into the product' },
          ],
          outcomeTitle: 'What changed',
          outcomes: [
            {
              title: 'Self Service',
              description:
                'Fundraisers could independently create, edit, organize, and manage templates.',
            },
            {
              title: 'Consistency',
              description:
                'Managers could distribute approved messaging and maintain standards across teams.',
            },
            {
              title: 'Scalability',
              description:
                'The permission and organization model supported larger teams, growing libraries, and different user roles.',
            },
          ],
        },
        reflection: {
          id: 'reflection',
          title: 'Reflection',
          body: [
            'The biggest lesson from Templates Manager was that seemingly simple content tools become systems problems at enterprise scale. The editor itself was only one part of the experience; the harder challenge was determining who could create, own, share, modify, and standardize content across an organization.',
            'The project shifted my approach from designing individual interfaces toward designing relationships between roles, permissions, content, and workflows.',
          ],
        },
      },
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
    projectType: 'code',
    description:
      'A reconstructed enterprise data experience for search, filtering, scalable tables, donor context, accessibility, and reusable product patterns.',
    image: donorDirectoryImage,
    tags: ['React', 'Data Grid', 'Enterprise UX', 'Search Interface'],
    roles: ['UX Design', 'React Dev', 'Data Grid Architecture', 'Search UX'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Search and filtering · Data grid UX · Preserved workflow context',
    liveUrl: '',
    githubUrl: '',
    accentColor: '#6EC6CA',
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
    projectType: 'code',
    description:
      'Talent search and curation platform with advanced filtering and profile management.',
    image: urgeProjectImage,
    tags: ['Featured', 'React', 'TypeScript', 'Figma', 'UX Research'],
    roles: ['UX Research', 'UI Design', 'React Dev', 'Component Library', 'Figma Prototyping'],
    rolePillLabel: 'Design + Code',
    impactLine: '↑ ~40% faster talent selection workflow',
    liveUrl: 'https://www.allbooked.co/',
    githubUrl: '',
    accentColor: '#E87B6A',
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
    projectType: 'code',
    description:
      'Music discovery platform with featured tracks, beats, and interactive player.',
    image: swProjectImage,
    tags: ['Music Platform', 'React', 'Web Audio API', 'Dark UI'],
    roles: ['Product Design', 'React Dev', 'Audio UX', 'Mobile-first'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Mobile-first · Inline audio player',
    liveUrl: 'https://swsmusicgroup.com/',
    githubUrl: '',
    accentColor: '#9B7FE8',
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
    projectType: 'code',
    description:
      'A marketing landing page for Givzey. An AI-powered platform for fundraising.',
    image: givzeyProjectImage,
    tags: ['Marketing Site', 'Wix', 'Figma', 'Nonprofit Tech'],
    roles: ['Figma Design', 'UX Design', 'Responsive Layout', 'Wix Implementation'],
    rolePillLabel: 'Wix · Figma',
    impactLine: 'Figma → Wix · Responsive marketing platform',
    liveUrl: '',
    githubUrl: '',
    accentColor: '#72C97A',
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
    projectType: 'code',
    description:
      'Dominican food restaurant website featuring menu items and preorder functionality.',
    image: chancletazoProjectImage,
    tags: ['Restaurant', 'React', 'Brand Design', 'E-commerce'],
    roles: ['Brand Design', 'UI Design', 'React Dev', 'Preorder System'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Cultural branding · React preorder system',
    liveUrl: '',
    githubUrl: '',
    accentColor: '#D4A84B',
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
    projectType: 'code',
    description:
      'Engineering-led advisory and execution platform for technical, operational, and infrastructure complexity.',
    image: gradumProjectImage,
    tags: ['Marketing Site', 'Next.js', 'Brand', 'Lead Gen'],
    roles: ['Brand Design', 'UI Design', 'Next.js Dev', 'Copy Architecture'],
    rolePillLabel: 'Design + Code',
    impactLine: 'Engineering advisory · Lead gen platform',
    liveUrl: 'https://www.gradumgroup.com/',
    githubUrl: '',
    accentColor: '#8A9BB0',
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
