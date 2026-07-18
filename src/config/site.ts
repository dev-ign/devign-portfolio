export const SITE_URL = 'https://devignux.com';

export const siteConfig = {
  name: 'DevignUX',
  title: 'DevignUX | Website Design, UX/UI & Development Studio',
  description:
    'DevignUX designs and builds premium websites, digital products, graphics, motion, and visual experiences for businesses worldwide.',
  url: SITE_URL,
  publicEmail: 'contact@devignux.com',
  socialImage: `${SITE_URL}/gateway-hero-poster.jpg`,
  socialImageAlt:
    'A violet sunrise over the horizon, representing DevignUX digital design and development work.',
} as const;

export const footerNavigation = [
  { label: 'Home', target: 'top' },
  { label: 'Services', target: 'services' },
  { label: 'Process', target: 'process' },
  { label: 'Projects', target: 'projects' },
  { label: 'FAQ', target: 'faq' },
  { label: 'Contact', target: 'inquiry' },
] as const;

export const footerServices = [
  'Website Design',
  'UX/UI Design',
  'Web Development',
  'Graphic Design',
  'Motion & Video',
  'Digital Strategy',
] as const;

export const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jona-ferreira-',
    accessibleLabel: 'Visit Jonathan Ferreira on LinkedIn',
  },
] as const;
