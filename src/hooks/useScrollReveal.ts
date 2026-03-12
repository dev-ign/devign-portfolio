import { useCallback, useRef } from 'react';

/**
 * Returns a callback ref that adds `.reveal-on-scroll` to the attached element
 * and uses IntersectionObserver to add `.revealed` when it enters the viewport.
 * Using a callback ref (not useRef) ensures it fires correctly even when the
 * component conditionally renders null and later mounts its DOM node.
 */
function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (el: T | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el) return;

      el.classList.add('reveal-on-scroll');

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('revealed');
            observer.disconnect();
            observerRef.current = null;
          }
        },
        { threshold }
      );

      observer.observe(el);
      observerRef.current = observer;
    },
    [threshold]
  );

  return ref;
}

export default useScrollReveal;
