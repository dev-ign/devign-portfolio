import React, { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useLenis } from '@/hooks/useLenis';
import { runGatewayEntrance } from '@/animations/gatewayAnimations';
import GatewayCard from '@/components/gateway/GatewayCard';
import Services from '@/components/work-with-me/Services';
import WhyWorkWithMe from '@/components/work-with-me/WhyWorkWithMe';
import Process from '@/components/work-with-me/Process';
import ProjectStartingPoints from '@/components/work-with-me/ProjectStartingPoints';
import BusinessOutcomes from '@/components/work-with-me/BusinessOutcomes';
import InquiryForm from '@/components/work-with-me/InquiryForm';
import FAQ from '@/components/work-with-me/FAQ';
import spaceBg from '@/assets/space-bg.png';

const GatewayPage: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis();

  useEffect(() => {
    document.body.setAttribute('data-page', 'gateway');
    return () => document.body.removeAttribute('data-page');
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
    <div>
      {/* ── Hero ── */}
      <div
        style={{
          minHeight: '100dvh',
          background: '#0C0C0E',
          backgroundImage: `url(${spaceBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)',
          gap: '48px',
          position: 'relative',
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
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            devign
            <span
              style={{
                background: 'linear-gradient(135deg, #c9b8e8 0%, #ddd0f4 55%, #ede6ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              UX
            </span>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '14px',
            width: '100%',
            maxWidth: '760px',
          }}
        >
          <div ref={leftRef} style={{ width: '100%' }}>
            <GatewayCard
              title="Work With Me"
              icon="✦"
              theme="dark"
              onAction={() => lenisRef.current?.scrollTo('#inquiry')}
            />
          </div>
          <div ref={rightRef} style={{ width: '100%' }}>
            <GatewayCard
              title="Portfolio"
              icon="◌"
              theme="warm"
              destination="/portfolio"
            />
          </div>
        </div>

        {/* Gradient feather — space horizon dissolves seamlessly into dark sections */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35vh',
            pointerEvents: 'none',
            zIndex: 2,
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(12,12,14,0.6) 60%, #0C0C0E 100%)',
          }}
        />
      </div>

      {/* ── Content sections ── */}
      <div style={{ background: '#0C0C0E' }}>
        <Services />
        <WhyWorkWithMe />
        <Process />
        <ProjectStartingPoints />
        <BusinessOutcomes />
        <InquiryForm />
        <FAQ />
      </div>
    </div>
  );
};

export default GatewayPage;
