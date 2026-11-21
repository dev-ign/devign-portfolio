export interface DonorDirectoryCardContent {
  title: string;
  body: string;
}

export const donorDirectoryCaseStudyContent = {
  hero: {
    eyebrow: 'Gravyty / Raise · Product design & UX engineering',
    title: 'Donor Directory',
    subtitle:
      'I designed and helped build a directory that gave fundraisers more control over donor discovery and action, alongside Raise’s AI recommendations.',
    quickFacts: [
      { label: 'Role', value: 'Product Designer & UX Engineer' },
      { label: 'Product', value: 'Gravyty / Raise' },
      { label: 'Scope', value: 'Research · product design · frontend' },
      { label: 'Challenge', value: 'Large datasets · user control' },
      { label: 'Team', value: 'Sole designer · PM · 4 engineers' },
      { label: 'Stack', value: 'React · Material UI · DataGrid Pro' },
    ],
    nda:
      'This case study uses reconstructed interfaces and fictional donor data to illustrate workflows and design decisions from my work at Gravyty. Original production assets and source code remain proprietary.',
  },
  opportunity: {
    heading: 'Recommendations weren’t enough',
    paragraphs: [
      'Raise supported nonprofit and higher-education fundraisers working with thousands of donor records. First Draft helped identify donors and generate personalized outreach. But a recommendation didn’t cover every reason a gift officer might want to contact someone.',
      'Sometimes they already knew the donor. Other times, they wanted to search using their own criteria or fundraising goals. The opportunity was to give them a centralized way to find that person, understand the relationship, and take the next step.',
    ],
    problem:
      'How might we give fundraisers more control over donor discovery and action without disrupting their workflow?',
  },
  research: {
    heading: 'I wanted to understand the workflow before designing the interface.',
    approach:
      'In customer discovery and usability sessions, I asked users to walk me through their normal work. I took notes and asked open-ended questions about their goals, friction, and expectations. I wanted to understand what they needed to accomplish before asking them to react to an interface.',
    participants:
      'I worked with champion users, fundraisers, gift officers, fundraising managers, and customer support to understand the workflow from different perspectives.',
    questionsHeading: 'The questions behind the design',
    questionsContext:
      'Representative questions from my recollection, rather than a standardized interview script:',
    questions: [
      'Can you walk me through your typical workflow?',
      'Where do you encounter the most friction?',
      'In a fantasy world, what would the perfect product allow you to do?',
      'What information do you need before deciding to engage a donor?',
    ],
    findingsHeading: 'Three needs shaped the direction',
    findings: [
      {
        title: 'Control over discovery',
        body: 'Users wanted to find specific donors and filter by criteria that mattered to them. They didn’t always want the AI to decide whom they should engage.',
      },
      {
        title: 'A next step after finding someone',
        body: 'Finding a record was only part of the task. Users wanted to initiate First Draft outreach, add notes, set reminders, and carry out donor-management work.',
      },
      {
        title: 'A more connected experience',
        body: 'Fundraisers described friction moving between their CRM, Gravyty, and other tools. They wanted donor information and useful actions closer together.',
      },
    ] satisfies DonorDirectoryCardContent[],
    shiftHeading: 'What changed after research',
    shift:
      'I started thinking about the directory as an actionable fundraising workspace. A clearer table mattered, but the design also needed to connect finding a donor, understanding their situation, and doing something useful with that information.',
  },
  priorities: {
    heading: 'Turning what I learned into design priorities',
    intro:
      'These needs gave me a way to evaluate the interaction decisions: could someone find a donor, inspect the relevant information, and keep moving without starting over?',
    items: [
      { need: 'Independent donor discovery', decision: 'Search and filtering', target: 'discovery' },
      { need: 'Efficient navigation through large datasets', decision: 'Readable tables, sorting, and pagination', target: 'discovery' },
      { need: 'More donor context', decision: 'A contextual information drawer', target: 'donor-context' },
      { need: 'A useful next step', decision: 'First Draft outreach beside donor context', target: 'donor-context' },
      { need: 'Less repetitive work', decision: 'Selection and contextual bulk actions', target: 'bulk-actions' },
      { need: 'Less workflow disruption', decision: 'Preserved search, filters, and position', target: 'donor-context' },
    ],
    scope:
      'Notes and reminders were needs raised in discovery; they are not implemented in this reconstruction. The demos illustrate search, filtering, sorting, pagination, selection, local CSV export, and a simulated First Draft request.',
  },
  experience: {
    heading: 'Finding the right donor, faster',
    intro:
      'I separated finding a known person from exploring a group of donors. Search supports a specific name; filters narrow a population; sorting helps decide which records to review first. Try those controls on the same local set of 30 fictional records below.',
    flow: ['Discover', 'Narrow', 'Inspect', 'Return', 'Act'],
    flowDetails: ['Search', 'Filter + sort', 'Donor drawer', 'Context kept', 'Individual + bulk'],
    tables: {
      heading: 'Put the decision-making information first',
      body:
        'I prioritized donor identity and useful fundraising context so people could scan before opening a record. Predictable headers, spacing, and selection states helped keep a dense table readable.',
    },
    navigation: {
      heading: 'Make the result set understandable',
      body:
        'Organizations mapped their donor data differently. Clear result counts, active filters, sorting, and pagination helped people understand which records they were looking at and how to refine them. No-results feedback gave them a way back.',
    },
    donorContext: {
      heading: 'From a record to a relationship',
      body:
        'Users needed enough context to decide what to do next. I chose a drawer so they could inspect giving information, relationship history, and details while keeping their search, filters, sort, and place in the directory.',
      comparison: [
        {
          title: 'Separate detail page',
          body: 'More space for deep or complex donor work, but leaving the results adds a return step when reviewing several people.',
        },
        {
          title: 'Contextual drawer',
          body: 'A tighter canvas for focused inspection and quick actions. It keeps the directory in place, but is less suited to a long, detailed workflow.',
        },
      ],
      aiHeading: 'Working alongside AI',
      ai:
        'The goal wasn’t to replace the AI. It was to give fundraisers more control over when and how they used it. They could identify a donor using their own judgment, review the context, and initiate First Draft outreach. The reconstructed request is simulated; nothing is sent.',
    },
    bulkActions: {
      heading: 'Reducing repetitive work',
      body:
        'Once people had identified the records they wanted, acting on each one separately could become repetitive. I used selection to reveal relevant bulk controls when needed, keeping the default view focused on discovery.',
      scope:
        'In this reconstruction, the selected count communicates scope. Select all applies to the visible page; selections persist across pages, and CSV export includes all selected fictional records. Clear selection makes it easy to reset.',
      consideration:
        'The design question: how clear is the scope before someone acts? For higher-impact operations, I would revisit confirmation and recovery with usability testing. This demo demonstrates selection and export, without claiming those additional safeguards shipped.',
    },
    states: {
      body:
        'I also specified loading, empty, no-results, error, selection, and unavailable-action states alongside the main experience. The local demo exercises no-results, selection, and action feedback; it does not simulate every production state.',
    },
  },
  systems: {
    heading: 'Built for scale, designed for everyone',
    paragraphs: [
      'Large datasets made performance a design constraint. The production approach combined server-side retrieval and pagination with DataGrid virtualization, rather than loading every donor at once. The local reconstruction shows the interaction with a small sample; it is not a performance benchmark.',
      'I worked with product and engineering to define reusable search, selection, drawer, and feedback patterns. Keyboard access, visible focus, responsive information priority, and clear state changes were part of design and QA.',
    ],
  },
  implementation: {
    heading: 'From design decisions to reusable components',
    body:
      'As product designer and UX engineer, I carried the interaction intent from Figma specifications into React and Material UI patterns. Working through component states and design QA with engineering helped keep the behavior consistent as the design became a working interface.',
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
    body:
      'A drawer needed more than the right layout: keyboard tabs, a clear close action, and focus returning to the donor all mattered. I treated those behaviors, responsive layouts, and clear feedback as part of the interaction design. You can try them in the reconstructed directory.',
  },
  outcome: {
    heading: 'What I heard, and what I’d measure today',
    intro:
      'The signals I can speak to are qualitative recollections and a usage update from my product manager. They suggest the directory was useful, but do not establish a measured improvement in efficiency or adoption.',
    items: [
      {
        title: 'Search and filters resonated',
        body: 'I received positive feedback about being able to search and filter donor information, reinforcing the need for user-directed discovery.',
      },
      {
        title: 'Discovery led to First Draft',
        body: 'My product manager shared usage data showing that users were initiating First Draft requests from the directory. I don’t have a verified rate or comparison to report.',
      },
      {
        title: 'Customers asked for more',
        body: 'Customers requested additional capabilities after the introduction. I took that as a signal to keep learning about the workflow, rather than proof that every need was solved.',
      },
    ] satisfies DonorDirectoryCardContent[],
    measurementHeading: 'What I would measure more explicitly today',
    measurementContext:
      'These are future evaluation measures, not historical results. I would pair task-based usability sessions with product usage data:',
    measures: [
      'Time to locate a specific donor',
      'Search and filter task completion',
      'Completion of First Draft actions from the directory',
      'Repeated navigation between donor records',
      'Success and error rates for relevant actions',
      'Qualitative feedback on clarity and control',
    ],
  },
  reflection: {
    heading: 'Helping people do meaningful work',
    body:
      'Good UX wasn’t just about surfacing the right donor information. It was about helping people do meaningful work with it. Research clarified the need for control alongside AI; that shaped what I prioritized, why I chose a drawer, and how I carried those decisions through implementation.',
  },
} as const;
