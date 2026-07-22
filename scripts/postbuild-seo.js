const fs = require('fs');
const path = require('path');
const donorDirectorySeo = require('../src/data/donorDirectorySeo.json');

const vercelEnvironment = process.env.VERCEL_ENV;
const isPreviewDeployment = Boolean(
  vercelEnvironment && vercelEnvironment !== 'production'
);
const buildDirectory = path.resolve(__dirname, '..', 'build');
const indexPath = path.join(buildDirectory, 'index.html');

const routeMetadata = [
  {
    pathname: 'case-studies',
    title: 'Case Studies | DevignUX',
    description:
      'Explore selected DevignUX UX/UI design and development case studies for digital products and web experiences.',
    canonical: 'https://devignux.com/case-studies',
  },
  {
    pathname: 'case-studies/gravyty-template-manager',
    title: 'Template Manager Case Study | DevignUX',
    description:
      'A self-serve email template system for fundraising teams, designed and developed by DevignUX.',
    canonical: 'https://devignux.com/case-studies/gravyty-template-manager',
  },
  {
    pathname: 'case-studies/donor-directory',
    ...donorDirectorySeo,
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          '@id': `${donorDirectorySeo.canonical}#case-study`,
          headline: 'Donor Directory enterprise UX case study',
          description: donorDirectorySeo.description,
          url: donorDirectorySeo.canonical,
          image: donorDirectorySeo.image,
          author: { '@id': 'https://devignux.com/#organization' },
          publisher: { '@id': 'https://devignux.com/#organization' },
          isPartOf: { '@id': 'https://devignux.com/#website' },
          inLanguage: 'en-US',
          about: ['Enterprise UX', 'Data tables', 'Search and filtering', 'Accessibility', 'Design systems'],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devignux.com/' },
            { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://devignux.com/case-studies' },
            { '@type': 'ListItem', position: 3, name: 'Donor Directory', item: donorDirectorySeo.canonical },
          ],
        },
      ],
    },
  },
];

const escapeAttribute = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const createRouteHtml = (baseHtml, metadata) => {
  const title = escapeAttribute(metadata.title);
  const description = escapeAttribute(metadata.description);
  const canonical = escapeAttribute(metadata.canonical);

  let html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${description}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${title}"/>`)
    .replace(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${description}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${title}"/>`)
    .replace(/<meta name="twitter:description" content="[^"]*"\/>/, `<meta name="twitter:description" content="${description}"/>`);

  if (metadata.indexable === false) {
    html = html.replace(
      /<meta name="robots" content="[^"]*"\/>/,
      '<meta name="robots" content="noindex, nofollow"/>'
    );
  }

  if (metadata.image) {
    const image = escapeAttribute(metadata.image);
    const imageType = escapeAttribute(metadata.imageType);
    const imageWidth = escapeAttribute(metadata.imageWidth);
    const imageHeight = escapeAttribute(metadata.imageHeight);
    const imageAlt = escapeAttribute(metadata.imageAlt);
    const ogType = escapeAttribute(metadata.ogType || 'website');

    html = html
      .replace(/<meta property="og:type" content="[^"]*"\/>/, `<meta property="og:type" content="${ogType}"/>`)
      .replace(/<meta property="og:image" content="[^"]*"\/>/, `<meta property="og:image" content="${image}"/>`)
      .replace(/<meta property="og:image:type" content="[^"]*"\/>/, `<meta property="og:image:type" content="${imageType}"/>`)
      .replace(/<meta property="og:image:width" content="[^"]*"\/>/, `<meta property="og:image:width" content="${imageWidth}"/>`)
      .replace(/<meta property="og:image:height" content="[^"]*"\/>/, `<meta property="og:image:height" content="${imageHeight}"/>`)
      .replace(/<meta property="og:image:alt" content="[^"]*"\/>/, `<meta property="og:image:alt" content="${imageAlt}"/>`)
      .replace(/<meta name="twitter:image" content="[^"]*"\/>/, `<meta name="twitter:image" content="${image}"/>`)
      .replace(/<meta name="twitter:image:alt" content="[^"]*"\/>/, `<meta name="twitter:image:alt" content="${imageAlt}"/>`);
  }

  if (metadata.structuredData) {
    html = html.replace(
      '</head>',
      `    <script id="route-structured-data" type="application/ld+json">${JSON.stringify(metadata.structuredData)}</script>\n  </head>`
    );
  }

  return html;
};

if (isPreviewDeployment) {
  const robotsPath = path.join(buildDirectory, 'robots.txt');

  const indexHtml = fs.readFileSync(indexPath, 'utf8').replace(
    'content="index, follow, max-image-preview:large"',
    'content="noindex, nofollow"'
  );

  fs.writeFileSync(indexPath, indexHtml);
  fs.writeFileSync(robotsPath, 'User-agent: *\nDisallow: /\n');
  console.log(`Applied noindex rules for Vercel ${vercelEnvironment} deployment.`);
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');
routeMetadata.forEach(metadata => {
  const routeDirectory = path.join(buildDirectory, metadata.pathname);
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(routeDirectory, 'index.html'),
    createRouteHtml(baseHtml, metadata)
  );
});

console.log(`Generated ${routeMetadata.length} route-specific static entry documents.`);
