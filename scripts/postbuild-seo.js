const fs = require('fs');
const path = require('path');

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

  return baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${description}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${title}"/>`)
    .replace(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${description}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${title}"/>`)
    .replace(/<meta name="twitter:description" content="[^"]*"\/>/, `<meta name="twitter:description" content="${description}"/>`);
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
