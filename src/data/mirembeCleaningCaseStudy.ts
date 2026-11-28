import { mirembeServicePhotos } from '@/data/mirembeVisualAssets';
import type { CaseStudyProjectDetail } from '@/components/case-studies/CaseStudyProjectDetails';

export const MIREMBE_SLUG = 'mirembe-cleaning';
export const MIREMBE_CASE_PATH = `/case-studies/${MIREMBE_SLUG}`;
export const MIREMBE_PORTFOLIO_PATH = `/portfolio#${MIREMBE_SLUG}`;

export const mirembeFacts: readonly CaseStudyProjectDetail[] = [
  { label: 'Role', value: 'Product Designer & Full-Stack UX Engineer' },
  { label: 'Scope', value: 'Strategy, design, engineering & growth' },
  { label: 'Industry', value: 'Residential services' },
  { label: 'Collaboration', value: 'Mirembe founders' },
  { label: 'Timeline', value: 'October 2026 – Present' },
  { label: 'Status', value: 'Live · Ongoing partnership' },
];

export const mirembeServices = [
  {
    name: 'Standard Clean',
    image: mirembeServicePhotos.standard.src,
    summary: 'Recurring or one-time care for a home that needs regular upkeep.',
    inclusions: [
      'Wiping counters and stovetop',
      'Cleaning sinks and appliance exteriors',
      'Cleaning and disinfecting bathrooms',
      'Vacuuming and mopping floors',
    ],
  },
  {
    name: 'Deep Clean',
    image: mirembeServicePhotos.deep.src,
    summary: 'A more detailed clean for first visits, seasonal resets, or hosting.',
    inclusions: [
      'Standard cleaning tasks',
      'Inside the oven, microwave, and fridge',
      'Baseboards and cabinet fronts',
      'Door frames, grout, ceiling fans, and blinds',
    ],
  },
  {
    name: 'Rental Turnovers & Moves',
    image: mirembeServicePhotos.rental.src,
    summary: 'Cleaning for rental turnovers and move-in or move-out days.',
    inclusions: [
      'Cleaning empty rooms and floors',
      'Cleaning inside cabinets and drawers',
      'Cleaning appliances inside and out',
      'Detailing kitchens and bathrooms',
    ],
  },
];

export const mirembeArchitecture = [
  {
    action: 'Customer waitlist and cleaner recruitment',
    processing: 'Vercel Functions',
    protection: 'Cloudflare Turnstile and server-side validation',
    destination: 'Supabase Postgres',
    downstream: 'Resend notifications and Google Sheets sync',
  },
  {
    action: 'Newsletter signup with consent',
    processing: 'Dedicated endpoint',
    protection: 'Validation and opt-out checks',
    destination: 'Resend newsletter segment',
  },
  {
    action: 'Cleaning requests',
    processing: 'Localized booking page',
    protection: 'Provider handoff',
    destination: 'ZenMaid scheduling and operations',
  },
  {
    action: 'Optional measurement',
    processing: 'Consent gate',
    protection: 'Booking journey signals',
    destination: 'GA4 and Meta Pixel',
  },
];

export const mirembeOutcomes = {
  milestone: {
    title: 'First customer cleaning',
    text: 'Mirembe completed its first customer cleaning and has additional appointments booked.',
  },
  capabilities: [
    {
      title: 'Customer-facing website',
      text: 'The pre-launch waitlist evolved into a live website with service discovery, a booking-request journey, and four languages.',
    },
    {
      title: 'Operational foundation',
      text: 'The founders gained separate customer and recruiting workflows, notification and lead handling, and consented newsletter collection.',
    },
  ],
};
