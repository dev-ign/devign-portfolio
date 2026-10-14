import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from './CaseStudySectionNavigation';
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
  { id: 'discovery', label: 'Discover and narrow', menuLabel: 'Discovery' },
  { id: 'donor-context', label: 'Inspect in context', menuLabel: 'Donor context' },
  { id: 'bulk-actions', label: 'From discovery to action', menuLabel: 'Action' },
  { id: 'reusable-system', label: 'Scale and accessibility', menuLabel: 'Scale' },
  { id: 'implementation', label: 'Design to implementation', menuLabel: 'Implementation' },
  { id: 'outcome', label: 'Reflection', menuLabel: 'Reflection' },
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

      <section aria-labelledby="project-details-title" className="mx-auto mt-8 max-w-[1180px]">
        <h2 id="project-details-title" className="sr-only">Project details</h2>
        <dl className="donor-directory-project-facts m-0 grid grid-cols-2 overflow-hidden rounded-[18px] border border-white/10 bg-black/10 text-left md:grid-cols-3 lg:grid-cols-6">
          {content.hero.quickFacts.map((fact) => (
            <div key={fact.label} className="border-white/8 px-4 py-4 sm:px-5 sm:py-5">
              <dt className="font-body text-[10px] font-semibold text-white/38">{fact.label}</dt>
              <dd className="mb-0 ml-0 mt-2 font-body text-[11px] font-medium leading-[1.55] text-white/68 sm:text-[12px]">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mb-0 mt-5 max-w-[980px] text-center font-body text-[11px] leading-[1.65] text-white/46 sm:text-[12px]">
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
      <WorkflowModel />

      <div className="mt-8">
        <LiveDirectoryDemo
          state="default"
          title="Search, inspect, select, and export"
          instruction="Try “Martinez”, apply High engagement, open a result, close the drawer, then select records and export the fictional sample."
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
          instruction="This controlled sequence illustrates the drawer decision. Use the interactive demo above to open and close a donor yourself."
          variant="hero"
        />
      </div>

      <p data-reveal="text" className="mb-0 mt-7 max-w-[800px] font-body text-[14px] leading-[1.7] text-white/62">{content.experience.donorContext.ai}</p>
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
        {content.experience.bulkActions.mapping}
      </p>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="selected"
          title="Progressive disclosure based on selection"
          instruction="Select or clear records to see bulk controls appear only when they are relevant."
          variant="bulk"
        />
      </div>
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
      <SectionTitle id="outcome" heading={content.outcome.heading} />
      <div data-reveal="card-group" className="mt-12 grid max-w-[1180px] gap-x-12 gap-y-9 lg:grid-cols-3">
        {content.outcome.items.map((item) => (
          <article key={item.title} className="border-t border-[#D8AEF0]/24 pt-6">
            <h3 className="m-0 font-disp text-[clamp(23px,2.2vw,31px)] font-bold leading-[1.12] tracking-[-0.03em] text-white/92">{item.title}</h3>
            <p className="mb-0 mt-4 max-w-[350px] font-body text-[15px] leading-[1.72] text-white/66">{item.body}</p>
          </article>
        ))}
      </div>
      <div data-reveal="text" className="mx-auto mt-12 max-w-[820px] text-center">
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
      <DiscoverySection />
      <DonorContextSection />
      <BulkActionsSection />
      <SystemsSection />
      <ImplementationSection />
      <OutcomeSection />
    </div>
  );
};

export default DonorDirectoryCaseStudy;
