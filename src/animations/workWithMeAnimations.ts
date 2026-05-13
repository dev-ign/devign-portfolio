import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
export function runServicesStagger(cards: HTMLElement[]) {
  if (!cards.length) return;
  gsap.from(cards, {
    autoAlpha: 0,
    y: 28,
    stagger: 0.07,
    duration: 0.65,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: cards[0].parentElement!,
      start: 'top 82%',
      once: true,
    },
  });
}

// Why Work With Me: each ruled row scrubs from near-invisible to full opacity
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

// Process pin (desktop ≥640px): section stays fixed, steps reveal sequentially.
// Returns the matchMedia instance — call mm.revert() in useGSAPContext cleanup.
export function initProcessPin(section: HTMLElement, stepEls: HTMLElement[]) {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 640px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${stepEls.length * 420}`,
        pin: true,
        scrub: 0.6,
      },
    });

    stepEls.forEach((step, i) => {
      if (i === 0) return;
      const offset = i * 0.25;
      tl.from(step, { autoAlpha: 0, y: 32, duration: 0.25 }, offset);
      tl.to(stepEls[i - 1], { autoAlpha: 0.25, duration: 0.2 }, offset);
    });

    return () => {};
  });

  return mm;
}
