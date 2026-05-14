import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useLenis(): RefObject<Lenis | null> {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    ref.current = lenis;

    // Keep ScrollTrigger in sync with Lenis-driven scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for consistent timing
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ref.current = null;
    };
  }, []);

  return ref;
}
