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
      style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#0C0C0E',
      }}
    >
      <div style={{ marginBottom: '52px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '12px',
          }}
        >
          Investment
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Project starting points.
        </h2>
      </div>

      <div>
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className="tier-row"
            style={{
              borderTop: i === 0 ? '1px solid rgba(255,255,255,0.07)' : undefined,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: 'clamp(22px, 3vw, 32px) 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-disp)',
                fontWeight: 700,
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                color: 'rgba(255,255,255,0.88)',
                letterSpacing: '-0.02em',
              }}
            >
              {t.name}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(12px, 1.4vw, 14px)',
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.45)',
                whiteSpace: 'nowrap',
              }}
            >
              {t.price}
            </span>
          </div>
        ))}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.32)',
          fontWeight: 300,
          fontStyle: 'italic',
          margin: '20px 0 0',
        }}
      >
        Every project is tailored to your goals, timeline, and scope.
      </p>
    </section>
  );
};

export default ProjectStartingPoints;
