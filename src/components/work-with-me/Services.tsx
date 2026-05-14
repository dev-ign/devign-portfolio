import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runServicesStagger } from '@/animations/workWithMeAnimations';

const SERVICES = [
  {
    icon: 'solar:rocket-2-bold',
    name: 'Landing Pages',
    description: 'Fast, conversion-focused pages that turn visitors into leads.',
  },
  {
    icon: 'solar:buildings-bold',
    name: 'Business Websites',
    description: 'Professional multi-page marketing sites that build trust and credibility.',
  },
  {
    icon: 'solar:refresh-circle-bold',
    name: 'Website Redesigns',
    description: 'Modernize outdated experiences with current UX standards.',
  },
  {
    icon: 'solar:cart-large-bold',
    name: 'E-Commerce',
    description: 'Online stores and checkout experiences optimized for mobile.',
  },
  {
    icon: 'solar:calendar-add-bold',
    name: 'Booking Experiences',
    description: 'Streamlined booking and scheduling flows that reduce friction.',
  },
  {
    icon: 'solar:settings-bold',
    name: 'Ongoing Support',
    description: 'Monthly maintenance, updates, and feature additions.',
  },
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.service-card')
      );
      runServicesStagger(cards);
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#0C0C0E',
        position: 'relative',
      }}
    >
      {/* Atmospheric top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '500px',
          pointerEvents: 'none',
          zIndex: 0,
          background: [
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(176,110,243,0.06) 0%, transparent 65%)',
            'radial-gradient(ellipse 60% 30% at 50% -5%, rgba(255,140,60,0.03) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      {/* Section header */}
      <div style={{ marginBottom: '52px', position: 'relative', zIndex: 1 }}>
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
          What I Build
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
          Services
        </h2>
      </div>

      {/* Grid — gap:1px + bg creates hairline dividers between cells */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {SERVICES.map((s) => (
          <div
            key={s.name}
            className="service-card"
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '32px 26px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon icon={s.icon} style={{ width: 19, height: 19, color: 'rgba(255,255,255,0.75)' }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.88)',
                  marginBottom: '6px',
                }}
              >
                {s.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.42)',
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {s.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
