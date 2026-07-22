import { getMetadata } from './PageMetadata';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
}), { virtual: true });

test('locks the Donor Directory launch metadata and structured data', () => {
  const metadata = getMetadata('/case-studies/donor-directory');

  expect(metadata).toMatchObject({
    title: 'Donor Directory UX Case Study | DevignUX',
    canonical: 'https://devignux.com/case-studies/donor-directory',
    image: 'https://devignux.com/donor-directory-social-preview.webp',
    imageWidth: '1200',
    imageHeight: '630',
    ogType: 'article',
  });
  expect(JSON.stringify(metadata.structuredData)).toContain('CreativeWork');
  expect(JSON.stringify(metadata.structuredData)).not.toMatch(/datePublished|award|rating|percent/i);
});

test('keeps the internal visual demo out of search results', () => {
  const metadata = getMetadata('/case-studies/donor-directory/visual-demo');

  expect(metadata.indexable).toBe(false);
  expect(metadata.canonical).toBe('https://devignux.com/case-studies/donor-directory');
});
