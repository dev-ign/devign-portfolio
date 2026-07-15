import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';

const OUTCOMES = [
  { label: 'More trust', description: 'A sharper first impression for new customers.' },
  { label: 'More leads', description: 'Clearer paths to contact, book, buy, or inquire.' },
  { label: 'Less friction', description: 'Fast, mobile-first experiences that feel easy to use.' },
];

const BusinessOutcomes: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const targets = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.business-reveal')
      );
      initScrollEnterExit(targets, {
        trigger: targets[0] ?? sectionRef.current,
        stagger: 0.1,
        duration: 1.24,
        y: 46,
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="py-[clamp(80px,10vw,120px)] px-[clamp(16px,6vw,88px)] bg-gateway"
    >
      <p
        className="business-reveal font-disp font-bold text-[clamp(22px,3.5vw,38px)] text-white/55 tracking-[-0.025em] leading-[1.25]"
        style={{ margin: '0 0 clamp(48px, 7vw, 80px)' }}
      >
        Built for businesses that need more than "just a website."
      </p>

      <div>
        {OUTCOMES.map((o) => (
          <div
            key={o.label}
            className="business-reveal border-t border-white/7 py-[clamp(20px,2.8vw,28px)] grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6 items-center"
          >
            <span className="font-disp font-bold text-[clamp(18px,2.2vw,24px)] text-white tracking-[-0.02em]">
              {o.label}
            </span>
            <span className="font-body font-light text-[clamp(14px,1.5vw,16px)] text-white/40 leading-[1.6]">
              {o.description}
            </span>
          </div>
        ))}
        <div className="business-reveal border-t border-white/7" />
      </div>
    </section>
  );
};

export default BusinessOutcomes;
