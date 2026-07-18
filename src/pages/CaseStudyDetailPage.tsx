import React, { useEffect, useLayoutEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import TemplateManagerHeroVisuals from '../components/case-studies/TemplateManagerHeroVisuals';
import TemplateManagerSectionNavigation, {
  type TemplateManagerSectionLink,
} from '../components/case-studies/TemplateManagerSectionNavigation';
import TemplateManagerStory from '../components/case-studies/TemplateManagerStory';
import { projects } from '../data/projects';

const TEMPLATE_MANAGER_SLUG = 'gravyty-template-manager';
const templateManagerProject = projects.find((project) => project.id === TEMPLATE_MANAGER_SLUG);

const templateManagerSectionLinks: TemplateManagerSectionLink[] = [
  { id: 'hero', label: 'Hero', menuLabel: 'Hero' },
  { id: 'opportunity', label: 'Opportunity', menuLabel: 'Opportunity' },
  { id: 'workflow', label: 'Workflow', menuLabel: 'Workflow' },
  { id: 'organization', label: 'Organization', menuLabel: 'Organization' },
  { id: 'discovery', label: 'Discovery', menuLabel: 'Discovery' },
  { id: 'editing', label: 'Editor', menuLabel: 'Editor' },
  { id: 'sharing', label: 'Collaboration', menuLabel: 'Collaboration' },
  { id: 'errors', label: 'Validation', menuLabel: 'Validation' },
  { id: 'implementation', label: 'Implementation', menuLabel: 'Implementation' },
  { id: 'impact', label: 'Impact', menuLabel: 'Impact' },
  { id: 'reflection', label: 'Reflection', menuLabel: 'Reflection' },
];

const backButtonClassName = [
  'fixed top-5 left-4 z-[60] inline-flex items-center sm:top-6 sm:left-6',
  'py-[9px] px-[18px]',
  'bg-black/28 [backdrop-filter:blur(16px)] [-webkit-backdrop-filter:blur(16px)]',
  'text-white/82 rounded-full font-body text-[13px] font-medium',
  'border border-white/18 cursor-pointer no-underline shadow-[0_8px_26px_rgba(4,6,20,0.2)]',
  'transition-[opacity,background-color] duration-200 hover:bg-black/40 hover:text-white',
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80',
].join(' ');

const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const narrative = templateManagerProject?.caseStudy.narrative;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  useEffect(() => {
    document.body.setAttribute('data-page', 'template-manager-case-study');
    return () => document.body.removeAttribute('data-page');
  }, []);

  if (slug !== TEMPLATE_MANAGER_SLUG || !narrative) {
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

  return (
    <main id="main-content" tabIndex={-1} className="template-manager-case-study-bg relative min-h-screen min-h-dvh overflow-x-clip text-white">
      <Link to="/case-studies" className={backButtonClassName}>
        ← Case Studies
      </Link>

      <TemplateManagerHeroVisuals />

      <section
        id="hero"
        aria-labelledby="template-manager-title"
        data-case-study-section="hero"
        className="relative flex min-h-screen min-h-dvh scroll-mt-[152px] items-center justify-center px-6 py-24 text-center sm:scroll-mt-24 sm:px-10"
      >
        <div className="relative w-full max-w-[820px]">
          <div className="relative z-10">
            <h1
              id="template-manager-title"
              className="m-0 font-disp text-[clamp(36px,5vw,48px)] font-extrabold leading-[1.15] tracking-[-0.035em] text-white"
            >
              {narrative.hero.title}
            </h1>
            <p className="mx-auto mb-0 mt-5 max-w-[760px] font-body text-[clamp(16px,2vw,20px)] font-normal leading-[1.6] tracking-[-0.015em] text-white/90">
              {narrative.hero.subtitle}
            </p>
          </div>
          <TemplateManagerSectionNavigation sections={templateManagerSectionLinks} />
        </div>
      </section>

      <TemplateManagerStory narrative={narrative} />
    </main>
  );
};

export default CaseStudyDetailPage;
