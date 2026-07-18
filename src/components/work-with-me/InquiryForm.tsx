import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import {
  initPosterParallax,
} from '@/animations/gatewayAnimations';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';

type InquiryFormProps = {
  onOpenInquiry: () => void;
};

const InquiryForm: React.FC<InquiryFormProps> = ({ onOpenInquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    if (!sectionRef.current || !mediaRef.current || !contentRef.current) return;

    const cleanupParallax = initPosterParallax(sectionRef.current, mediaRef.current);
    const contentTargets = Array.from(contentRef.current.children) as HTMLElement[];
    const entranceTriggers = initScrollEnterExit(contentTargets, {
      trigger: contentRef.current,
      stagger: 0.1,
      duration: 0.92,
      y: 36,
    });

    return () => {
      entranceTriggers?.forEach(trigger => trigger.kill());
      cleanupParallax();
    };
  }, []);

  return (
    <>
      <section
        id="inquiry"
        ref={sectionRef}
        aria-labelledby="inquiry-title"
        className="relative min-h-[clamp(620px,92dvh,860px)] overflow-hidden bg-gateway"
      >
        <div
          ref={mediaRef}
          className="absolute inset-[-8%] z-0 will-change-transform [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
        >
          <img
            src="/inquiry-bg-poster.jpg"
            alt=""
            aria-hidden="true"
            width="1280"
            height="714"
            className="h-full w-full object-cover opacity-90"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 z-[1] pointer-events-none [background:radial-gradient(circle_at_center,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.3)_28%,rgba(12,12,14,0.62)_62%,#0C0C0E_100%)]" />
        <div className="absolute inset-0 z-[1] pointer-events-none [background:radial-gradient(ellipse_at_center,rgba(12,12,14,0)_0%,rgba(12,12,14,0.24)_52%,#0C0C0E_100%)]" />
        <div className="absolute inset-x-0 top-0 z-[1] h-[36vh] pointer-events-none [background:linear-gradient(to_bottom,#0C0C0E_0%,rgba(12,12,14,0.82)_22%,rgba(12,12,14,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-[1] h-[44vh] pointer-events-none [background:linear-gradient(to_bottom,rgba(12,12,14,0)_0%,rgba(12,12,14,0.84)_68%,#0C0C0E_100%)]" />

        <div className="relative z-[2] flex min-h-[clamp(620px,92dvh,860px)] items-center justify-center px-[clamp(20px,4vw,40px)] py-[clamp(96px,14vh,150px)] text-center">
          <div
            ref={contentRef}
            className="flex max-w-[760px] flex-col items-center gap-8 will-change-[transform,opacity] [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
          >
            <div className="hero-reveal-item font-mono text-[11px] tracking-[0.14em] uppercase text-white/38">
              Start a Project
            </div>
            <div className="hero-reveal-item">
              <h2 id="inquiry-title" className="m-0 text-[clamp(40px,7vw,88px)] leading-[0.98] tracking-[-0.04em] text-white/94">
                Let's start something.
              </h2>
            </div>
            <div className="hero-reveal-item max-w-[680px] px-2 sm:px-0">
              <p className="m-0 font-body text-[clamp(15px,1.7vw,19px)] font-light leading-[1.75] text-white/62">
                Whether you're launching something new, refining an existing product, or reimagining your digital presence, every great experience starts with a conversation. Tell us where you're headed, and we'll help map the path forward.
              </p>
            </div>
            <div className="hero-reveal-item mt-3">
              <button
                type="button"
                onClick={onOpenInquiry}
                className="primary-hero-cta"
              >
                <span>Work With Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InquiryForm;
