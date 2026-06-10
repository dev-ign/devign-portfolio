import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initWhyScrub } from '@/animations/workWithMeAnimations';

const STATEMENTS = [
  {
    headline: 'Design + engineering in one place.',
    body: 'No handoffs. No miscommunication. I design it and I build it — the same person, start to finish.',
  },
  {
    headline: 'Built for business outcomes.',
    body: 'Not just beautiful sites — experiences designed to convert, retain, and grow the businesses I work with.',
  },
  {
    headline: 'Enterprise-level thinking, boutique attention.',
    body: '8+ years shipping production software for companies serving 200+ organizations. That discipline comes to every project.',
  },
  {
    headline: "You'll always know where we are.",
    body: 'Transparent process, clear milestones, direct communication. No black-box freelancing.',
  },
];

const WhyWorkWithMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const els = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.why-statement')
      );
      initWhyScrub(els);
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,8vw,88px)] bg-gateway relative overflow-hidden"
    >
      {/* Subtle purple orb bleed — right edge */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 w-[500px] h-[500px] rounded-full [background:radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_65%)]" style={{ right: '-120px' }} />

      <div className="mb-16 relative z-1">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3">
          Why Work With Us
        </div>
        <h2 className="text-[clamp(30px,5vw,52px)] text-white/88 tracking-[-0.03em] leading-[1.1] m-0">
          The details shape the experience.
        </h2>
      </div>

      <div className="relative z-1">
        {STATEMENTS.map((s, i) => (
          <div
            key={i}
            className="why-statement border-t border-white/7 py-[clamp(32px,4vw,48px)] grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6 items-start"
          >
            <h3 className="text-[clamp(20px,2.8vw,30px)] text-white/88 tracking-[-0.025em] leading-[1.2] m-0">
              {s.headline}
            </h3>
            <p className="font-body font-light text-[clamp(14px,1.5vw,16px)] text-white/45 leading-[1.7] m-0">
              {s.body}
            </p>
          </div>
        ))}
        <div className="border-t border-white/7" />
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
