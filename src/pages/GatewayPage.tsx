import React, { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runGatewayEntrance } from '@/animations/gatewayAnimations';
import GatewayCard from '@/components/gateway/GatewayCard';

const GatewayPage: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute('data-page', 'gateway');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.removeAttribute('data-page');
      document.body.style.overflow = '';
    };
  }, []);

  useGSAPContext(() => {
    if (
      headerRef.current &&
      taglineRef.current &&
      leftRef.current &&
      rightRef.current
    ) {
      runGatewayEntrance(
        headerRef.current,
        taglineRef.current,
        leftRef.current,
        rightRef.current
      );
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0C0C0E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)',
        gap: '48px',
      }}
    >
      {/* Wordmark + tagline */}
      <div ref={headerRef} style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            color: '#fff',
            letterSpacing: '-0.03em',
          }}
        >
          devign<span style={{ color: 'var(--accent-teal)' }}>UX</span>
        </div>
        <p
          ref={taglineRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            color: 'rgba(255,255,255,0.38)',
            marginTop: '10px',
            marginBottom: 0,
            fontWeight: 300,
            maxWidth: '420px',
          }}
        >
          Design-driven digital experiences for brands, businesses, and modern products.
        </p>
      </div>

      {/* Two cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '880px',
        }}
      >
        <div ref={leftRef}>
          <GatewayCard
            title="Portfolio"
            description="Product design, UX engineering, and frontend systems for modern teams."
            cta="View Work →"
            destination="/portfolio"
            theme="dark"
          />
        </div>
        <div ref={rightRef}>
          <GatewayCard
            title="Work With Me"
            description="Premium websites and digital experiences built to help businesses grow."
            cta="Start a Project →"
            destination="/work-with-me"
            theme="warm"
          />
        </div>
      </div>
    </div>
  );
};

export default GatewayPage;
