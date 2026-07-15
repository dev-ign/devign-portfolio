var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAsset = exports.isSpamSubmission = exports.parseInquiryFields = exports.validateInquiry = exports.validateFiles = exports.getSelectedProjectTypes = exports.FILE_LIMITS = exports.PROJECT_TYPE_LABELS = exports.config = void 0;
const formidable_1 = __importDefault(require("formidable"));
const cloudinary_1 = require("cloudinary");
const resend_1 = require("resend");
const inquiryEmails_1 = require("./lib/email/inquiryEmails");
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
    }
}
exports.config = {
    api: {
        bodyParser: false,
    },
};
exports.PROJECT_TYPE_LABELS = {
    product: 'Product design',
    system: 'Design system',
    marketing: 'Marketing website',
    app: 'App / dashboard',
    graphic: 'Graphic design',
    video: 'Video',
};
exports.FILE_LIMITS = {
    maxFiles: 6,
    maxImageBytes: 4 * 1024 * 1024,
    maxPdfBytes: 4 * 1024 * 1024,
    maxVideoBytes: 4 * 1024 * 1024,
    maxArchiveBytes: 4 * 1024 * 1024,
    maxDesignFileBytes: 4 * 1024 * 1024,
    maxTotalBytes: 4 * 1024 * 1024,
};
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
const getFirst = (value) => Array.isArray(value) ? value[0] || '' : value || '';
const getExtension = (fileName) => {
    const match = fileName.toLowerCase().match(/\.[^.]+$/);
    return match ? match[0] : '';
};
const formatFileSize = (bytes) => {
    if (bytes < 1024)
        return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024)
        return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
};
const getSelectedProjectTypes = (projectTypes) => projectTypes.map(id => exports.PROJECT_TYPE_LABELS[id]).filter(Boolean).join(', ');
exports.getSelectedProjectTypes = getSelectedProjectTypes;
const getFileLimit = (file) => {
    const extension = getExtension(file.originalFilename || '');
    const mimetype = file.mimetype || '';
    if (mimetype.startsWith('image/') || ['.ai', '.eps', '.psd'].includes(extension)) {
        return exports.FILE_LIMITS.maxImageBytes;
    }
    if (mimetype === 'application/pdf' || extension === '.pdf') {
        return exports.FILE_LIMITS.maxPdfBytes;
    }
    if (mimetype.startsWith('video/') || ['.mp4', '.mov', '.webm'].includes(extension)) {
        return exports.FILE_LIMITS.maxVideoBytes;
    }
    if (extension === '.fig' || extension === '.sketch') {
        return exports.FILE_LIMITS.maxDesignFileBytes;
    }
    return exports.FILE_LIMITS.maxArchiveBytes;
};
const isAcceptedFile = (file) => {
    const mimetype = file.mimetype || '';
    const extension = getExtension(file.originalFilename || '');
    return ACCEPTED_TYPES.has(mimetype) || ACCEPTED_EXTENSIONS.has(extension);
};
const validateFiles = (files) => {
    const errors = [];
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (files.length > exports.FILE_LIMITS.maxFiles) {
        errors.push(`Add up to ${exports.FILE_LIMITS.maxFiles} files.`);
    }
    if (totalBytes > exports.FILE_LIMITS.maxTotalBytes) {
        errors.push(`Keep total uploads under ${formatFileSize(exports.FILE_LIMITS.maxTotalBytes)}.`);
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
exports.validateFiles = validateFiles;
const validateInquiry = (inquiry) => {
    const errors = [];
    if (!inquiry.name)
        errors.push('Enter your name.');
    if (!EMAIL_PATTERN.test(inquiry.email))
        errors.push('Enter a valid email address.');
    if (!inquiry.projectTypes.length)
        errors.push('Select at least one project type.');
    if (!inquiry.budget)
        errors.push('Select a budget range.');
    if (!inquiry.timeline)
        errors.push('Select a timeline.');
    return errors;
};
exports.validateInquiry = validateInquiry;
const parseProjectTypes = (value) => {
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter(type => Object.prototype.hasOwnProperty.call(exports.PROJECT_TYPE_LABELS, type));
    }
    catch (_a) {
        return [];
    }
};
const parseInquiryFields = (fields) => ({
    name: getFirst(fields.name).trim(),
    email: getFirst(fields.email).trim(),
    businessName: getFirst(fields.businessName).trim(),
    website: getFirst(fields.website).trim(),
    projectTypes: parseProjectTypes(getFirst(fields.projectTypes)),
    budget: getFirst(fields.budget).trim(),
    timeline: getFirst(fields.timeline).trim(),
    details: getFirst(fields.details).trim(),
});
exports.parseInquiryFields = parseInquiryFields;
const isSpamSubmission = (fields) => getFirst(fields.companyWebsite).trim().length > 0;
exports.isSpamSubmission = isSpamSubmission;
const normalizeFiles = (files) => {
    const rawFiles = files.assets;
    if (!rawFiles)
        return [];
    return Array.isArray(rawFiles) ? rawFiles : [rawFiles];
};
const parseMultipartForm = (req) => new Promise((resolve, reject) => {
    const form = (0, formidable_1.default)({
        multiples: true,
        maxFiles: exports.FILE_LIMITS.maxFiles,
        maxTotalFileSize: exports.FILE_LIMITS.maxTotalBytes,
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
const getCloudinaryResourceType = (file) => {
    const mimetype = file.mimetype || '';
    if (mimetype.startsWith('image/'))
        return 'image';
    if (mimetype.startsWith('video/'))
        return 'video';
    return 'raw';
};
const uploadAsset = async (file) => {
    const result = await cloudinary_1.v2.uploader.upload(file.filepath, {
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
exports.uploadAsset = uploadAsset;
const getRequiredEnv = (key) => {
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
    cloudinary_1.v2.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
};
const sendJson = (res, statusCode, body) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
};
async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        sendJson(res, 405, { error: 'Method not allowed.' });
        return;
    }
    try {
        ensureServerConfig();
        const { fields, files } = await parseMultipartForm(req);
        if ((0, exports.isSpamSubmission)(fields)) {
            console.warn('Inquiry honeypot triggered');
            sendJson(res, 200, { ok: true });
            return;
        }
        const inquiry = (0, exports.parseInquiryFields)(fields);
        const assetFiles = normalizeFiles(files);
        const validationErrors = [
            ...(0, exports.validateInquiry)(inquiry),
            ...(0, exports.validateFiles)(assetFiles),
        ];
        if (validationErrors.length) {
            console.warn('Inquiry validation failed', {
                validationErrorCount: validationErrors.length,
                uploadedFileCount: assetFiles.length,
            });
            sendJson(res, 400, { error: validationErrors[0] });
            return;
        }
        let assets;
        try {
            assets = await Promise.all(assetFiles.map(exports.uploadAsset));
            console.info('Inquiry assets uploaded', {
                uploadedFileCount: assets.length,
                resourceTypes: assets.map(asset => asset.resourceType),
            });
        }
        catch (error) {
            console.error('Inquiry Cloudinary upload failed:', error);
            throw new HttpError(502, 'Your files could not be uploaded right now. Please try again in a moment.');
        }
        const resend = new resend_1.Resend(getRequiredEnv('RESEND_API_KEY'));
        try {
            await (0, inquiryEmails_1.sendInquiryEmails)({
                resend,
                fromEmail: getResendFromEmail(),
                ownerEmail: getOwnerEmail(),
                inquiry,
                assets,
                submittedAt: new Date(),
            });
            console.info('Inquiry emails processed', { uploadedFileCount: assets.length });
        }
        catch (error) {
            console.error('Lead notification email failed:', error);
            throw new HttpError(502, 'Your inquiry could not be emailed right now. Please try again in a moment.');
        }
        sendJson(res, 200, { ok: true });
    }
    catch (error) {
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
exports.default = handler;
module.exports = Object.assign(handler, exports, { default: handler });
