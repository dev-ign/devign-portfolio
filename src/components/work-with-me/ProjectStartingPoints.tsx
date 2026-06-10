import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runFadeStagger } from '@/animations/workWithMeAnimations';

const TIERS = [
  { name: 'Landing Pages', price: 'Starting at $2k+' },
  { name: 'Business Websites', price: 'Starting at $5k+' },
  { name: 'Premium Experiences', price: 'Custom Quote' },
];

const ProjectStartingPoints: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const rows = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.tier-row')
      );
      runFadeStagger(rows, sectionRef.current);
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,8vw,88px)] bg-gateway"
    >
      <div className="mb-[52px]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3">
          Investment
        </div>
        <h2 className="text-[clamp(30px,5vw,52px)] text-white/88 tracking-[-0.03em] leading-[1.1] m-0">
          Project starting points.
        </h2>
      </div>

      <div>
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className={`tier-row border-b border-white/7 py-[clamp(22px,3vw,32px)] flex justify-between items-center gap-4${i === 0 ? ' border-t' : ''}`}
          >
            <span className="font-disp font-bold text-[clamp(18px,2.5vw,26px)] text-white/88 tracking-[-0.02em]">
              {t.name}
            </span>
            <span className="font-mono text-[clamp(12px,1.4vw,14px)] tracking-[0.06em] text-white/45 whitespace-nowrap">
              {t.price}
            </span>
          </div>
        ))}
      </div>

      <p className="font-body text-[13px] text-white/32 font-light italic mt-5 m-0">
        Every project is tailored to your goals, timeline, and scope.
      </p>
    </section>
  );
};

export default ProjectStartingPoints;
