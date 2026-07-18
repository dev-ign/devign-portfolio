import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '@/data/projects';
import { siteConfig, SITE_URL } from '@/config/site';

type Metadata = {
  title: string;
  description: string;
  canonical: string;
  indexable?: boolean;
};

const setMeta = (selector: string, attribute: 'content' | 'href', value: string) => {
  const element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  element?.setAttribute(attribute, value);
};

const getMetadata = (pathname: string): Metadata => {
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
    const project = projects.find(item => item.id === slug);
    if (project) {
      return {
        title: `${project.title} Case Study | DevignUX`,
        description: project.description,
        canonical: `${SITE_URL}/case-studies/${project.id}`,
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
    setMeta('meta[name="twitter:title"]', 'content', metadata.title);
    setMeta('meta[name="twitter:description"]', 'content', metadata.description);
  }, [pathname]);

  return null;
};

export default PageMetadata;
