import React, { useCallback, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import {
  useHomeNavigationController,
  useHomeNavigationState,
} from '@/hooks/useHomeNavigationState';
import { serviceBranches } from '../config/serviceBranches';
import { branchVisualThemes } from '../config/branchVisualThemes';
import type { ServiceBranch } from '../types/servicePlanner.types';

interface ServiceChapterSequenceProps {
  onSelect: (branch: ServiceBranch) => void;
}

export const getChapterIndex = (progress: number) => Math.min(
  serviceBranches.length - 1,
  Math.max(0, Math.round(progress * (serviceBranches.length - 1))),
);

export const getChapterProgress = (index: number) => (
  Math.min(serviceBranches.length - 1, Math.max(0, index))
  / (serviceBranches.length - 1)
);

const chapterAtmospheres: Record<ServiceBranch['id'], string> = {
  websites: 'radial-gradient(circle at 76% 26%, rgba(218, 203, 255, 0.22), transparent 32%), radial-gradient(circle at 18% 82%, rgba(183, 124, 255, 0.12), transparent 42%), linear-gradient(128deg, #14131A 0%, #0C0C10 58%, #09090C 100%)',
  'web-applications': 'radial-gradient(circle at 77% 25%, rgba(102, 216, 255, 0.2), transparent 34%), radial-gradient(circle at 15% 78%, rgba(71, 109, 255, 0.12), transparent 40%), linear-gradient(128deg, #0D1218 0%, #0B0D12 58%, #08090C 100%)',
  'branding-marketing': 'radial-gradient(circle at 76% 25%, rgba(255, 156, 105, 0.2), transparent 34%), radial-gradient(circle at 17% 80%, rgba(190, 115, 85, 0.11), transparent 42%), linear-gradient(128deg, #17110F 0%, #100D0D 58%, #0B0A0B 100%)',
  'motion-video': 'radial-gradient(circle at 76% 25%, rgba(255, 110, 169, 0.25), transparent 34%), radial-gradient(circle at 18% 79%, rgba(109, 76, 255, 0.18), transparent 43%), linear-gradient(128deg, #160E18 0%, #0E0A12 58%, #09090C 100%)',
};

const chapterOfferings: Record<ServiceBranch['id'], string[]> = {
  websites: [
    'Landing Pages',
    'Business Websites',
    'E-Commerce',
    'Portfolio',
    'Membership',
    'Booking',
    'Editorial',
    'Campaign Sites',
  ],
  'web-applications': [
    'Dashboards',
    'Customer Portals',
    'Internal Tools',
    'SaaS Products',
    'Platforms',
    'Marketplaces',
    'Admin Systems',
    'Automation',
  ],
  'branding-marketing': [
    'Brand Identity',
    'Visual Systems',
    'Campaigns',
    'Social Content',
    'Digital Ads',
    'Email Design',
    'Creative Direction',
    'Marketing Assets',
  ],
  'motion-video': [
    'Brand Films',
    'Product Videos',
    'Social Content',
    'Motion Graphics',
    'Commercials',
    'Explainers',
    'Editing',
    'Campaign Video',
  ],
};

const BrowserPreview: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="service-chapter-browser">
    <div className="service-chapter-browser__bar">
      <span /><span /><span />
      <div className="service-chapter-browser__address" />
    </div>
    <div className="service-chapter-browser__page">
      <span className="service-chapter-browser__cursor" aria-hidden="true" />
      <div className="service-chapter-browser__nav"><span>STUDIO / 24</span><span>Work&nbsp;&nbsp;About&nbsp;&nbsp;Contact</span></div>
      <div className="service-chapter-browser__hero">
        <p>Digital presence, considered.</p>
        <div className="service-chapter-browser__headline">Built to make<br />the value clear.</div>
        <span className="service-chapter-browser__cta" style={{ backgroundColor: accent }}>Explore the approach</span>
      </div>
      <div className="service-chapter-browser__cards"><span /><span /><span /></div>
    </div>
  </div>
);

const ApplicationPreview: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="service-chapter-app">
    <aside>
      <span className="service-chapter-app__logo" style={{ backgroundColor: accent }} />
      {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
    </aside>
    <div className="service-chapter-app__workspace">
      <div className="service-chapter-app__topbar"><strong>Workspace</strong><span /><span /></div>
      <div className="service-chapter-app__metrics">
        {['Overview', 'Activity', 'Completion'].map((label, index) => (
          <div key={label}><small>{label}</small><strong>{index === 0 ? '2,480' : index === 1 ? '84%' : '312'}</strong></div>
        ))}
      </div>
      <div className="service-chapter-app__data">
        <div className="service-chapter-app__chart">
          {[42, 66, 54, 82, 71, 92, 78].map((height, index) => (
            <span key={index} style={{ height: `${height}%`, backgroundColor: index === 5 ? accent : undefined }} />
          ))}
        </div>
        <div className="service-chapter-app__activity">
          {Array.from({ length: 4 }, (_, index) => <span key={index}><i /><b /></span>)}
        </div>
      </div>
    </div>
  </div>
);

const BrandPreview: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="service-chapter-brand">
    <div className="service-chapter-brand__poster service-chapter-brand__poster--primary" style={{ backgroundColor: accent }}>
      <small>IDENTITY / 01</small><strong>Form<br />follows<br />feeling.</strong><span>DEVIGN / BRAND SYSTEM</span>
    </div>
    <div className="service-chapter-brand__poster service-chapter-brand__poster--type">
      <small>TYPOGRAPHY</small><strong>Aa</strong><span>Cabinet Grotesk<br />Regular / Bold</span>
    </div>
    <div className="service-chapter-brand__poster service-chapter-brand__poster--mark">
      <span className="service-chapter-brand__monogram">D</span><small>SYSTEM / 24</small>
    </div>
    <div className="service-chapter-brand__swatches">
      <span style={{ backgroundColor: accent }} /><span /><span /><span />
    </div>
  </div>
);

const MotionPreview: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="service-chapter-motion">
    <div className="service-chapter-motion__viewer">
      <div className="service-chapter-motion__orb" style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${accent} 24%, #6D4CFF 58%, transparent 72%)` }} />
      <div className="service-chapter-motion__title">Make the<br />story move.</div>
      <span className="service-chapter-motion__timecode">00:00:08:14</span>
    </div>
    <div className="service-chapter-motion__controls"><span>▶</span><div><i /></div><span>24 FPS</span></div>
    <div className="service-chapter-motion__timeline">
      <div className="service-chapter-motion__ticks" />
      <div className="service-chapter-motion__track">
        <span style={{ backgroundColor: `${accent}99` }} /><span /><span />
      </div>
      <div className="service-chapter-motion__track service-chapter-motion__track--audio">
        <span /><span />
      </div>
      <div className="service-chapter-motion__playhead" style={{ backgroundColor: accent }} />
    </div>
  </div>
);

const ServiceImmersivePreview: React.FC<{ branch: ServiceBranch }> = ({ branch }) => {
  switch (branch.id) {
    case 'websites':
      return <BrowserPreview accent={branch.preview.accent} />;
    case 'web-applications':
      return <ApplicationPreview accent={branch.preview.accent} />;
    case 'branding-marketing':
      return <BrandPreview accent={branch.preview.accent} />;
    case 'motion-video':
      return <MotionPreview accent={branch.preview.accent} />;
    default:
      return null;
  }
};

const ServiceChapterSequence: React.FC<ServiceChapterSequenceProps> = ({ onSelect }) => {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const navigationState = useHomeNavigationState();
  const { setServiceContext } = useHomeNavigationController();
  const activeService = navigationState.activeService ?? serviceBranches[0].id;
  const activeIndexRef = useRef(0);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const sequenceActiveRef = useRef(false);
  const gestureTimerRef = useRef<number | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const commitChapter = useCallback((index: number) => {
    const branch = serviceBranches[index];
    activeIndexRef.current = index;
    setServiceContext(branch.id, getChapterProgress(index));
  }, [setServiceContext]);

  useGSAPContext((_context, contextSafe) => {
    if (!rootRef.current) return;

    const panels = Array.from(rootRef.current.querySelectorAll<HTMLElement>('[data-service-panel]'));
    const backgrounds = Array.from(rootRef.current.querySelectorAll<HTMLElement>('[data-service-background]'));
    const markers = Array.from(rootRef.current.querySelectorAll<HTMLElement>('[data-service-chapter]'));
    const revealElements = panels.flatMap(panel => (
      Array.from(panel.querySelectorAll<HTMLElement>('[data-service-reveal]'))
    ));
    if (
      panels.length !== serviceBranches.length
      || backgrounds.length !== serviceBranches.length
      || markers.length !== serviceBranches.length
    ) return;

    gsap.set(panels, { autoAlpha: 0, xPercent: 0, yPercent: 0, scale: 1 });
    gsap.set(backgrounds, { autoAlpha: 0, scale: 1.025 });
    gsap.set(revealElements, { autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1 });
    gsap.set(panels[0], { autoAlpha: 1 });
    gsap.set(backgrounds[0], { autoAlpha: 1, scale: 1 });

    const setVisualChapter = (index: number) => {
      gsap.set(panels, { autoAlpha: 0, xPercent: 0, yPercent: 0, scale: 1 });
      gsap.set(backgrounds, { autoAlpha: 0, scale: 1.025 });
      gsap.set(revealElements, { autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1 });
      gsap.set(panels[index], { autoAlpha: 1 });
      gsap.set(backgrounds[index], { autoAlpha: 1, scale: 1 });
    };

    const runTransition = (nextIndex: number) => {
      const clampedIndex = Math.min(serviceBranches.length - 1, Math.max(0, nextIndex));
      const currentIndex = activeIndexRef.current;
      if (clampedIndex === currentIndex) return;

      const direction = clampedIndex > currentIndex ? 1 : -1;
      const outgoingPanel = panels[currentIndex];
      const incomingPanel = panels[clampedIndex];
      const outgoingBackground = backgrounds[currentIndex];
      const incomingBackground = backgrounds[clampedIndex];
      const outgoingCopy = Array.from(outgoingPanel.querySelectorAll<HTMLElement>('[data-service-reveal]:not([data-service-reveal="visual"])'));
      const incomingVisual = incomingPanel.querySelector<HTMLElement>('[data-service-reveal="visual"]');
      const incomingTitle = incomingPanel.querySelector<HTMLElement>('[data-service-reveal="title"]');
      const incomingSubtitle = incomingPanel.querySelector<HTMLElement>('[data-service-reveal="subtitle"]');
      const incomingHighlights = incomingPanel.querySelector<HTMLElement>('[data-service-reveal="highlights"]');
      const incomingCta = incomingPanel.querySelector<HTMLElement>('[data-service-reveal="cta"]');

      transitionTimelineRef.current?.kill();
      setVisualChapter(currentIndex);
      activeIndexRef.current = clampedIndex;
      commitChapter(clampedIndex);
      setIsTransitioning(true);

      const finish = () => {
        setVisualChapter(clampedIndex);
        setIsTransitioning(false);
      };

      if (reducedMotion) {
        finish();
        return;
      }

      gsap.set(incomingPanel, {
        autoAlpha: 1,
        xPercent: direction * 1.4,
        yPercent: direction * 0.8,
        scale: 0.994,
      });
      gsap.set(incomingBackground, { autoAlpha: 0, scale: 1.028 });
      if (incomingVisual) {
        gsap.set(incomingVisual, {
          autoAlpha: 0,
          xPercent: direction * 2.6,
          yPercent: direction * 1.1,
          scale: 0.984,
        });
      }
      gsap.set(
        [incomingTitle, incomingSubtitle, incomingHighlights, incomingCta].filter(Boolean),
        { autoAlpha: 0, y: direction * 14 },
      );

      transitionTimelineRef.current = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      })
        .addLabel('environment', 0)
        .addLabel('artwork', 0.08)
        .addLabel('copy', 0.16)
        .to(outgoingBackground, {
          autoAlpha: 0,
          scale: 1.04,
          duration: 0.58,
          ease: 'power2.inOut',
        }, 'environment')
        .to(incomingBackground, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.72,
          ease: 'power2.inOut',
        }, 'environment+=0.03')
        .to(outgoingPanel, {
          autoAlpha: 0,
          xPercent: direction * -1.8,
          yPercent: direction * -0.9,
          scale: 1.006,
          duration: 0.46,
          ease: 'power2.inOut',
        }, 'environment+=0.02')
        .to(outgoingCopy, {
          autoAlpha: 0,
          y: direction * -8,
          duration: 0.28,
          stagger: 0.025,
          ease: 'power2.in',
        }, 'environment')
        .to(incomingPanel, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          duration: 0.7,
        }, 'environment+=0.04');

      if (incomingVisual) {
        transitionTimelineRef.current.to(incomingVisual, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          duration: 0.62,
        }, 'artwork');
      }

      [
        { element: incomingTitle, at: 'copy', duration: 0.5 },
        { element: incomingSubtitle, at: 'copy+=0.09', duration: 0.46 },
        { element: incomingHighlights, at: 'copy+=0.18', duration: 0.44 },
        { element: incomingCta, at: 'copy+=0.28', duration: 0.42 },
      ].forEach(({ element, at, duration }) => {
        if (!element) return;
        transitionTimelineRef.current?.to(element, {
          autoAlpha: 1,
          y: 0,
          duration,
        }, at);
      });
    };

    const transitionTo = contextSafe ? contextSafe(runTransition) : runTransition;
    let bypassGuidedProgress = false;

    const onNavigationIntent = (event: Event) => {
      const target = (event as CustomEvent<{ target?: string }>).detail?.target ?? '';
      bypassGuidedProgress = !target.startsWith('service-');
    };

    const isGuidedRegionActive = () => {
      if (sequenceActiveRef.current) return true;
      const bounds = rootRef.current?.getBoundingClientRect();
      return Boolean(bounds && bounds.top <= 2 && bounds.bottom >= window.innerHeight - 2);
    };

    const acknowledgeGesture = (deltaY: number) => {
      if (reducedMotion || window.innerWidth < 1024 || !isGuidedRegionActive()) return;
      const activePanel = panels[activeIndexRef.current];
      const preview = activePanel.querySelector<HTMLElement>('.service-chapter-preview');
      const copy = activePanel.querySelector<HTMLElement>('.service-chapter-copy');
      const intent = Math.max(-1, Math.min(1, deltaY / 160));
      if (!preview || !copy) return;

      gsap.to(preview, {
        yPercent: intent * -0.7,
        scale: 1 + Math.abs(intent) * 0.002,
        duration: 0.14,
        ease: 'power1.out',
        overwrite: 'auto',
      });
      gsap.to(copy, {
        yPercent: intent * -0.18,
        duration: 0.14,
        ease: 'power1.out',
        overwrite: 'auto',
      });

      window.clearTimeout(gestureTimerRef.current);
      gestureTimerRef.current = window.setTimeout(() => {
        gsap.to(preview, { yPercent: 0, scale: 1, duration: 0.44, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(copy, { yPercent: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      }, 72);
    };

    const onWheel = contextSafe
      ? contextSafe((event: WheelEvent) => acknowledgeGesture(event.deltaY))
      : (event: WheelEvent) => acknowledgeGesture(event.deltaY);

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('home:navigation-intent', onNavigationIntent);

    const trigger = ScrollTrigger.create({
      id: 'home-service-chapters-guided',
      trigger: rootRef.current,
      start: 'top 1px',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      ...(reducedMotion ? {} : {
        snap: {
          snapTo: (value: number) => {
            const snapped = Math.round(value * (serviceBranches.length - 1))
              / (serviceBranches.length - 1);
            return Math.min(0.998, Math.max(0.002, snapped));
          },
          duration: { min: 0.26, max: 0.56 },
          delay: 0.04,
          ease: 'power2.out',
        },
      }),
      onUpdate: self => {
        if (bypassGuidedProgress) return;
        const desiredIndex = getChapterIndex(self.progress);
        if (desiredIndex !== activeIndexRef.current) transitionTo(desiredIndex);
      },
      onEnter: self => {
        sequenceActiveRef.current = true;
        const desiredIndex = getChapterIndex(self.progress);
        if (navigationState.activeService === undefined) {
          setVisualChapter(desiredIndex);
          commitChapter(desiredIndex);
        } else if (desiredIndex !== activeIndexRef.current) {
          transitionTo(desiredIndex);
        }
      },
      onEnterBack: self => {
        sequenceActiveRef.current = true;
        const desiredIndex = getChapterIndex(self.progress);
        if (desiredIndex !== activeIndexRef.current) transitionTo(desiredIndex);
      },
      onLeave: () => {
        sequenceActiveRef.current = false;
        bypassGuidedProgress = false;
      },
      onLeaveBack: () => {
        if (activeIndexRef.current === 0) {
          sequenceActiveRef.current = false;
          setServiceContext(undefined, 0);
        }
      },
      onRefresh: self => {
        sequenceActiveRef.current = self.isActive;
        if (!self.isActive && self.progress === 0) {
          setVisualChapter(0);
          activeIndexRef.current = 0;
          setServiceContext(undefined, 0);
        }
      },
    });

    return () => {
      trigger.kill();
      transitionTimelineRef.current?.kill();
      window.clearTimeout(gestureTimerRef.current);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('home:navigation-intent', onNavigationIntent);
      sequenceActiveRef.current = false;
    };
  }, {
    scope: rootRef,
    dependencies: [commitChapter, reducedMotion],
    revertOnUpdate: true,
  });

  return (
    <section
      ref={rootRef}
      className="service-chapter-sequence relative z-[1] mt-[clamp(36px,6vw,72px)]"
      aria-label="Service chapters"
      data-active-service={activeService}
      data-transitioning={isTransitioning ? 'true' : 'false'}
    >
      <div
        className="service-chapter-stage sticky top-0 h-svh overflow-hidden bg-[#0C0C0E]"
        aria-busy={isTransitioning}
      >
        {serviceBranches.map(branch => (
          <div
            key={branch.id}
            data-service-background={branch.id}
            aria-hidden="true"
            className="service-chapter-background absolute inset-0 will-change-[transform,opacity]"
            style={{ background: chapterAtmospheres[branch.id] }}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-36 bg-gradient-to-b from-[#0C0C0E] via-[#0C0C0E]/68 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#0C0C0E] to-transparent" aria-hidden="true" />

        <p className="sr-only" aria-live="polite">
          Current service: {serviceBranches.find(branch => branch.id === activeService)?.shortTitle}
        </p>

        {serviceBranches.map(branch => {
          const isActive = branch.id === activeService;
          const theme = branchVisualThemes[branch.id];
          return (
            <div
              key={branch.id}
              data-service-panel={branch.id}
              aria-hidden={!isActive}
              aria-labelledby={`service-chapter-title-${branch.id}`}
              className={`service-chapter-panel absolute inset-0 z-[3] will-change-[transform,opacity] ${isActive ? '' : 'pointer-events-none'}`}
            >
              <div className="service-chapter-copy">
                <h3
                  id={`service-chapter-title-${branch.id}`}
                  data-service-reveal="title"
                  className="service-chapter-title home-display m-0 text-white/96"
                >
                  {branch.shortTitle}
                </h3>
                <p data-service-reveal="subtitle" className="service-chapter-subtitle home-display m-0 text-white/72">
                  {branch.title}
                </p>
                <ul data-service-reveal="highlights" className="service-chapter-highlights mt-7 grid max-w-[620px] grid-cols-2 gap-x-6 gap-y-2.5 p-0">
                  {chapterOfferings[branch.id].map(offering => (
                    <li key={offering} className="font-body text-white/58">
                      {offering}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-service-reveal="cta"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onSelect(branch)}
                  className="mt-8 inline-flex min-h-11 w-fit cursor-pointer items-center gap-3 rounded-full border border-white/12 bg-white/6 px-5 py-3 font-body text-[13px] font-medium text-white/78 outline-none transition-[background,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transform-none"
                >
                  {theme.ctaLabel}
                  <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4" />
                </button>
              </div>

              <div data-service-reveal="visual" className="service-chapter-preview" aria-hidden="true">
                <div className="service-chapter-preview__glow" style={{ backgroundColor: theme.glow }} />
                <ServiceImmersivePreview branch={branch} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-0 mt-[-100svh]" aria-hidden="true">
        {serviceBranches.map(branch => (
          <div
            key={branch.id}
            id={`service-${branch.id}`}
            data-service-chapter={branch.id}
            data-testid="service-chapter-marker"
            className="h-svh"
          />
        ))}
      </div>
    </section>
  );
};

export default ServiceChapterSequence;
