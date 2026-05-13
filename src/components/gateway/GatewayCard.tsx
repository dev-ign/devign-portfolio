import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attachOrbHover } from '@/animations/gatewayAnimations';

export interface GatewayCardProps {
  title: string;
  description: string;
  cta: string;
  destination: string;
  theme: 'dark' | 'warm';
}

const GatewayCard: React.FC<GatewayCardProps> = ({
  title, description, cta, destination, theme,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!cardRef.current || !orbRef.current) return;
    return attachOrbHover(cardRef.current, orbRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => navigate(destination)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(destination)}
      aria-label={`Go to ${title}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        padding: 'clamp(36px, 5vw, 56px) clamp(28px, 4vw, 44px)',
        cursor: 'pointer',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: isDark ? 'rgba(16, 16, 20, 0.92)' : '#DDDCD6',
        border: isDark
          ? '1px solid rgba(255,255,255,0.07)'
          : '1px solid rgba(0,0,0,0.1)',
        backdropFilter: isDark ? 'blur(24px)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(24px)' : undefined,
        transition: 'border-color 0.35s ease, transform 0.35s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-3px)';
        el.style.borderColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.1)';
      }}
    >
      {/* Ambient hover orb — tracked by gsap.quickTo in attachOrbHover */}
      <div
        ref={orbRef}
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(77,240,198,0.09) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(176,110,243,0.11) 0%, transparent 65%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.3)',
          marginBottom: '20px',
        }}>
          devignUX /
        </div>
        <h2 style={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: 'clamp(32px, 4vw, 48px)',
          color: isDark ? '#fff' : '#0C0C0E',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: '0 0 14px',
        }}>
          {title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 300,
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
          lineHeight: 1.65,
          margin: 0,
          maxWidth: '260px',
        }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '32px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: isDark ? 'var(--accent-teal)' : '#0C0C0E',
        }}>
          {cta}
        </span>
      </div>
    </div>
  );
};

export default GatewayCard;
