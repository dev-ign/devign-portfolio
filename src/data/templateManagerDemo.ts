/** Illustrative content shared by the Portfolio preview and case-study reconstruction. */
export type TemplateRecord = {
  id: string;
  title: string;
  ownerId: string;
  access: 'owner' | 'shared-read-only';
  sourceId?: string;
};

export const templateManagerDemo = {
  workspace: 'Advancement Office',
  manager: 'Dana Whitfield',
  people: {
    dana: { id: 'dana', name: 'Dana Whitfield' },
    maya: { id: 'maya', name: 'Maya Rodriguez' },
  },
  records: {
    original: { id: 'template-dana-first-time', title: 'First-Time Donor Thank You', ownerId: 'dana', access: 'shared-read-only' },
    personalCopy: { id: 'template-maya-first-time-copy', title: 'First-Time Donor Thank You — My Copy', ownerId: 'maya', access: 'owner', sourceId: 'template-dana-first-time' },
  } as { original: TemplateRecord; personalCopy: TemplateRecord },
  sharedRecipients: ['maya', 'daniel'],
  sharedUpdate: { templateId: 'template-dana-first-time', recipientId: 'maya', available: true },
  firstDraft: {
    /** The exact historical scope and reassignment UI remain unverified. */
    scopeLabel: 'applicable scope',
    rule: { id: 'top-donor', label: 'Top Donor' },
    assignment: { ruleId: 'top-donor', templateId: 'template-dana-first-time' },
  },
  template: {
    title: 'First-Time Donor Thank You',
    category: 'Annual Giving',
    subject: 'Thank you for your first gift',
    personalSubject: 'Thank you for joining our community',
    greetingField: '{{First Name}}',
    signatureField: '{{Fundraiser Name}}',
    body: 'Your first gift is already helping students access new opportunities. We are grateful to welcome you to our community.',
    personalBody: 'Your first gift is already helping students access new opportunities. I look forward to sharing the impact of your support.',
  },
  fundraisers: [
    { id: 'maya', name: 'Maya Rodriguez', initials: 'MR' },
    { id: 'daniel', name: 'Daniel Brooks', initials: 'DB' },
    { id: 'sofia', name: 'Sofia Martinez', initials: 'SM' },
  ],
  categories: [
    { name: 'Annual Giving', count: 12 },
    { name: 'Stewardship', count: 9 },
    { name: 'Campaign Updates', count: 6 },
    { name: 'Donor Follow-Up', count: 11 },
  ],
} as const;

export const getAssignedFirstDraftRule = (templateId: string) => {
  const { rule, assignment } = templateManagerDemo.firstDraft;
  return assignment.templateId === templateId && assignment.ruleId === rule.id ? rule : null;
};
