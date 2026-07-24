import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useLenis } from '@/hooks/useLenis';
import {
  initGatewayIntroExperience,
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
import Footer from '@/components/Footer';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { trackEvent } from '@/utils/analytics';

const CAPABILITIES = [
  { label: 'Websites.', size: 'large', direction: 'from-left', tracking: 'normal', mobileHidden: false },
  { label: 'Products.', size: 'large', direction: 'from-right', tracking: 'normal', mobileHidden: false },
  { label: 'Apps.', size: 'xlarge', direction: 'diagonal-up-right', tracking: 'tight', mobileHidden: false },
  { label: 'Motion.', size: 'xlarge', direction: 'from-right', tracking: 'tight', mobileHidden: false },
  { label: 'Content.', size: 'large', direction: 'from-left', tracking: 'normal', mobileHidden: false },
  { label: 'Brands.', size: 'xlarge', direction: 'diagonal-up-left', tracking: 'tight', mobileHidden: true },
  { label: 'Commerce.', size: 'large', direction: 'from-right', tracking: 'normal', mobileHidden: false },
  { label: 'Campaigns.', size: 'medium', direction: 'from-left', tracking: 'relaxed', mobileHidden: true },
] as const;

const GatewayPage: React.FC = () => {
  const isTouch = isTouchDevice();
  const reducedMotion = usePrefersReducedMotion();
  const useStaticHeroMedia = isTouch || reducedMotion;

  const heroRef    = useRef<HTMLDivElement>(null);
  const mediaRef   = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef   = useRef<HTMLElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const servicesSurfaceRef = useRef<HTMLDivElement>(null);
  const lenisRef   = useLenis(!isTouch && !reducedMotion);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const openInquiry = useCallback(() => {
    trackEvent('contact_cta_click', { location: 'homepage' });
    trackEvent('inquiry_open', { form: 'project_inquiry' });
    setInquiryOpen(true);
  }, []);
  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

  useEffect(() => {
    document.body.setAttribute('data-page', 'gateway');
    return () => document.body.removeAttribute('data-page');
  }, []);

  // One scroll clock coordinates the hero exit, persistent atmosphere,
  // capability words, conclusion, and the handoff into Services.
  useGSAPContext(() => {
    if (
      reducedMotion ||
      !introRef.current ||
      !heroRef.current ||
      !mediaRef.current ||
      !contentRef.current ||
      !typographyRef.current ||
      !servicesSurfaceRef.current
    ) return;

    return initGatewayIntroExperience(
      introRef.current,
      mediaRef.current,
      contentRef.current,
      typographyRef.current,
      servicesSurfaceRef.current,
      isTouch ? undefined : videoRef.current ?? undefined
    );
  }, [reducedMotion]);

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    const navClearance =
      id === 'inquiry'
        ? Math.min(window.innerHeight * 0.78, 720)
        : 96;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - navClearance;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div id="top">
      <GlobalNavigation onScrollTo={scrollToSection} onOpenInquiry={openInquiry} />

      <main id="main-content" tabIndex={-1}>
        {/* ── Hero → capabilities: one pinned cinematic introduction ── */}
        <section
          ref={introRef}
          className="gateway-intro-experience"
          style={{ backgroundImage: "url('/gateway-hero-poster.jpg')" }}
        >
          {/* The existing media persists behind the first capability words. */}
          <div
            ref={mediaRef}
            className="gateway-intro-media"
          >
            {useStaticHeroMedia ? (
              <img
                src="/gateway-hero-poster.jpg"
                alt=""
                aria-hidden="true"
                width="1844"
                height="1124"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                poster="/gateway-hero-poster.jpg"
                aria-hidden="true"
                className="w-full h-full object-cover"
              >
                <source src="/gateway-parallax.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          <div className="gateway-intro-shade" aria-hidden="true" />
          <div className="gateway-intro-atmosphere" aria-hidden="true" />

          <div
            ref={heroRef}
            aria-labelledby="home-heading"
            className={`gateway-hero-stage ${isTouch ? 'min-h-svh' : 'min-h-dvh'}`}
          >

            <div ref={contentRef} className="gateway-hero-content">
              {/* Headline */}
              <div className="hero-reveal-item max-w-[820px]">
                <h1 id="home-heading" className="text-[clamp(30px,4.8vw,58px)] leading-[1.4] tracking-[-0.01em] text-white">
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

                <a
                  href="#projects"
                  onClick={event => {
                    event.preventDefault();
                    scrollToSection('projects');
                  }}
                  className="font-body font-medium text-[clamp(14px,1.4vw,16px)] text-white/82 bg-transparent border border-white/22 rounded-full py-3.5 px-7 cursor-pointer tracking-[0.01em] [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)] transition-[border-color,color,transform] duration-200 ease-linear hover:border-white/45 hover:text-white hover:-translate-y-0.5"
                >
                  View Projects
                </a>
              </div>
            </div>
          </div>

          <div
            ref={typographyRef}
            className="gateway-capability-stage"
          >
            <p className="sr-only">
              DevignUX creates websites, digital products, apps, motion, content, brands,
              commerce experiences, and campaigns—everything digital.
            </p>

            <div className="gateway-capability-visuals" aria-hidden="true">
              {CAPABILITIES.map((capability) => (
                <div
                  key={capability.label}
                  className={`gateway-capability-word gateway-capability-word--${capability.size}`}
                  data-direction={capability.direction}
                  data-tracking={capability.tracking}
                  data-capability={capability.label.replace('.', '').toLowerCase()}
                  data-mobile-hidden={capability.mobileHidden ? 'true' : undefined}
                >
                  <span>{capability.label}</span>
                </div>
              ))}

              <div className="gateway-capability-summary">
                <strong>Everything Digital.</strong>
                <span>Designed, built, and brought to life.</span>
              </div>
            </div>
          </div>

          <div className="gateway-intro-feather" aria-hidden="true" />
        </section>

        {/* ── Content sections ── */}
        <div
          className="gateway-sections relative z-3 bg-gateway"
          data-gateway-sections
        >
          <div ref={servicesSurfaceRef} className="gateway-services-surface">
            <Services />
          </div>
          <Process />
          <ProjectsShowcase />
          <BusinessOutcomes />
          <InquiryForm onOpenInquiry={openInquiry} />
          <FAQ />
        </div>
      </main>

      <Footer onScrollTo={scrollToSection} />

      <InquiryModal open={inquiryOpen} onClose={closeInquiry} />
    </div>
  );
};

export default GatewayPage;
