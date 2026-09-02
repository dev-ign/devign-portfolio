import { createSharedQuestions, makeOption as option } from '../sharedQuestions';
import type { ServiceBranch } from '../../types/servicePlanner.types';

const branchId = 'web-applications' as const;

export const webApplicationsBranch: ServiceBranch = {
  id: branchId,
  eyebrow: 'Web Applications',
  title: 'Build Your Product',
  shortTitle: 'Web Applications',
  description: 'Custom digital products that simplify workflows, organize information, and help people complete meaningful work.',
  prompt: 'What are you trying to create or improve?',
  preview: { type: 'interactive', alt: 'Abstract dashboard and application interface preview', icon: 'solar:widget-5-bold-duotone', accent: '#66D8FF' },
  highlights: ['Dashboards', 'Internal tools', 'Customer portals', 'SaaS products', 'Workflow automation'],
  questions: [
    {
      id: 'app-type', branchId, stepLabel: 'Product type', title: 'What are you trying to create or improve?',
      educationalNote: 'The product model tells us who must be supported and whether the core challenge is discovery, workflow design, or platform delivery.',
      inputType: 'single-select', required: true,
      options: [
        { ...option('dashboard', 'Internal dashboard', 'Help a team understand operations, reporting, or performance.'), complexityScore: 2 },
        { ...option('internal-tool', 'Internal tool', 'Replace spreadsheets, emails, or disconnected workflows.'), complexityScore: 2 },
        { ...option('customer-portal', 'Customer or client portal', 'Give customers a secure place to manage their relationship.'), complexityScore: 3 },
        { ...option('saas', 'SaaS product', 'A software product serving multiple customers or organizations.'), complexityScore: 5 },
        { ...option('marketplace', 'Marketplace or platform', 'Connect two or more distinct user groups.'), complexityScore: 5 },
        { ...option('existing-product', 'Existing product improvement'), complexityScore: 3 },
        { ...option('prototype-mvp', 'Prototype or MVP', 'Validate an idea before investing in the full platform.'), complexityScore: 2 },
        option('other', 'Something else'),
      ],
    },
    {
      id: 'app-users', branchId, stepLabel: 'Users', title: 'Who will use the product?',
      educationalNote: 'Products serving multiple roles usually require separate permissions, workflows, dashboards, and navigation structures.',
      inputType: 'multi-select', required: true,
      options: ['Business owners', 'Administrators', 'Employees', 'Managers', 'Customers', 'Service providers', 'Partners', 'Public visitors', 'Multiple organizations', 'Other'].map(label => ({ ...option(label.toLowerCase().replace(/\s+/g, '-'), label), complexityScore: label === 'Multiple organizations' ? 4 : 0 })),
    },
    {
      id: 'app-main-workflow', branchId, stepLabel: 'Core workflow', title: 'What is the most important task users need to complete?',
      inputType: 'single-select', required: true,
      options: ['Review information', 'Manage records', 'Complete a workflow', 'Communicate with others', 'Upload or organize files', 'Schedule people or resources', 'Track progress', 'Generate reports', 'Buy or sell something', 'Approve or reject requests', 'Automate repetitive work', 'Other'].map(label => option(label.toLowerCase().replace(/\s+/g, '-'), label)),
    },
    {
      id: 'app-workflow-context', branchId, stepLabel: 'Workflow context', title: 'What happens today, and what should become easier?',
      description: 'A short explanation is enough. This is optional.', inputType: 'textarea', required: false,
      validation: { maxLength: 800 },
    },
    {
      id: 'app-stage', branchId, stepLabel: 'Starting point', title: 'How far along is the product?',
      inputType: 'single-select', required: true,
      options: [
        option('idea', 'Idea only'), option('notes', 'Early sketches or notes'), option('wireframes', 'Wireframes exist'),
        option('figma', 'Figma designs exist'), option('prototype', 'Prototype exists'), option('existing-app', 'Application already exists'),
        option('backend', 'Backend exists, frontend needed'), option('frontend', 'Frontend exists, UX improvement needed'), option('rebuild', 'Full rebuild needed'),
      ],
    },
    {
      id: 'app-access', branchId, stepLabel: 'Accounts', title: 'Will users need to sign in?',
      educationalNote: 'Roles, organizations, invitations, and audit history add both interface and technical complexity.',
      inputType: 'single-select', required: true,
      options: [
        option('none', 'No'), option('single-role', 'One shared type of account'),
        { ...option('multiple-roles', 'Multiple roles and permission levels'), complexityScore: 3 },
        { ...option('organizations', 'Multiple organizations or workspaces'), complexityScore: 5 },
        { ...option('third-party', 'Social or third-party authentication'), complexityScore: 2 }, option('not-sure', 'Not sure'),
      ],
    },
    {
      id: 'app-account-capabilities', branchId, stepLabel: 'Account needs', title: 'Which account capabilities are needed?',
      inputType: 'multi-select', required: true,
      visibility: { operator: 'and', conditions: [
        { questionId: 'app-access', operator: 'exists' },
        { questionId: 'app-access', operator: 'not-equals', value: ['none', 'not-sure'] },
      ] },
      options: ['Invite team members', 'Password recovery', 'Profile management', 'Role assignment', 'Organization switching', 'Approval-based access', 'Subscription management', 'Admin impersonation', 'Audit history'].map(label => ({ ...option(label.toLowerCase().replace(/\s+/g, '-'), label), complexityScore: 1 })),
    },
    {
      id: 'app-data', branchId, stepLabel: 'Data & features', title: 'What information or capabilities will the product manage?',
      inputType: 'multi-select', required: true,
      options: ['Forms and records', 'Tables with filtering', 'Search', 'File uploads', 'Images or media', 'Charts and analytics', 'Maps or location data', 'Notifications', 'Real-time updates', 'Import/export', 'Payment data', 'Integrations with another system', 'AI-assisted features'].map(label => ({ ...option(label.toLowerCase().replace(/[/\s]+/g, '-'), label), complexityScore: ['Real-time updates', 'Payment data', 'Integrations with another system', 'AI-assisted features'].includes(label) ? 2 : 1 })),
    },
    {
      id: 'app-platform', branchId, stepLabel: 'Platform', title: 'Where should the product work?',
      inputType: 'single-select', required: true,
      options: [option('responsive-web', 'Responsive web application'), option('desktop-first', 'Desktop-first internal tool'), option('mobile-first', 'Mobile-first web application'), option('native-mobile', 'Native mobile app', 'Useful for qualification; delivery may involve a specialist partner.'), option('pwa', 'Progressive web app'), option('not-sure', 'Not sure')],
    },
    {
      id: 'app-technical-start', branchId, stepLabel: 'Technology', title: 'What technical foundation already exists?',
      inputType: 'multi-select', required: true,
      options: ['No technology selected', 'Existing codebase', 'Existing API or backend', 'Existing database', 'Existing vendor platform', 'Need architecture guidance', 'Not sure'].map(label => option(label.toLowerCase().replace(/\s+/g, '-'), label)),
    },
    ...createSharedQuestions(branchId),
  ],
  recommendations: [
    {
      id: 'product-discovery', branchId, title: 'Product Discovery', complexity: 'foundation',
      description: 'A structured definition phase that turns an early idea into an actionable product direction.',
      bestFor: ['Unclear ideas', 'Early-stage teams', 'Workflow definition'],
      includedDeliverables: ['Stakeholder discovery', 'User and workflow definition', 'Feature priorities', 'User flows', 'Wireframes', 'Feasibility review', 'MVP roadmap'],
      possibleAddOns: ['Interactive prototype', 'Technical architecture'], baseTimelineWeeks: [2, 4], baseInvestmentRange: [2500, 5000],
      criteria: [
        { questionId: 'app-stage', operator: 'equals', value: ['idea', 'notes'], score: 8 },
        { questionId: 'decision-status', operator: 'equals', value: 'needs-definition', score: 5 },
      ],
    },
    {
      id: 'prototype-mvp', branchId, title: 'Prototype or MVP', complexity: 'growth',
      description: 'A focused first version designed to validate the core workflow with real users.',
      bestFor: ['New products', 'Core workflow validation', 'Fundraising prototypes'],
      includedDeliverables: ['Product strategy', 'UX/UI design', 'Reusable components', 'Core workflow', 'Responsive implementation', 'Testing and launch support'],
      possibleAddOns: ['Authentication', 'Basic data model', 'Analytics'], baseTimelineWeeks: [6, 10], baseInvestmentRange: [7000, 14000],
      criteria: [
        { questionId: 'app-type', operator: 'equals', value: 'prototype-mvp', score: 9 },
        { questionId: 'app-stage', operator: 'equals', value: ['wireframes', 'figma', 'prototype'], score: 4 },
      ],
    },
    {
      id: 'custom-product-platform', branchId, title: 'Custom Product Platform', complexity: 'custom',
      description: 'A mature, multi-role product with the workflows, permissions, data, and integrations needed to operate at scale.',
      bestFor: ['SaaS products', 'Marketplaces', 'Multi-organization platforms'],
      includedDeliverables: ['Product architecture', 'Multiple user roles', 'Dashboards', 'Advanced data interfaces', 'Integrations', 'Testing', 'Scalable frontend architecture'],
      possibleAddOns: ['Payments', 'Notifications', 'Admin tools', 'Reporting'], baseTimelineWeeks: [10, 18], requiresReview: true,
      criteria: [
        { questionId: 'app-type', operator: 'equals', value: ['saas', 'marketplace'], score: 10 },
        { questionId: 'app-access', operator: 'equals', value: ['multiple-roles', 'organizations'], score: 8 },
        { questionId: 'app-users', operator: 'includes', value: 'multiple-organizations', score: 6 },
        { questionId: 'app-data', operator: 'includes-any', value: ['payment-data', 'real-time-updates', 'notifications'], score: 5 },
      ],
    },
    {
      id: 'existing-product-enhancement', branchId, title: 'Existing Product Enhancement', complexity: 'growth',
      description: 'A focused modernization or extension of an active application and its most important workflows.',
      bestFor: ['UX modernization', 'New features', 'Accessibility', 'Workflow simplification'],
      includedDeliverables: ['Product audit', 'Workflow redesign', 'UI system alignment', 'Frontend implementation', 'Quality assurance'],
      possibleAddOns: ['Design system', 'Performance work', 'Frontend migration'], baseTimelineWeeks: [5, 10], baseInvestmentRange: [6000, 12000],
      criteria: [
        { questionId: 'app-type', operator: 'equals', value: 'existing-product', score: 9 },
        { questionId: 'app-stage', operator: 'equals', value: ['existing-app', 'backend', 'frontend', 'rebuild'], score: 6 },
      ],
    },
  ],
  addOns: [],
};
