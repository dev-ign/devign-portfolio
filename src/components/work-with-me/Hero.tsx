import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { runHeroReveal } from '@/animations/workWithMeAnimations';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAPContext(
    () => {
      const els = ([line1Ref, line2Ref, subRef, ctaRef] as React.RefObject<HTMLElement>[])
        .map((r) => r.current)
        .filter((el): el is HTMLElement => el !== null);
      runHeroReveal(els);
    },
    { scope: containerRef, dependencies: [] }
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: 'linear-gradient(160deg, #070910 0%, #0C0E18 100%)',
        position: 'relative',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '28px',
            height: '1px',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
        devignUX · Web Design & Development · Tampa, FL
      </div>

      {/* Headline — solid fill */}
      <div ref={line1Ref}>
        <h1
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(48px, 9vw, 108px)',
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          Let's build something
        </h1>
      </div>

      {/* Headline — ghost outline */}
      <div ref={line2Ref}>
        <h1
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(48px, 9vw, 108px)',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            margin: '0 0 36px',
          }}
        >
          great together.
        </h1>
      </div>

      {/* Subheadline */}
      <p
        ref={subRef}
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: 'clamp(15px, 1.8vw, 19px)',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.65,
          maxWidth: '460px',
          margin: '0 0 44px',
        }}
      >
        I help businesses create digital experiences that convert, retain, and grow.
      </p>

      {/* CTAs */}
      <div ref={ctaRef} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={() => scrollTo('inquiry')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: '#fff',
            color: '#0C0C0E',
            border: 'none',
            borderRadius: '100px',
            padding: '15px 30px',
            cursor: 'pointer',
          }}
        >
          Start a Project
        </button>
        <button
          onClick={() => scrollTo('services')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: 'transparent',
            color: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px',
            padding: '15px 30px',
            cursor: 'pointer',
          }}
        >
          See My Work ↓
        </button>
      </div>
    </section>
  );
};

export default Hero;
