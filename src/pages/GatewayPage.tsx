import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useLenis } from '@/hooks/useLenis';
import {
  runGatewayEntrance,
  initVideoScrub,
  initPosterScroll,
  initGatewayServicesTypography,
} from '@/animations/gatewayAnimations';
import { isTouchDevice } from '@/utils/deviceDetect';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import Services from '@/components/work-with-me/Services';
import Process from '@/components/work-with-me/Process';
import ProjectsShowcase from '@/components/work-with-me/ProjectsShowcase';
import BusinessOutcomes from '@/components/work-with-me/BusinessOutcomes';
import InquiryForm from '@/components/work-with-me/InquiryForm';
import InquiryModal from '@/components/work-with-me/InquiryModal';
import FAQ from '@/components/work-with-me/FAQ';

const GatewayPage: React.FC = () => {
  const isTouch = isTouchDevice();

  const heroRef    = useRef<HTMLDivElement>(null);
  const mediaRef   = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLElement>(null);
  const lenisRef   = useLenis(!isTouch);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const openInquiry = useCallback(() => setInquiryOpen(true), []);
  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

  useEffect(() => {
    document.body.setAttribute('data-page', 'gateway');
    return () => document.body.removeAttribute('data-page');
  }, []);

  // Entrance animation — headline + subheadline + CTA stagger in
  useGSAPContext(() => {
    if (contentRef.current) {
      runGatewayEntrance(contentRef.current);
    }
  }, []);

  useGSAPContext(() => {
    if (!typographyRef.current) return;
    return initGatewayServicesTypography(typographyRef.current);
  }, []);

  // Scroll animation — video scrub on desktop, poster parallax on touch
  useGSAPContext(() => {
    if (!heroRef.current || !mediaRef.current || !contentRef.current || !sectionsRef.current) return;
    if (isTouch) {
      return initPosterScroll(
        heroRef.current,
        mediaRef.current,
        contentRef.current,
        sectionsRef.current
      );
    }
    if (!videoRef.current) return;
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
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const target =
      id === 'services'
        ? typographyRef.current
        : document.getElementById(id);
    if (!target) return;

    const sectionsTransform = sectionsRef.current
      ? new DOMMatrixReadOnly(getComputedStyle(sectionsRef.current).transform).m42
      : 0;
    const targetTransform =
      id === 'services' && !isTouch ? window.innerHeight * -0.62 : sectionsTransform;
    const navClearance =
      id === 'inquiry'
        ? Math.min(window.innerHeight * 0.78, 720)
        : 96;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - sectionsTransform + targetTransform - navClearance;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <GlobalNavigation onScrollTo={scrollToSection} onOpenInquiry={openInquiry} />

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className={`${isTouch ? 'min-h-svh' : 'min-h-dvh'} relative overflow-hidden bg-gateway`}
      >

        {/* Media — video (desktop) or poster image (touch/tablet) */}
        <div
          ref={mediaRef}
          className="absolute inset-[-5%] z-0 will-change-[transform,opacity] [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
        >
          {isTouch ? (
            <img
              src="/gateway-hero-poster.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src="/gateway-parallax.mp4" type="video/mp4" />
            </video>
          )}
        </div>

        {/* Content */}
        <div className={`relative z-2 ${isTouch ? 'min-h-svh' : 'min-h-dvh'} flex flex-col items-center justify-center pt-[clamp(40px,6vw,80px)] pb-[clamp(96px,14vh,150px)] px-[clamp(20px,4vw,40px)] text-center`}>

          <div ref={contentRef} className="flex flex-col items-center gap-10 will-change-[transform,opacity] backface-hidden translate-z-0">
            {/* Headline */}
            <div className="hero-reveal-item max-w-[820px]">
              <h1 className="text-[clamp(30px,4.8vw,58px)] leading-[1.4] tracking-[-0.01em] text-white">
                Crafting{' '}
                <span className="hero-digital-sheen">Digital Experiences</span>
                {' '}for Modern Brands.
              </h1>
            </div>

            {/* Subheadline */}
            <div className="hero-reveal-item max-w-186 px-4 sm:px-0">
              <p className="hero-subheadline">
                Helping brands navigate the digital landscape through thoughtful design,
                modern development, creative production, and ongoing partnership.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="hero-reveal-item flex gap-3.5 flex-wrap justify-center mt-6 sm:mt-8">
              <button
                type="button"
                onClick={openInquiry}
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
        <div className="absolute bottom-0 left-0 right-0 h-[48dvh] sm:h-[35vh] pointer-events-none z-2 [background:linear-gradient(to_bottom,transparent_0%,rgba(12,12,14,0.14)_48%,#0C0C0E_100%)]" />
      </div>

      {/* ── Content sections ── */}
      <div
        ref={sectionsRef}
        className={`relative z-3 bg-gateway ${isTouch ? 'mb-0' : 'mb-[-62vh]'}`}
        data-gateway-sections
      >
        <section
          ref={typographyRef}
          className="gateway-services-typography h-[clamp(170px,24vw,320px)] bg-gateway relative overflow-hidden"
          aria-hidden="true"
        >
          <div className="gateway-services-typography-track">
            <div className="gateway-services-typography-sequence">
              {['Apps.', 'Web.', 'Design.', 'Motion.'].map((word) => (
                <span key={word} className="gateway-service-typography-word">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </section>
        <Services />
        <Process />
        <ProjectsShowcase />
        <BusinessOutcomes />
        <InquiryForm onOpenInquiry={openInquiry} />
        <FAQ />
      </div>

      <InquiryModal open={inquiryOpen} onClose={closeInquiry} />
    </div>
  );
};

export default GatewayPage;
