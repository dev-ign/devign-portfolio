import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

const {
  isSpamSubmission,
  parseInquiryFields,
  validateFiles,
  validateInquiry,
} = require('../../api/inquiry');
const {
  generateAutoReplyEmail,
  generateLeadNotificationEmail,
  sendInquiryEmails,
} = require('../../api/lib/email/inquiryEmails');

const makeFile = (overrides: Partial<{
  originalFilename: string;
  mimetype: string;
  size: number;
}> = {}) => ({
  filepath: '/tmp/file',
  originalFilename: 'image-1.png',
  mimetype: 'image/png',
  size: 1024,
  ...overrides,
});

describe('inquiry api helpers', () => {
  it('parses inquiry fields from multipart values', () => {
    expect(parseInquiryFields({
      name: ['John Smith'],
      email: ['john@email.com'],
      businessName: ['Nutrition Shop'],
      website: ['https://nutrition.example'],
      projectTypes: ['["marketing","video"]'],
      budget: ['$3,000 - $5,000'],
      timeline: ['Flexible'],
      details: ['I need a new site for my nutrition shop.'],
    })).toEqual({
      name: 'John Smith',
      email: 'john@email.com',
      businessName: 'Nutrition Shop',
      website: 'https://nutrition.example',
      projectTypes: ['marketing', 'video'],
      budget: '$3,000 - $5,000',
      timeline: 'Flexible',
      details: 'I need a new site for my nutrition shop.',
    });
  });

  it('validates required inquiry fields', () => {
    expect(validateInquiry({
      name: '',
      email: 'not-email',
      businessName: '',
      website: '',
      projectTypes: [],
      budget: '',
      timeline: '',
      details: '',
    })).toEqual([
      'Enter your name.',
      'Enter a valid email address.',
      'Select at least one project type.',
      'Select a budget range.',
      'Select a timeline.',
    ]);
  });

  it('identifies filled honeypot submissions without using the real website field', () => {
    expect(isSpamSubmission({
      companyWebsite: ['https://spam.example'],
      website: ['https://legit-business.example'],
    })).toBe(true);

    expect(isSpamSubmission({
      companyWebsite: ['   '],
      website: ['https://legit-business.example'],
    })).toBe(false);
  });

  it('validates upload file type and size', () => {
    expect(validateFiles([
      makeFile(),
      makeFile({ originalFilename: 'clip.mp4', mimetype: 'video/mp4', size: 1.5 * 1024 * 1024 }),
      makeFile({ originalFilename: 'wireframe.fig', mimetype: '', size: 2 * 1024 * 1024 }),
    ] as never)).toEqual([]);

    expect(validateFiles([
      makeFile({ originalFilename: 'large-image.png', mimetype: 'image/png', size: 5 * 1024 * 1024 }),
      makeFile({ originalFilename: 'installer.exe', mimetype: 'application/x-msdownload', size: 1024 }),
    ] as never)).toEqual([
      'Keep total uploads under 4.0 MB.',
      'large-image.png is over the 4.0 MB limit.',
      'installer.exe is not a supported asset type.',
    ]);
  });

  it('builds a branded lead notification email with reply metadata and uploaded asset links', () => {
    const email = generateLeadNotificationEmail({
      name: 'John Smith',
      email: 'john@email.com',
      businessName: 'Nutrition Shop',
      website: '',
      projectTypes: ['marketing', 'video'],
      budget: '$3,000 - $5,000',
      timeline: 'Flexible',
      details: 'I need a new site for my nutrition shop.',
    }, [
      {
        name: 'image-1.png',
        size: 2048,
        url: 'https://res.cloudinary.com/dnct9yomi/image/upload/image-1.png',
        publicId: 'devign/inquiries/image-1',
        resourceType: 'image',
      },
      {
        name: 'image-2.jpg',
        size: 4096,
        url: 'https://res.cloudinary.com/dnct9yomi/image/upload/image-2.jpg',
        publicId: 'devign/inquiries/image-2',
        resourceType: 'image',
      },
    ], new Date('2026-06-13T14:30:00.000Z'));

    expect(email.subject).toBe('New Project Inquiry — John Smith');
    expect(email.text).toContain('New project inquiry');
    expect(email.text).toContain('Name: John Smith');
    expect(email.text).toContain('Email: john@email.com');
    expect(email.text).toContain('Company: Nutrition Shop');
    expect(email.text).toContain('Project Type: Marketing website, Video');
    expect(email.text).toContain('Budget: $3,000 - $5,000');
    expect(email.text).toContain('Submission timestamp: Jun 13, 2026');
    expect(email.text).toContain('Notes / Message:\nI need a new site for my nutrition shop.');
    expect(email.text).toContain('image-1.png (2.0 KB): https://res.cloudinary.com/dnct9yomi/image/upload/image-1.png');
    expect(email.text).toContain('image-2.jpg (4.0 KB): https://res.cloudinary.com/dnct9yomi/image/upload/image-2.jpg');
    expect(email.html).toContain('Devign');
    expect(email.html).toContain('New project inquiry');
    expect(email.html).toContain('Reply to John Smith');
    expect(email.html).toContain('Project Type');
    expect(email.html).toContain('Marketing website, Video');
    expect(email.html).toContain('https://res.cloudinary.com/dnct9yomi/image/upload/image-1.png');
    expect(email.html).toContain('image-1.png');
  });

  it('builds a premium client auto-reply email with preview text and Devign signature', () => {
    const email = generateAutoReplyEmail({
      name: 'John Smith',
      email: 'john@email.com',
      businessName: '',
      website: '',
      projectTypes: ['product'],
      budget: '$5,000+',
      timeline: 'ASAP',
      details: 'Please review this.',
    });

    expect(email.subject).toBe("We've received your project inquiry");
    expect(email.text).toContain('Thank you for contacting Devign.');
    expect(email.text).toContain('Typical response time is within 24 business hours.');
    expect(email.text).toContain('Jonathan Ferreira');
    expect(email.text).toContain('Founder, Devign UX');
    expect(email.html).toContain("Thanks for reaching out. We'll review your project and get back to you shortly.");
    expect(email.html).toContain('https://devignux.com');
    expect(email.html).toContain('No further action is required.');
  });

  it('escapes user-provided content in the Resend HTML emails', () => {
    const email = generateLeadNotificationEmail({
      name: '<script>alert("x")</script>',
      email: 'john@email.com',
      businessName: 'A&B Studio',
      website: 'https://example.com/?q=<test>',
      projectTypes: ['product'],
      budget: '$5,000+',
      timeline: 'ASAP',
      details: 'Please review <b>this</b>.',
    }, []);

    expect(email.text).toContain('Name: <script>alert("x")</script>');
    expect(email.html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(email.html).toContain('A&amp;B Studio');
    expect(email.html).toContain('Please review &lt;b&gt;this&lt;/b&gt;.');
  });

  it('sends lead notification before auto-reply with the expected Resend fields', async () => {
    const send = jest.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null });

    await sendInquiryEmails({
      resend: { emails: { send } },
      fromEmail: 'Devign UX <hello@devignux.com>',
      ownerEmail: 'devignux@gmail.com',
      inquiry: {
        name: 'John Smith',
        email: 'john@email.com',
        businessName: 'Nutrition Shop',
        website: '',
        projectTypes: ['marketing'],
        budget: '$3,000 - $5,000',
        timeline: 'Flexible',
        details: 'I need a new site.',
      },
      assets: [],
      submittedAt: new Date('2026-06-13T14:30:00.000Z'),
    });

    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][0]).toMatchObject({
      from: 'Devign UX <hello@devignux.com>',
      to: 'devignux@gmail.com',
      replyTo: 'john@email.com',
      subject: 'New Project Inquiry — John Smith',
    });
    expect(send.mock.calls[1][0]).toMatchObject({
      from: 'Devign UX <hello@devignux.com>',
      to: 'john@email.com',
      subject: "We've received your project inquiry",
    });
  });

  it('throws when lead notification fails and does not send the auto-reply', async () => {
    const send = jest.fn().mockRejectedValueOnce(new Error('lead failed'));

    await expect(sendInquiryEmails({
      resend: { emails: { send } },
      fromEmail: 'Devign UX <hello@devignux.com>',
      ownerEmail: 'devignux@gmail.com',
      inquiry: {
        name: 'John Smith',
        email: 'john@email.com',
        businessName: '',
        website: '',
        projectTypes: ['marketing'],
        budget: '$3,000 - $5,000',
        timeline: 'Flexible',
        details: 'I need a new site.',
      },
      assets: [],
      submittedAt: new Date('2026-06-13T14:30:00.000Z'),
    })).rejects.toThrow('lead failed');

    expect(send).toHaveBeenCalledTimes(1);
  });

  it('logs and continues when auto-reply fails', async () => {
    const send = jest.fn()
      .mockResolvedValueOnce({ data: { id: 'lead-id' }, error: null })
      .mockRejectedValueOnce(new Error('auto reply failed'));
    const originalError = console.error;
    console.error = jest.fn();

    await expect(sendInquiryEmails({
      resend: { emails: { send } },
      fromEmail: 'Devign UX <hello@devignux.com>',
      ownerEmail: 'devignux@gmail.com',
      inquiry: {
        name: 'John Smith',
        email: 'john@email.com',
        businessName: '',
        website: '',
        projectTypes: ['marketing'],
        budget: '$3,000 - $5,000',
        timeline: 'Flexible',
        details: 'I need a new site.',
      },
      assets: [],
      submittedAt: new Date('2026-06-13T14:30:00.000Z'),
    })).resolves.toBeUndefined();

    expect(send).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith('Auto reply failed', expect.any(Error));
    console.error = originalError;
  });
});
