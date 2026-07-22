export type CaseStudyMotionBreakpoint = 'mobile' | 'tablet' | 'desktop';

export interface CaseStudyRevealPreset {
  duration: number;
  distance: number;
  start: string;
  initialOpacity: number;
}

export interface CaseStudyBreakpointPresets {
  intro: CaseStudyRevealPreset;
  cardGroup: CaseStudyRevealPreset;
  text: CaseStudyRevealPreset;
  visual: CaseStudyRevealPreset;
}

export const CASE_STUDY_MOTION_TRIGGER_PREFIX = 'donor-directory-reveal';

// Editorial motion stays intentionally quieter than the major product visuals.

export const CASE_STUDY_MOTION = {
  ease: {
    editorial: 'power2.out',
    visual: 'power3.out',
  },
  hero: {
    copy: {
      duration: 0.82,
      distance: 16,
      initialOpacity: 0.2,
    },
    metadata: {
      duration: 0.55,
      start: 0.08,
      initialOpacity: 0.25,
    },
    visual: {
      duration: 0.82,
      distance: 36,
      scale: 0.988,
      start: 0.38,
    },
  },
  desktop: {
    intro: { duration: 0.72, distance: 14, start: 'top 88%', initialOpacity: 0.25 },
    cardGroup: { duration: 0.7, distance: 12, start: 'top 90%', initialOpacity: 0.35 },
    text: { duration: 0.62, distance: 8, start: 'top 90%', initialOpacity: 0.4 },
    visual: { duration: 1, distance: 32, start: 'top 84%', initialOpacity: 0 },
  },
  tablet: {
    intro: { duration: 0.68, distance: 12, start: 'top 89%', initialOpacity: 0.3 },
    cardGroup: { duration: 0.66, distance: 10, start: 'top 90%', initialOpacity: 0.4 },
    text: { duration: 0.6, distance: 8, start: 'top 90%', initialOpacity: 0.45 },
    visual: { duration: 0.92, distance: 28, start: 'top 87%', initialOpacity: 0 },
  },
  mobile: {
    intro: { duration: 0.6, distance: 8, start: 'top 90%', initialOpacity: 0.4 },
    cardGroup: { duration: 0.6, distance: 8, start: 'top 91%', initialOpacity: 0.5 },
    text: { duration: 0.56, distance: 6, start: 'top 91%', initialOpacity: 0.55 },
    visual: { duration: 0.82, distance: 20, start: 'top 91%', initialOpacity: 0 },
  },
  visualScale: 0.99,
  directionalDistance: 18,
  annotationStagger: 0.045,
} as const;

export const getCaseStudyMotionPresets = (
  breakpoint: CaseStudyMotionBreakpoint
): CaseStudyBreakpointPresets => CASE_STUDY_MOTION[breakpoint];

export const getCaseStudyMotionBreakpoint = (
  isDesktop: boolean,
  isTablet: boolean
): CaseStudyMotionBreakpoint => {
  if (isDesktop) return 'desktop';
  if (isTablet) return 'tablet';
  return 'mobile';
};
