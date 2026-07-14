import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import InquiryModal from '@/components/work-with-me/InquiryModal';
import FeaturedCaseStudyCard from '@/components/case-studies/FeaturedCaseStudyCard';
import TemplateManagerAnimation from '@/components/showcase/TemplateManagerAnimation';
import DonorDirectoryAnimation from '@/components/showcase/DonorDirectoryAnimation';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useLenis } from '@/hooks/useLenis';
import { projects } from '@/data/projects';

const featuredProjectIds = ['gravyty-template-manager', 'gravyty-donor-directory'];
const featuredProjects = projects.filter((project) => featuredProjectIds.includes(project.id));

const projectCardGradients: Record<string, string> = {
  'gravyty-template-manager':
    'radial-gradient(circle at 18% 0%, rgba(196, 210, 255, 0.42), transparent 38%), linear-gradient(150deg, #8799E4 0%, #7183CF 48%, #293052 100%)',
  'gravyty-donor-directory':
    'radial-gradient(circle at 18% 0%, rgba(224, 188, 255, 0.34), transparent 38%), linear-gradient(150deg, #A56FD5 0%, #925BC9 48%, #32163F 100%)',
};

const CaseStudiesPage: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headerBackdropRef = useRef<HTMLDivElement>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  useLenis();

  const openInquiry = useCallback(() => setInquiryOpen(true), []);
  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

  useEffect(() => {
    document.body.setAttribute('data-page', 'case-studies');
    return () => document.body.removeAttribute('data-page');
  }, []);

  useGSAPContext(
    () => {
      if (
        !sectionRef.current ||
        !headerRef.current ||
        !cardsRef.current ||
        !titleRef.current ||
        !subtitleRef.current ||
        !headerBackdropRef.current
      ) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'max',
        pin: headerRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        refreshPriority: -10,
      });

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          gsap.set(titleRef.current, { transformOrigin: 'top center' });

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${Math.min(window.innerHeight * 0.52, 520)}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .addLabel('compact', 0)
            .to(
              titleRef.current,
              {
                scale: desktop ? 0.46 : 0.66,
                y: desktop ? -35 : -24,
                duration: 1,
              },
              'compact'
            )
            .to(
              subtitleRef.current,
              {
                autoAlpha: 0,
                y: -18,
                duration: 0.46,
              },
              'compact+=0.06'
            )
            .to(
              headerBackdropRef.current,
              {
                opacity: 1,
                duration: 0.7,
              },
              'compact+=0.12'
            );
        }
      );

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        media.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <main className="relative min-h-dvh overflow-x-clip bg-gateway">
      <GlobalNavigation variant="case-studies" onOpenInquiry={openInquiry} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_38%,rgba(190,151,237,0.1),transparent_34%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[clamp(20px,5vw,72px)] top-0 h-full border-x border-white/[0.035]"
      />

      <section
        ref={sectionRef}
        aria-labelledby="selected-work-label"
        className="relative z-10 mx-auto w-full max-w-[1320px] px-[clamp(24px,6vw,88px)] pb-[clamp(112px,15vw,200px)]"
      >
        <header
          ref={headerRef}
          className="pointer-events-none relative z-30 w-full pt-[clamp(144px,17vh,184px)] pb-[clamp(64px,8vh,90px)] text-center"
        >
          <div
            ref={headerBackdropRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[clamp(300px,40vh,420px)] w-screen -translate-x-1/2 opacity-0 [background:linear-gradient(to_bottom,#0C0C0E_0%,rgba(12,12,14,0.96)_72%,transparent_100%)]"
          />

          <h1
            ref={titleRef}
            className="m-0 will-change-transform text-[clamp(48px,8.4vw,116px)] leading-[0.92] tracking-[-0.055em] text-white/94"
          >
            Projects <span className="text-[#C6A1F2]">&amp;</span>{' '}
            <span className="whitespace-nowrap">Case Studies</span>
          </h1>

          <p
            ref={subtitleRef}
            className="mx-auto mb-0 mt-[clamp(24px,3vw,36px)] max-w-[680px] will-change-[transform,opacity] font-body text-[clamp(15px,1.45vw,18px)] font-light leading-[1.75] text-white/50"
          >
            A mix of big-team builds and scrappy freelance favorites, shaped through UX/UI
            design and development. Take a look around. These are the projects I had the most
            fun bringing to life.
          </p>
        </header>

        <div ref={cardsRef} className="relative z-10 mt-[clamp(64px,10vh,112px)]">
          <div
            id="selected-work-label"
            className="mb-[clamp(24px,3.5vw,40px)] flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/32 md:justify-start"
          >
            <span className="h-px w-8 bg-[#BE97ED]/45" aria-hidden="true" />
            Selected work
            <span className="h-px w-8 bg-[#BE97ED]/45" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 items-stretch gap-[clamp(18px,2vw,28px)] md:grid-cols-2 min-[1100px]:grid-cols-3">
            {featuredProjects.map((project) => (
              <FeaturedCaseStudyCard
                key={project.id}
                project={project}
                backgroundGradient={projectCardGradients[project.id]}
              >
                {project.id === 'gravyty-template-manager' ? (
                  <TemplateManagerAnimation className="block h-auto w-full" />
                ) : (
                  <DonorDirectoryAnimation className="block h-auto w-full" />
                )}
              </FeaturedCaseStudyCard>
            ))}
          </div>
        </div>
      </section>

      <InquiryModal open={inquiryOpen} onClose={closeInquiry} />
    </main>
  );
};

export default CaseStudiesPage;
