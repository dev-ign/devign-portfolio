export interface DonorDirectoryCardContent {
  title: string;
  body: string;
}

export interface DonorDirectorySectionContent {
  heading: string;
  intro?: string;
}

export const donorDirectoryCaseStudyContent = {
  hero: {
    eyebrow: 'Donor Directory',
    title: 'Donor Directory',
    subtitle:
      'I designed and helped build a scalable directory that lets fundraisers find donors, understand their relationships, and take action without losing their place.',
    quickFacts: [
      { label: 'Role', value: 'Product Designer & UX Engineer' },
      { label: 'Product', value: 'Gravyty / Raise' },
      { label: 'Scope', value: 'UX · interaction design · frontend' },
      { label: 'Challenge', value: 'Large datasets · workflow clarity' },
      { label: 'Team', value: 'Sole designer · PM · 4 engineers' },
      { label: 'Stack', value: 'React · Material UI · DataGrid Pro' },
    ],
    nda:
      'The original product is protected by NDA. Product visuals have been reconstructed using fictional data while preserving the original workflows, interaction patterns, and design decisions.',
  },
  opportunity: {
    heading: 'Making complex donor data easier to navigate',
    paragraphs: [
      'Raise served organizations managing hundreds to more than 10,000 donor records. Each organization could map its data differently, so the directory had to make varied information useful at scale.',
      'The product requirement was a connected workflow: find and narrow records, inspect a donor, then take an action without repeating the search or losing the result position.',
    ],
    problem:
      'How could a large, organization-specific dataset feel manageable and actionable?',
    challenge:
      'How might we help fundraisers quickly find, understand, and act on the right donor as the dataset grows?',
  },
  experience: {
    heading: 'Finding the right donor, faster',
    intro:
      'The directory connects search, filters, sorting, and readable results. Try the fictional reconstruction below; its controls update the same local set of 30 records.',
    flow: ['Discover', 'Narrow', 'Inspect', 'Return', 'Act'],
    flowDetails: ['Search', 'Filter + sort', 'Donor drawer', 'Context kept', 'Select + export'],
    discovery: {
      heading: 'Finding the right donor, faster',
      body:
        'Search finds a known donor; filters narrow a population; sorting changes which records rise to the top. Each control changes the visible results and count.',
    },
    scale: {
      heading: 'Designing around real data constraints',
      body:
        'Loading or rendering an entire organization’s dataset at once was not a viable interaction model. Performance therefore became a product-design input: server-side retrieval and pagination worked with DataGrid virtualization, explicit loading feedback, and preserved filter and sort state so the interface stayed responsive without making the dataset feel fragmented.',
    },
    tables: {
      heading: 'Using hierarchy and spacing to improve scanability',
      body:
        'The table prioritized donor identity and high-value fundraising information, used controlled density to fit meaningful context without visual noise, and kept headers, sorting, selection, hover, and status behavior predictable.',
    },
    donorContext: {
      heading: 'From a record to a relationship',
      body:
        'A separate detail page offered more room, but interrupted the directory workflow. I explored a contextual drawer so fundraisers could review giving and relationship history while their search, filters, sort, and position stayed in place.',
      comparison: [
        {
          title: 'Separate detail page',
          body: 'More room for information, but breaks workflow context.',
        },
        {
          title: 'Contextual drawer',
          body: "Preserves the user's place and supports rapid donor review.",
        },
      ],
      ai:
        'Request First Draft sat beside the donor context needed to judge it. AI could support a suggested outreach action, but the fundraiser decided whether to initiate it: recommendation support, followed by a human decision.',
    },
    bulkActions: {
      heading: 'Reducing repetitive work',
      body:
        'Selection reveals relevant bulk controls only when records are chosen. In this reconstruction, selecting rows and exporting the selected fictional records to CSV are fully local interactions.',
      mapping:
        'CSV workflows also had to accommodate organization-specific data mappings. The interaction pattern stayed consistent even when the customer data beneath it did not.',
    },
    states: {
      heading: 'Designing beyond the ideal path',
      body:
        'The directory was designed for the states users actually encounter—not just the ideal dataset. Loading, empty, no-results, error, selection, and unavailable-action behavior were defined alongside the primary experience.',
    },
  },
  systems: {
    heading: 'Built for scale, designed for everyone',
    paragraphs: [
      'The production design accounted for server-side retrieval, pagination, and DataGrid virtualization so organizations could work with large datasets without loading every row at once. The portfolio demo uses a small local sample to show the interaction.',
      'Search, selection, drawers, and feedback were specified as reusable patterns that informed the broader Raise system of approximately 50+ components. Keyboard access, visible focus, responsive information priority, and clear state changes were part of design and QA.',
    ],
  },
  implementation: {
    heading: 'From design decisions to reusable components',
    body:
      'As product designer and UX engineer, I carried the interaction intent from Figma specifications into React and Material UI patterns, then checked behavior, responsive layouts, and accessibility with engineering.',
    steps: [
      'Requirements',
      'Wireframes',
      'High-fidelity design',
      'State specification',
      'React implementation',
      'Design QA',
    ],
  },
  quality: {
    heading: 'Designing for real-world interaction',
    body:
      'Accessibility and interaction quality were part of normal design and QA, not a final checklist. WCAG 2.1 AA-aligned practices included keyboard navigation, visible focus, contrast, screen-reader testing, responsive information prioritization, and clear interaction feedback.',
  },
  outcome: {
    heading: 'What this project taught me',
    items: [
      {
        title: 'Discover and understand',
        body: 'Search, filtering, sorting, information hierarchy, and richer donor context made complex datasets easier to navigate and understand.',
      },
      {
        title: 'Act without losing context',
        body: "The contextual drawer preserved the user's search, filters, sorting, and position, while selection and bulk actions made repeated work more efficient.",
      },
      {
        title: 'Scale beyond one feature',
        body: 'Reusable product patterns informed other data-heavy experiences, while direct frontend ownership strengthened design-to-production fidelity.',
      },
    ] satisfies DonorDirectoryCardContent[],
  },
  reflection: {
    heading: 'Reflection',
    body:
      'Good data-heavy design is not about showing everything at once. It helps people understand what matters, keep their context, and move confidently to the next action. This project sharpened how I balance clarity, performance, reusable patterns, and collaboration from design through QA.',
  },
} as const;
