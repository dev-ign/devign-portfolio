import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from './CaseStudySectionNavigation';
import CaseStudyProjectDetails from './CaseStudyProjectDetails';
import { donorDirectoryCaseStudyContent as content } from '../../data/donorDirectoryCaseStudy';
import donorDirectoryHero from '../../assets/case-studies/donor-directory/donor-directory-hero.webp';
import donorDirectoryDesignToProduction from '../../assets/case-studies/donor-directory/donor-directory-design-to-production.webp';
import DirectoryDemo, {
  ROW_TO_DRAWER_DURATION,
  type DirectoryDemoState,
} from './donor-directory-demo/DirectoryDemo';
import { useCaseStudyScrollReveal } from '../../hooks/useCaseStudyScrollReveal';

export const donorDirectorySectionLinks: CaseStudySectionLink[] = [
  { id: 'opportunity', label: 'The problem', menuLabel: 'Problem' },
  { id: 'research', label: 'Research and discovery', menuLabel: 'Research' },
  { id: 'design-priorities', label: 'From findings to decisions', menuLabel: 'Design priorities' },
  { id: 'discovery', label: 'Discover and narrow', menuLabel: 'Search and filters' },
  { id: 'bulk-actions', label: 'From discovery to action', menuLabel: 'Bulk actions' },
  { id: 'donor-context', label: 'Inspect in context', menuLabel: 'Donor context' },
  { id: 'reusable-system', label: 'Scale and accessibility', menuLabel: 'Scale' },
  { id: 'implementation', label: 'Design to implementation', menuLabel: 'Implementation' },
  { id: 'outcome', label: 'Validation and lessons', menuLabel: 'Outcomes' },
];

const sectionClassName =
  'case-study-section donor-directory-top-level-section relative overflow-hidden border-t border-white/[0.055] px-6 pb-[clamp(56px,6vw,84px)] pt-[clamp(56px,6vw,84px)] sm:px-10 lg:px-14 xl:px-20';

const PortfolioAsset: React.FC<{
  src: string;
  alt: string;
  assetId: string;
  aspectRatio: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  priority?: boolean;
  reveal?: 'visual' | 'hero-item' | 'none';
}> = ({
  src,
  alt,
  assetId,
  aspectRatio,
  width,
  height,
  className = '',
  imageClassName = '',
  objectPosition,
  priority = false,
  reveal = 'visual',
}) => (
  <figure
    data-asset-id={assetId}
    data-reveal={reveal === 'visual' ? 'visual' : undefined}
    data-reveal-hero-visual={reveal === 'hero-item' ? '' : undefined}
    className={`m-0 overflow-hidden rounded-[clamp(20px,3vw,32px)] border border-white/10 bg-[#0F0F1A] shadow-[0_28px_80px_rgba(0,0,0,0.24)] ${className}`}
    style={{ aspectRatio }}
  >
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={imageClassName || 'h-full w-full object-cover'}
      style={objectPosition ? { objectPosition } : undefined}
    />
  </figure>
);

const demoStageLabels: Record<string, string> = {
  resting: 'Resting directory',
  'row-focused': 'Row hover',
  'row-activated': 'Row selected',
  'drawer-opening': 'Drawer opening',
  'overview-settled': 'Overview',
  'giving-history': 'Giving history',
  history: 'History preview',
  'action-emphasis': 'Request First Draft',
  'drawer-closing': 'Drawer closing',
  'context-restored': 'Table context preserved',
};

const LiveDirectoryDemo: React.FC<{
  state: DirectoryDemoState;
  title: string;
  instruction: string;
  variant?: 'discovery' | 'anatomy' | 'hero' | 'bulk';
  children?: React.ReactNode;
}> = ({ state, title, instruction, variant = 'discovery', children }) => {
  const frameRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [demoKey, setDemoKey] = useState(0);
  const [stage, setStage] = useState('resting');
  const isAnimated = state === 'row-to-drawer';

  useEffect(() => {
    if (!isAnimated || !frameRef.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const requiredRatio = window.innerWidth < 640 ? 0.58 : window.innerWidth < 1024 ? 0.6 : 0.64;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= requiredRatio),
      { rootMargin: '-72px 0px -4% 0px', threshold: [0, requiredRatio] }
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [isAnimated]);

  const replay = useCallback(() => {
    setDemoKey((current) => current + 1);
    setStage('resting');
    setIsPaused(false);
  }, []);

  return (
    <figure
      ref={frameRef}
      className={`donor-directory-live-figure donor-directory-live-figure--${variant} m-0`}
      data-testid={`live-directory-demo-${variant}`}
      data-reveal="visual"
      data-visual-variant={variant === 'anatomy' ? 'anatomy' : undefined}
    >
      <figcaption className="donor-directory-live-caption">
        <div>
          <span>{isAnimated ? 'Reconstructed interaction sequence' : 'Interactive reconstruction'}</span>
          <strong>{title}</strong>
        </div>
        <p>{instruction}</p>
        {isAnimated && (
          <div className="donor-directory-playback" aria-label="Animation controls">
            <span aria-hidden="true">{demoStageLabels[stage] ?? stage}</span>
            <button
              type="button"
              aria-label={`${isPaused ? 'Play' : 'Pause'} row-to-drawer animation`}
              onClick={() => setIsPaused((current) => !current)}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
            <button type="button" aria-label="Replay row-to-drawer animation" onClick={replay}>Replay</button>
          </div>
        )}
      </figcaption>
      <div className="donor-directory-live-demo">
        <DirectoryDemo
          key={demoKey}
          state={state}
          autoPlay={!isAnimated || (isVisible && !isPaused)}
          onAnimationStageChange={isAnimated ? setStage : undefined}
          embedded
          presentationOnly={isAnimated}
        />
        {children}
      </div>
      {isAnimated && (
        <p className="sr-only">
          The complete interaction repeats every {ROW_TO_DRAWER_DURATION / 1000} seconds and pauses when it leaves the viewport.
        </p>
      )}
    </figure>
  );
};

const SectionTitle: React.FC<{
  id: string;
  heading: string;
  intro?: string;
  maxWidth?: string;
}> = ({ id, heading, intro, maxWidth = 'max-w-[960px]' }) => (
  <header className={maxWidth} data-reveal="intro">
    <h2
      id={`${id}-title`}
      className="m-0 font-disp text-[clamp(40px,5.5vw,76px)] font-extrabold leading-[0.96] tracking-[-0.05em] text-white"
    >
      {heading}
    </h2>
    {intro && (
      <p className="mb-0 mt-6 max-w-[740px] font-body text-[clamp(16px,1.45vw,21px)] leading-[1.72] text-white/70">
        {intro}
      </p>
    )}
  </header>
);

const DonorDirectoryHero: React.FC = () => (
  <section
    id="hero"
    aria-labelledby="donor-directory-title"
    data-case-study-section="hero"
    className="relative px-6 pb-12 pt-24 sm:px-10 sm:pb-16 sm:pt-28 lg:px-14 xl:px-20"
  >
    <div data-reveal="hero" className="relative mx-auto w-full max-w-[1320px]">
      <div data-hero-copy className="mx-auto max-w-[1020px] text-center">
        <p className="m-0 font-body text-[12px] font-medium text-[#E1C2F3]/72">{content.hero.eyebrow}</p>
        <h1
          id="donor-directory-title"
          className="m-0 mt-5 font-disp text-[clamp(42px,7vw,104px)] font-extrabold leading-[0.9] tracking-[-0.055em] text-white"
        >
          {content.hero.title}
        </h1>
        <p className="mx-auto mb-0 mt-6 max-w-[860px] font-body text-[clamp(16px,1.7vw,22px)] leading-[1.65] tracking-[-0.015em] text-white/72">
          {content.hero.subtitle}
        </p>
      </div>

      <section aria-labelledby="project-details-title" className="mx-auto mt-8 max-w-[1030px]">
        <h2 id="project-details-title" className="sr-only">Project details</h2>
        <CaseStudyProjectDetails items={content.hero.quickFacts} />
        <p className="mx-auto mb-0 mt-5 max-w-[80ch] text-center font-body text-[12px] leading-[1.65] text-white/64">
          {content.hero.nda}
        </p>
      </section>

      <div className="mt-8 flex w-full justify-center sm:mt-10">
        <PortfolioAsset
          src={donorDirectoryHero}
          alt="Top of a reconstructed donor directory showing navigation, search, filters, and a donor results table."
          assetId="donor-directory-hero"
          aspectRatio="16 / 10"
          width={2400}
          height={1500}
          priority
          reveal="hero-item"
          className="w-full max-w-[1320px]"
          imageClassName="block h-auto w-full object-contain"
        />
      </div>

      <CaseStudySectionNavigation sections={donorDirectorySectionLinks} tone="donor-directory" />
    </div>
  </section>
);

const OpportunitySection: React.FC = () => (
  <section
    id="opportunity"
    aria-labelledby="opportunity-title"
    data-case-study-section="opportunity"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="opportunity" heading={content.opportunity.heading} />
      <div data-reveal="text" className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
        {content.opportunity.paragraphs.map((paragraph) => (
          <p key={paragraph} className="m-0 max-w-[600px] font-body text-[16px] leading-[1.76] text-white/68">{paragraph}</p>
        ))}
      </div>
      <blockquote data-reveal="text" className="m-0 mt-10 max-w-[980px] border-l-2 border-[#D7A9F0]/42 pl-6 sm:pl-8">
        <p className="m-0 font-disp text-[clamp(22px,2.6vw,36px)] font-bold leading-[1.25] tracking-[-0.03em] text-white/86">
          {content.opportunity.problem}
        </p>
      </blockquote>
    </div>
  </section>
);

const ResearchSection: React.FC = () => (
  <section
    id="research"
    aria-labelledby="research-title"
    data-case-study-section="research"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="research" heading={content.research.heading} intro={content.research.approach} maxWidth="max-w-[1100px]" />
      <p data-reveal="text" className="mb-0 mt-6 max-w-[800px] font-body text-[16px] leading-[1.76] text-white/68">{content.research.participants}</p>
      <div data-reveal="text" className="mt-9 max-w-[1060px] border-t border-white/14 pt-6">
        <h3 className="m-0 font-disp text-[23px] font-bold tracking-[-0.025em] text-white/90">{content.research.questionsHeading}</h3>
        <p className="mb-0 mt-3 font-body text-[14px] leading-[1.7] text-white/64">{content.research.questionsContext}</p>
        <ul className="mb-0 mt-5 grid list-disc gap-x-12 gap-y-4 pl-5 font-body text-[15px] leading-[1.72] text-white/78 md:grid-cols-2">
          {content.research.questions.map((question) => <li key={question}>{question}</li>)}
        </ul>
      </div>
      <div data-reveal="card-group" className="mt-10">
        <h3 className="m-0 font-disp text-[23px] font-bold tracking-[-0.025em] text-white/90">{content.research.findingsHeading}</h3>
        <div className="mt-6 grid gap-x-12 gap-y-6 lg:grid-cols-3">
          {content.research.findings.map((finding) => (
            <article key={finding.title} className="border-t border-[#D8AEF0]/24 pt-5">
              <h4 className="m-0 font-disp text-[21px] font-bold tracking-[-0.025em] text-white/90">{finding.title}</h4>
              <p className="mb-0 mt-3 max-w-[600px] font-body text-[15px] leading-[1.72] text-white/68">{finding.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div data-reveal="text" className="mt-9 max-w-[900px] border-l-2 border-[#D7A9F0]/42 pl-6 sm:pl-8">
        <h3 className="m-0 font-disp text-[23px] font-bold tracking-[-0.025em] text-white/90">{content.research.shiftHeading}</h3>
        <p className="mb-0 mt-3 font-body text-[16px] leading-[1.76] text-white/70">{content.research.shift}</p>
      </div>
    </div>
  </section>
);

const DesignPrioritiesSection: React.FC = () => (
  <section
    id="design-priorities"
    aria-labelledby="design-priorities-title"
    data-case-study-section="design-priorities"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="design-priorities" heading={content.priorities.heading} intro={content.priorities.intro} />
      <dl data-reveal="card-group" className="mb-0 mt-9 grid max-w-[1180px] gap-x-12 gap-y-6 md:grid-cols-2">
        {content.priorities.items.map((item) => (
          <div key={item.need} className="border-t border-white/14 pt-5">
            <dt className="font-body text-[14px] leading-[1.7] text-white/68">{item.need}</dt>
            <dd className="mb-0 ml-0 mt-2 font-disp text-[20px] font-bold leading-[1.4] tracking-[-0.025em] text-white/90">
              <a href={`#${item.target}`} className="rounded-sm underline decoration-white/25 underline-offset-4 transition hover:decoration-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80">
                {item.decision}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <p data-reveal="text" className="mb-0 mt-8 max-w-[900px] font-body text-[14px] leading-[1.72] text-white/64">{content.priorities.scope}</p>
      <WorkflowModel />
    </div>
  </section>
);

const WorkflowModel: React.FC = () => (
  <div data-reveal="card-group" className="donor-directory-workflow-model mt-10" aria-label="Donor directory workflow model">
    {content.experience.flow.map((step, index) => (
      <React.Fragment key={step}>
        <div>
          <strong>{step}</strong>
          <span>{content.experience.flowDetails[index]}</span>
        </div>
        {index < content.experience.flow.length - 1 && <i aria-hidden="true">→</i>}
      </React.Fragment>
    ))}
  </div>
);

const DiscoverySection: React.FC = () => (
  <section
    id="discovery"
    aria-labelledby="discovery-title"
    data-case-study-section="discovery"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="discovery" heading={content.experience.heading} intro={content.experience.intro} maxWidth="max-w-[1060px]" />

      <div data-reveal="card-group" className="mt-9 grid max-w-[1180px] gap-6 md:grid-cols-2 md:gap-12">
        {[content.experience.tables, content.experience.navigation].map((item) => (
          <article key={item.heading} className="border-t border-white/14 pt-5">
            <h3 className="m-0 font-disp text-[21px] font-bold tracking-[-0.025em] text-white/86">{item.heading}</h3>
            <p className="mb-0 mt-3 max-w-[550px] font-body text-[15px] leading-[1.72] text-white/68">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <LiveDirectoryDemo
          state="default"
          title="Find a person, then refine the results"
          instruction="Try “Martinez” and High engagement. Clear those controls to explore sorting and pagination, or open a donor to inspect their context."
          variant="discovery"
        />
      </div>
    </div>
  </section>
);

const DonorContextSection: React.FC = () => (
  <section
    id="donor-context"
    aria-labelledby="donor-context-title"
    data-case-study-section="donor-context"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="donor-context" heading={content.experience.donorContext.heading} intro={content.experience.donorContext.body} />
      <div data-reveal="card-group" className="mt-9 grid max-w-[980px] gap-5 sm:grid-cols-2">
        {content.experience.donorContext.comparison.map((option) => (
          <article key={option.title} className="border-t border-white/14 pt-5">
            <h3 className="m-0 font-disp text-[21px] font-bold tracking-[-0.025em] text-white/86">{option.title}</h3>
            <p className="mb-0 mt-3 max-w-[420px] font-body text-[14px] leading-[1.7] text-white/64">{option.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-9">
        <LiveDirectoryDemo
          state="row-to-drawer"
          title="Directory remains visible; donor context comes forward"
          instruction="This sequence illustrates inspection and return. Try the drawer yourself in either interactive directory above, including Overview, History, Details, and Request First Draft."
          variant="hero"
        />
      </div>

      <div data-reveal="text" className="mt-8 max-w-[800px]">
        <h3 className="m-0 font-disp text-[23px] font-bold tracking-[-0.025em] text-white/90">{content.experience.donorContext.aiHeading}</h3>
        <p className="mb-0 mt-3 font-body text-[16px] leading-[1.76] text-white/70">{content.experience.donorContext.ai}</p>
      </div>
    </div>
  </section>
);

const BulkActionsSection: React.FC = () => (
  <section
    id="bulk-actions"
    aria-labelledby="bulk-actions-title"
    data-case-study-section="bulk-actions"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="bulk-actions" heading={content.experience.bulkActions.heading} intro={content.experience.bulkActions.body} />
      <p data-reveal="text" className="mb-0 mt-6 max-w-[720px] border-l border-[#D4A5EF]/32 pl-5 font-body text-[14px] leading-[1.72] text-white/60">
        {content.experience.bulkActions.scope}
      </p>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="selected"
          title="Progressive disclosure based on selection"
          instruction="Select or clear records to see bulk controls appear only when they are relevant."
          variant="bulk"
        />
      </div>
      <p data-reveal="text" className="mb-0 mt-7 max-w-[900px] font-body text-[15px] leading-[1.72] text-white/68">{content.experience.bulkActions.consideration}</p>
    </div>
  </section>
);

const SystemsSection: React.FC = () => (
  <section
    id="reusable-system"
    aria-labelledby="reusable-system-title"
    data-case-study-section="reusable-system"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="reusable-system" heading={content.systems.heading} maxWidth="max-w-[1100px]" />
      <div data-reveal="text" className="mt-7 grid max-w-[1060px] gap-5 md:grid-cols-2 md:gap-10">
        {content.systems.paragraphs.map((paragraph) => (
          <p key={paragraph} className="m-0 font-body text-[16px] leading-[1.74] text-white/68">{paragraph}</p>
        ))}
      </div>
      <div data-reveal="card-group" className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Search and filters', 'Clear input, active states, and a recoverable no-results view.'],
          ['Table and selection', 'Stable row identity, readable hierarchy, and contextual bulk controls.'],
          ['Donor context', 'A drawer with focused details, keyboard tabs, and focus return.'],
          ['Feedback and states', 'Loading, empty, error, and action states specified alongside the ideal path.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-[18px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <h3 className="m-0 font-disp text-[20px] font-bold tracking-[-0.025em] text-white/90">{title}</h3>
            <p className="mb-0 mt-3 font-body text-[14px] leading-[1.65] text-white/66">{description}</p>
          </article>
        ))}
      </div>
      <p data-reveal="text" className="mb-0 mt-7 max-w-[900px] font-body text-[15px] leading-[1.72] text-white/66">{content.experience.states.body}</p>
    </div>
  </section>
);

const ImplementationSection: React.FC = () => (
  <section
    id="implementation"
    aria-labelledby="implementation-title"
    data-case-study-section="implementation"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="implementation" heading={content.implementation.heading} intro={content.implementation.body} maxWidth="max-w-[1060px]" />
      <div data-reveal="text" className="donor-directory-production-flow mt-9" aria-label="Design and implementation workflow">
        {content.implementation.steps.map((step, index) => (
          <React.Fragment key={step}>
            <span>{step}</span>
            {index < content.implementation.steps.length - 1 && <i aria-hidden="true">→</i>}
          </React.Fragment>
        ))}
      </div>
      <PortfolioAsset
        src={donorDirectoryDesignToProduction}
        alt="Side-by-side design specification and reconstructed React component implementation, connected by tokens, variants, composition, Material UI, and keyboard behavior."
        assetId="donor-directory-design-to-production"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-10 sm:mt-12"
      />

      <p data-reveal="text" className="mb-0 mt-7 max-w-[900px] font-body text-[15px] leading-[1.72] text-white/66">{content.quality.body}</p>
    </div>
  </section>
);

const OutcomeSection: React.FC = () => (
  <section
    id="outcome"
    aria-labelledby="outcome-title"
    data-case-study-section="outcome"
    data-testid="case-study-section"
    className={`${sectionClassName} donor-directory-impact-section`}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionTitle id="outcome" heading={content.outcome.heading} intro={content.outcome.intro} />
      <div data-reveal="card-group" className="mt-12 grid max-w-[1180px] gap-x-12 gap-y-9 lg:grid-cols-3">
        {content.outcome.items.map((item) => (
          <article key={item.title} className="border-t border-[#D8AEF0]/24 pt-6">
            <h3 className="m-0 font-disp text-[clamp(23px,2.2vw,31px)] font-bold leading-[1.12] tracking-[-0.03em] text-white/92">{item.title}</h3>
            <p className="mb-0 mt-4 max-w-[350px] font-body text-[15px] leading-[1.72] text-white/66">{item.body}</p>
          </article>
        ))}
      </div>
      <div data-reveal="text" className="mt-10 max-w-[1180px] border-t border-white/14 pt-6">
        <h3 className="m-0 font-disp text-[23px] font-bold tracking-[-0.025em] text-white/90">{content.outcome.measurementHeading}</h3>
        <p className="mb-0 mt-3 max-w-[800px] font-body text-[15px] leading-[1.72] text-white/68">{content.outcome.measurementContext}</p>
        <ul className="mb-0 mt-5 grid list-disc gap-x-12 gap-y-3 pl-5 font-body text-[15px] leading-[1.72] text-white/72 md:grid-cols-2">
          {content.outcome.measures.map((measure) => <li key={measure}>{measure}</li>)}
        </ul>
      </div>
      <div data-reveal="text" className="mx-auto mt-12 max-w-[820px] text-center">
        <h3 className="m-0 font-disp text-[clamp(23px,2.2vw,31px)] font-bold leading-[1.12] tracking-[-0.03em] text-white/92">{content.reflection.heading}</h3>
        <p className="mx-auto mb-0 mt-6 max-w-[720px] font-body text-[clamp(16px,1.7vw,22px)] leading-[1.68] text-white/70">{content.reflection.body}</p>
        <nav aria-label="Continue exploring" className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/case-studies/gravyty-template-manager" className="inline-flex min-h-11 items-center rounded-full border border-[#D4A5EF]/34 bg-[#D4A5EF]/12 px-5 py-3 font-body text-[11px] font-semibold text-white/84 no-underline transition hover:border-[#D4A5EF]/58 hover:bg-[#D4A5EF]/18 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80">
            View the Template Manager case study ↗
          </Link>
          <Link to="/portfolio#donor-directory" className="inline-flex min-h-11 items-center rounded-full border border-white/13 bg-white/[0.055] px-5 py-3 font-body text-[11px] font-medium text-white/62 no-underline backdrop-blur-md transition hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80">
            Back to Portfolio
          </Link>
          <Link to="/work-with-me" className="inline-flex min-h-11 items-center px-3 py-3 font-body text-[11px] font-medium text-white/48 no-underline transition hover:text-white/82 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80">
            Work with DevignUX
          </Link>
        </nav>
      </div>
    </div>
  </section>
);

const DonorDirectoryCaseStudy: React.FC = () => {
  const motionRootRef = useRef<HTMLDivElement>(null);
  useCaseStudyScrollReveal(motionRootRef);

  return (
    <div ref={motionRootRef} data-case-study-motion-root="donor-directory">
      <DonorDirectoryHero />
      <OpportunitySection />
      <ResearchSection />
      <DesignPrioritiesSection />
      <DiscoverySection />
      <BulkActionsSection />
      <DonorContextSection />
      <SystemsSection />
      <ImplementationSection />
      <OutcomeSection />
    </div>
  );
};

export default DonorDirectoryCaseStudy;
