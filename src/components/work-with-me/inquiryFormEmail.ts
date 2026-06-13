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
  type?: string;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'website', string>>;

export const PROJECT_TYPE_LABELS: Record<ProjectTypeId, string> = {
  product: 'Product design',
  system: 'Design system',
  marketing: 'Marketing website',
  app: 'App / dashboard',
  graphic: 'Graphic design',
  video: 'Video',
};

export const INQUIRY_FILE_LIMITS = {
  maxFiles: 6,
  maxImageBytes: 4 * 1024 * 1024,
  maxPdfBytes: 4 * 1024 * 1024,
  maxVideoBytes: 4 * 1024 * 1024,
  maxArchiveBytes: 4 * 1024 * 1024,
  maxDesignFileBytes: 4 * 1024 * 1024,
  maxTotalBytes: 4 * 1024 * 1024,
} as const;

export const INQUIRY_ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'application/zip',
  'application/x-zip-compressed',
  'application/postscript',
  'application/illustrator',
  'image/vnd.adobe.photoshop',
] as const;

export const INQUIRY_ACCEPTED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.pdf',
  '.mp4',
  '.mov',
  '.webm',
  '.zip',
  '.ai',
  '.eps',
  '.psd',
  '.fig',
  '.sketch',
] as const;

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

export const getFileExtension = (fileName: string) => {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match ? match[0] : '';
};

export const isInquiryFileTypeAccepted = (file: ResourceFileSummary) => {
  const extension = getFileExtension(file.name);
  return (
    INQUIRY_ACCEPTED_FILE_TYPES.includes(file.type as (typeof INQUIRY_ACCEPTED_FILE_TYPES)[number]) ||
    INQUIRY_ACCEPTED_EXTENSIONS.includes(extension as (typeof INQUIRY_ACCEPTED_EXTENSIONS)[number])
  );
};

export const getInquiryFileLimit = (file: ResourceFileSummary) => {
  const extension = getFileExtension(file.name);

  if (file.type?.startsWith('image/') || ['.ai', '.eps', '.psd'].includes(extension)) {
    return INQUIRY_FILE_LIMITS.maxImageBytes;
  }

  if (file.type === 'application/pdf' || extension === '.pdf') {
    return INQUIRY_FILE_LIMITS.maxPdfBytes;
  }

  if (file.type?.startsWith('video/') || ['.mp4', '.mov', '.webm'].includes(extension)) {
    return INQUIRY_FILE_LIMITS.maxVideoBytes;
  }

  if (extension === '.fig' || extension === '.sketch') {
    return INQUIRY_FILE_LIMITS.maxDesignFileBytes;
  }

  return INQUIRY_FILE_LIMITS.maxArchiveBytes;
};

export const validateInquiryFiles = (files: ResourceFileSummary[]) => {
  const errors: string[] = [];
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (files.length > INQUIRY_FILE_LIMITS.maxFiles) {
    errors.push(`Add up to ${INQUIRY_FILE_LIMITS.maxFiles} files.`);
  }

  if (totalBytes > INQUIRY_FILE_LIMITS.maxTotalBytes) {
    errors.push(`Keep total uploads under ${formatFileSize(INQUIRY_FILE_LIMITS.maxTotalBytes)}.`);
  }

  files.forEach(file => {
    if (!isInquiryFileTypeAccepted(file)) {
      errors.push(`${file.name} is not a supported asset type.`);
      return;
    }

    const limit = getInquiryFileLimit(file);
    if (file.size > limit) {
      errors.push(`${file.name} is over the ${formatFileSize(limit)} limit.`);
    }
  });

  return errors;
};
