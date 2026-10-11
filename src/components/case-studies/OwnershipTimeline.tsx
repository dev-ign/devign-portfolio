import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { getCurrentTimelineStage, getTimelineFill } from '@/utils/ownershipTimeline';
import './OwnershipTimeline.css';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { number: '01', title: 'Manager', copy: 'Dana chooses the template and its recipients.', meta: 'Owns and shares' },
  { number: '02', title: 'Shared Library', copy: 'Recipients see Dana’s original with its owner and access state.', meta: 'Original stays read-only' },
  { number: '03', title: 'Fundraiser', copy: 'Maya duplicates it, edits her copy, and saves independent content.', meta: 'Copy is editable' },
] as const;

const OwnershipTimeline: React.FC = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAPContext(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return undefined;

    const markers = Array.from(list.querySelectorAll<HTMLElement>('.ownership-timeline-marker'));
    const items = Array.from(list.querySelectorAll<HTMLElement>('.ownership-timeline-stage'));
    let sharedCenter = 0.45;
    let fundraiserCenter = 0.85;
    let vertical = false;
    let progress = 0;
    let frame = 0;
    let disposed = false;
    let trigger: ReturnType<typeof ScrollTrigger.create> | null = null;

    const paint = (nextProgress: number) => {
      progress = Math.min(1, Math.max(0, nextProgress));
      const fillFraction = reducedMotion ? 1 : getTimelineFill(progress, sharedCenter, fundraiserCenter);
      fill.style.transform = vertical ? `scaleY(${fillFraction})` : `scaleX(${fillFraction})`;
      const current = reducedMotion ? 2 : getCurrentTimelineStage(progress);
      if (list.dataset.currentStage !== String(current)) list.dataset.currentStage = String(current);
      items.forEach((item, index) => {
        const state = reducedMotion ? 'complete' : index < current ? 'complete' : index === current ? 'current' : 'upcoming';
        if (item.dataset.state !== state) item.dataset.state = state;
      });
    };

    const measure = () => {
      if (markers.length !== 3) return;
      vertical = window.matchMedia('(max-width: 767px)').matches;
      const bounds = list.getBoundingClientRect();
      const centers = markers.map(marker => {
        const rect = marker.getBoundingClientRect();
        return vertical ? rect.top + rect.height / 2 - bounds.top : rect.left + rect.width / 2 - bounds.left;
      });
      const start = centers[0];
      const end = vertical ? bounds.height : bounds.width;
      const length = Math.max(1, end - start);
      const track = fill.parentElement as HTMLElement;
      track.style.left = `${vertical ? centers[0] : start}px`;
      track.style.top = `${vertical ? start : centers[0]}px`;
      track.style.width = vertical ? '2px' : `${length}px`;
      track.style.height = vertical ? `${length}px` : '2px';
      sharedCenter = (centers[1] - start) / length;
      fundraiserCenter = (centers[2] - start) / length;
      paint(progress);
    };

    const syncPulseContext = (self: ReturnType<typeof ScrollTrigger.create>) => {
      const inView = String(Boolean(self.isActive));
      if (list.dataset.inView !== inView) list.dataset.inView = inView;
    };

    measure();
    if (reducedMotion) {
      list.dataset.inView = 'false';
      paint(1);
    } else {
      trigger = ScrollTrigger.create({
        trigger: list,
        start: 'top 78%',
        end: 'bottom 45%',
        onUpdate: self => { paint(self.progress); syncPulseContext(self); },
        onToggle: syncPulseContext,
        onRefresh: self => { measure(); paint(self.progress); syncPulseContext(self); },
      });
      paint(trigger.progress);
      syncPulseContext(trigger);
    }

    const onLayoutChange = () => {
      if (disposed) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (disposed) return;
        measure();
        trigger?.refresh();
      });
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onLayoutChange);
    observer?.observe(list);
    window.addEventListener('resize', onLayoutChange);
    document.fonts?.ready.then(onLayoutChange);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', onLayoutChange);
      trigger?.kill();
    };
  }, { scope: listRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <ol
      ref={listRef}
      className="ownership-timeline mt-14 grid list-none p-0 md:grid-cols-3 md:gap-10"
      aria-label="Template ownership path"
      data-testid="ownership-timeline"
      data-current-stage={reducedMotion ? '2' : '0'}
      data-in-view="false"
      data-reduced-motion={String(reducedMotion)}
    >
      <li className="ownership-timeline-track" aria-hidden="true"><span ref={fillRef} className="ownership-timeline-fill" /></li>
      {stages.map((stage, index) => (
        <li key={stage.number} className="ownership-timeline-stage" data-state={reducedMotion ? 'complete' : index === 0 ? 'current' : 'upcoming'}>
          <span className="ownership-timeline-marker" aria-hidden="true" />
          <span className="font-mono text-[12px] text-[#D7B9FA]">{stage.number} / 03</span>
          <h3 className="m-0 mt-5 font-disp text-[clamp(27px,3vw,42px)] font-bold tracking-[-0.03em] text-white">{stage.title}</h3>
          <p className="m-0 mt-3 max-w-[340px] font-body text-[14px] leading-[1.65] text-white/70">{stage.copy}</p>
          <p className="m-0 mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#D7B9FA]">{stage.meta}</p>
        </li>
      ))}
    </ol>
  );
};

export default OwnershipTimeline;
