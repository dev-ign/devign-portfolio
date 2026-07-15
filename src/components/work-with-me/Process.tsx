import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';
import { useIsMobile } from '@/hooks/useMediaQuery';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    body: 'We align on goals, audience, and what success looks like before a single pixel is designed.',
  },
  {
    number: '02',
    title: 'Design',
    body: 'High-fidelity mockups built to match your brand — with room for two rounds of revisions.',
  },
  {
    number: '03',
    title: 'Build',
    body: 'Production-grade code. Responsive, fast, accessible, and optimized from the start.',
  },
  {
    number: '04',
    title: 'Launch',
    body: 'We deploy together, test live, and I stay reachable for 30 days post-launch.',
  },
];

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const intro = sectionRef.current.querySelector<HTMLElement>('.process-intro');
      const grid = sectionRef.current.querySelector<HTMLElement>('.process-grid');
      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.process-step')
      );

      if (intro) {
        initScrollEnterExit(Array.from(intro.children) as HTMLElement[], {
          trigger: intro,
          stagger: 0.1,
          duration: 1.12,
          y: 42,
        });
      }

      if (grid) {
        initScrollEnterExit(cards, {
          trigger: grid,
          stagger: 0.09,
          duration: 1.08,
          y: 40,
        });
      }
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-[clamp(80px,10vw,120px)] px-[clamp(16px,6vw,88px)] bg-gateway"
      style={{ overflow: isMobile ? undefined : 'hidden' }}
    >
      <div className="process-intro mb-16">
        <div className="process-eyebrow font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3 will-change-[transform,opacity]">
          How It Works
        </div>
        <h2 className="process-title text-[clamp(30px,5vw,52px)] text-white/88 tracking-[-0.03em] leading-[1.1] m-0 will-change-[transform,opacity]">
          A clear process,<br />no surprises.
        </h2>
      </div>

      <div
        className="process-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '0' : 'clamp(24px, 3vw, 40px)',
        }}
      >
        {STEPS.map((step, i) =>
          isMobile ? (
            <div
              key={step.number}
              className="process-step border-t border-white/7 py-[clamp(24px,4vw,36px)] will-change-[transform,opacity]"
            >
              <StepContent step={step} />
            </div>
          ) : (
            <div
              key={step.number}
              className="process-step border-t-2 border-white/8 pt-7 will-change-[transform,opacity]"
            >
              <StepContent step={step} />
            </div>
          )
        )}
        {isMobile && <div className="border-t border-white/7" />}
      </div>
    </section>
  );
};

const StepContent: React.FC<{ step: (typeof STEPS)[number] }> = ({ step }) => (
  <>
    <div className="font-mono text-[11px] tracking-[0.1em] text-black/30 mb-5">
      {step.number}
    </div>
    <h3 className="text-[clamp(20px,2.4vw,26px)] text-white/88 tracking-[-0.025em] leading-[1.2] m-0 mb-3">
      {step.title}
    </h3>
    <p className="font-body font-light text-[clamp(14px,1.4vw,15px)] text-white/48 leading-[1.7] m-0">
      {step.body}
    </p>
  </>
);

export default Process;
