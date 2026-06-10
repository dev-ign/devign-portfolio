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
      className="min-h-dvh flex flex-col justify-center py-[clamp(80px,10vw,120px)] px-[clamp(24px,8vw,88px)] [background:linear-gradient(160deg,#070910_0%,#0C0E18_100%)] relative"
    >
      {/* Eyebrow */}
      <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/35 mb-9 flex items-center gap-3">
        <span className="inline-block w-7 h-px bg-current shrink-0" />
        devignUX · Web Design & Development · Tampa, FL
      </div>

      {/* Headline — solid fill */}
      <div ref={line1Ref}>
        <h1 className="text-[clamp(48px,9vw,108px)] text-white/92 tracking-[-0.04em] leading-none m-0">
          Let's build something
        </h1>
      </div>

      {/* Headline — ghost outline */}
      <div ref={line2Ref}>
        <h1
          className="text-[clamp(48px,9vw,108px)] text-transparent tracking-[-0.04em] leading-none m-0 mb-9"
          style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.5)' }}
        >
          great together.
        </h1>
      </div>

      {/* Subheadline */}
      <p
        ref={subRef}
        className="font-body font-light text-[clamp(15px,1.8vw,19px)] text-white/45 leading-[1.65] max-w-[460px] m-0 mb-11"
      >
        I help businesses create digital experiences that convert, retain, and grow.
      </p>

      {/* CTAs */}
      <div ref={ctaRef} className="flex gap-3.5 flex-wrap">
        <button
          onClick={() => scrollTo('inquiry')}
          className="font-mono text-[11px] tracking-[0.1em] uppercase bg-white text-gateway border-0 rounded-full py-[15px] px-[30px] cursor-pointer"
        >
          Start a Project
        </button>
        <button
          onClick={() => scrollTo('services')}
          className="font-mono text-[11px] tracking-[0.1em] uppercase bg-transparent text-white/75 border border-white/20 rounded-full py-[15px] px-[30px] cursor-pointer"
        >
          See My Work ↓
        </button>
      </div>
    </section>
  );
};

export default Hero;
