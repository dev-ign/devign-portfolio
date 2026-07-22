export type DonorDirectoryAssetStatus =
  | 'available'
  | 'needs-capture'
  | 'needs-sanitization'
  | 'needs-recreation'
  | 'optional';

export type DonorDirectoryAssetType =
  | 'full-screen'
  | 'cropped-ui'
  | 'annotated-ui'
  | 'interaction-sequence'
  | 'component-sheet'
  | 'state-grid'
  | 'design-to-code'
  | 'responsive-comparison'
  | 'full-ui-drawer'
  | 'interaction-detail';

export type DonorDirectoryVisualAssetId =
  | 'donor-directory-hero'
  | 'donor-directory-overview'
  | 'donor-directory-search-filter-sequence'
  | 'donor-directory-pagination'
  | 'donor-directory-table-anatomy'
  | 'donor-directory-drawer-overview'
  | 'donor-directory-history-timeline'
  | 'donor-directory-request-first-draft'
  | 'donor-directory-row-to-drawer-sequence'
  | 'donor-directory-bulk-actions'
  | 'donor-directory-state-grid'
  | 'donor-directory-component-sheet'
  | 'donor-directory-design-to-production'
  | 'donor-directory-accessibility-details'
  | 'donor-directory-impact-summary';

export interface DonorDirectoryVisualAsset {
  id: DonorDirectoryVisualAssetId;
  section: string;
  title: string;
  purpose: string;
  assetType: DonorDirectoryAssetType;
  recommendedAspectRatio: string;
  source: string;
  status: DonorDirectoryAssetStatus;
  privacyNotes: readonly string[];
  captureInstructions: readonly string[];
  annotationNotes: readonly string[];
}

const sharedPrivacyNotes = [
  'Replace all donor names, email addresses, phone numbers, donation values, notes, profile images, and internal identifiers with realistic fictional data.',
  'Replace organization and customer names; do not include customer logos without approval.',
  'Prefer clean data replacement in a duplicated product or Figma screen instead of blurring the interface.',
] as const;

export const donorDirectoryVisualAssets = [
  {
    id: 'donor-directory-hero',
    section: 'Hero',
    title: 'Primary desktop Donor Directory overview',
    purpose: 'Establish the scope, density, and polish of the complete product experience immediately.',
    assetType: 'full-screen',
    recommendedAspectRatio: '16:9 or 1.6:1',
    source: 'Representative reconstruction captured from the internal React visual demo',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture a full-width desktop composition with product navigation, search, filters, table controls, and donor records visible.',
      'Keep the interface readable and avoid extreme zoom or unnecessary browser chrome.',
      'Preserve enough product shell to communicate that this is a complete enterprise experience.',
    ],
    annotationNotes: ['Do not annotate the hero image. Keep the treatment clean and product-focused.'],
  },
  {
    id: 'donor-directory-overview',
    section: 'Opportunity',
    title: 'Directory complexity overview',
    purpose: 'Show the breadth and density of the problem before the story breaks it into smaller UX decisions.',
    assetType: 'full-screen',
    recommendedAspectRatio: '16:9',
    source: 'Sanitized production application capture using a crop distinct from the hero',
    status: 'needs-capture',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Use a wider product shell, an open filter panel, or a view that makes dataset size and table density legible.',
      'Do not reuse the hero crop unchanged.',
      'Use a before-and-after comparison only if a real previous version becomes available.',
    ],
    annotationNotes: ['Keep annotations minimal; the image should communicate complexity primarily through the product view.'],
  },
  {
    id: 'donor-directory-search-filter-sequence',
    section: 'Finding the Right Donor',
    title: 'Search and filtering interaction sequence',
    purpose: 'Demonstrate how search, filtering, sorting, and visible feedback work together to narrow a large dataset.',
    assetType: 'interaction-sequence',
    recommendedAspectRatio: '4:3 per frame',
    source: 'Three or four sanitized production captures composed in Figma',
    status: 'needs-capture',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture the initial directory, search entry, applied filters with active chips, and the narrowed result set.',
      'Include a shipped sort state and clear or reset behavior only if they can be shown accurately.',
      'Compose frames horizontally for desktop and verify they can stack cleanly on mobile.',
    ],
    annotationNotes: [
      'Search entry point',
      'Filter trigger',
      'Active filter chip',
      'Result count',
      'Sort indicator',
      'Clear or reset behavior',
    ],
  },
  {
    id: 'donor-directory-pagination',
    section: 'Working With Large Data Sets',
    title: 'Pagination and large-dataset behavior',
    purpose: 'Show how server-side pagination, data retrieval, and loading feedback supported large record sets.',
    assetType: 'annotated-ui',
    recommendedAspectRatio: '16:10',
    source: 'One sanitized production capture with two supporting detail crops',
    status: 'needs-capture',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture pagination, current page, total record context, and page-size control if that control shipped.',
      'Capture a real loading state during data retrieval while preserving table structure.',
      'Compose one main pagination view with loading and record-count detail crops.',
    ],
    annotationNotes: [
      'Server-side pagination',
      'Current page',
      'Total record context',
      'Loading feedback',
      'Preserved table structure',
    ],
  },
  {
    id: 'donor-directory-table-anatomy',
    section: 'Making Complex Tables Feel Simple',
    title: 'Annotated table anatomy',
    purpose: 'Make UI precision, hierarchy, alignment, density, and interaction-state craft visible.',
    assetType: 'annotated-ui',
    recommendedAspectRatio: '3:2',
    source: 'Sanitized production table crop annotated and composed in Figma',
    status: 'needs-recreation',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture a readable table close-up containing a real sort state and a selected row.',
      'Capture hover separately if hover and selected states cannot be represented accurately in one source frame.',
      'Preserve real column widths, spacing, status treatments, and density.',
    ],
    annotationNotes: [
      'Column hierarchy',
      'Text and numeric alignment',
      'Row density',
      'Sticky header',
      'Sort state',
      'Selected and hover states',
      'Status and metadata treatment',
      'Column spacing',
      'Primary versus secondary information',
    ],
  },
  {
    id: 'donor-directory-drawer-overview',
    section: 'Donor Context',
    title: 'Donor-detail drawer overview',
    purpose: 'Show how users moved from a donor row into relationship context and next actions without leaving the directory.',
    assetType: 'full-ui-drawer',
    recommendedAspectRatio: '16:10',
    source: 'Representative reconstruction based on DonorDirectoryAnimation.tsx and donor-directory-project.svg',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Keep the directory visible behind or beside the open right-side drawer.',
      'Associate the visible selected row with the donor shown in the drawer.',
      'Show the compact profile header, three or four summary metrics, recommended next action, recent history, key details, and close control.',
      'Use fictional Northstar Foundation data and do not label the reconstruction as a production screenshot.',
    ],
    annotationNotes: ['No annotations are required; continuity between the table and drawer should be self-evident.'],
  },
  {
    id: 'donor-directory-history-timeline',
    section: 'Donor History',
    title: 'Relationship history timeline',
    purpose: 'Demonstrate how chronological donor activity could be scanned without leaving the directory context.',
    assetType: 'cropped-ui',
    recommendedAspectRatio: '3:2',
    source: 'Close-up from the representative donor-detail drawer reconstruction',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Show four to six fictional activities with readable dates, distinct event categories, and concise supporting details.',
      'Keep Amara Lewis data consistent with the table, summary metrics, and next-action asset.',
      'Preserve generous spacing and avoid turning the timeline into a dense audit log.',
    ],
    annotationNotes: [
      'Chronological relationship context',
      'Distinct activity categories',
      'Supporting details without overload',
      'Recent activity remains prominent',
    ],
  },
  {
    id: 'donor-directory-request-first-draft',
    section: 'Next Action',
    title: 'Request First Draft interaction detail',
    purpose: 'Show how a relevant donor-level action was surfaced alongside the context needed to act confidently.',
    assetType: 'interaction-detail',
    recommendedAspectRatio: '4:3',
    source: 'Close-up from the representative donor-detail drawer reconstruction',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Show the recommended-action title, concise context, and the confirmed “Request First Draft” primary action.',
      'Include a disabled or loading variant only if it improves the story without implying a full generation workflow.',
      'Do not create a draft-generation interface.',
    ],
    annotationNotes: ['Keep the next step prominent, contextual, and clearly actionable.'],
  },
  {
    id: 'donor-directory-row-to-drawer-sequence',
    section: 'Context Preservation',
    title: 'Row-to-drawer interaction sequence',
    purpose: 'Demonstrate continuity from table discovery into donor context while preserving search and filter state.',
    assetType: 'interaction-sequence',
    recommendedAspectRatio: '4:3 per frame',
    source: 'Deterministic states from the internal reconstruction composed into a four-frame sequence',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture the default table, Amara Lewis row hover or focus, selected row, and open drawer.',
      'Use the same fictional record and unchanged table context in every frame.',
      'Use restrained 220–320 ms slide-and-fade motion for the live interaction and respect reduced-motion preferences.',
    ],
    annotationNotes: ['Default directory', 'Focused donor row', 'Selected record', 'Contextual drawer open'],
  },
  {
    id: 'donor-directory-bulk-actions',
    section: 'Bulk Actions',
    title: 'Multi-row selection and bulk-action sequence',
    purpose: 'Show how repetitive work was streamlined while preserving clear states and feedback.',
    assetType: 'interaction-sequence',
    recommendedAspectRatio: '4:3 per frame',
    source: 'Three or four sanitized production captures composed in Figma',
    status: 'needs-capture',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture the default table, initial row selection, multiple selected rows, and visible contextual bulk actions.',
      'Include a real loading, success, or error state that shipped.',
      'Capture CSV import or export only where it belongs naturally in the shipped workflow.',
      'Do not add a confirmation dialog or Undo behavior.',
    ],
    annotationNotes: [
      'Checkbox and select-all behavior',
      'Selected count',
      'Contextual action area',
      'Selected and disabled states',
      'Loading, success, or error feedback',
    ],
  },
  {
    id: 'donor-directory-state-grid',
    section: 'Designing Every State',
    title: 'Directory state grid',
    purpose: 'Demonstrate that loading, empty, recovery, error, and unavailable-action states were designed intentionally.',
    assetType: 'state-grid',
    recommendedAspectRatio: '3:2 composition; consistent 4:3 tiles',
    source: 'Representative React reconstruction captured from the internal evidence canvas',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture Loading, Empty, No Results, Error, Selected, and Unavailable Action states from the reconstruction.',
      'Use consistent crop sizes and preserve surrounding context needed to understand each state.',
      'Arrange three columns on desktop, two on tablet, and one on mobile.',
      'Do not add generic illustrations that did not exist in the product.',
    ],
    annotationNotes: ['Give each tile a state label and one concise explanation; avoid additional callouts.'],
  },
  {
    id: 'donor-directory-component-sheet',
    section: 'Building Reusable Components',
    title: 'Shared component and interaction sheet',
    purpose: 'Show how established platform patterns were reused, extended, and refined through implementation.',
    assetType: 'component-sheet',
    recommendedAspectRatio: '16:10',
    source: 'Representative React reconstruction using the same primitives as the interactive directory demo',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Compose the search field, filter trigger, active filter chip, table header, sort control, checkbox, status badge, context menu, pagination, empty state, buttons, loading treatment, and feedback pattern.',
      'Show only useful, verified variants such as default, hover, active, selected, disabled, loading, and error.',
      'Do not imply that every component originated in the Donor Directory.',
    ],
    annotationNotes: [
      'Include the caption: “Shared platform patterns reused, extended, and refined through production implementation.”',
    ],
  },
  {
    id: 'donor-directory-design-to-production',
    section: 'Designing for Engineering',
    title: 'Figma-to-production comparison',
    purpose: 'Demonstrate accurate translation from component specifications into React and Material UI production behavior.',
    assetType: 'design-to-code',
    recommendedAspectRatio: '16:10 or 3:2',
    source: 'Representative specification overlay paired with the reconstructed React implementation',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Pair the same component or workflow in Figma and production using a split-screen or stacked composition.',
      'Prefer examples that show variant naming, responsive behavior, state documentation, or spacing specifications.',
      'Do not expose proprietary source code; include only a sanitized code-like excerpt if it materially improves the comparison.',
    ],
    annotationNotes: ['Label Figma and Production clearly; keep supporting specification notes concise.'],
  },
  {
    id: 'donor-directory-accessibility-details',
    section: 'Accessibility & Polish',
    title: 'Accessibility and interaction detail composition',
    purpose: 'Show the subtle states and responsive decisions that make the enterprise interface reliable.',
    assetType: 'responsive-comparison',
    recommendedAspectRatio: '3:2 composition; six equal tiles',
    source: 'Representative reconstruction and reviewed responsive captures composed in React',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Capture visible keyboard focus, hover, selected, disabled, interaction-feedback, and responsive-priority examples.',
      'Include touch-target spacing or a mobile/tablet crop where it communicates a real responsive behavior.',
      'Compose two rows of three tiles on desktop with layouts that can stack responsively.',
    ],
    annotationNotes: [
      'Visible Focus',
      'Keyboard Navigation',
      'Selected State',
      'Disabled State',
      'Responsive Priority',
      'Interaction Feedback',
    ],
  },
  {
    id: 'donor-directory-impact-summary',
    section: 'Impact',
    title: 'Product-system summary',
    purpose: 'Provide a restrained closing visual only if it adds synthesis without repeating another overview screenshot.',
    assetType: 'component-sheet',
    recommendedAspectRatio: '16:10',
    source: 'Representative React reconstruction collage using the approved directory, drawer, history, and next-action views',
    status: 'available',
    privacyNotes: sharedPrivacyNotes,
    captureInstructions: [
      'Prefer a summary collage or simple connection between search, tables, states, and shared components.',
      'Use a refined directory capture only if it is meaningfully different from the hero and opportunity views.',
      'Keep the outcome cards as the primary focus of the section.',
    ],
    annotationNotes: ['Avoid dense annotations and do not repeat an existing overview composition.'],
  },
] as const satisfies readonly DonorDirectoryVisualAsset[];

export const donorDirectorySectionVisualMap = [
  { section: 'Hero', assetIds: ['donor-directory-hero'] },
  { section: 'Opportunity', assetIds: ['donor-directory-overview'] },
  { section: 'Design Principles', assetIds: [], note: 'The five principle cards remain the primary visual; no external asset is required.' },
  {
    section: 'Experience — Finding the Right Donor',
    assetIds: ['donor-directory-search-filter-sequence'],
  },
  {
    section: 'Experience — Working With Large Data Sets',
    assetIds: ['donor-directory-pagination'],
  },
  {
    section: 'Experience — Making Complex Tables Feel Simple',
    assetIds: ['donor-directory-table-anatomy'],
  },
  { section: 'Experience — Donor Context', assetIds: ['donor-directory-drawer-overview'] },
  { section: 'Experience — Donor History', assetIds: ['donor-directory-history-timeline'] },
  { section: 'Experience — Next Action', assetIds: ['donor-directory-request-first-draft'] },
  {
    section: 'Experience — Context Preservation',
    assetIds: ['donor-directory-row-to-drawer-sequence'],
  },
  { section: 'Experience — Bulk Actions', assetIds: ['donor-directory-bulk-actions'] },
  {
    section: 'Building Reusable Components',
    assetIds: ['donor-directory-component-sheet', 'donor-directory-state-grid'],
  },
  { section: 'Designing for Engineering', assetIds: ['donor-directory-design-to-production'] },
  { section: 'Accessibility & Polish', assetIds: ['donor-directory-accessibility-details'] },
  { section: 'Impact', assetIds: ['donor-directory-impact-summary'] },
] as const;

export const donorDirectoryCaptureOrder: readonly DonorDirectoryVisualAssetId[] = [
  'donor-directory-hero',
  'donor-directory-drawer-overview',
  'donor-directory-overview',
  'donor-directory-row-to-drawer-sequence',
  'donor-directory-search-filter-sequence',
  'donor-directory-table-anatomy',
  'donor-directory-history-timeline',
  'donor-directory-request-first-draft',
  'donor-directory-bulk-actions',
  'donor-directory-state-grid',
  'donor-directory-component-sheet',
  'donor-directory-design-to-production',
  'donor-directory-accessibility-details',
  'donor-directory-pagination',
  'donor-directory-impact-summary',
];

export const donorDirectorySanitizationChecklist = [
  'Replace donor names with realistic fictional names.',
  'Replace email addresses, phone numbers, and mailing details.',
  'Replace donation amounts and giving-history values.',
  'Replace organization and customer names; remove unapproved customer logos.',
  'Replace notes, profile images, internal identifiers, and record IDs.',
  'Preserve realistic text lengths, data density, row counts, and column relationships.',
  'Review open menus, tooltips, URLs, browser tabs, metadata, and export filenames for hidden identifiers.',
  'Verify every sequence frame uses the same fictional dataset and consistent record details.',
  'Prefer clean replacement data over broad blur treatments.',
] as const;

export const existingDonorDirectoryReferences = [
  {
    path: 'src/assets/donor-directory-project.svg',
    description: 'Abstract donor-directory project card artwork; useful as a layout reference, not production evidence.',
    suitableForFinalCaseStudy: false,
  },
  {
    path: 'src/components/showcase/DonorDirectoryAnimation.tsx',
    description: 'Animated case-study card preview; useful as an interaction reference, not a production screenshot.',
    suitableForFinalCaseStudy: false,
  },
] as const;

export const getDonorDirectoryVisualAsset = (id: DonorDirectoryVisualAssetId) => {
  const asset = donorDirectoryVisualAssets.find((item) => item.id === id);
  if (!asset) throw new Error(`Unknown Donor Directory visual asset: ${id}`);
  return asset;
};
