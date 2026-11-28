import React, { useEffect, useLayoutEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import TemplateManagerHeroVisuals from '../components/case-studies/TemplateManagerHeroVisuals';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from '../components/case-studies/CaseStudySectionNavigation';
import TemplateManagerStory from '../components/case-studies/TemplateManagerStory';
import DonorDirectoryCaseStudy from '../components/case-studies/DonorDirectoryCaseStudy';
import CaseStudyProjectDetails from '../components/case-studies/CaseStudyProjectDetails';
import MirembeCleaningCaseStudy from '@/components/case-studies/mirembe/MirembeCleaningCaseStudy';
import { MIREMBE_PORTFOLIO_PATH, MIREMBE_SLUG } from '@/data/mirembeCleaningCaseStudy';
import { projects } from '../data/projects';

const TEMPLATE_MANAGER_SLUG = 'gravyty-template-manager';
const DONOR_DIRECTORY_SLUG = 'donor-directory';
const templateManagerProject = projects.find((project) => project.id === TEMPLATE_MANAGER_SLUG);

const templateManagerSectionLinks: CaseStudySectionLink[] = [
  { id: 'hero', label: 'Hero', menuLabel: 'Hero' },
  { id: 'opportunity', label: 'Problem', menuLabel: 'Problem' },
  { id: 'workflow', label: 'Workflow', menuLabel: 'Workflow' },
  { id: 'decisions', label: 'Decisions', menuLabel: 'Decisions' },
  { id: 'experience', label: 'Experience', menuLabel: 'Experience' },
  { id: 'first-draft', label: 'First Draft', menuLabel: 'First Draft' },
  { id: 'implementation', label: 'Implementation', menuLabel: 'Implementation' },
  { id: 'impact', label: 'Outcome', menuLabel: 'Outcome' },
  { id: 'reflection', label: 'Reflection', menuLabel: 'Reflection' },
];

const backButtonClassName = [
  'case-study-back-control fixed z-[60] inline-flex min-h-11 items-center',
  'py-[9px] px-[18px]',
  'bg-black/28 [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)]',
  'text-white/82 rounded-full font-body text-[13px] font-medium',
  'border border-white/18 cursor-pointer no-underline shadow-[0_8px_26px_rgba(4,6,20,0.2)]',
  'transition-[opacity,background-color] duration-200 hover:bg-black/40 hover:text-white',
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80',
].join(' ');

const getStickyOffset = () => {
  const value = window.getComputedStyle(document.body).getPropertyValue('--case-study-sticky-offset');
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : window.innerWidth < 640 ? 112 : 104;
};

const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const narrative = templateManagerProject?.caseStudy.narrative;
  const isTemplateManager = slug === TEMPLATE_MANAGER_SLUG && Boolean(narrative);
  const isDonorDirectory = slug === DONOR_DIRECTORY_SLUG;
  const isMirembe = slug === MIREMBE_SLUG;
  const portfolioReturnUrl = isMirembe
    ? MIREMBE_PORTFOLIO_PATH
    : isDonorDirectory ? '/portfolio#donor-directory' : '/portfolio#selected-work';

  useLayoutEffect(() => {
    const alignCurrentHash = () => {
      const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      const hashTarget = hashId ? document.getElementById(hashId) : null;
      if (!hashTarget) return false;
      const top = window.scrollY + hashTarget.getBoundingClientRect().top - getStickyOffset();
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
      return true;
    };

    if (isMirembe) {
      const initialHash = window.location.hash;
      const aligned = alignCurrentHash();
      if (!aligned) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      const pendingAlignment = new AbortController();
      let frameId = 0;
      if (aligned && document.fonts) {
        // Realign after font layout only while the reader stays on the initial deep link.
        const cancelAlignment = () => pendingAlignment.abort();
        const options = { passive: true, signal: pendingAlignment.signal };
        window.addEventListener('wheel', cancelAlignment, options);
        window.addEventListener('touchstart', cancelAlignment, options);
        window.addEventListener('pointerdown', cancelAlignment, options);
        window.addEventListener('keydown', cancelAlignment, options);
        void document.fonts.ready.then(() => {
          if (pendingAlignment.signal.aborted) return;
          frameId = window.requestAnimationFrame(() => {
            if (!pendingAlignment.signal.aborted && window.location.hash === initialHash) alignCurrentHash();
            pendingAlignment.abort();
          });
        });
      }
      window.addEventListener('hashchange', alignCurrentHash);
      window.addEventListener('popstate', alignCurrentHash);
      return () => {
        pendingAlignment.abort();
        window.cancelAnimationFrame(frameId);
        window.removeEventListener('hashchange', alignCurrentHash);
        window.removeEventListener('popstate', alignCurrentHash);
      };
    }

    if (alignCurrentHash()) {
      let isCancelled = false;
      let frameId = 0;
      const alignHashTarget = () => {
        if (isCancelled) return;
        alignCurrentHash();
      };
      const handleLoad = () => alignHashTarget();
      const settleInterval = window.setInterval(alignHashTarget, 100);
      const settleTimer = window.setTimeout(() => {
        alignHashTarget();
        window.clearInterval(settleInterval);
      }, 2000);

      frameId = window.requestAnimationFrame(() => {
        frameId = window.requestAnimationFrame(alignHashTarget);
      });
      window.addEventListener('load', handleLoad, { once: true });
      window.addEventListener('hashchange', alignHashTarget);
      window.addEventListener('popstate', alignHashTarget);
      document.fonts?.ready.then(alignHashTarget);

      return () => {
        isCancelled = true;
        window.cancelAnimationFrame(frameId);
        window.clearInterval(settleInterval);
        window.clearTimeout(settleTimer);
        window.removeEventListener('load', handleLoad);
        window.removeEventListener('hashchange', alignHashTarget);
        window.removeEventListener('popstate', alignHashTarget);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [slug, isMirembe]);

  useEffect(() => {
    if (isTemplateManager) {
      document.body.setAttribute('data-page', 'template-manager-case-study');
    } else if (isDonorDirectory) {
      document.body.setAttribute('data-page', 'donor-directory-case-study');
    } else if (isMirembe) {
      document.body.setAttribute('data-page', 'mirembe-cleaning-case-study');
    }
    return () => document.body.removeAttribute('data-page');
  }, [isDonorDirectory, isMirembe, isTemplateManager]);

  if (!isTemplateManager && !isDonorDirectory && !isMirembe) {
    return (
      <main id="main-content" tabIndex={-1} className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-gateway px-6 text-center text-white">
        <p className="m-0 font-body text-[15px] text-white/60">Case study not found.</p>
        <Link
          to="/portfolio"
          className="font-body text-[13px] text-white/80 underline-offset-4 hover:underline"
        >
          Back to Portfolio
        </Link>
      </main>
    );
  }

  const backgroundClassName = isMirembe
    ? 'mirembe-case-study-bg'
    : isDonorDirectory ? 'donor-directory-case-study-bg' : 'template-manager-case-study-bg';

  return (
    <main id="main-content" tabIndex={-1} className={`${backgroundClassName} relative min-h-screen min-h-dvh overflow-x-clip text-white`}>
      <Link to={portfolioReturnUrl} className={backButtonClassName}>
        <span aria-hidden="true" className="mr-1">←</span>Back to Portfolio
      </Link>

      {isMirembe ? (
        <MirembeCleaningCaseStudy />
      ) : isDonorDirectory ? (
        <DonorDirectoryCaseStudy />
      ) : (
        <>
          <TemplateManagerHeroVisuals />

          <section
            id="hero"
            aria-labelledby="template-manager-title"
            data-case-study-section="hero"
            className="relative flex min-h-screen min-h-dvh scroll-mt-[152px] items-center justify-center px-6 py-20 text-center sm:scroll-mt-24 sm:px-10 sm:py-24"
          >
            <div className="relative w-full max-w-[1040px]">
              <div className="relative z-10">
                <h1
                  id="template-manager-title"
                  className="m-0 font-disp text-[clamp(36px,5vw,48px)] font-extrabold leading-[1.15] tracking-[-0.035em] text-white"
                >
                  {narrative?.hero.title}
                </h1>
                <p className="mx-auto mb-0 mt-5 max-w-[760px] font-body text-[clamp(16px,2vw,20px)] font-normal leading-[1.6] tracking-[-0.015em] text-white/90">
                  {narrative?.hero.subtitle}
                </p>

                <div className="mx-auto mt-8 max-w-[980px]">
                  <CaseStudyProjectDetails items={narrative?.hero.summary} data-testid="template-manager-project-summary" />
                </div>

                <p className="mx-auto mb-0 mt-4 max-w-[900px] font-body text-[11px] leading-[1.55] text-white/58 sm:text-[12px]">
                  <span className="font-medium text-white/58">Confidentiality note:</span>{' '}
                  {narrative?.hero.confidentiality}
                </p>
              </div>
              <div className="relative z-20">
                <CaseStudySectionNavigation sections={templateManagerSectionLinks} />
              </div>
            </div>
          </section>

          {narrative && <TemplateManagerStory narrative={narrative} />}
        </>
      )}
    </main>
  );
};

export default CaseStudyDetailPage;
