import {
  formatFileSize,
  getResourceSummary,
  getSelectedProjectTypes,
  validateContactStep,
  validateInquiryFiles,
} from './inquiryFormEmail';
import { submitInquiry } from './inquiryFormSubmission';

const validFormData = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  businessName: 'Northstar Studio',
  website: 'https://northstar.example',
  projectTypes: ['product', 'video'],
  budget: '$5k-$10k',
  timeline: '2-4 Weeks',
  details: 'We need a redesigned product flow and launch video.',
};

test('formats inquiry project types and uploaded resources', () => {
  expect(getSelectedProjectTypes(validFormData.projectTypes)).toBe('Product design, Video');
  expect(formatFileSize(1536)).toBe('1.5 KB');
  expect(getResourceSummary([
    { name: 'brand-guide.pdf', size: 2048 },
    { name: 'homepage.png', size: 1536 },
  ])).toBe('brand-guide.pdf (2.0 KB), homepage.png (1.5 KB)');
});

test('validates required contact fields and rejects malformed field values', () => {
  expect(validateContactStep({ ...validFormData, name: '  ' })).toEqual({
    name: 'Enter your name.',
  });
  expect(validateContactStep({ ...validFormData, email: 'bad-email' })).toEqual({
    email: 'Enter a valid email address.',
  });
  expect(validateContactStep({ ...validFormData, website: 'not a link' })).toEqual({
    website: 'Enter a valid website URL or Instagram handle.',
  });
});

test('validates inquiry files by type, count, and size', () => {
  expect(validateInquiryFiles([
    { name: 'reference.png', size: 1024, type: 'image/png' },
    { name: 'walkthrough.mp4', size: 20 * 1024 * 1024, type: 'video/mp4' },
    { name: 'wireframe.fig', size: 2 * 1024 * 1024, type: '' },
  ])).toEqual([]);

  expect(validateInquiryFiles([
    { name: 'huge.png', size: 11 * 1024 * 1024, type: 'image/png' },
    { name: 'script.exe', size: 1024, type: 'application/x-msdownload' },
  ])).toEqual([
    'huge.png is over the 10 MB limit.',
    'script.exe is not a supported asset type.',
  ]);
});

test('submits inquiry form data and files to the api route', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  });

  const file = new File(['image-bytes'], 'image-1.png', { type: 'image/png' });
  const result = await submitInquiry(validFormData, [file]);

  expect(result).toEqual({ ok: true });
  expect(global.fetch).toHaveBeenCalledWith('/api/inquiry', {
    method: 'POST',
    body: expect.any(FormData),
  });

  const body = global.fetch.mock.calls[0][1].body;
  expect(body.get('name')).toBe('Jordan Lee');
  expect(body.get('email')).toBe('jordan@example.com');
  expect(body.get('projectTypes')).toBe(JSON.stringify(['product', 'video']));
  expect(body.get('assets').name).toBe('image-1.png');

  global.fetch = originalFetch;
});

test('returns a friendly message when inquiry api rejects submission', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'Please upload fewer files.' }),
  });

  await expect(submitInquiry(validFormData, [])).resolves.toEqual({
    ok: false,
    message: 'Please upload fewer files.',
  });

  global.fetch = originalFetch;
});
