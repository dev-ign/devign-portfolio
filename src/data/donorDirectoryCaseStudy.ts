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
    title: 'Designing Enterprise Data Experiences',
    subtitle:
      'Managing donor relationships at scale requires more than displaying rows in a table. I designed a system that helped fundraisers find, understand, and act on the right donor while keeping large, organization-specific datasets manageable.',
    quickFacts: [
      { label: 'Role', value: 'Product Designer & UX Engineer' },
      { label: 'Product', value: 'Raise — B2B fundraising SaaS' },
      { label: 'Scale', value: '1,000+ organizations · ~10,000 platform users' },
      { label: 'Dataset', value: 'Up to 10,000+ donor records per organization' },
      { label: 'Team', value: 'Sole Product Designer · Product Manager · 4 Engineers' },
      { label: 'Platform', value: 'React · Material UI · MUI X DataGrid Pro · Django REST Framework' },
    ],
    nda:
      'The original product is protected by NDA. Product visuals have been reconstructed using fictional data while preserving the original workflows, interaction patterns, and design decisions.',
  },
  opportunity: {
    heading: 'Making large record sets easier to navigate',
    paragraphs: [
      'Raise served organizations with dramatically different donor data: some managed hundreds of records, while others managed more than 10,000. Organization-specific mappings meant the shape and priority of that information could differ as much as its volume.',
      'Fundraisers needed to locate known donors, segment a population, prioritize the right information, repeat common actions, and move into relationship context—then return to the larger dataset without losing their place.',
    ],
    problem:
      'The problem was not “How do we make a nice table?” It was “How do we make a large, organization-specific dataset feel manageable and actionable?”',
    challenge:
      'How might we help fundraisers quickly find, understand, and act on the right donor as the dataset grows?',
  },
  experience: {
    heading: 'A workflow system, not a table',
    intro:
      'I treated discovery, selection, donor context, feedback, and action as one connected experience. Each step had to preserve what the user had already established in the step before it.',
    flow: ['Discover', 'Narrow', 'Select', 'Understand', 'Act'],
    flowDetails: ['Search', 'Filters + sorting', 'Donor dataset', 'Relationship context', 'Next action'],
    discovery: {
      heading: 'Finding the right donor, faster',
      body:
        'Search, filters, and sorting were designed as complementary discovery tools: search for a known donor, filters to narrow a population, and sorting to prioritize what mattered within the result set.',
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
        'A separate detail page offered more room, but it would pull fundraisers away from the search, filters, sort order, and dataset position they had just established. A contextual drawer accepted a tighter canvas in exchange for preserving that working context.',
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
        'Managing donors one at a time made routine administration slow. Selection changed the interface contextually: bulk controls stayed out of the way by default, then appeared when one or more rows were selected. Multi-row and select-all behavior, clear disabled states, CSV import and export, and success or error feedback made repeated actions faster without making them feel risky.',
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
    heading: 'Turning individual solutions into reusable product patterns',
    paragraphs: [
      'Search, filters, DataGrid behavior, selection, drawers, timelines, empty states, loading states, and feedback were refined as connected patterns rather than one-off directory features.',
      'Built on Material UI, the Figma patterns and reusable React implementation contributed to a broader Raise system of approximately 50+ components. The directory did not create that system alone; patterns developed and refined here became reusable solutions elsewhere in Raise.',
    ],
  },
  implementation: {
    heading: 'Designing with production behavior in mind',
    body:
      'Working across product design and frontend implementation let me carry product intent into production. Decisions were evaluated against API behavior, React and Material UI feasibility, responsive states, keyboard interactions, reusable component structure, and loading and error behavior.',
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
    heading: 'Outcome',
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
      'The biggest lesson was that enterprise data experiences are rarely solved by the table itself. Search, filtering, hierarchy, performance, selection, context, states, and actions have to work together as one system. Designing and implementing the directory reinforced the value of treating data volume, asynchronous retrieval, responsiveness, and component reuse as product-design inputs—not engineering concerns that appear after handoff.',
  },
} as const;
