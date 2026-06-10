import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attachOrbHover } from '@/animations/gatewayAnimations';
import cardBgDark from '@/assets/card-bg-dark.png';
import cardBgLight from '@/assets/card-bg-light.png';

export interface GatewayCardProps {
  title: string;
  icon: string;
  theme: 'dark' | 'warm';
  destination?: string;
  onAction?: () => void;
}

const GatewayCard: React.FC<GatewayCardProps> = ({
  title, icon, theme, destination, onAction,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!cardRef.current || !orbRef.current) return;
    return attachOrbHover(cardRef.current, orbRef.current);
  }, []);

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (destination) {
      navigate(destination);
    }
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleAction}
      onKeyDown={(e) => e.key === 'Enter' && handleAction()}
      aria-label={`Go to ${title}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        padding: 'clamp(24px, 3.5vw, 36px) clamp(22px, 3vw, 32px)',
        cursor: 'pointer',
        minHeight: '170px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: isDark ? 'rgba(14, 14, 18, 0.88)' : '#DDDCD6',
        backgroundImage: `url(${isDark ? cardBgDark : cardBgLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.3)',
        backdropFilter: isDark ? 'blur(20px)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(20px)' : undefined,
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.3s ease',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-4px)';
        el.style.borderColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)';
        el.style.boxShadow = isDark
          ? '0 0 40px rgba(139,92,246,0.18), 0 8px 32px rgba(0,0,0,0.5)'
          : '0 0 40px rgba(139,92,246,0.12), 0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.3)';
        el.style.boxShadow = '';
      }}
    >
      {/* Ambient hover orb */}
      <div
        ref={orbRef}
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(176,110,243,0.1) 0%, transparent 65%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Icon + Title */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            lineHeight: 1,
            opacity: 0.65,
            color: isDark ? '#fff' : '#0C0C0E',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 700,
            fontSize: 'clamp(20px, 2.5vw, 26px)',
            color: isDark ? '#fff' : '#0C0C0E',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
};

export default GatewayCard;
