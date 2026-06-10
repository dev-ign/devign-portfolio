import {
  buildInquiryEmailParams,
  buildInquiryConfirmationParams,
  validateContactStep,
} from './inquiryFormEmail';

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

const files = [
  { name: 'brand-guide.pdf', size: 2048 },
  { name: 'homepage.png', size: 1536 },
];

test('builds owner inquiry email for devignux@gmail.com with all submitted details', () => {
  const params = buildInquiryEmailParams(validFormData, files);

  expect(params.to_email).toBe('devignux@gmail.com');
  expect(params.from_name).toBe('Jordan Lee');
  expect(params.from_email).toBe('jordan@example.com');
  expect(params.reply_to).toBe('jordan@example.com');
  expect(params.subject).toContain('Product design, Video');
  expect(params.message).toContain('Name: Jordan Lee');
  expect(params.message).toContain('Email: jordan@example.com');
  expect(params.message).toContain('Business: Northstar Studio');
  expect(params.message).toContain('Website/Social: https://northstar.example');
  expect(params.message).toContain('Project types: Product design, Video');
  expect(params.message).toContain('Budget: $5k-$10k');
  expect(params.message).toContain('Timeline: 2-4 Weeks');
  expect(params.message).toContain('Resources/assets: brand-guide.pdf (2.0 KB), homepage.png (1.5 KB)');
  expect(params.message).toContain('We need a redesigned product flow and launch video.');
});

test('builds confirmation email for the user who submitted the inquiry', () => {
  const params = buildInquiryConfirmationParams(validFormData, files);

  expect(params.to_email).toBe('jordan@example.com');
  expect(params.from_name).toBe('Devign UX');
  expect(params.subject).toBe('Your Devign inquiry was received');
  expect(params.message).toContain('Hi Jordan Lee,');
  expect(params.message).toContain('I received your inquiry and will review the details soon.');
  expect(params.message).toContain('Project types: Product design, Video');
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
