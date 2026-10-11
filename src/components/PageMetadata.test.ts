import { getMetadata } from './PageMetadata';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
}), { virtual: true });

test('gives Welcome and Studio distinct indexable canonical metadata', () => {
  expect(getMetadata('/')).toMatchObject({
    title: 'DevignUX — Studio & Portfolio',
    canonical: 'https://devignux.com/',
  });
  expect(getMetadata('/studio')).toMatchObject({
    title: 'DevignUX | Website Design, UX/UI & Development Studio',
    canonical: 'https://devignux.com/studio',
  });
});

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
  expect(JSON.stringify(metadata.structuredData)).toContain('https://devignux.com/portfolio');
  expect(JSON.stringify(metadata.structuredData)).not.toContain('https://devignux.com/case-studies"');
  expect(JSON.stringify(metadata.structuredData)).not.toMatch(/datePublished|award|rating|percent/i);
});

test('uses the Portfolio canonical for the retired case-study index', () => {
  expect(getMetadata('/case-studies').canonical).toBe('https://devignux.com/portfolio');
  expect(getMetadata('/case-studies/').canonical).toBe('https://devignux.com/portfolio');
});

test('keeps the Donor Directory canonical for a trailing-slash visit', () => {
  expect(getMetadata('/case-studies/donor-directory/').canonical).toBe('https://devignux.com/case-studies/donor-directory');
  expect(getMetadata('/case-studies/gravyty-donor-directory').canonical).toBe('https://devignux.com/case-studies/donor-directory');
});

test('keeps the internal visual demo out of search results', () => {
  const metadata = getMetadata('/case-studies/donor-directory/visual-demo');

  expect(metadata.indexable).toBe(false);
  expect(metadata.canonical).toBe('https://devignux.com/case-studies/donor-directory');
});
