import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

const {
  buildOwnerEmail,
  parseInquiryFields,
  validateFiles,
  validateInquiry,
} = require('../../api/inquiry');

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

  it('validates upload file type and size', () => {
    expect(validateFiles([
      makeFile(),
      makeFile({ originalFilename: 'clip.mp4', mimetype: 'video/mp4', size: 20 * 1024 * 1024 }),
      makeFile({ originalFilename: 'wireframe.fig', mimetype: '', size: 2 * 1024 * 1024 }),
    ] as never)).toEqual([]);

    expect(validateFiles([
      makeFile({ originalFilename: 'large-image.png', mimetype: 'image/png', size: 11 * 1024 * 1024 }),
      makeFile({ originalFilename: 'installer.exe', mimetype: 'application/x-msdownload', size: 1024 }),
    ] as never)).toEqual([
      'large-image.png is over the 10 MB limit.',
      'installer.exe is not a supported asset type.',
    ]);
  });

  it('builds the Resend owner email with the requested subject and body', () => {
    const email = buildOwnerEmail({
      name: 'John Smith',
      email: 'john@email.com',
      businessName: '',
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
    ]);

    expect(email.subject).toBe('Lead - john@email.com');
    expect(email.text).toContain('New project inquiry');
    expect(email.text).toContain('Name: John Smith');
    expect(email.text).toContain('Email: john@email.com');
    expect(email.text).toContain('Project Type: Marketing website, Video');
    expect(email.text).toContain('Budget: $3,000 - $5,000');
    expect(email.text).toContain('Notes:\nI need a new site for my nutrition shop.');
    expect(email.text).toContain('image-1.png (2.0 KB): https://res.cloudinary.com/dnct9yomi/image/upload/image-1.png');
    expect(email.text).toContain('image-2.jpg (4.0 KB): https://res.cloudinary.com/dnct9yomi/image/upload/image-2.jpg');
  });
});
