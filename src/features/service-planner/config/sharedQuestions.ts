import type {
  PlannerOption,
  PlannerQuestion,
  ServiceBranchId,
} from '../types/servicePlanner.types';

const option = (id: string, label: string, description?: string): PlannerOption => ({
  id,
  label,
  description,
});

const forBranch = (
  branchId: ServiceBranchId,
  question: Omit<PlannerQuestion, 'branchId'>,
): PlannerQuestion => ({ ...question, branchId });

export const createSharedQuestions = (branchId: ServiceBranchId): PlannerQuestion[] => [
  forBranch(branchId, {
    id: 'audience',
    stepLabel: 'Audience',
    title: 'Who is this for?',
    description: 'Select every audience that needs to understand or use the finished work.',
    educationalNote:
      'Different audiences may need distinct messages, paths, permissions, or formats. This helps us avoid designing for an undefined “everyone.”',
    inputType: 'multi-select',
    required: true,
    options: [
      option('consumers', 'Consumers'),
      option('businesses', 'Businesses'),
      option('existing-customers', 'Existing customers'),
      option('internal-employees', 'Internal employees'),
      option('investors', 'Investors'),
      option('members', 'Members'),
      option('donors', 'Donors'),
      option('fans-listeners', 'Fans or listeners'),
      option('multiple-audiences', 'Multiple audiences'),
      option('other', 'Other'),
    ],
  }),
  forBranch(branchId, {
    id: 'business-stage',
    stepLabel: 'Context',
    title: 'Where is the organization today?',
    educationalNote:
      'The right starting point changes with your stage. A new idea often needs definition; an established organization may need alignment, migration, or change management.',
    inputType: 'single-select',
    required: true,
    options: [
      option('new-idea', 'New idea'),
      option('new-business', 'New business'),
      option('growing-business', 'Growing business'),
      option('established-business', 'Established business'),
      option('enterprise', 'Enterprise organization'),
      option('nonprofit', 'Nonprofit'),
      option('personal-brand', 'Personal brand'),
      option('artist-creator', 'Artist or creator'),
      option('other', 'Other'),
    ],
  }),
  forBranch(branchId, {
    id: 'decision-status',
    stepLabel: 'Readiness',
    title: 'How ready are you to begin?',
    inputType: 'single-select',
    required: true,
    options: [
      option('ready', 'Ready to start'),
      option('comparing', 'Comparing partners'),
      option('future', 'Planning for a future date'),
      option('researching', 'Gathering information'),
      option('needs-definition', 'Need help defining the project'),
    ],
  }),
  forBranch(branchId, {
    id: 'target-timeline',
    stepLabel: 'Timing',
    title: 'When would you ideally like to begin or launch?',
    educationalNote:
      'Fast timelines usually require a focused scope, quick feedback, and ready content. We use this answer as planning context, not a promise.',
    inputType: 'single-select',
    required: true,
    options: [
      { ...option('asap', 'As soon as possible'), timelineImpactWeeks: [-1, -1] },
      option('one-month', 'Within one month'),
      option('two-three-months', 'Within two to three months'),
      option('three-six-months', 'Three to six months'),
      option('six-plus-months', 'Six months or later'),
      option('no-fixed-date', 'No fixed date'),
    ],
  }),
  forBranch(branchId, {
    id: 'investment-comfort',
    stepLabel: 'Investment',
    title: 'Have you established an investment range for the project?',
    description: 'This helps us recommend a realistic starting scope. It does not disqualify your project.',
    educationalNote:
      'An early range lets us explain tradeoffs and decide whether a focused first phase or discovery engagement would create more value.',
    inputType: 'single-select',
    required: true,
    options: [
      option('under-1500', 'Under $1,500'),
      option('1500-3000', '$1,500–$3,000'),
      option('3000-6000', '$3,000–$6,000'),
      option('6000-12000', '$6,000–$12,000'),
      option('12000-plus', '$12,000+'),
      option('not-sure', 'Not sure yet'),
    ],
  }),
];

export const makeOption = option;
