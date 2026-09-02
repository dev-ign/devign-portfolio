import { createSharedQuestions, makeOption as option } from '../sharedQuestions';
import type { ServiceBranch } from '../../types/servicePlanner.types';

const branchId = 'branding-marketing' as const;
const slug = (label: string) => label.toLowerCase().replace(/[/\s]+/g, '-');

export const brandingMarketingBranch: ServiceBranch = {
  id: branchId,
  eyebrow: 'Branding & Marketing',
  title: 'Build Your Brand',
  shortTitle: 'Branding & Marketing',
  description: 'Visual systems and campaign assets that help your business look consistent, communicate clearly, and earn attention.',
  prompt: 'What kind of creative support do you need?',
  preview: { type: 'interactive', alt: 'Abstract brand identity and campaign materials preview', icon: 'solar:palette-bold-duotone', accent: '#FF9C69' },
  highlights: ['Brand identity', 'Graphic design', 'Advertising', 'Email campaigns', 'Trade-show materials'],
  questions: [
    {
      id: 'brand-support-type', branchId, stepLabel: 'Creative support', title: 'What kind of creative support do you need?',
      educationalNote: 'A defined engagement type helps distinguish foundational identity work from a focused campaign or ongoing production relationship.',
      inputType: 'single-select', required: true,
      options: [
        option('new-identity', 'New brand identity'), option('brand-refresh', 'Brand refresh'),
        option('marketing-campaign', 'Marketing campaign'), option('ongoing-design', 'Ongoing graphic design'),
        option('email-campaign', 'Email campaign design'), option('event-materials', 'Trade show or event materials'),
        option('social-advertising', 'Social and digital advertising'), option('sales-materials', 'Presentation or sales materials'), option('other', 'Something else'),
      ],
    },
    {
      id: 'brand-goal', branchId, stepLabel: 'Goal', title: 'What should this work accomplish?',
      inputType: 'multi-select', required: true, maxSelections: 2,
      options: ['Launch something new', 'Look more professional', 'Improve consistency', 'Increase awareness', 'Generate leads or sales', 'Support an event', 'Explain a complex offering', 'Create reusable templates', 'Update an outdated brand', 'Other'].map(label => option(slug(label), label)),
    },
    {
      id: 'brand-assets', branchId, stepLabel: 'Starting assets', title: 'What brand assets already exist?',
      inputType: 'single-select', required: true,
      options: [option('guidelines', 'Complete brand guidelines'), option('logo-colors', 'Logo and basic colors'), option('logo-only', 'Logo only'), option('inconsistent', 'Inconsistent collection of assets'), option('none', 'No existing identity'), option('not-sure', 'Not sure')],
    },
    {
      id: 'brand-deliverables', branchId, stepLabel: 'Deliverables', title: 'What would be useful to create?',
      educationalNote: 'Select likely needs, even if the exact list is not settled. We will organize the work into a coherent system rather than isolated pieces.',
      inputType: 'multi-select', required: true,
      options: ['Logo system', 'Color palette', 'Typography system', 'Brand guidelines', 'Business cards', 'Letterhead', 'Social templates', 'Digital advertisements', 'Print advertisements', 'Flyers or brochures', 'Posters', 'Flags or banners', 'Booth graphics', 'Email templates', 'HTML email development', 'Presentation deck', 'Packaging', 'Merchandise graphics', 'Website visual direction', 'Other'].map(label => ({ ...option(slug(label), label), complexityScore: ['Brand guidelines', 'Booth graphics', 'HTML email development', 'Packaging'].includes(label) ? 2 : 1 })),
    },
    {
      id: 'brand-email-format', branchId, stepLabel: 'Email scope', title: 'Is this a one-time campaign or a reusable email system?',
      inputType: 'single-select', required: true,
      visibility: { operator: 'or', conditions: [
        { questionId: 'brand-support-type', operator: 'equals', value: 'email-campaign' },
        { questionId: 'brand-deliverables', operator: 'includes', value: ['email-templates', 'html-email-development'] },
      ] },
      options: [option('one-time', 'One-time campaign'), option('reusable', 'Reusable template'), option('both', 'Campaign plus reusable system'), option('not-sure', 'Not sure')],
    },
    {
      id: 'brand-email-platform', branchId, stepLabel: 'Email platform', title: 'Which email platform will you use?',
      inputType: 'single-select', required: true,
      visibility: { operator: 'and', conditions: [{ questionId: 'brand-email-format', operator: 'exists' }] },
      options: ['HubSpot', 'Mailchimp', 'Klaviyo', 'Constant Contact', 'Salesforce Marketing Cloud', 'Custom platform', 'Not sure'].map(label => option(slug(label), label)),
    },
    {
      id: 'brand-event-readiness', branchId, stepLabel: 'Event production', title: 'Which event-production details are confirmed?',
      educationalNote: 'Large-format production requires confirmed measurements, safe areas, bleed, material specifications, and coordination with the selected vendor.',
      inputType: 'multi-select', required: true,
      visibility: { operator: 'or', conditions: [
        { questionId: 'brand-support-type', operator: 'equals', value: 'event-materials' },
        { questionId: 'brand-deliverables', operator: 'includes', value: ['flags-or-banners', 'booth-graphics'] },
      ] },
      options: [option('indoor', 'Indoor event'), option('outdoor', 'Outdoor event'), option('dimensions-confirmed', 'Deliverable dimensions confirmed'), option('printer-selected', 'Printer or fabricator selected'), option('installation', 'Installation support needed'), option('existing-system', 'Existing booth or environmental system'), option('not-sure', 'Details still in progress')],
    },
    {
      id: 'brand-campaign-channels', branchId, stepLabel: 'Channels', title: 'Where will the campaign appear?',
      inputType: 'multi-select', required: true,
      visibility: { operator: 'or', conditions: [
        { questionId: 'brand-support-type', operator: 'equals', value: ['marketing-campaign', 'social-advertising'] },
        { questionId: 'brand-goal', operator: 'includes', value: ['increase-awareness', 'generate-leads-or-sales', 'support-an-event'] },
      ] },
      options: ['Meta', 'Google', 'YouTube', 'LinkedIn', 'TikTok', 'Email', 'Website', 'Print', 'In-person event', 'Other'].map(label => option(slug(label), label)),
    },
    ...createSharedQuestions(branchId),
  ],
  recommendations: [
    {
      id: 'essential-identity', branchId, title: 'Essential Identity', complexity: 'foundation',
      description: 'A practical visual foundation for launching with clarity and consistency.',
      bestFor: ['New small businesses', 'Artists', 'Individual professionals', 'Focused launches'],
      includedDeliverables: ['Logo direction', 'Core color palette', 'Typography', 'Basic usage guide', 'Essential launch assets'],
      possibleAddOns: ['Social templates', 'Business cards', 'Website direction'], baseTimelineWeeks: [3, 5], baseInvestmentRange: [1800, 4000],
      criteria: [
        { questionId: 'brand-support-type', operator: 'equals', value: 'new-identity', score: 8 },
        { questionId: 'brand-assets', operator: 'equals', value: ['logo-only', 'none'], score: 4 },
      ],
    },
    {
      id: 'brand-system', branchId, title: 'Brand System', complexity: 'growth',
      description: 'An expanded identity system built for consistent use across teams and channels.',
      bestFor: ['Growing organizations', 'Multi-channel brands', 'Teams needing templates'],
      includedDeliverables: ['Expanded identity', 'Brand guidelines', 'Layout system', 'Reusable templates', 'Digital and print applications'],
      possibleAddOns: ['Campaign direction', 'Website visual direction'], baseTimelineWeeks: [5, 8], baseInvestmentRange: [4500, 8500],
      criteria: [
        { questionId: 'brand-support-type', operator: 'equals', value: 'brand-refresh', score: 7 },
        { questionId: 'brand-goal', operator: 'includes-any', value: ['improve-consistency', 'create-reusable-templates', 'update-an-outdated-brand'], score: 5 },
        { questionId: 'brand-deliverables', operator: 'includes-any', value: ['brand-guidelines', 'website-visual-direction'], score: 4 },
      ],
    },
    {
      id: 'focused-campaign', branchId, title: 'Focused Campaign', complexity: 'growth',
      description: 'A coordinated visual campaign for one launch, offer, event, or initiative.',
      bestFor: ['Product launches', 'Events', 'Advertising initiatives'],
      includedDeliverables: ['Campaign concept', 'Visual direction', 'Channel-specific assets', 'Print and social variations', 'Production-ready files'],
      possibleAddOns: ['Email development', 'Landing-page support'], baseTimelineWeeks: [3, 7], baseInvestmentRange: [3000, 7500],
      criteria: [
        { questionId: 'brand-support-type', operator: 'equals', value: ['marketing-campaign', 'event-materials', 'social-advertising', 'email-campaign'], score: 9 },
        { questionId: 'brand-goal', operator: 'includes', value: 'support-an-event', score: 6 },
      ],
    },
    {
      id: 'ongoing-creative-partnership', branchId, title: 'Ongoing Creative Partnership', complexity: 'custom',
      description: 'Recurring design capacity for teams with an evolving stream of brand and campaign needs.',
      bestFor: ['Recurring requests', 'Multi-channel campaigns', 'Growing marketing teams'],
      includedDeliverables: ['Prioritized requests', 'Campaign production', 'Presentations', 'Social and advertising', 'Continuous brand consistency'],
      possibleAddOns: ['Email assets', 'Monthly planning'], baseTimelineWeeks: [4, 12], requiresReview: true,
      criteria: [{ questionId: 'brand-support-type', operator: 'equals', value: 'ongoing-design', score: 12 }],
    },
  ],
  addOns: [],
};
