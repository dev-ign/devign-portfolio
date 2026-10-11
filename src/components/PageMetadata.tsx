import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '@/data/projects';
import donorDirectorySeo from '@/data/donorDirectorySeo.json';
import { siteConfig, SITE_URL, welcomeMetadata } from '@/config/site';

type Metadata = {
  title: string;
  description: string;
  canonical: string;
  indexable?: boolean;
  image?: string;
  imageType?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageAlt?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
};

const setMeta = (selector: string, attribute: 'content' | 'href', value: string) => {
  const element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  element?.setAttribute(attribute, value);
};

export const getMetadata = (pathname: string): Metadata => {
  const routePath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
  if (
    routePath === '/case-studies/donor-directory/visual-demo' ||
    routePath === '/case-studies/donor-directory/evidence'
  ) {
    return {
      title: 'Donor Directory Visual Demo | DevignUX',
      description: 'Internal representative reconstruction used to compose Donor Directory case-study visuals.',
      canonical: `${SITE_URL}/case-studies/donor-directory`,
      indexable: false,
    };
  }

  if (routePath === '/case-studies/gravyty-donor-directory') {
    return getMetadata('/case-studies/donor-directory');
  }

  if (routePath === '/case-studies/donor-directory') {
    return {
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
            author: { '@id': `${SITE_URL}/#organization` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            isPartOf: { '@id': `${SITE_URL}/#website` },
            inLanguage: 'en-US',
            about: ['Enterprise UX', 'Data tables', 'Search and filtering', 'Accessibility', 'Design systems'],
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE_URL}/portfolio` },
              { '@type': 'ListItem', position: 3, name: 'Donor Directory', item: donorDirectorySeo.canonical },
            ],
          },
        ],
      },
    };
  }

  if (routePath === '/portfolio' || routePath === '/case-studies') {
    return {
      title: 'Jona Ferreira | Product Designer & UX Engineer | DevignUX',
      description: 'Meet Jona Ferreira, a product designer and UX engineer who designs and builds digital products from 0 to 1.',
      canonical: `${SITE_URL}/portfolio`,
    };
  }

  if (routePath.startsWith('/case-studies/')) {
    const slug = routePath.split('/').filter(Boolean).pop();
    const projectId = slug === 'donor-directory' ? 'gravyty-donor-directory' : slug;
    const project = projects.find(item => item.id === projectId);
    if (project) {
      return {
        title: `${project.title} Case Study | DevignUX`,
        description: project.description,
        canonical: `${SITE_URL}${routePath}`,
      };
    }
  }

  if (routePath === '/') {
    return {
      title: welcomeMetadata.title,
      description: welcomeMetadata.description,
      canonical: `${SITE_URL}/`,
    };
  }

  if (routePath === '/studio') {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
      canonical: `${SITE_URL}/studio`,
    };
  }

  return {
    title: `Selected Work | DevignUX`,
    description:
      'Selected website, UX/UI, development, graphic, motion, and digital product work by DevignUX.',
    canonical: `${SITE_URL}${routePath}`,
    indexable: false,
  };
};

const PageMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = getMetadata(pathname);
    const isProductionHost = ['devignux.com', 'www.devignux.com'].includes(window.location.hostname);
    const robots = isProductionHost && metadata.indexable !== false
      ? 'index, follow, max-image-preview:large'
      : 'noindex, nofollow';

    document.title = metadata.title;
    setMeta('meta[name="description"]', 'content', metadata.description);
    setMeta('meta[name="robots"]', 'content', robots);
    setMeta('link[rel="canonical"]', 'href', metadata.canonical);
    setMeta('meta[property="og:title"]', 'content', metadata.title);
    setMeta('meta[property="og:description"]', 'content', metadata.description);
    setMeta('meta[property="og:url"]', 'content', metadata.canonical);
    setMeta('meta[property="og:type"]', 'content', metadata.ogType ?? 'website');
    setMeta('meta[property="og:image"]', 'content', metadata.image ?? `${SITE_URL}/gateway-hero-poster.jpg`);
    setMeta('meta[property="og:image:type"]', 'content', metadata.imageType ?? 'image/jpeg');
    setMeta('meta[property="og:image:width"]', 'content', metadata.imageWidth ?? '1844');
    setMeta('meta[property="og:image:height"]', 'content', metadata.imageHeight ?? '1124');
    setMeta('meta[property="og:image:alt"]', 'content', metadata.imageAlt ?? 'A violet sunrise over the horizon, representing DevignUX digital design and development work.');
    setMeta('meta[name="twitter:title"]', 'content', metadata.title);
    setMeta('meta[name="twitter:description"]', 'content', metadata.description);
    setMeta('meta[name="twitter:image"]', 'content', metadata.image ?? `${SITE_URL}/gateway-hero-poster.jpg`);
    setMeta('meta[name="twitter:image:alt"]', 'content', metadata.imageAlt ?? 'A violet sunrise over the horizon, representing DevignUX digital design and development work.');

    const existingStructuredData = document.getElementById('route-structured-data');
    if (metadata.structuredData) {
      const script = existingStructuredData ?? document.createElement('script');
      script.id = 'route-structured-data';
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(metadata.structuredData);
      if (!existingStructuredData) document.head.appendChild(script);
    } else {
      existingStructuredData?.remove();
    }
  }, [pathname]);

  return null;
};

export default PageMetadata;
