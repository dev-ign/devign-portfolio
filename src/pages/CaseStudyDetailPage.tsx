import React, { useEffect, useLayoutEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import TemplateManagerHeroVisuals from '../components/case-studies/TemplateManagerHeroVisuals';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from '../components/case-studies/CaseStudySectionNavigation';
import TemplateManagerStory from '../components/case-studies/TemplateManagerStory';
import DonorDirectoryCaseStudy from '../components/case-studies/DonorDirectoryCaseStudy';
import { projects } from '../data/projects';

const TEMPLATE_MANAGER_SLUG = 'gravyty-template-manager';
const DONOR_DIRECTORY_SLUG = 'donor-directory';
const templateManagerProject = projects.find((project) => project.id === TEMPLATE_MANAGER_SLUG);

const templateManagerSectionLinks: CaseStudySectionLink[] = [
  { id: 'hero', label: 'Hero', menuLabel: 'Hero' },
  { id: 'opportunity', label: 'Opportunity', menuLabel: 'Opportunity' },
  { id: 'workflow', label: 'Workflow', menuLabel: 'Workflow' },
  { id: 'decisions', label: 'Decisions', menuLabel: 'Decisions' },
  { id: 'organization', label: 'Organization', menuLabel: 'Organization' },
  { id: 'editing', label: 'Editor', menuLabel: 'Editor' },
  { id: 'sharing', label: 'Collaboration', menuLabel: 'Collaboration' },
  { id: 'discovery', label: 'Discovery', menuLabel: 'Discovery' },
  { id: 'errors', label: 'Validation', menuLabel: 'Validation' },
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

  useLayoutEffect(() => {
    const alignCurrentHash = () => {
      const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      const hashTarget = hashId ? document.getElementById(hashId) : null;
      if (!hashTarget) return false;
      const top = window.scrollY + hashTarget.getBoundingClientRect().top - getStickyOffset();
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
      return true;
    };

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
  }, [slug]);

  useEffect(() => {
    if (isTemplateManager) {
      document.body.setAttribute('data-page', 'template-manager-case-study');
    } else if (isDonorDirectory) {
      document.body.setAttribute('data-page', 'donor-directory-case-study');
    }
    return () => document.body.removeAttribute('data-page');
  }, [isDonorDirectory, isTemplateManager]);

  if (!isTemplateManager && !isDonorDirectory) {
    return (
      <main id="main-content" tabIndex={-1} className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-gateway px-6 text-center text-white">
        <p className="m-0 font-body text-[15px] text-white/60">Case study not found.</p>
        <Link
          to="/case-studies"
          className="font-body text-[13px] text-white/80 underline-offset-4 hover:underline"
        >
          Back to case studies
        </Link>
      </main>
    );
  }

  const backgroundClassName = isDonorDirectory
    ? 'donor-directory-case-study-bg'
    : 'template-manager-case-study-bg';

  return (
    <main id="main-content" tabIndex={-1} className={`${backgroundClassName} relative min-h-screen min-h-dvh overflow-x-clip text-white`}>
      <Link to="/case-studies" className={backButtonClassName}>
        ← Case Studies
      </Link>

      {isDonorDirectory ? (
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

                <dl data-testid="template-manager-project-summary" className="mx-auto mb-0 mt-8 grid max-w-[980px] gap-px overflow-hidden rounded-[18px] border border-white/10 bg-white/10 text-left shadow-[0_18px_55px_rgba(7,10,34,0.18)] backdrop-blur-[18px] sm:grid-cols-2 lg:grid-cols-3">
                  {narrative?.hero.summary.map((item) => (
                    <div key={item.label} className="bg-[#171B3A]/78 px-4 py-4 sm:px-5">
                      <dt className="font-body text-[10px] font-semibold text-white/55">{item.label}</dt>
                      <dd className="m-0 mt-2 font-body text-[10px] font-medium leading-[1.55] text-white/68 sm:text-[11px]">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mx-auto mb-0 mt-4 max-w-[900px] font-body text-[9px] leading-[1.55] text-white/45 sm:text-[10px]">
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
