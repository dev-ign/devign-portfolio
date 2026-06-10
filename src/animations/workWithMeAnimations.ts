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
  let isVisible = false;
  const revealVars = {
    ...revealDefaults,
    duration,
    delay: options.delay ?? 0,
    stagger,
  };

  gsap.set(targets, fromState);

  const reveal = () => {
    isVisible = true;
    gsap.to(targets, revealVars);
  };

  const exit = (direction: 1 | -1) => {
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

  const enterTrigger = ScrollTrigger.create({
    trigger,
    start: options.start ?? 'top 64%',
    invalidateOnRefresh: true,
    onEnter: reveal,
    onEnterBack: reveal,
    onLeaveBack: () => exit(-1),
  });

  const exitTrigger = ScrollTrigger.create({
    start: 0,
    end: 'max',
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const rect = trigger.getBoundingClientRect();
      const shouldExitDown =
        exitWhen === 'bottom'
          ? rect.bottom <= 20
          : rect.top <= 20;

      if (self.direction === 1 && shouldExitDown) {
        exit(1);
      }

      if (self.direction === -1 && !isVisible && rect.top > 0 && rect.top < window.innerHeight * 0.7) {
        reveal();
      }
    },
    onLeave: () => {
      const rect = trigger.getBoundingClientRect();
      const shouldExitDown =
        exitWhen === 'bottom'
          ? rect.bottom <= 20
          : rect.top <= 20;

      if (shouldExitDown) exit(1);
    },
    onLeaveBack: () => {
      if (isVisible) exit(-1);
    },
  });

  return [enterTrigger, exitTrigger];
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
