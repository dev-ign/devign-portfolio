import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '@/data/projects';
import donorDirectorySeo from '@/data/donorDirectorySeo.json';
import { siteConfig, SITE_URL } from '@/config/site';

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
  if (
    pathname === '/case-studies/donor-directory/visual-demo' ||
    pathname === '/case-studies/donor-directory/evidence'
  ) {
    return {
      title: 'Donor Directory Visual Demo | DevignUX',
      description: 'Internal representative reconstruction used to compose Donor Directory case-study visuals.',
      canonical: `${SITE_URL}/case-studies/donor-directory`,
      indexable: false,
    };
  }

  if (pathname === '/case-studies/donor-directory') {
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
              { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/case-studies` },
              { '@type': 'ListItem', position: 3, name: 'Donor Directory', item: donorDirectorySeo.canonical },
            ],
          },
        ],
      },
    };
  }

  if (pathname === '/case-studies') {
    return {
      title: 'Case Studies | DevignUX',
      description:
        'Explore selected DevignUX UX/UI design and development case studies for digital products and web experiences.',
      canonical: `${SITE_URL}/case-studies`,
    };
  }

  if (pathname.startsWith('/case-studies/')) {
    const slug = pathname.split('/').filter(Boolean).pop();
    const projectId = slug === 'donor-directory' ? 'gravyty-donor-directory' : slug;
    const project = projects.find(item => item.id === projectId);
    if (project) {
      return {
        title: `${project.title} Case Study | DevignUX`,
        description: project.description,
        canonical: `${SITE_URL}${pathname}`,
      };
    }
  }

  if (pathname === '/') {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
      canonical: `${SITE_URL}/`,
    };
  }

  return {
    title: `Selected Work | DevignUX`,
    description:
      'Selected website, UX/UI, development, graphic, motion, and digital product work by DevignUX.',
    canonical: `${SITE_URL}${pathname}`,
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
