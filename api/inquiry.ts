import type { IncomingMessage, ServerResponse } from 'http';
import formidable, {
  type Fields,
  type File as FormidableFile,
  type Files,
} from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { Resend } from 'resend';
import { sendInquiryEmails } from './lib/email/inquiryEmails';

type ProjectTypeId = 'product' | 'system' | 'marketing' | 'app' | 'graphic' | 'video';

interface ParsedInquiry {
  name: string;
  email: string;
  businessName: string;
  website: string;
  projectTypes: ProjectTypeId[];
  budget: string;
  timeline: string;
  details: string;
}

interface UploadedAsset {
  name: string;
  size: number;
  url: string;
  publicId: string;
  resourceType: string;
}

class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export const PROJECT_TYPE_LABELS: Record<ProjectTypeId, string> = {
  product: 'Product design',
  system: 'Design system',
  marketing: 'Marketing website',
  app: 'App / dashboard',
  graphic: 'Graphic design',
  video: 'Video',
};

export const FILE_LIMITS = {
  maxFiles: 6,
  maxImageBytes: 4 * 1024 * 1024,
  maxPdfBytes: 4 * 1024 * 1024,
  maxVideoBytes: 4 * 1024 * 1024,
  maxArchiveBytes: 4 * 1024 * 1024,
  maxDesignFileBytes: 4 * 1024 * 1024,
  maxTotalBytes: 4 * 1024 * 1024,
} as const;

const ACCEPTED_TYPES = new Set([
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
]);

const ACCEPTED_EXTENSIONS = new Set([
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
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || '' : value || '';

const getExtension = (fileName: string) => {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match ? match[0] : '';
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
};

export const getSelectedProjectTypes = (projectTypes: ProjectTypeId[]) =>
  projectTypes.map(id => PROJECT_TYPE_LABELS[id]).filter(Boolean).join(', ');

const getFileLimit = (file: FormidableFile) => {
  const extension = getExtension(file.originalFilename || '');
  const mimetype = file.mimetype || '';

  if (mimetype.startsWith('image/') || ['.ai', '.eps', '.psd'].includes(extension)) {
    return FILE_LIMITS.maxImageBytes;
  }

  if (mimetype === 'application/pdf' || extension === '.pdf') {
    return FILE_LIMITS.maxPdfBytes;
  }

  if (mimetype.startsWith('video/') || ['.mp4', '.mov', '.webm'].includes(extension)) {
    return FILE_LIMITS.maxVideoBytes;
  }

  if (extension === '.fig' || extension === '.sketch') {
    return FILE_LIMITS.maxDesignFileBytes;
  }

  return FILE_LIMITS.maxArchiveBytes;
};

const isAcceptedFile = (file: FormidableFile) => {
  const mimetype = file.mimetype || '';
  const extension = getExtension(file.originalFilename || '');
  return ACCEPTED_TYPES.has(mimetype) || ACCEPTED_EXTENSIONS.has(extension);
};

export const validateFiles = (files: FormidableFile[]) => {
  const errors: string[] = [];
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (files.length > FILE_LIMITS.maxFiles) {
    errors.push(`Add up to ${FILE_LIMITS.maxFiles} files.`);
  }

  if (totalBytes > FILE_LIMITS.maxTotalBytes) {
    errors.push(`Keep total uploads under ${formatFileSize(FILE_LIMITS.maxTotalBytes)}.`);
  }

  files.forEach(file => {
    const name = file.originalFilename || 'Attached file';

    if (!isAcceptedFile(file)) {
      errors.push(`${name} is not a supported asset type.`);
      return;
    }

    const limit = getFileLimit(file);
    if (file.size > limit) {
      errors.push(`${name} is over the ${formatFileSize(limit)} limit.`);
    }
  });

  return errors;
};

export const validateInquiry = (inquiry: ParsedInquiry) => {
  const errors: string[] = [];

  if (!inquiry.name) errors.push('Enter your name.');
  if (!EMAIL_PATTERN.test(inquiry.email)) errors.push('Enter a valid email address.');
  if (!inquiry.projectTypes.length) errors.push('Select at least one project type.');
  if (!inquiry.budget) errors.push('Select a budget range.');
  if (!inquiry.timeline) errors.push('Select a timeline.');

  return errors;
};

const parseProjectTypes = (value: string): ProjectTypeId[] => {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(type => Object.prototype.hasOwnProperty.call(PROJECT_TYPE_LABELS, type));
  } catch {
    return [];
  }
};

export const parseInquiryFields = (fields: Fields): ParsedInquiry => ({
  name: getFirst(fields.name).trim(),
  email: getFirst(fields.email).trim(),
  businessName: getFirst(fields.businessName).trim(),
  website: getFirst(fields.website).trim(),
  projectTypes: parseProjectTypes(getFirst(fields.projectTypes)),
  budget: getFirst(fields.budget).trim(),
  timeline: getFirst(fields.timeline).trim(),
  details: getFirst(fields.details).trim(),
});

export const isSpamSubmission = (fields: Fields) =>
  getFirst(fields.companyWebsite).trim().length > 0;

const normalizeFiles = (files: Files) => {
  const rawFiles = files.assets;
  if (!rawFiles) return [];
  return Array.isArray(rawFiles) ? rawFiles : [rawFiles];
};

const parseMultipartForm = (req: IncomingMessage) =>
  new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFiles: FILE_LIMITS.maxFiles,
      maxTotalFileSize: FILE_LIMITS.maxTotalBytes,
      keepExtensions: true,
    });

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });

const getCloudinaryResourceType = (file: FormidableFile) => {
  const mimetype = file.mimetype || '';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw';
};

export const uploadAsset = async (file: FormidableFile): Promise<UploadedAsset> => {
  const result = await cloudinary.uploader.upload(file.filepath, {
    folder: 'devign/inquiries',
    resource_type: getCloudinaryResourceType(file),
    use_filename: true,
    unique_filename: true,
  });

  return {
    name: file.originalFilename || result.original_filename || result.public_id,
    size: file.size,
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
  };
};

const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    console.error('Inquiry server configuration is missing a required environment variable.', { key });
    throw new HttpError(500, 'Inquiry service is not configured correctly.');
  }

  return value;
};

const getOwnerEmail = () => getRequiredEnv('LEAD_NOTIFICATION_EMAIL');
const getResendFromEmail = () => getRequiredEnv('RESEND_FROM_EMAIL');

const ensureServerConfig = () => {
  const missing = [
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'LEAD_NOTIFICATION_EMAIL',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ].filter(key => !process.env[key]);

  if (missing.length) {
    console.error('Inquiry server configuration is missing required environment variables.', { keys: missing });
    throw new HttpError(500, 'Inquiry service is not configured correctly.');
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

const sendJson = (res: ServerResponse, statusCode: number, body: Record<string, unknown>) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    ensureServerConfig();

    const { fields, files } = await parseMultipartForm(req);
    if (isSpamSubmission(fields)) {
      console.warn('Inquiry honeypot triggered');
      sendJson(res, 200, { ok: true });
      return;
    }

    const inquiry = parseInquiryFields(fields);
    const assetFiles = normalizeFiles(files);
    const validationErrors = [
      ...validateInquiry(inquiry),
      ...validateFiles(assetFiles),
    ];

    if (validationErrors.length) {
      console.warn('Inquiry validation failed', {
        validationErrorCount: validationErrors.length,
        uploadedFileCount: assetFiles.length,
      });
      sendJson(res, 400, { error: validationErrors[0] });
      return;
    }

    let assets: UploadedAsset[];
    try {
      assets = await Promise.all(assetFiles.map(uploadAsset));
      console.info('Inquiry assets uploaded', {
        uploadedFileCount: assets.length,
        resourceTypes: assets.map(asset => asset.resourceType),
      });
    } catch (error) {
      console.error('Inquiry Cloudinary upload failed:', error);
      throw new HttpError(502, 'Your files could not be uploaded right now. Please try again in a moment.');
    }

    const resend = new Resend(getRequiredEnv('RESEND_API_KEY'));

    try {
      await sendInquiryEmails({
        resend,
        fromEmail: getResendFromEmail(),
        ownerEmail: getOwnerEmail(),
        inquiry,
        assets,
        submittedAt: new Date(),
      });
      console.info('Inquiry emails processed', { uploadedFileCount: assets.length });
    } catch (error) {
      console.error('Lead notification email failed:', error);
      throw new HttpError(502, 'Your inquiry could not be emailed right now. Please try again in a moment.');
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('Inquiry API error:', error);
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    const message = error instanceof HttpError
      ? error.message
      : 'Your inquiry could not be sent right now. Please try again in a moment.';

    sendJson(res, statusCode, {
      error: message,
    });
  }
}
