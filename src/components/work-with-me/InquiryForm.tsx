import React, { useCallback, useRef, useState } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import {
  initPosterScroll,
  initVideoScrub,
  runGatewayEntrance,
} from '@/animations/gatewayAnimations';
import { isTouchDevice } from '@/utils/deviceDetect';
import InquiryModal from './InquiryModal';

const InquiryForm: React.FC = () => {
  const isTouch = isTouchDevice();
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useGSAPContext(() => {
    if (contentRef.current) {
      runGatewayEntrance(contentRef.current);
    }
  }, []);

  useGSAPContext(() => {
    if (!sectionRef.current || !mediaRef.current || !contentRef.current) return;

    const scrubOptions = {
      end: '+=120%',
      pin: false,
      pinSpacing: false,
      mediaFadeStart: 0.72,
      mediaFadeDuration: 0.32,
      mediaYPercent: -6,
      mediaStartScale: 1.08,
      mediaEndScale: 1.02,
      contentExitAt: 0.82,
      contentExitY: -28,
    };

    if (isTouch) {
      return initPosterScroll(
        sectionRef.current,
        mediaRef.current,
        undefined,
        undefined,
        scrubOptions
      );
    }

    if (!videoRef.current) return;

    return initVideoScrub(
      sectionRef.current,
      videoRef.current,
      mediaRef.current,
      undefined,
      undefined,
      scrubOptions
    );
  }, []);

  return (
    <>
      <section
        id="inquiry"
        ref={sectionRef}
        className="relative min-h-[clamp(620px,92dvh,860px)] overflow-hidden bg-gateway"
      >
        <div
          ref={mediaRef}
          className="absolute inset-[-5%] z-0 will-change-[transform,opacity] [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
        >
          {isTouch ? (
            <video
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              className="h-full w-full object-cover"
              aria-hidden="true"
            >
              <source src="/inquiry-bg.mp4" type="video/mp4" />
            </video>
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
              aria-hidden="true"
            >
              <source src="/inquiry-bg.mp4" type="video/mp4" />
            </video>
          )}
        </div>

        <div className="absolute inset-0 z-[1] pointer-events-none [background:radial-gradient(circle_at_center,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.56)_34%,rgba(12,12,14,0.82)_72%,#0C0C0E_100%)]" />
        <div className="absolute inset-x-0 top-0 z-[1] h-[22vh] pointer-events-none [background:linear-gradient(to_bottom,#0C0C0E_0%,rgba(12,12,14,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-[1] h-[34vh] pointer-events-none [background:linear-gradient(to_bottom,rgba(12,12,14,0)_0%,#0C0C0E_100%)]" />

        <div className="relative z-[2] flex min-h-[clamp(620px,92dvh,860px)] items-center justify-center px-[clamp(20px,4vw,40px)] py-[clamp(96px,14vh,150px)] text-center">
          <div
            ref={contentRef}
            className="flex max-w-[760px] flex-col items-center gap-8 will-change-[transform,opacity] [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
          >
            <div className="hero-reveal-item font-mono text-[11px] tracking-[0.14em] uppercase text-white/38">
              Start a Project
            </div>
            <div className="hero-reveal-item">
              <h2 className="m-0 text-[clamp(40px,7vw,88px)] leading-[0.98] tracking-[-0.04em] text-white/94">
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
                onClick={openModal}
                className="primary-hero-cta"
              >
                <span>Work With Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal open={modalOpen} onClose={closeModal} />
    </>
  );
};

export default InquiryForm;
