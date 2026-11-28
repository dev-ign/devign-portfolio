import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';

export function useMirembeMotion(rootRef: RefObject<HTMLDivElement | null>) {
  const revealed = useRef(new WeakSet<Element>());

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.location.hash || !window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches) return;

    // CaseStudyDetailPage aligns the hero in the same layout pass.
    const clearEntry = () => {
      delete root.dataset.mirembeHeroEntry;
      root.removeEventListener('animationend', onEntryEnd);
      root.removeEventListener('animationcancel', onEntryEnd);
    };
    const onEntryEnd = (event: AnimationEvent) => {
      if (event.animationName === 'mirembe-hero-in' && (event.target as Element).matches('.mirembe-hero-mobile')) clearEntry();
    };
    root.addEventListener('animationend', onEntryEnd);
    root.addEventListener('animationcancel', onEntryEnd);
    root.dataset.mirembeHeroEntry = 'true';
    return clearEntry;
  }, [rootRef]);

  useGSAPContext(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add({
      reduced: '(prefers-reduced-motion: reduce)',
      animated: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const reduced = Boolean(context.conditions?.reduced);
      root.dataset.motionReduced = String(reduced);
      if (reduced) return;

      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver((entries, instance) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          instance.unobserve(entry.target);
          revealed.current.add(entry.target);
          context.add(() => {
            // These sections are readable before the observer runs.
            gsap.from(entry.target, { y: 6, duration: 0.34, ease: 'power2.out', clearProps: 'transform' });
          });
        }
      }, { rootMargin: '0px 0px -5% 0px' });

      root.querySelectorAll('[data-mirembe-reveal]').forEach((element) => {
        if (!revealed.current.has(element)) observer.observe(element);
      });
      return () => observer.disconnect();
    }, root);

    return () => {
      media.revert();
      delete root.dataset.motionReduced;
    };
  }, { scope: rootRef });
}
