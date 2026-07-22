import type React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAPContext } from './useGSAPContext';
import {
  CASE_STUDY_MOTION,
  CASE_STUDY_MOTION_TRIGGER_PREFIX,
  getCaseStudyMotionBreakpoint,
  getCaseStudyMotionPresets,
  type CaseStudyRevealPreset,
} from '../utils/caseStudyMotion';

// One motion source keeps quiet editorial reveals distinct from product visuals.

gsap.registerPlugin(ScrollTrigger);

const clearMotionStyles = (targets: gsap.TweenTarget) => {
  gsap.set(targets, { clearProps: 'opacity,visibility,transform,willChange' });
};

export const useCaseStudyScrollReveal = (rootRef: React.RefObject<HTMLElement | null>) => {
  useGSAPContext(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;

      const media = gsap.matchMedia();
      let refreshTimer = 0;
      let isActive = true;

      const setMotionDiagnostics = (breakpoint: string, reduced: boolean) => {
        root.dataset.motionBreakpoint = breakpoint;
        root.dataset.motionReduced = String(reduced);
        root.dataset.motionTriggerCount = String(
          ScrollTrigger.getAll().filter(({ vars }) =>
            String(vars.id ?? '').startsWith(CASE_STUDY_MOTION_TRIGGER_PREFIX)
          ).length
        );
      };

      media.add(
        {
          isDesktop: '(min-width: 1024px)',
          isTablet: '(min-width: 641px) and (max-width: 1023px)',
          isMobile: '(max-width: 640px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop = false, isTablet = false, reduceMotion = false } =
            context.conditions ?? {};
          const breakpoint = getCaseStudyMotionBreakpoint(isDesktop, isTablet);
          const presets = getCaseStudyMotionPresets(breakpoint);
          let triggerIndex = 0;
          const triggerId = (type: string) =>
            `${CASE_STUDY_MOTION_TRIGGER_PREFIX}-${breakpoint}-${type}-${triggerIndex++}`;

          const allMotionTargets = root.querySelectorAll<HTMLElement>(
            '[data-reveal], [data-hero-copy], [data-hero-metadata], [data-reveal-hero-visual], [data-visual-direction]'
          );

          if (reduceMotion) {
            clearMotionStyles(allMotionTargets);
            setMotionDiagnostics(breakpoint, true);
            return undefined;
          }

          const hero = root.querySelector<HTMLElement>('[data-reveal="hero"]');
          const heroCopy = hero?.querySelector<HTMLElement>('[data-hero-copy]');
          const heroMetadata = hero?.querySelector<HTMLElement>('[data-hero-metadata]');
          const heroVisual = hero?.querySelector<HTMLElement>('[data-reveal-hero-visual]');
          const shouldAnimateHero =
            hero && window.scrollY < 120 && window.location.hash.length === 0;

          if (hero && shouldAnimateHero) {
            const heroTimeline = gsap.timeline();

            if (heroCopy) {
              heroTimeline.fromTo(
                heroCopy,
                {
                  opacity: CASE_STUDY_MOTION.hero.copy.initialOpacity,
                  y: CASE_STUDY_MOTION.hero.copy.distance,
                  willChange: 'transform,opacity',
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: CASE_STUDY_MOTION.hero.copy.duration,
                  ease: CASE_STUDY_MOTION.ease.editorial,
                  clearProps: 'opacity,transform,willChange',
                },
                0
              );
            }

            if (heroMetadata) {
              heroTimeline.fromTo(
                heroMetadata,
                {
                  opacity: CASE_STUDY_MOTION.hero.metadata.initialOpacity,
                  willChange: 'opacity',
                },
                {
                  opacity: 1,
                  duration: CASE_STUDY_MOTION.hero.metadata.duration,
                  ease: CASE_STUDY_MOTION.ease.editorial,
                  clearProps: 'opacity,willChange',
                },
                CASE_STUDY_MOTION.hero.metadata.start
              );
            }

            if (heroVisual) {
              heroTimeline.fromTo(
                heroVisual,
                {
                  y: CASE_STUDY_MOTION.hero.visual.distance,
                  scale: CASE_STUDY_MOTION.hero.visual.scale,
                  willChange: 'transform',
                },
                {
                  y: 0,
                  scale: 1,
                  duration: CASE_STUDY_MOTION.hero.visual.duration,
                  ease: CASE_STUDY_MOTION.ease.visual,
                  clearProps: 'transform,willChange',
                },
                CASE_STUDY_MOTION.hero.visual.start
              );
            }
          } else if (hero) {
            clearMotionStyles([heroCopy, heroMetadata, heroVisual].filter(Boolean));
          }

          const createEditorialReveal = (
            target: HTMLElement,
            preset: CaseStudyRevealPreset,
            type: 'intro' | 'card-group' | 'text'
          ) => {
            gsap.fromTo(
              target,
              {
                opacity: preset.initialOpacity,
                y: preset.distance,
                willChange: 'transform,opacity',
              },
              {
                opacity: 1,
                y: 0,
                duration: preset.duration,
                ease: CASE_STUDY_MOTION.ease.editorial,
                clearProps: 'opacity,transform,willChange',
                scrollTrigger: {
                  id: triggerId(type),
                  trigger: target,
                  start: preset.start,
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          };

          root.querySelectorAll<HTMLElement>('[data-reveal="intro"]').forEach((intro) => {
            createEditorialReveal(intro, presets.intro, 'intro');
          });

          root.querySelectorAll<HTMLElement>('[data-reveal="card-group"]').forEach((group) => {
            createEditorialReveal(group, presets.cardGroup, 'card-group');
          });

          root.querySelectorAll<HTMLElement>('[data-reveal="text"]').forEach((text) => {
            createEditorialReveal(text, presets.text, 'text');
          });

          root.querySelectorAll<HTMLElement>('[data-reveal="visual"]').forEach((visual) => {
            const visualVariant = visual.dataset.visualVariant;
            const visualGroup = visual.dataset.visualGroup;

            if (visualVariant === 'anatomy') {
              const labels = visual.querySelectorAll<HTMLElement>(
                '.donor-directory-anatomy-annotations > li'
              );
              const anatomyTimeline = gsap.timeline({
                scrollTrigger: {
                  id: triggerId('visual-anatomy'),
                  trigger: visual,
                  start: presets.visual.start,
                  once: true,
                  invalidateOnRefresh: true,
                },
              });

              anatomyTimeline.fromTo(
                visual,
                {
                  opacity: presets.visual.initialOpacity,
                  y: presets.visual.distance,
                  scale: CASE_STUDY_MOTION.visualScale,
                  willChange: 'transform,opacity',
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: presets.visual.duration,
                  ease: CASE_STUDY_MOTION.ease.visual,
                  clearProps: 'opacity,transform,willChange',
                }
              );

              if (labels.length) {
                anatomyTimeline.fromTo(
                  labels,
                  { opacity: 0, y: breakpoint === 'mobile' ? 4 : 8 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: CASE_STUDY_MOTION.annotationStagger,
                    ease: CASE_STUDY_MOTION.ease.visual,
                    clearProps: 'opacity,transform',
                  },
                  '>-=0.36'
                );
              }
              return;
            }

            if (visualGroup === 'drawer-details') {
              const details = visual.querySelectorAll<HTMLElement>('[data-visual-direction]');
              gsap.fromTo(
                details,
                {
                  opacity: presets.visual.initialOpacity,
                  x: (index, element) => {
                    if (breakpoint === 'mobile') return 0;
                    return element.dataset.visualDirection === 'left'
                      ? -CASE_STUDY_MOTION.directionalDistance
                      : CASE_STUDY_MOTION.directionalDistance;
                  },
                  y: breakpoint === 'mobile' ? presets.visual.distance : 0,
                  willChange: 'transform,opacity',
                },
                {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  duration: presets.visual.duration,
                  ease: CASE_STUDY_MOTION.ease.visual,
                  clearProps: 'opacity,transform,willChange',
                  scrollTrigger: {
                    id: triggerId('visual-details'),
                    trigger: visual,
                    start: presets.visual.start,
                    once: true,
                    invalidateOnRefresh: true,
                  },
                }
              );
              return;
            }

            gsap.fromTo(
              visual,
              {
                opacity: presets.visual.initialOpacity,
                y: presets.visual.distance,
                scale: CASE_STUDY_MOTION.visualScale,
                willChange: 'transform,opacity',
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: presets.visual.duration,
                ease: CASE_STUDY_MOTION.ease.visual,
                clearProps: 'opacity,transform,willChange',
                scrollTrigger: {
                  id: triggerId('visual'),
                  trigger: visual,
                  start: presets.visual.start,
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          });

          window.requestAnimationFrame(() => setMotionDiagnostics(breakpoint, false));
          return undefined;
        },
        root
      );

      const scheduleRefresh = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          if (isActive) ScrollTrigger.refresh();
        }, 140);
      };

      const lazyImages = Array.from(root.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));
      lazyImages.forEach((image) => {
        if (!image.complete) image.addEventListener('load', scheduleRefresh, { once: true });
      });

      document.fonts?.ready.then(() => {
        if (isActive) scheduleRefresh();
      });

      return () => {
        isActive = false;
        window.clearTimeout(refreshTimer);
        lazyImages.forEach((image) => image.removeEventListener('load', scheduleRefresh));
        media.revert();
        delete root.dataset.motionBreakpoint;
        delete root.dataset.motionReduced;
        delete root.dataset.motionTriggerCount;
      };
    },
    { scope: rootRef }
  );
};
