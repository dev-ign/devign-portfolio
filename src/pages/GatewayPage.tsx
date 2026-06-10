import React, { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useLenis } from '@/hooks/useLenis';
import { runGatewayEntrance, initVideoScrub } from '@/animations/gatewayAnimations';
import GatewayNav from '@/components/gateway/GatewayNav';
import Services from '@/components/work-with-me/Services';
import Process from '@/components/work-with-me/Process';
import ProjectsShowcase from '@/components/work-with-me/ProjectsShowcase';
import BusinessOutcomes from '@/components/work-with-me/BusinessOutcomes';
import InquiryForm from '@/components/work-with-me/InquiryForm';
import FAQ from '@/components/work-with-me/FAQ';

const GatewayPage: React.FC = () => {
  const heroRef   = useRef<HTMLDivElement>(null);
  const mediaRef  = useRef<HTMLDivElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const lenisRef  = useLenis();

  useEffect(() => {
    document.body.setAttribute('data-page', 'gateway');
    return () => document.body.removeAttribute('data-page');
  }, []);

  // Entrance animation — headline + CTA fade/slide in
  useGSAPContext(() => {
    if (contentRef.current) {
      runGatewayEntrance(contentRef.current);
    }
  }, []);

  // Scroll-driven video scrub — plays forward on scroll-down, reverses on scroll-up
  useGSAPContext(() => {
    if (!heroRef.current || !mediaRef.current || !videoRef.current || !contentRef.current || !sectionsRef.current) return;
    return initVideoScrub(
      heroRef.current,
      videoRef.current,
      mediaRef.current,
      contentRef.current,
      sectionsRef.current
    );
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      lenisRef.current?.scrollTo(0);
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    const sectionsTransform = sectionsRef.current
      ? new DOMMatrixReadOnly(getComputedStyle(sectionsRef.current).transform).m42
      : 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - sectionsTransform - 96;
    lenisRef.current?.scrollTo(targetY);
  };

  return (
    <div>
      <GatewayNav onScrollTo={scrollToSection} />

      {/* ── Hero ── */}
      <div ref={heroRef} className="min-h-dvh relative overflow-hidden bg-gateway">

        {/* Video — scrubbed by scroll, not autoplayed. */}
        <div
          ref={mediaRef}
          className="absolute inset-[-5%] z-0 will-change-[transform,opacity] [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/gateway-parallax.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content */}
        <div className="relative z-2 min-h-dvh flex flex-col items-center justify-center pt-[clamp(40px,6vw,80px)] pb-[clamp(96px,14vh,150px)] px-[clamp(20px,4vw,40px)] text-center">

          <div ref={contentRef} className="flex flex-col items-center gap-10 will-change-[transform,opacity] backface-visibility:hidden transform:translate3d(0,0,0)">
            {/* Headline */}
            <div className="hero-reveal-item max-w-[820px]">
              <h1 className="text-[clamp(30px,4.8vw,58px)] leading-[1.4] tracking-[-0.01em] text-white">
                Crafting{' '}
                <span className="hero-digital-sheen">Digital Experiences</span>
                {' '}for Modern Brands.
              </h1>
            </div>

            {/* CTA buttons */}
            <div className="hero-reveal-item flex gap-3.5 mt-12 flex-wrap justify-center">
              <button
                onClick={() => scrollToSection('inquiry')}
                className="primary-hero-cta"
              >
                <span>Work With Us</span>
              </button>

              <button
                onClick={() => scrollToSection('projects')}
                className="font-body font-medium text-[clamp(14px,1.4vw,16px)] text-white/82 bg-transparent border border-white/22 rounded-full py-3.5 px-7 cursor-pointer tracking-[0.01em] [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)] transition-[border-color,color,transform] duration-200 ease-linear hover:border-white/45 hover:text-white hover:-translate-y-0.5"
              >
                View Projects
              </button>
            </div>
          </div>
        </div>

        {/* Bottom feather — hero dissolves into dark sections */}
        <div className="absolute bottom-0 left-0 right-0 h-[35vh] pointer-events-none z-2 [background:linear-gradient(to_bottom,transparent_0%,rgba(12,12,14,0.08)_60%,#0C0C0E_100%)]" />
      </div>

      {/* ── Content sections ── */}
      <div ref={sectionsRef} className="relative z-3 bg-gateway">
        <Services />
        <Process />
        <ProjectsShowcase />
        <BusinessOutcomes />
        <InquiryForm />
        <FAQ />
      </div>
    </div>
  );
};

export default GatewayPage;
