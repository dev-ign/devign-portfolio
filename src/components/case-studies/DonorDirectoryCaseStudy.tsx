import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from './CaseStudySectionNavigation';
import { donorDirectoryCaseStudyContent as content } from '../../data/donorDirectoryCaseStudy';
import donorDirectoryHero from '../../assets/case-studies/donor-directory/donor-directory-hero.webp';
import donorDirectoryDrawerOverview from '../../assets/case-studies/donor-directory/donor-directory-drawer-overview.webp';
import donorDirectoryHistoryTimeline from '../../assets/case-studies/donor-directory/donor-directory-history-timeline.webp';
import donorDirectoryRequestFirstDraft from '../../assets/case-studies/donor-directory/donor-directory-request-first-draft.webp';
import donorDirectoryComponentSheet from '../../assets/case-studies/donor-directory/donor-directory-component-sheet.webp';
import donorDirectoryStateGrid from '../../assets/case-studies/donor-directory/donor-directory-state-grid.webp';
import donorDirectoryDesignToProduction from '../../assets/case-studies/donor-directory/donor-directory-design-to-production.webp';
import donorDirectoryAccessibilityDetails from '../../assets/case-studies/donor-directory/donor-directory-accessibility-details.webp';
import donorDirectoryImpactSummary from '../../assets/case-studies/donor-directory/donor-directory-impact-summary.webp';
import DirectoryDemo, {
  ROW_TO_DRAWER_DURATION,
  type DirectoryDemoState,
} from './donor-directory-demo/DirectoryDemo';
import { useCaseStudyScrollReveal } from '../../hooks/useCaseStudyScrollReveal';

export const donorDirectorySectionLinks: CaseStudySectionLink[] = [
  { id: 'opportunity', label: 'Opportunity', menuLabel: 'Opportunity' },
  { id: 'discovery', label: 'Discovery', menuLabel: 'Discovery' },
  { id: 'donor-context', label: 'Donor context', menuLabel: 'Donor context' },
  { id: 'bulk-actions', label: 'Bulk work', menuLabel: 'Bulk work' },
  { id: 'reusable-system', label: 'Reusable system', menuLabel: 'Reusable system' },
  { id: 'implementation', label: 'Implementation', menuLabel: 'Implementation' },
  { id: 'outcome', label: 'Outcome', menuLabel: 'Outcome' },
];

const sectionClassName =
  'case-study-section donor-directory-top-level-section relative overflow-hidden border-t border-white/[0.055] px-6 pb-[clamp(76px,8vw,112px)] pt-[clamp(76px,8vw,112px)] sm:px-10 lg:px-14 xl:px-20';

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
      className={`h-full w-full object-cover ${imageClassName}`}
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
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [demoKey, setDemoKey] = useState(0);
  const [stage, setStage] = useState('resting');
  const isAnimated = state === 'row-to-drawer';

  useEffect(() => {
    if (!frameRef.current || typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: '700px 0px', threshold: 0 }
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAnimated || !shouldRender || !frameRef.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(shouldRender);
      return undefined;
    }

    const requiredRatio = window.innerWidth < 640 ? 0.58 : window.innerWidth < 1024 ? 0.6 : 0.64;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= requiredRatio),
      { rootMargin: '-72px 0px -4% 0px', threshold: [0, requiredRatio] }
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [isAnimated, shouldRender]);

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
          <span>Interactive reconstruction</span>
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
        {shouldRender ? (
          <>
            <DirectoryDemo
              key={demoKey}
              state={state}
              autoPlay={!isAnimated || (isVisible && !isPaused)}
              onAnimationStageChange={isAnimated ? setStage : undefined}
              embedded
            />
            {children}
          </>
        ) : (
          <div className="donor-directory-demo-pending" aria-hidden="true">
            <span /><span /><span />
          </div>
        )}
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
    className="relative px-6 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28 lg:px-14 xl:px-20"
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

      <PortfolioAsset
        src={donorDirectoryHero}
        alt="Reconstructed Northstar Foundation donor directory showing search, filters, donor records, engagement, relationship managers, recent contact, giving, and status."
        assetId="donor-directory-hero"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        priority
        reveal="hero-item"
        className="mt-8 sm:mt-10"
      />

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
        <p className="mb-0 mt-5 max-w-[760px] font-body text-[15px] leading-[1.72] text-[#E0C0F2]/76">{content.opportunity.challenge}</p>
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

      <div data-reveal="intro" className="mt-[clamp(56px,7vw,88px)] max-w-[860px]">
        <h3 className="m-0 font-disp text-[clamp(34px,4.7vw,62px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">{content.experience.discovery.heading}</h3>
        <p className="mb-0 mt-6 max-w-[740px] font-body text-[16px] leading-[1.76] text-white/68">{content.experience.discovery.body}</p>
      </div>
      <div className="mt-10">
        <LiveDirectoryDemo
          state="default"
          title="Search, filters, and sorting in context"
          instruction="Search by donor name, open Filters, sort the result set, or select a record to inspect the interaction."
          variant="discovery"
        />
      </div>

      <div data-reveal="intro" className="mt-[clamp(56px,7vw,88px)] grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <article className="border-t-2 border-[#D6A7F0]/44 pt-6">
          <h3 className="m-0 max-w-[650px] font-disp text-[clamp(31px,3.6vw,48px)] font-bold leading-[1.04] tracking-[-0.04em] text-white/94">{content.experience.scale.heading}</h3>
          <p className="mb-0 mt-5 max-w-[650px] font-body text-[16px] leading-[1.76] text-white/70">{content.experience.scale.body}</p>
        </article>
        <article className="border-t border-white/12 pt-6 lg:mt-5">
          <h3 className="m-0 max-w-[520px] font-disp text-[clamp(24px,2.6vw,34px)] font-bold leading-[1.1] tracking-[-0.03em] text-white/82">{content.experience.tables.heading}</h3>
          <p className="mb-0 mt-5 max-w-[540px] font-body text-[15px] leading-[1.74] text-white/60">{content.experience.tables.body}</p>
        </article>
      </div>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="row-selected"
          title="Table hierarchy in practice"
          instruction="Annotations focus on the three decisions that made dense records easier to scan."
          variant="anatomy"
        >
          <ol className="donor-directory-anatomy-annotations donor-directory-anatomy-annotations--condensed" aria-label="Table anatomy annotations">
            <li><span>1</span>Information hierarchy</li>
            <li><span>2</span>Controlled density</li>
            <li><span>3</span>Predictable interaction</li>
          </ol>
        </LiveDirectoryDemo>
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
      <div className="mt-12">
        <LiveDirectoryDemo
          state="row-to-drawer"
          title="Directory remains visible; donor context comes forward"
          instruction="The sequence moves through overview, giving, history, and the next action before returning to the preserved table state."
          variant="hero"
        />
      </div>

      <PortfolioAsset
        src={donorDirectoryDrawerOverview}
        alt="Reconstructed donor directory with Amara Lewis selected and an Overview drawer showing metrics, Request First Draft, Giving History, and recent relationship activity."
        assetId="donor-directory-drawer-overview"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-8 sm:mt-10"
      />
      <div data-reveal="text" className="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[20px] border border-[#D4A5EF]/18 bg-black/10 p-6 sm:p-8">
          <h3 className="m-0 font-disp text-[clamp(23px,2.5vw,34px)] font-bold tracking-[-0.03em] text-white/90">Human-in-the-loop by design</h3>
          <p className="mb-0 mt-4 font-body text-[15px] leading-[1.74] text-white/66">{content.experience.donorContext.ai}</p>
          <p className="mb-0 mt-5 font-body text-[13px] font-semibold text-[#E0BCF4]/80">AI support → human decision</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <PortfolioAsset
              src={donorDirectoryHistoryTimeline}
              alt="History tab showing five chronological fictional donor activities for Amara Lewis, tightly framed with only enough table context for orientation."
              assetId="donor-directory-history-timeline"
              aspectRatio="4 / 3"
              width={1800}
              height={1200}
              objectPosition="72% center"
              reveal="none"
            />
            <p className="mb-0 mt-3 font-body text-[12px] leading-[1.6] text-white/58">Relationship history becomes a narrative, not an activity dump.</p>
          </div>
          <div>
            <PortfolioAsset
              src={donorDirectoryRequestFirstDraft}
              alt="Overview drawer detail focused on the recommendation, Request First Draft call to action, surrounding metrics, and five-year giving history."
              assetId="donor-directory-request-first-draft"
              aspectRatio="4 / 3"
              width={1600}
              height={1200}
              objectPosition="76% center"
              reveal="none"
            />
            <p className="mb-0 mt-3 font-body text-[12px] leading-[1.6] text-white/58">Recommendation, supporting context, and giving stay connected.</p>
          </div>
        </div>
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
      <PortfolioAsset
        src={donorDirectoryComponentSheet}
        alt="Reconstructed donor directory component system grouped into Inputs and Filters, Data and Selection, Donor Context, and Feedback and States."
        assetId="donor-directory-component-sheet"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-10 sm:mt-12"
      />
      <div data-reveal="intro" className="mt-[clamp(60px,7vw,88px)] max-w-[900px]">
        <h3 className="m-0 font-disp text-[clamp(32px,4.2vw,54px)] font-extrabold leading-[1] tracking-[-0.045em] text-white">{content.experience.states.heading}</h3>
        <p className="mb-0 mt-5 max-w-[740px] font-body text-[16px] leading-[1.76] text-white/68">{content.experience.states.body}</p>
      </div>
      <PortfolioAsset
        src={donorDirectoryStateGrid}
        alt="Interaction state grid for the donor directory showing loading, empty, no-results, error, selected, and unavailable-action states."
        assetId="donor-directory-state-grid"
        aspectRatio="3 / 2"
        width={2400}
        height={1600}
        className="mt-9 sm:mt-10"
      />
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

      <div data-reveal="intro" className="mt-[clamp(60px,7vw,88px)] max-w-[920px]">
        <h3 className="m-0 font-disp text-[clamp(32px,4.2vw,54px)] font-extrabold leading-[1] tracking-[-0.045em] text-white">{content.quality.heading}</h3>
        <p className="mb-0 mt-5 max-w-[740px] font-body text-[16px] leading-[1.76] text-white/68">{content.quality.body}</p>
      </div>
      <PortfolioAsset
        src={donorDirectoryAccessibilityDetails}
        alt="Accessibility and interaction-quality composition highlighting visible keyboard focus, row selection, drawer tabs, responsive mobile information priority, loading structure, and reduced-motion behavior."
        assetId="donor-directory-accessibility-details"
        aspectRatio="3 / 2"
        width={2400}
        height={1600}
        className="mt-9 sm:mt-10"
      />
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
      <PortfolioAsset
        src={donorDirectoryImpactSummary}
        alt="Calm summary of the reconstructed donor platform showing the directory, contextual donor drawer, relationship history, and connected next actions."
        assetId="donor-directory-impact-summary"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-12 sm:mt-14"
      />

      <div data-reveal="text" className="mx-auto mt-[clamp(60px,7vw,88px)] max-w-[820px] text-center">
        <h3 className="m-0 font-disp text-[clamp(34px,4.5vw,58px)] font-extrabold tracking-[-0.045em] text-white">{content.reflection.heading}</h3>
        <p className="mx-auto mb-0 mt-6 max-w-[720px] font-body text-[clamp(16px,1.7vw,22px)] leading-[1.68] text-white/70">{content.reflection.body}</p>
        <nav aria-label="Continue exploring" className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/case-studies/gravyty-template-manager" className="inline-flex min-h-11 items-center rounded-full border border-[#D4A5EF]/34 bg-[#D4A5EF]/12 px-5 py-3 font-body text-[11px] font-semibold text-white/84 no-underline transition hover:border-[#D4A5EF]/58 hover:bg-[#D4A5EF]/18 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80">
            View the Template Manager case study ↗
          </Link>
          <Link to="/case-studies" className="inline-flex min-h-11 items-center rounded-full border border-white/13 bg-white/[0.055] px-5 py-3 font-body text-[11px] font-medium text-white/62 no-underline backdrop-blur-md transition hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80">
            Back to all case studies
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
