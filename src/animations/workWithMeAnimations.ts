import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const revealDefaults = {
  autoAlpha: 1,
  y: 0,
  duration: 1.18,
  ease: 'power3.out',
  overwrite: 'auto' as const,
};

const hiddenState = {
  autoAlpha: 0,
  y: 44,
  willChange: 'transform, opacity',
};

export function initScrollEnterExit(
  elements: HTMLElement[],
  options: {
    trigger?: HTMLElement;
    stagger?: number;
    start?: string;
    end?: string | (() => string);
    duration?: number;
    delay?: number;
    y?: number;
    exitY?: number;
    exitDuration?: number;
    exitWhen?: 'top' | 'bottom';
  } = {}
) {
  const targets = elements.filter(Boolean);
  if (!targets.length) return undefined;
  const trigger = options.trigger ?? targets[0];
  const y = options.y ?? hiddenState.y;
  const exitY = options.exitY ?? Math.max(20, y * 0.72);
  const fromState = { ...hiddenState, y };
  const duration = options.duration ?? revealDefaults.duration;
  const stagger = options.stagger ?? 0.08;
  const exitWhen = options.exitWhen ?? 'top';
  const isTouchLayout =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 639px), (pointer: coarse)').matches;
  let isVisible = false;
  const revealVars = {
    ...revealDefaults,
    duration,
    delay: options.delay ?? 0,
    stagger,
    onComplete: () => gsap.set(targets, { clearProps: 'willChange' }),
  };

  gsap.set(targets, fromState);

  const reveal = () => {
    if (isVisible) return;
    isVisible = true;
    gsap.to(targets, revealVars);
  };

  const exit = (direction: 1 | -1) => {
    if (!isVisible) return;
    isVisible = false;
    gsap.to(targets, {
      autoAlpha: 0,
      y: direction === 1 ? -exitY : y,
      duration: options.exitDuration ?? Math.min(duration * 0.72, 0.92),
      ease: 'power2.inOut',
      stagger: stagger ? Math.min(stagger, 0.05) : 0,
      overwrite: 'auto',
    });
  };

  const revealIfVisible = () => {
    if (isVisible) return;
    const rect = trigger.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight * 0.9) reveal();
  };

  // On touch layouts, each group gets one one-shot trigger. Elements never get
  // hidden again after entering, so a fast swipe cannot skip a narrow reveal
  // window and leave an entire section permanently transparent.
  if (isTouchLayout) {
    const mobileTrigger = ScrollTrigger.create({
      trigger,
      start: 'top 88%',
      once: true,
      invalidateOnRefresh: true,
      onEnter: reveal,
      onRefresh: revealIfVisible,
    });

    return [mobileTrigger];
  }

  // Desktop keeps the reversible entrance/exit behavior with one trigger per
  // group. This avoids the previous global `0 → max` trigger and forced layout
  // read on every scroll tick for every animated element.
  const desktopTrigger = ScrollTrigger.create({
    trigger,
    start: options.start ?? 'top 64%',
    end: exitWhen === 'bottom' ? 'bottom top' : 'top top',
    invalidateOnRefresh: true,
    onEnter: reveal,
    onEnterBack: reveal,
    onLeave: () => exit(1),
    onLeaveBack: () => exit(-1),
    onRefresh: revealIfVisible,
  });

  return [desktopTrigger];
}

// Hero: headline lines + sub + CTA stagger up on load
export function runHeroReveal(elements: HTMLElement[]) {
  gsap.from(elements, {
    autoAlpha: 0,
    y: 56,
    stagger: 0.12,
    duration: 0.9,
    ease: 'power3.out',
  });
}

// Services: cards fade + rise as section scrolls into view
export function runServicesIntroReveal(intro: HTMLElement) {
  const introChildren = Array.from(intro.children);
  initScrollEnterExit(
    (introChildren.length ? introChildren : [intro]) as HTMLElement[],
    {
      trigger: intro.parentElement ?? intro,
      stagger: 0.11,
      start: 'top 92%',
    }
  );
}

export function runServicesStagger(cards: HTMLElement[]) {
  if (!cards.length) return;
  initScrollEnterExit(cards, {
    trigger: cards[0].parentElement!,
    stagger: 0.07,
    start: 'top 90%',
  });
}

// Projects: premium grid cards reveal in a stagger as the section enters.
export function runProjectsGridReveal(header: HTMLElement, cards: HTMLElement[]) {
  const headerChildren = Array.from(header.children);

  initScrollEnterExit(headerChildren as HTMLElement[], {
    trigger: header.parentElement ?? header,
    stagger: 0.1,
    start: 'top 92%',
  });

  initScrollEnterExit(cards, {
    trigger: cards[0]?.parentElement ?? header,
    stagger: 0.08,
    start: 'top 90%',
  });
}

// Why Work With Us: each ruled row scrubs from near-invisible to full opacity
export function initWhyScrub(statements: HTMLElement[]) {
  statements.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0.08 },
      {
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1.2,
        },
      }
    );
  });
}

// Generic stagger fade-up used for pricing tiers + business outcome rows
export function runFadeStagger(elements: HTMLElement[], triggerEl: HTMLElement) {
  gsap.from(elements, {
    autoAlpha: 0,
    y: 20,
    stagger: 0.09,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top 80%',
      once: true,
    },
  });
}

// Process: content fades in as the section enters.
// Returns the matchMedia instance — call mm.revert() in useGSAPContext cleanup.
export function initProcessPin(section: HTMLElement, contentEls: HTMLElement[]) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 640px)', () => {
    initScrollEnterExit(contentEls, {
      trigger: section,
      stagger: 0.12,
      start: 'top 90%',
    });

    return () => {};
  });

  return mm;
}
