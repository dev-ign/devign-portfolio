import { createSharedQuestions, makeOption as option } from '../sharedQuestions';
import type { ServiceBranch } from '../../types/servicePlanner.types';

const branchId = 'motion-video' as const;
const slug = (label: string) => label.toLowerCase().replace(/[/\s]+/g, '-');

export const motionVideoBranch: ServiceBranch = {
  id: branchId,
  eyebrow: 'Motion & Video',
  title: 'Tell Your Story',
  shortTitle: 'Motion & Video',
  description: 'Cinematic and animated content designed to explain, promote, and give your story momentum.',
  prompt: 'What kind of video or motion experience are you planning?',
  preview: { type: 'interactive', alt: 'Abstract video timeline and motion frames preview', icon: 'solar:videocamera-record-bold-duotone', accent: '#FF6EA9' },
  highlights: ['Product videos', 'Motion graphics', 'Commercials', 'Social content', 'Music videos'],
  questions: [
    {
      id: 'motion-type', branchId, stepLabel: 'Production type', title: 'What kind of video or motion experience are you planning?',
      inputType: 'single-select', required: true,
      options: [
        option('animated-product', 'Animated product video', 'Demonstrate a product, interface, feature, or workflow.'),
        option('motion-graphics', 'Motion graphics', 'Animated type, logos, graphics, data, or announcements.'),
        { ...option('commercial', 'Commercial or brand film'), complexityScore: 4 },
        option('social-video', 'Social video content'), { ...option('music-video', 'Music video or visualizer'), complexityScore: 4 },
        option('website-animation', 'Website hero animation'), option('video-editing', 'Video editing'),
        { ...option('event-recap', 'Event recap'), complexityScore: 4 }, option('other', 'Something else'),
      ],
    },
    {
      id: 'motion-objective', branchId, stepLabel: 'Objective', title: 'What should the video accomplish?',
      inputType: 'single-select', required: true,
      options: ['Explain a product', 'Generate awareness', 'Sell an offer', 'Launch a release', 'Build emotional connection', 'Show how something works', 'Create social content', 'Support a website', 'Recap an experience', 'Other'].map(label => option(slug(label), label)),
    },
    {
      id: 'motion-format', branchId, stepLabel: 'Format', title: 'What production format fits the idea?',
      educationalNote: 'Production format affects crew, planning, locations, asset needs, and review time. “Not sure” is a valid answer—we can recommend a direction.',
      inputType: 'single-select', required: true,
      options: [
        option('animated', 'Fully animated'), { ...option('live-action', 'Live action'), complexityScore: 4 },
        option('interface-animation', 'Screen recording and interface animation'), option('existing-footage', 'Existing footage with editing'),
        { ...option('mixed-media', 'Mixed media'), complexityScore: 2 }, option('ai-assisted', 'AI-assisted visual production'), option('not-sure', 'Not sure'),
      ],
    },
    {
      id: 'motion-assets', branchId, stepLabel: 'Available assets', title: 'What do you already have?',
      inputType: 'multi-select', required: true,
      options: ['Final script', 'Draft script', 'Storyboard', 'Brand guidelines', 'Logo files', 'Product screenshots', 'Existing footage', 'Photography', 'Voiceover', 'Music', 'No assets yet'].map(label => option(slug(label), label)),
    },
    {
      id: 'motion-support', branchId, stepLabel: 'Support needed', title: 'Where would you like support?',
      inputType: 'multi-select', required: true,
      options: ['Creative concept', 'Scriptwriting', 'Storyboarding', 'Art direction', 'Production planning', 'Filming', 'Animation', 'Editing', 'Color grading', 'Sound design', 'Voiceover', 'Captions', 'Multiple aspect ratios', 'Social cutdowns', 'Thumbnail or cover art'].map(label => ({ ...option(slug(label), label), complexityScore: ['Filming', 'Animation', 'Multiple aspect ratios', 'Social cutdowns'].includes(label) ? 2 : 1 })),
    },
    {
      id: 'motion-live-production', branchId, stepLabel: 'Production planning', title: 'What is known about the live production?',
      description: 'Select everything that currently applies.',
      educationalNote: 'Locations, talent, crew, travel, props, weather, and permits can materially change a production. A human scope review is always included here.',
      inputType: 'multi-select', required: true,
      visibility: { operator: 'or', conditions: [
        { questionId: 'motion-format', operator: 'equals', value: 'live-action' },
        { questionId: 'motion-type', operator: 'equals', value: ['commercial', 'event-recap', 'music-video'] },
        { questionId: 'motion-support', operator: 'includes', value: 'filming' },
      ] },
      options: [option('location-known', 'Filming location is known'), option('multiple-locations', 'Multiple locations'), option('people-camera', 'People appear on camera'), option('talent-selected', 'Talent is selected'), option('crew-available', 'Equipment or crew is available'), option('travel', 'Travel is required'), option('styling', 'Wardrobe, props, makeup, or set design'), option('indoor-outdoor', 'Indoor and outdoor filming'), option('not-sure', 'Still planning')],
    },
    {
      id: 'motion-duration', branchId, stepLabel: 'Duration', title: 'What is the approximate finished duration?',
      inputType: 'single-select', required: true,
      visibility: { operator: 'or', conditions: [
        { questionId: 'motion-format', operator: 'equals', value: ['animated', 'interface-animation', 'mixed-media'] },
        { questionId: 'motion-type', operator: 'equals', value: ['animated-product', 'motion-graphics', 'website-animation'] },
      ] },
      options: [option('under-15', 'Under 15 seconds'), option('15-30', '15–30 seconds'), option('30-60', '30–60 seconds'), { ...option('60-120', 'One to two minutes'), complexityScore: 2 }, { ...option('over-120', 'More than two minutes'), complexityScore: 4 }, option('not-sure', 'Not sure')],
    },
    {
      id: 'motion-style', branchId, stepLabel: 'Animation style', title: 'Which visual style feels closest?',
      inputType: 'single-select', required: true,
      visibility: { operator: 'and', conditions: [{ questionId: 'motion-duration', operator: 'exists' }] },
      options: [option('2d', '2D animation'), option('3d', '3D animation'), option('interface', 'Interface-based'), option('typographic', 'Typographic'), option('mixed', 'Mixed style'), option('not-sure', 'Not sure')],
    },
    ...createSharedQuestions(branchId),
  ],
  recommendations: [
    {
      id: 'motion-asset', branchId, title: 'Motion Asset', complexity: 'foundation',
      description: 'A focused animated piece designed for a specific placement or moment.',
      bestFor: ['Logo animation', 'Website loops', 'Social announcements', 'Short visualizers'],
      includedDeliverables: ['Creative alignment', 'Motion direction', 'Animation', 'Sound finishing', 'Delivery-ready exports'],
      possibleAddOns: ['Extra aspect ratios', 'Cover art'], baseTimelineWeeks: [2, 4], baseInvestmentRange: [1500, 3500],
      criteria: [
        { questionId: 'motion-type', operator: 'equals', value: ['motion-graphics', 'website-animation'], score: 8 },
        { questionId: 'motion-duration', operator: 'equals', value: ['under-15', '15-30'], score: 5 },
      ],
    },
    {
      id: 'product-story', branchId, title: 'Product Story', complexity: 'growth',
      description: 'A clear, polished product walkthrough that makes an interface, feature, or service easy to understand.',
      bestFor: ['Product walkthroughs', 'App demonstrations', 'Feature launches', 'Explainer videos'],
      includedDeliverables: ['Creative concept', 'Script support', 'Storyboard', 'Interface animation', 'Editing', 'Sound design'],
      possibleAddOns: ['Voiceover', 'Multiple aspect ratios', 'Social cutdowns'], baseTimelineWeeks: [4, 7], baseInvestmentRange: [3500, 7500],
      criteria: [
        { questionId: 'motion-type', operator: 'equals', value: 'animated-product', score: 10 },
        { questionId: 'motion-objective', operator: 'equals', value: ['explain-a-product', 'show-how-something-works'], score: 6 },
        { questionId: 'motion-format', operator: 'equals', value: 'interface-animation', score: 6 },
      ],
    },
    {
      id: 'campaign-production', branchId, title: 'Campaign Production', complexity: 'custom',
      description: 'A reviewed production scope for cinematic, live-action, or multi-scene storytelling.',
      bestFor: ['Commercials', 'Brand films', 'Music videos', 'Live-action concepts'],
      includedDeliverables: ['Creative concept', 'Pre-production', 'Production planning', 'Filming or animation', 'Edit and finish', 'Delivery masters'],
      possibleAddOns: ['Talent', 'Travel', 'Styling', 'Cutdowns'], baseTimelineWeeks: [6, 12], requiresReview: true,
      criteria: [
        { questionId: 'motion-type', operator: 'equals', value: ['commercial', 'music-video', 'event-recap'], score: 10 },
        { questionId: 'motion-format', operator: 'equals', value: 'live-action', score: 8 },
        { questionId: 'motion-support', operator: 'includes', value: 'filming', score: 6 },
      ],
    },
    {
      id: 'content-system', branchId, title: 'Content System', complexity: 'custom',
      description: 'A primary production designed from the start to become a reusable family of content.',
      bestFor: ['Multiple cutdowns', 'Several aspect ratios', 'Ongoing social assets'],
      includedDeliverables: ['Master creative', 'Reusable motion language', 'Primary edit', 'Channel-specific versions', 'Organized delivery system'],
      possibleAddOns: ['Ongoing production', 'Monthly content plan'], baseTimelineWeeks: [5, 10], requiresReview: true,
      criteria: [
        { questionId: 'motion-support', operator: 'includes-any', value: ['multiple-aspect-ratios', 'social-cutdowns'], score: 8 },
        { questionId: 'motion-type', operator: 'equals', value: 'social-video', score: 5 },
      ],
    },
  ],
  addOns: [],
};
