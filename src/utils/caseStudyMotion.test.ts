import {
  CASE_STUDY_MOTION,
  CASE_STUDY_MOTION_TRIGGER_PREFIX,
  getCaseStudyMotionBreakpoint,
  getCaseStudyMotionPresets,
} from './caseStudyMotion';

test('separates calm editorial motion from cinematic visual motion', () => {
  expect(CASE_STUDY_MOTION_TRIGGER_PREFIX).toBe('donor-directory-reveal');
  expect(CASE_STUDY_MOTION.ease.editorial).toBe('power2.out');
  expect(CASE_STUDY_MOTION.ease.visual).toBe('power3.out');
  expect(CASE_STUDY_MOTION.hero.visual.start).toBeLessThan(0.5);

  const desktop = getCaseStudyMotionPresets('desktop');
  const mobile = getCaseStudyMotionPresets('mobile');

  expect(desktop.intro.distance).toBeLessThanOrEqual(14);
  expect(desktop.cardGroup.distance).toBeLessThanOrEqual(12);
  expect(desktop.visual.distance).toBeGreaterThan(desktop.intro.distance);
  expect(desktop.visual.duration).toBeGreaterThan(desktop.cardGroup.duration);
  expect(mobile.intro.distance).toBeLessThan(desktop.intro.distance);
  expect(mobile.cardGroup.distance).toBeLessThan(desktop.cardGroup.distance);
  expect(mobile.visual.distance).toBeLessThan(desktop.visual.distance);
  expect(mobile.cardGroup.duration).toBeLessThanOrEqual(0.6);
});

test('selects a single motion breakpoint', () => {
  expect(getCaseStudyMotionBreakpoint(true, false)).toBe('desktop');
  expect(getCaseStudyMotionBreakpoint(false, true)).toBe('tablet');
  expect(getCaseStudyMotionBreakpoint(false, false)).toBe('mobile');
});
