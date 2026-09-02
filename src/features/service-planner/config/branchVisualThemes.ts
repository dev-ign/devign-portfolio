import type { ServiceBranchId } from '../types/servicePlanner.types';

interface BranchVisualTheme {
  ctaLabel: string;
  glow: string;
  previewVariant: 'presence' | 'product' | 'brand' | 'motion';
}

export const branchVisualThemes: Record<ServiceBranchId, BranchVisualTheme> = {
  websites: {
    ctaLabel: 'Explore Websites',
    glow: 'rgba(183, 124, 255, 0.24)',
    previewVariant: 'presence',
  },
  'web-applications': {
    ctaLabel: 'Explore Applications',
    glow: 'rgba(102, 216, 255, 0.22)',
    previewVariant: 'product',
  },
  'branding-marketing': {
    ctaLabel: 'Explore Branding',
    glow: 'rgba(255, 156, 105, 0.22)',
    previewVariant: 'brand',
  },
  'motion-video': {
    ctaLabel: 'Explore Motion',
    glow: 'rgba(255, 110, 169, 0.22)',
    previewVariant: 'motion',
  },
};
