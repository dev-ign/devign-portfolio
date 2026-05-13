import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initProcessPin } from '@/animations/workWithMeAnimations';
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

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useGSAPContext(
    () => {
      if (isMobile || !sectionRef.current) return;
      const stepEls = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.process-step')
      );
      const mm = initProcessPin(sectionRef.current, stepEls);
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#E8E7E1',
        overflow: isMobile ? undefined : 'hidden',
      }}
    >
      <div style={{ marginBottom: '64px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.35)',
            marginBottom: '12px',
          }}
        >
          How It Works
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: '#0C0C0E',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          A clear process,<br />no surprises.
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '0' : 'clamp(24px, 3vw, 40px)',
        }}
      >
        {STEPS.map((step, i) =>
          isMobile ? (
            <motion.div
              key={step.number}
              className="process-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              style={{
                borderTop: '1px solid rgba(0,0,0,0.1)',
                padding: 'clamp(24px, 4vw, 36px) 0',
              }}
            >
              <StepContent step={step} />
            </motion.div>
          ) : (
            <div
              key={step.number}
              className="process-step"
              style={{
                borderTop: '2px solid rgba(0,0,0,0.12)',
                paddingTop: '28px',
              }}
            >
              <StepContent step={step} />
            </div>
          )
        )}
        {isMobile && <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />}
      </div>
    </section>
  );
};

const StepContent: React.FC<{ step: (typeof STEPS)[number] }> = ({ step }) => (
  <>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        color: 'rgba(0,0,0,0.3)',
        marginBottom: '20px',
      }}
    >
      {step.number}
    </div>
    <h3
      style={{
        fontFamily: 'var(--font-disp)',
        fontWeight: 700,
        fontSize: 'clamp(20px, 2.4vw, 26px)',
        color: '#0C0C0E',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
        margin: '0 0 12px',
      }}
    >
      {step.title}
    </h3>
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 300,
        fontSize: 'clamp(14px, 1.4vw, 15px)',
        color: 'rgba(0,0,0,0.5)',
        lineHeight: 1.7,
        margin: 0,
      }}
    >
      {step.body}
    </p>
  </>
);

export default Process;
