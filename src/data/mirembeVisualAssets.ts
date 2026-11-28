export interface MirembeVisual {
  src: string;
  width: number;
  height: number;
  alt: string;
  source: string;
  status: 'historical' | 'current' | 'campaign';
  privacy: 'public design' | 'public UI captured locally' | 'approved creative';
  priority?: boolean;
  mobile?: string;
}

const media = '/mirembe-case-study/';

export const mirembeSelectedWorkAlt =
  'Mirembe Cleaning’s desktop homepage and mobile layout with lavender branding, warm photography, and a prominent booking action.';

export const mirembeVisuals = {
  homepage: {
    src: `${media}homepage.webp`,
    width: 1440,
    height: 900,
    mobile: `${media}homepage-small.webp`,
    priority: true,
    alt: 'Mirembe’s live homepage layout with its Request a Cleaning button, lavender accents, and layered photos of a home and family.',
    source: 'Current Mirembe homepage, isolated production-style build at d3053d4',
    status: 'current',
    privacy: 'public UI captured locally',
  },
  mobile: {
    src: `${media}mobile-en.webp`,
    width: 390,
    height: 844,
    alt: 'English mobile homepage with the booking action above the tall hero photograph.',
    source: 'Current Mirembe homepage at 390 px, isolated build',
    status: 'current',
    privacy: 'public UI captured locally',
  },
  waitlist: {
    src: `${media}waitlist.webp`,
    width: 1250,
    height: 889,
    alt: 'Original waitlist design with an email field, a separate link for cleaning applicants, and an overlapping home photograph.',
    source: 'Mirembe Figma, Waitlist, Desktop - 1 (1:9)',
    status: 'historical',
    privacy: 'public design',
  },
  services: {
    src: `${media}expanded.webp`,
    width: 1280,
    height: 875,
    alt: 'Expanded landing-page design with Standard Clean, Deep Clean, and Rental Turnovers service cards.',
    source: 'Mirembe Figma, Expanded Landing, desktop Our Services (58:1462)',
    status: 'historical',
    privacy: 'public design',
  },
  drawer: {
    src: `${media}detail-desktop.webp`,
    width: 1440,
    height: 900,
    alt: 'The Standard Clean checklist in a desktop drawer over the service cards, with a Request a Cleaning button.',
    source: 'Current desktop Standard Clean detail, isolated build',
    status: 'current',
    privacy: 'public UI captured locally',
  },
  spanish: {
    src: `${media}mobile-es.webp`,
    width: 390,
    height: 844,
    alt: 'Mirembe mobile homepage in Spanish with a localized heading and booking action.',
    source: 'Current Spanish homepage at 390 px, isolated build',
    status: 'current',
    privacy: 'public UI captured locally',
  },
  mobileDrawer: {
    src: `${media}mobile-detail.webp`,
    width: 390,
    height: 844,
    alt: 'Spanish service details displayed as a mobile sheet with a cleaning checklist.',
    source: 'Current Spanish Standard Clean detail at 390 px, isolated build',
    status: 'current',
    privacy: 'public UI captured locally',
  },
  booking: {
    src: `${media}booking-archive.webp`,
    width: 390,
    height: 844,
    alt: 'Holiday booking page showing the transition from Mirembe’s branded introduction to the blank ZenMaid request form.',
    source:
      'Archived Mirembe campaign production capture, booking-focused-full.png, cropped to the first viewport',
    status: 'historical',
    privacy: 'public UI captured locally',
  },
  thankYou: {
    src: `${media}thank-you.webp`,
    width: 390,
    height: 844,
    alt: 'The Spanish booking acknowledgment with next steps and a separate newsletter invitation.',
    source: 'Direct visit to the localized acknowledgment route in an isolated build',
    status: 'current',
    privacy: 'public UI captured locally',
  },
  heroPhoto: {
    src: `${media}brand-photo.webp`,
    width: 840,
    height: 473,
    alt: 'A sunlit living room with warm neutrals and soft lavender details.',
    source: 'Mirembe source, public/landing/v2/hero.webp, downscaled',
    status: 'current',
    privacy: 'public design',
  },
} satisfies Record<string, MirembeVisual>;

export const mirembeServicePhotos = {
  standard: { src: `${media}service-standard.webp`, source: 'public/landing/v2/service_standard.webp' },
  deep: { src: `${media}service-deep.webp`, source: 'public/landing/v2/service_deep.webp' },
  rental: { src: `${media}service-rental.webp`, source: 'public/landing/v2/service_rental.webp' },
};

export const mirembeCreatives = [
  {
    id: 'holiday',
    title: 'Holiday booking reel',
    duration: '24 sec',
    file: `${media}holiday-booking.mp4`,
    poster: `${media}holiday-poster.webp`,
    width: 720,
    height: 1280,
    source: 'Supplied mirembe-v2-final-fixed.mp4',
    status: 'campaign',
    privacy: 'approved creative',
    description:
      'A mobile walkthrough shows the site, regional coverage, and how booking works before closing on the limited holiday offer.',
    transcript:
      '“A Cleaner Home, More Peace.” The mobile site scrolls through service coverage and how booking works. The reel shows the holiday request form, then ends with “Holiday Cleaning 10% Off” and “Request a Holiday Cleaning.” This was a seasonal campaign.',
  },
  {
    id: 'languages',
    title: 'Multilingual launch reel',
    duration: '24 sec',
    file: `${media}languages.mp4`,
    poster: `${media}languages-poster.webp`,
    width: 720,
    height: 1280,
    source: 'Supplied mirembe-languages-ig-reel.mp4',
    status: 'campaign',
    privacy: 'approved creative',
    description:
      'Localized headlines and mobile screens turn support for four languages into something a viewer can see in a few seconds.',
    transcript:
      '“More peace. In your language.” The home-page message appears in English, Spanish, Portuguese, and Haitian Creole, with examples of the translated mobile experience. The reel closes with “Your home. Your language.” and “Request a Cleaning.”',
  },
] as const;
