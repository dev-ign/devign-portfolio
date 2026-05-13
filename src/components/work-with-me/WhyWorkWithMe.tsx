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
      style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#E8E7E1',
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
          Why Work With Me
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
          The difference is in the details.
        </h2>
      </div>

      <div>
        {STATEMENTS.map((s, i) => (
          <div
            key={i}
            className="why-statement"
            style={{
              borderTop: '1px solid rgba(0,0,0,0.1)',
              padding: 'clamp(32px, 4vw, 48px) 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-disp)',
                fontWeight: 700,
                fontSize: 'clamp(20px, 2.8vw, 30px)',
                color: '#0C0C0E',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {s.headline}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                color: 'rgba(0,0,0,0.5)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
