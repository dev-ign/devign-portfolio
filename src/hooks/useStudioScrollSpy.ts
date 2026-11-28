import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export const STUDIO_NAV_ITEMS = [
  { label: 'Services', target: 'services' },
  { label: 'Process', target: 'process' },
  { label: 'Projects', target: 'projects' },
  { label: 'FAQ', target: 'faq' },
] as const;

export type StudioSection = typeof STUDIO_NAV_ITEMS[number]['target'];

type SectionBounds = { id: StudioSection; top: number; bottom: number };

export function selectStudioSection(sections: readonly SectionBounds[], readingLine: number): StudioSection | null {
  return sections.find(({ top, bottom }) => top <= readingLine && bottom > readingLine)?.id ?? null;
}

const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

export function useStudioScrollSpy(headerRef: RefObject<HTMLElement | null>) {
  const [activeSection, setActiveSection] = useState<StudioSection | null>(null);
  const pendingTarget = useRef<StudioSection | null>(null);
  const settleTimer = useRef(0);
  const scheduleUpdate = useRef<(() => void) | undefined>(undefined);

  const clearPending = useCallback(() => {
    pendingTarget.current = null;
    window.clearTimeout(settleTimer.current);
  }, []);

  const noteNavigation = useCallback((id: string) => {
    clearPending();
    const target = STUDIO_NAV_ITEMS.find(item => item.target === id)?.target;
    if (target) {
      pendingTarget.current = target;
      setActiveSection(target);
      // Recover even if another scroll owner prevents the requested anchor from settling.
      settleTimer.current = window.setTimeout(() => {
        clearPending();
        scheduleUpdate.current?.();
      }, 1800);
    }
    scheduleUpdate.current?.();
  }, [clearPending]);

  useEffect(() => {
    const sections = STUDIO_NAV_ITEMS.flatMap(({ target }) => {
      const element = document.getElementById(target);
      return element ? [{ id: target, element }] : [];
    });
    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const navbarBottom = headerRef.current?.getBoundingClientRect().bottom ?? 88;
        const readingLine = Math.min(window.innerHeight - 1, Math.max(navbarBottom + 12, window.innerHeight * 0.3));
        const measuredSection = selectStudioSection(sections.flatMap(({ id, element }) => {
          if (window.getComputedStyle(element).visibility === 'hidden') return [];
          const { top, bottom } = element.getBoundingClientRect();
          return [{ id, top, bottom }];
        }), readingLine);

        if (pendingTarget.current === measuredSection && measuredSection) clearPending();
        setActiveSection(pendingTarget.current ?? measuredSection);
      });
    };
    scheduleUpdate.current = update;

    const interrupt = () => {
      clearPending();
      update();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) interrupt();
    };
    const passive = { passive: true };
    window.addEventListener('scroll', update, passive);
    window.addEventListener('resize', update);
    window.addEventListener('wheel', interrupt, passive);
    window.addEventListener('touchstart', interrupt, passive);
    window.addEventListener('pointerdown', interrupt, passive);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', interrupt);
    window.addEventListener('popstate', interrupt);

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    const content = document.getElementById('main-content');
    if (content) resizeObserver?.observe(content);
    if (headerRef.current) resizeObserver?.observe(headerRef.current);
    sections.forEach(({ element }) => resizeObserver?.observe(element));
    update();

    return () => {
      scheduleUpdate.current = undefined;
      window.cancelAnimationFrame(frame);
      clearPending();
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('pointerdown', interrupt);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', interrupt);
      window.removeEventListener('popstate', interrupt);
    };
  }, [clearPending, headerRef]);

  return { activeSection, noteNavigation };
}
