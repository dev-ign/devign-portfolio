import fs from 'fs';
import path from 'path';
import { CONTACT_EMAIL_URL, RESUME_FILE_NAME, RESUME_URL } from './site';

test('points contact and resume actions at the canonical destinations', () => {
  expect(CONTACT_EMAIL_URL).toBe('mailto:contact@devignux.com');
  expect(RESUME_URL).toBe('/jona-ferreira-product-resume-devign.docx');
  const resume = fs.readFileSync(path.join(process.cwd(), 'public', RESUME_FILE_NAME));
  expect(resume.length).toBeGreaterThan(1000);
  expect(resume.subarray(0, 2).toString()).toBe('PK');
});
