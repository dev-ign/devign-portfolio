export interface DonorDirectoryCardContent {
  title: string;
  body: string;
}

export interface DonorDirectorySectionContent {
  label: string;
  heading: string;
  intro?: string;
}

export const donorDirectoryCaseStudyContent = {
  hero: {
    eyebrow: 'Donor Directory',
    title: 'Designing Enterprise Data Experiences',
    subtitle:
      'Managing donor relationships at scale requires more than displaying rows in a table. The challenge was to help fundraisers discover, organize, and act on large donor datasets without sacrificing clarity, speed, or usability.',
    quickFacts: [
      { label: 'Role', value: 'Product Designer & UX Engineer' },
      { label: 'Platform', value: 'Enterprise SaaS' },
      {
        label: 'Tools',
        value: 'Figma, React, Material UI, MUI X DataGrid Pro, Django REST Framework',
      },
      {
        label: 'Focus',
        value: 'Data Tables, Search, Filtering, Accessibility, Design Systems',
      },
    ],
  },
  opportunity: {
    label: 'Opportunity',
    heading: 'Making large record sets easier to navigate',
    paragraphs: [
      'Fundraisers depend on donor data to understand relationships, prioritize outreach, and take meaningful action. As organizations and datasets grew, the directory needed to support increasingly complex workflows without becoming visually overwhelming or difficult to navigate.',
      'The opportunity was to create a scalable donor-management experience that made large volumes of information easier to search, scan, filter, and act upon while establishing reusable interaction patterns for the wider platform.',
    ],
    challenge:
      'How might we help fundraisers quickly find and manage the right donor without overwhelming them as the dataset grows?',
  },
  principles: {
    label: 'Principles',
    heading: 'A foundation for every design decision',
    intro:
      'The interface was guided by five principles that helped balance usability, flexibility, and technical scalability.',
    cards: [
      {
        title: 'Clarity',
        body: 'Reduce unnecessary visual noise and make important information easy to scan.',
      },
      {
        title: 'Efficiency',
        body: 'Support frequent and repetitive workflows with fewer steps and predictable interactions.',
      },
      {
        title: 'Scalability',
        body: 'Create patterns that continue working as the number of records, filters, columns, and user needs grow.',
      },
      {
        title: 'Accessibility',
        body: 'Support keyboard navigation, readable hierarchy, visible states, and WCAG-aligned interaction patterns.',
      },
      {
        title: 'Consistency',
        body: 'Reuse familiar components and behaviors so users do not need to relearn the interface across the platform.',
      },
    ] satisfies DonorDirectoryCardContent[],
  },
  experience: {
    label: 'Experience',
    heading: 'Solving the directory as a set of connected UX problems',
    intro:
      'Rather than treating the directory as a single table, I approached it as a connected system of discovery, filtering, selection, donor context, feedback, and action. Users could move from a large dataset into the history and next steps of an individual relationship without losing their place.',
    discovery: {
      heading: 'Finding the right donor, faster',
      body:
        'With large record sets, discovery could not depend on manual browsing alone. Search, filtering, and sorting worked together so users could quickly narrow the dataset without losing context.',
      cards: [
        {
          title: 'Search',
          body: 'Provide a clear, prominent entry point for locating donors by known information.',
        },
        {
          title: 'Filtering',
          body: 'Allow users to narrow large datasets through multiple criteria while making active filters easy to understand and remove.',
        },
        {
          title: 'Sorting',
          body: 'Support rapid scanning by allowing users to reorder records according to the information most relevant to their workflow.',
        },
      ] satisfies DonorDirectoryCardContent[],
    },
    scale: {
      heading: 'Designing for scale without sacrificing responsiveness',
      body:
        "The directory needed to remain usable across organizations with significantly different dataset sizes. Server-side pagination and data retrieval helped the directory remain responsive as datasets grew, while clear loading feedback preserved the user's place within the workflow.",
      cards: [
        {
          title: 'Server-side pagination',
          body: 'Load manageable sets of records through server-side data retrieval while preserving navigation across larger datasets.',
        },
        {
          title: 'Virtualized rendering',
          body: "MUI X DataGrid Pro's virtualization capabilities helped efficiently render large record sets.",
        },
        {
          title: 'Predictable navigation',
          body: 'Make page changes, row counts, and dataset boundaries clear to users.',
        },
        {
          title: 'Loading feedback',
          body: 'Use visible progress and skeleton states so the interface never appears frozen or unresponsive.',
        },
      ] satisfies DonorDirectoryCardContent[],
    },
    tables: {
      heading: 'Using hierarchy and spacing to improve scanability',
      body:
        'Data tables often become difficult to use when every piece of information is given equal visual weight. The table system used hierarchy, spacing, alignment, and controlled density to help users scan across rows and identify relevant details quickly.',
      details: [
        'Column hierarchy',
        'Consistent alignment',
        'Controlled row density',
        'Sticky headers',
        'Clear sort indicators',
        'Status and metadata treatments',
        'Predictable hover and selected states',
      ],
      supportingCopy:
        'Every table detail was treated as part of the interaction system, from column widths and cell alignment to selected-row styling and sticky controls.',
    },
    donorContext: {
      label: 'Donor Context',
      heading: 'Moving from a record to a relationship',
      body:
        'A donor row was only the starting point. Selecting a record opened a donor-detail drawer where fundraisers could review key details, understand relationship history, and identify the next meaningful action without leaving the directory or losing their search and filter context.',
      cards: [
        {
          title: 'Context without interruption',
          body: 'Keep the directory visible so users could review an individual donor without losing their position in the wider dataset.',
        },
        {
          title: 'Relationship history',
          body: 'Present meaningful interactions, gifts, notes, and outreach activity in a chronological timeline that was easy to scan.',
        },
        {
          title: 'Actionable next steps',
          body: 'Surface relevant donor-level actions—including requesting a first draft—close to the information needed to make a confident decision.',
        },
      ] satisfies DonorDirectoryCardContent[],
    },
    bulkActions: {
      heading: 'Reducing repetitive work through confident bulk actions',
      problem:
        'Managing records one at a time made repetitive workflows slower and increased unnecessary interaction.',
      solution:
        'Multi-row selection and contextual bulk actions allowed users to act on multiple records while maintaining confidence through clear selected and disabled states, CSV import and export workflows, and accessible feedback.',
      callouts: [
        'Multi-row selection',
        'Select-all behavior',
        'Contextual bulk actions',
        'Selected and disabled states',
        'CSV import/export',
        'Loading, success, and error feedback',
      ],
    },
    states: {
      heading: 'Designing beyond the ideal path',
      body:
        "The quality of the directory depended on how it behaved when data was loading, unavailable, or unable to match a user's request. These states were treated as core product experiences rather than afterthoughts.",
      cards: [
        {
          title: 'Loading',
          body: 'Communicate that records are being retrieved without shifting the surrounding layout.',
        },
        {
          title: 'Empty',
          body: 'Explain what the directory represents and guide users toward the next meaningful action.',
        },
        {
          title: 'No Results',
          body: 'Clarify that the current search or filter combination returned no matches and provide a clear recovery path.',
        },
        {
          title: 'Error',
          body: 'Describe what went wrong in plain language and provide an appropriate retry or recovery action.',
        },
        {
          title: 'Selected',
          body: 'Keep selected records and the actions available for that selection visibly connected.',
        },
        {
          title: 'Unavailable',
          body: 'Clearly communicate when an action cannot be performed because of the current selection, record state, or user context.',
        },
      ] satisfies DonorDirectoryCardContent[],
    },
  },
  systems: {
    label: 'Systems',
    heading: 'Turning individual solutions into reusable product patterns',
    paragraphs: [
      'The directory did not operate as an isolated interface. It reused and extended shared patterns for search, filters, tables, drawers, timelines, actions, feedback, and states.',
      'Those refinements contributed back to the wider product system, with Figma components aligned to reusable React and Material UI implementation patterns.',
    ],
    components: [
      'Search field',
      'Filter trigger',
      'Active filter chip',
      'Table header',
      'Sort control',
      'Selection checkbox',
      'Status badge',
      'Context menu',
      'Pagination',
      'Empty state',
      'Feedback message',
      'Primary and secondary actions',
    ],
    callout: 'Designed once. Reused across workflows. Refined through production use.',
  },
  implementation: {
    label: 'Implementation',
    heading: 'Designing with production behavior in mind',
    body:
      'Because I worked across both design and frontend implementation, decisions were evaluated not only for visual quality but also for responsive behavior, component reuse, accessibility, API constraints, and maintainability.',
    steps: [
      'Requirements and workflow definition',
      'Wireframes and interaction planning',
      'High-fidelity Figma designs',
      'Component and state specifications',
      'React and Material UI implementation',
      'Design QA and refinement',
    ],
    cards: [
      {
        title: 'Component variants',
        body: 'Documented behavior across states, sizes, and interaction contexts.',
      },
      {
        title: 'Responsive behavior',
        body: 'Defined how controls, columns, and actions should adapt as available space changes.',
      },
      {
        title: 'State documentation',
        body: 'Included validation, loading, empty, selected, disabled, success, and error behavior.',
      },
      {
        title: 'API considerations',
        body: 'Aligned UI behavior with server-side pagination and data retrieval, available filtering and sorting behavior, and asynchronous feedback.',
      },
      {
        title: 'Design QA',
        body: 'Reviewed production implementation through design QA, keyboard testing, and screen-reader testing to refine spacing, hierarchy, interactions, and accessibility.',
      },
    ] satisfies DonorDirectoryCardContent[],
  },
  quality: {
    label: 'Quality',
    heading: 'The details that make a complex product feel reliable',
    body:
      'The experience followed WCAG 2.1 AA-aligned practices, including keyboard usability, visible focus states, readable hierarchy, contrast, and accessible interaction feedback. Keyboard and screen-reader testing informed the broader implementation and QA process.',
    cards: [
      {
        title: 'Keyboard navigation',
        body: 'Support predictable movement through interactive controls and table actions.',
      },
      {
        title: 'Focus states',
        body: 'Ensure the active control remains visible during keyboard interaction.',
      },
      {
        title: 'Contrast and hierarchy',
        body: 'Maintain readability across text, labels, selected states, and status treatments.',
      },
      {
        title: 'Interaction feedback',
        body: 'Provide visible hover, active, selected, disabled, loading, success, and error states.',
      },
      {
        title: 'Touch targets',
        body: 'Keep actions usable across different devices and input methods.',
      },
      {
        title: 'Responsive prioritization',
        body: 'Preserve the most important information and actions as screen space becomes limited.',
      },
    ] satisfies DonorDirectoryCardContent[],
  },
  impact: {
    label: 'Impact',
    heading: 'A stronger foundation for data-heavy product experiences',
    cards: [
      {
        title: 'Improved discoverability',
        body: 'Search, filtering, sorting, and clear hierarchy made large donor datasets easier to navigate.',
      },
      {
        title: 'Reduced cognitive load',
        body: 'Consistent table patterns and progressive disclosure helped users focus on the information relevant to their task.',
      },
      {
        title: 'Established reusable patterns',
        body: 'Shared components and interaction models supported greater consistency across future enterprise workflows.',
      },
      {
        title: 'Improved implementation quality',
        body: 'Close collaboration between design and engineering reduced ambiguity and helped the production interface behave as intended.',
      },
      {
        title: 'Preserved workflow context',
        body: 'The donor-detail drawer allowed users to investigate individual records and take action without losing their search, filters, sorting, or position in the directory.',
      },
    ] satisfies DonorDirectoryCardContent[],
    summary:
      'The Donor Directory became more than a table of records. It established a reusable foundation for how the platform handled large datasets, complex interactions, responsive behavior, and design-to-engineering collaboration.',
  },
} as const;
