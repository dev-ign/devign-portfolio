export type ProjectTypeId = 'product' | 'system' | 'marketing' | 'app' | 'graphic' | 'video';

export interface InquiryFormData {
  name: string;
  email: string;
  businessName: string;
  website: string;
  projectTypes: ProjectTypeId[];
  budget: string;
  timeline: string;
  details: string;
}

export interface ResourceFileSummary {
  name: string;
  size: number;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'website', string>>;

const OWNER_EMAIL = 'devignux@gmail.com';

const PROJECT_TYPE_LABELS: Record<ProjectTypeId, string> = {
  product: 'Product design',
  system: 'Design system',
  marketing: 'Marketing website',
  app: 'App / dashboard',
  graphic: 'Graphic design',
  video: 'Video',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INSTAGRAM_HANDLE_PATTERN = /^@[\w.]{2,30}$/;
const DOMAIN_PATTERN = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());

export const isValidWebsiteOrHandle = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return INSTAGRAM_HANDLE_PATTERN.test(trimmed) || DOMAIN_PATTERN.test(trimmed);
};

export const validateContactStep = (formData: InquiryFormData): ContactErrors => {
  const errors: ContactErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Enter your name.';
  }

  if (!formData.email.trim() || !isValidEmail(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!isValidWebsiteOrHandle(formData.website)) {
    errors.website = 'Enter a valid website URL or Instagram handle.';
  }

  return errors;
};

export const getSelectedProjectTypes = (projectTypes: ProjectTypeId[]) =>
  projectTypes.map(id => PROJECT_TYPE_LABELS[id]).filter(Boolean).join(', ');

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
};

export const getResourceSummary = (resourceFiles: ResourceFileSummary[]) =>
  resourceFiles.length
    ? resourceFiles.map(file => `${file.name} (${formatFileSize(file.size)})`).join(', ')
    : 'No resources uploaded';

const buildInquiryMessage = (formData: InquiryFormData, resourceFiles: ResourceFileSummary[]) => {
  const selectedProjectTypes = getSelectedProjectTypes(formData.projectTypes);

  return [
    `Name: ${formData.name.trim()}`,
    `Email: ${formData.email.trim()}`,
    `Business: ${formData.businessName.trim() || '-'}`,
    `Website/Social: ${formData.website.trim() || '-'}`,
    `Project types: ${selectedProjectTypes || '-'}`,
    `Budget: ${formData.budget || '-'}`,
    `Timeline: ${formData.timeline || '-'}`,
    `Resources/assets: ${getResourceSummary(resourceFiles)}`,
    `\nDetails:\n${formData.details.trim() || '(no details provided)'}`,
  ].join('\n');
};

export const buildInquiryEmailParams = (
  formData: InquiryFormData,
  resourceFiles: ResourceFileSummary[]
) => {
  const selectedProjectTypes = getSelectedProjectTypes(formData.projectTypes);
  const name = formData.name.trim();
  const email = formData.email.trim();

  return {
    to_email: OWNER_EMAIL,
    to_name: 'Devign UX',
    from_name: name,
    from_email: email,
    reply_to: email,
    subject: `[Work With Us] ${selectedProjectTypes || 'Inquiry'} - ${formData.businessName.trim() || name}`,
    message: buildInquiryMessage(formData, resourceFiles),
    name,
    email,
    business_name: formData.businessName.trim(),
    website: formData.website.trim(),
    project_types: selectedProjectTypes,
    budget: formData.budget,
    timeline: formData.timeline,
    details: formData.details.trim(),
    resources: getResourceSummary(resourceFiles),
  };
};

export const buildInquiryConfirmationParams = (
  formData: InquiryFormData,
  resourceFiles: ResourceFileSummary[]
) => {
  const selectedProjectTypes = getSelectedProjectTypes(formData.projectTypes);
  const name = formData.name.trim();
  const email = formData.email.trim();

  return {
    to_email: email,
    to_name: name,
    from_name: 'Devign UX',
    from_email: OWNER_EMAIL,
    reply_to: OWNER_EMAIL,
    subject: 'Your Devign inquiry was received',
    message: [
      `Hi ${name},`,
      '',
      'I received your inquiry and will review the details soon.',
      '',
      'Your inquiry summary:',
      `Project types: ${selectedProjectTypes || '-'}`,
      `Budget: ${formData.budget || '-'}`,
      `Timeline: ${formData.timeline || '-'}`,
      `Resources/assets: ${getResourceSummary(resourceFiles)}`,
      '',
      'I will reach out with next steps soon.',
      '',
      'Devign UX',
    ].join('\n'),
    name,
    email,
    project_types: selectedProjectTypes,
    budget: formData.budget,
    timeline: formData.timeline,
    resources: getResourceSummary(resourceFiles),
  };
};
