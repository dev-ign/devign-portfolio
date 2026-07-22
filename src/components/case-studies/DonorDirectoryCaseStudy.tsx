import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from './CaseStudySectionNavigation';
import {
  donorDirectoryCaseStudyContent as content,
  type DonorDirectoryCardContent,
  type DonorDirectorySectionContent,
} from '../../data/donorDirectoryCaseStudy';
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
  { id: 'design-principles', label: 'Principles', menuLabel: 'Principles' },
  { id: 'experience', label: 'Experience', menuLabel: 'Experience' },
  { id: 'building-reusable-components', label: 'Systems', menuLabel: 'Systems' },
  { id: 'designing-for-engineering', label: 'Implementation', menuLabel: 'Implementation' },
  { id: 'accessibility-and-polish', label: 'Quality', menuLabel: 'Quality' },
  { id: 'impact', label: 'Impact', menuLabel: 'Impact' },
];

const sectionClassName =
  'case-study-section donor-directory-top-level-section relative overflow-hidden border-t border-white/[0.055] px-6 pb-[clamp(88px,10vw,144px)] pt-[var(--case-study-section-top)] sm:px-10 lg:px-14 xl:px-20';

const subsectionClassName =
  'case-study-section donor-directory-subsection relative border-t border-white/[0.055] px-6 pb-[clamp(64px,6.2vw,88px)] pt-[var(--case-study-subsection-top)] sm:px-10 lg:px-14 xl:px-20';

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
          <span>Live product reconstruction</span>
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

const tableAnnotations = [
  ['01', 'Donor hierarchy'],
  ['02', 'Spacing'],
  ['03', 'Alignment'],
  ['04', 'Information density'],
  ['05', 'Sorting'],
  ['06', 'Selection'],
  ['07', 'Status treatment'],
  ['08', 'Row actions'],
] as const;

const SectionIntro: React.FC<DonorDirectorySectionContent & {
  id: string;
  maxWidth?: string;
  reveal?: boolean;
}> = ({
  id,
  label,
  heading,
  intro,
  maxWidth = 'max-w-[900px]',
  reveal = true,
}) => (
  <header className={maxWidth} data-reveal={reveal ? 'intro' : undefined}>
    <p className="m-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[#D4A5EF]/72">{label}</p>
    <h2
      id={`${id}-title`}
      className="m-0 mt-5 font-disp text-[clamp(42px,6vw,88px)] font-extrabold leading-[0.94] tracking-[-0.052em] text-white"
    >
      {heading}
    </h2>
    {intro && (
      <p className="mb-0 mt-7 max-w-[720px] font-body text-[clamp(16px,1.5vw,21px)] leading-[1.7] text-white/66">
        {intro}
      </p>
    )}
  </header>
);

const ContentCard: React.FC<{
  card: DonorDirectoryCardContent;
  index?: number;
  headingLevel?: 'h3' | 'h4';
}> = ({ card, index, headingLevel = 'h3' }) => {
  const Heading = headingLevel;

  return (
    <article className="donor-directory-placeholder-card rounded-[20px] p-5 sm:p-6">
      {typeof index === 'number' && (
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/28">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <Heading className="mb-0 mt-4 font-disp text-[clamp(20px,2vw,28px)] font-bold tracking-[-0.025em] text-white/88">
        {card.title}
      </Heading>
      <p className="mb-0 mt-3 font-body text-[13px] leading-[1.68] text-white/60">{card.body}</p>
    </article>
  );
};

const LabelCalloutGrid: React.FC<{ labels: readonly string[]; columns?: string }> = ({
  labels,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
}) => (
  <div className={`grid gap-3 ${columns}`}>
    {labels.map((label, index) => (
      <div
        key={label}
        className="donor-directory-placeholder-card flex min-h-[76px] items-center rounded-[16px] px-4 py-4 sm:px-5"
      >
        <span className="mr-3 font-mono text-[8px] text-[#D5A9EF]/52">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-body text-[12px] font-medium leading-[1.45] text-white/66">{label}</span>
      </div>
    ))}
  </div>
);

const DonorDirectoryHero: React.FC = () => (
  <section
    id="hero"
    aria-labelledby="donor-directory-title"
    data-case-study-section="hero"
    className="relative px-6 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28 lg:px-14 xl:px-20"
  >
    <div data-reveal="hero" className="relative mx-auto w-full max-w-[1320px]">
      <div data-hero-copy className="mx-auto max-w-[980px] text-center">
        <p className="m-0 font-mono text-[9px] uppercase tracking-[0.18em] text-[#D4A5EF]/72">
          {content.hero.eyebrow}
        </p>
        <h1
          id="donor-directory-title"
          className="m-0 mt-5 font-disp text-[clamp(42px,7vw,104px)] font-extrabold leading-[0.9] tracking-[-0.055em] text-white"
        >
          {content.hero.title}
        </h1>
        <p className="mx-auto mb-0 mt-5 max-w-[840px] font-body text-[clamp(16px,1.7vw,22px)] font-normal leading-[1.68] tracking-[-0.015em] text-white/72">
          {content.hero.subtitle}
        </p>
      </div>

      <div data-hero-metadata>
        <section aria-labelledby="quick-facts-title" className="mx-auto mt-7 max-w-[1120px] sm:mt-8">
          <h2 id="quick-facts-title" className="sr-only">Quick Facts</h2>
          <div className="grid grid-cols-2 overflow-hidden rounded-[18px] border border-white/10 bg-black/10 text-left lg:grid-cols-4">
            {content.hero.quickFacts.map((fact, index) => (
              <div
                key={fact.label}
                className={`px-4 py-4 sm:px-5 sm:py-5 ${index > 0 ? 'lg:border-l lg:border-white/8' : ''} ${index > 1 ? 'border-t border-white/8 lg:border-t-0' : ''} ${index % 2 === 1 ? 'border-l border-white/8 lg:border-l' : ''}`}
              >
                <p className="m-0 font-mono text-[8px] uppercase tracking-[0.14em] text-white/30">{fact.label}</p>
                <p className="mb-0 mt-2 font-body text-[11px] font-medium leading-[1.55] text-white/68 sm:text-[12px]">{fact.value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="mx-auto mt-5 max-w-[980px] rounded-[18px] border border-[#D4A5EF]/18 bg-[#D4A5EF]/7 px-5 py-4 text-left sm:px-6">
          <p className="m-0 font-body text-[11px] leading-[1.65] text-white/60 sm:text-[12px]">
            To respect confidentiality, the product visuals in this case study were reconstructed using fictional data while preserving the original workflows, interaction patterns, and design decisions.
          </p>
        </aside>
      </div>

      <PortfolioAsset
        src={donorDirectoryHero}
        alt="Reconstructed Northstar Foundation donor directory showing search, filters, donor records, engagement, relationship managers, recent contact, giving, and status."
        assetId="donor-directory-hero"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        priority
        reveal="hero-item"
        className="mt-7 sm:mt-8"
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
    <div className="relative mx-auto w-full max-w-[1320px]">
      <div data-reveal="intro">
        <SectionIntro
          id="opportunity"
          label={content.opportunity.label}
          heading={content.opportunity.heading}
          reveal={false}
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-10">
          {content.opportunity.paragraphs.map((paragraph) => (
            <p key={paragraph} className="m-0 max-w-[620px] font-body text-[15px] leading-[1.75] text-white/64">
              {paragraph}
            </p>
          ))}
        </div>
        <aside className="mt-10 max-w-[940px] rounded-[22px] border border-[#D2A4EF]/20 bg-[#D2A4EF]/8 px-6 py-6 sm:px-8 sm:py-7">
          <p className="m-0 font-mono text-[8px] uppercase tracking-[0.14em] text-[#D8B4F0]/60">Design challenge</p>
          <p className="mb-0 mt-4 font-disp text-[clamp(21px,2.3vw,32px)] font-bold leading-[1.25] tracking-[-0.025em] text-white/86">
            {content.opportunity.challenge}
          </p>
        </aside>
      </div>
    </div>
  </section>
);

const DesignPrinciplesSection: React.FC = () => (
  <section
    id="design-principles"
    aria-labelledby="design-principles-title"
    data-case-study-section="design-principles"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="relative mx-auto w-full max-w-[1320px]">
      <div data-reveal="intro">
        <SectionIntro
          id="design-principles"
          label={content.principles.label}
          heading={content.principles.heading}
          intro={content.principles.intro}
          reveal={false}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {content.principles.cards.map((card, index) => (
            <ContentCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ExperienceHeader: React.FC = () => (
  <header className="px-6 pb-12 pt-[var(--case-study-section-top)] sm:px-10 sm:pb-16 lg:px-14 xl:px-20">
    <div className="mx-auto max-w-[1320px]">
      <SectionIntro
        id="experience"
        label={content.experience.label}
        heading={content.experience.heading}
        intro={content.experience.intro}
        maxWidth="max-w-[1060px]"
      />
    </div>
  </header>
);

const DiscoverySection: React.FC = () => (
  <section id="finding-the-right-donor" aria-labelledby="finding-the-right-donor-title" className={subsectionClassName}>
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro">
        <div className="max-w-[820px]">
          <h3 id="finding-the-right-donor-title" className="m-0 font-disp text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
            {content.experience.discovery.heading}
          </h3>
          <p className="mb-0 mt-6 max-w-[720px] font-body text-[15px] leading-[1.75] text-white/64">
            {content.experience.discovery.body}
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {content.experience.discovery.cards.map((card, index) => (
            <ContentCard key={card.title} card={card} index={index} headingLevel="h4" />
          ))}
        </div>
      </div>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="default"
          title="Search and filtering in context"
          instruction="Search by donor name, open Filters, or select a record to inspect the real interaction."
          variant="discovery"
        />
      </div>
    </div>
  </section>
);

const ScaleSection: React.FC = () => (
  <section id="working-with-large-data-sets" aria-labelledby="working-with-large-data-sets-title" className={subsectionClassName}>
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro">
        <div className="max-w-[900px]">
          <h3 id="working-with-large-data-sets-title" className="m-0 font-disp text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
            {content.experience.scale.heading}
          </h3>
          <p className="mb-0 mt-6 max-w-[740px] font-body text-[15px] leading-[1.75] text-white/64">
            {content.experience.scale.body}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.experience.scale.cards.map((card, index) => (
            <ContentCard key={card.title} card={card} index={index} headingLevel="h4" />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const TableSection: React.FC = () => (
  <section id="making-complex-tables-feel-simple" aria-labelledby="making-complex-tables-feel-simple-title" className={subsectionClassName}>
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro" className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.65fr)] lg:gap-16">
        <div>
          <h3 id="making-complex-tables-feel-simple-title" className="m-0 font-disp text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
            {content.experience.tables.heading}
          </h3>
          <p className="mb-0 mt-6 max-w-[740px] font-body text-[15px] leading-[1.75] text-white/64">
            {content.experience.tables.body}
          </p>
        </div>
        <p className="m-0 border-l border-[#D4A5EF]/32 pl-5 font-body text-[14px] leading-[1.7] text-white/64">
          {content.experience.tables.supportingCopy}
        </p>
      </div>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="row-selected"
          title="Table anatomy"
          instruction="A large, inspectable reconstruction shows how hierarchy and density work together."
          variant="anatomy"
        >
          <ol className="donor-directory-anatomy-annotations" aria-label="Table anatomy annotations">
            {tableAnnotations.map(([number, label]) => (
              <li key={label}>
                <span>{number}</span>
                {label}
              </li>
            ))}
          </ol>
        </LiveDirectoryDemo>
      </div>
      <div className="mt-5">
        <LabelCalloutGrid labels={content.experience.tables.details} />
      </div>
    </div>
  </section>
);

const BulkActionsSection: React.FC = () => (
  <section id="bulk-actions" aria-labelledby="bulk-actions-title" className={subsectionClassName}>
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro">
        <div className="max-w-[900px]">
          <h3 id="bulk-actions-title" className="m-0 font-disp text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
            {content.experience.bulkActions.heading}
          </h3>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {[
            ['Problem', content.experience.bulkActions.problem],
            ['Solution', content.experience.bulkActions.solution],
          ].map(([label, body]) => (
            <article key={label} className="donor-directory-placeholder-card rounded-[22px] p-6 sm:p-8">
              <h4 className="m-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[#D4A5EF]/70">{label}</h4>
              <p className="mb-0 mt-5 font-body text-[clamp(15px,1.4vw,19px)] leading-[1.7] text-white/62">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-5">
          <LabelCalloutGrid labels={content.experience.bulkActions.callouts} />
        </div>
      </div>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="selected"
          title="Bulk actions without losing context"
          instruction="Select or clear records to see contextual actions appear only when they are relevant."
          variant="bulk"
        />
      </div>
    </div>
  </section>
);

const DonorContextSection: React.FC = () => (
  <section id="donor-context" aria-labelledby="donor-context-title" className={subsectionClassName}>
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro" className="max-w-[920px]">
        <p className="m-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[#D4A5EF]/72">
          {content.experience.donorContext.label}
        </p>
        <h3 id="donor-context-title" className="m-0 mt-5 font-disp text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
          {content.experience.donorContext.heading}
        </h3>
        <p className="mb-0 mt-6 max-w-[780px] font-body text-[15px] leading-[1.75] text-white/64">
          {content.experience.donorContext.body}
        </p>
      </div>
      <div className="mt-10 sm:mt-12">
        <LiveDirectoryDemo
          state="row-to-drawer"
          title="From a record to a relationship"
          instruction="An 8.58-second reconstruction preserves the table while donor context, history, giving, and the next action come forward."
          variant="hero"
        />
      </div>
      <div data-reveal="card-group" className="mt-8 grid gap-4 md:grid-cols-3 sm:mt-10">
        {content.experience.donorContext.cards.map((card, index) => (
          <ContentCard key={card.title} card={card} index={index} headingLevel="h4" />
        ))}
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
      <div data-reveal="visual" data-visual-group="drawer-details" className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div data-visual-direction="left">
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
          <div className="donor-directory-detail-caption">
            <span>History</span>
            <strong>A chronological relationship narrative, not an activity dump.</strong>
          </div>
        </div>
        <div data-visual-direction="right">
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
          <div className="donor-directory-detail-caption">
            <span>Next action + giving history</span>
            <strong>Recommendation, supporting context, and annual giving remain connected.</strong>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ExperienceSection: React.FC = () => (
  <section
    id="experience"
    aria-labelledby="experience-title"
    data-case-study-section="experience"
    data-testid="case-study-section"
    className="case-study-section donor-directory-top-level-section relative border-t border-white/[0.055]"
  >
    <ExperienceHeader />
    <DiscoverySection />
    <ScaleSection />
    <TableSection />
    <DonorContextSection />
    <BulkActionsSection />
  </section>
);

const SystemsSection: React.FC = () => (
  <section
    id="building-reusable-components"
    aria-labelledby="building-reusable-components-title"
    data-case-study-section="building-reusable-components"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro">
        <SectionIntro
          id="building-reusable-components"
          label={content.systems.label}
          heading={content.systems.heading}
          maxWidth="max-w-[1080px]"
          reveal={false}
        />
        <div className="mt-7 grid max-w-[1040px] gap-4 md:grid-cols-2 md:gap-8">
          {content.systems.paragraphs.map((paragraph) => (
            <p key={paragraph} className="m-0 font-body text-[clamp(15px,1.35vw,19px)] leading-[1.72] text-white/66">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <PortfolioAsset
        src={donorDirectoryComponentSheet}
        alt="Reconstructed donor directory component system grouped into Inputs and Filters, Data and Selection, Donor Context, and Feedback and States."
        assetId="donor-directory-component-sheet"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-10 sm:mt-14"
      />
      <aside className="mt-8 rounded-[20px] border border-[#D4A5EF]/20 bg-[#D4A5EF]/8 px-6 py-5 text-center">
        <p className="m-0 font-disp text-[clamp(20px,2.2vw,30px)] font-bold tracking-[-0.025em] text-white/82">{content.systems.callout}</p>
      </aside>
      <div data-reveal="intro" className="mt-16 max-w-[900px] sm:mt-20">
        <h3 className="m-0 font-disp text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
          {content.experience.states.heading}
        </h3>
        <p className="mb-0 mt-6 max-w-[760px] font-body text-[15px] leading-[1.75] text-white/64">
          {content.experience.states.body}
        </p>
      </div>
      <PortfolioAsset
        src={donorDirectoryStateGrid}
        alt="Interaction state grid for the donor directory showing loading, empty, no-results, error, selected, and unavailable-action states."
        assetId="donor-directory-state-grid"
        aspectRatio="3 / 2"
        width={2400}
        height={1600}
        className="mt-10 sm:mt-14"
      />
    </div>
  </section>
);

const ImplementationSection: React.FC = () => (
  <section
    id="designing-for-engineering"
    aria-labelledby="designing-for-engineering-title"
    data-case-study-section="designing-for-engineering"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionIntro
        id="designing-for-engineering"
        label={content.implementation.label}
        heading={content.implementation.heading}
        intro={content.implementation.body}
      />
      <PortfolioAsset
        src={donorDirectoryDesignToProduction}
        alt="Side-by-side design specification and reconstructed React component implementation, connected by tokens, variants, composition, Material UI, and keyboard behavior."
        assetId="donor-directory-design-to-production"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-10 sm:mt-14"
      />
      <ol className="mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-6">
        {content.implementation.steps.map((step, index) => (
          <li key={step} className="donor-directory-placeholder-card relative rounded-[16px] px-4 py-5">
            <span className="font-mono text-[8px] text-[#D4A5EF]/54">{String(index + 1).padStart(2, '0')}</span>
            <p className="mb-0 mt-4 font-body text-[11px] font-medium leading-[1.55] text-white/64">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {content.implementation.cards.map((card, index) => (
          <ContentCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </div>
  </section>
);

const QualitySection: React.FC = () => (
  <section
    id="accessibility-and-polish"
    aria-labelledby="accessibility-and-polish-title"
    data-case-study-section="accessibility-and-polish"
    data-testid="case-study-section"
    className={sectionClassName}
  >
    <div className="mx-auto max-w-[1320px]">
      <SectionIntro
        id="accessibility-and-polish"
        label={content.quality.label}
        heading={content.quality.heading}
        intro={content.quality.body}
        maxWidth="max-w-[1120px]"
      />
      <PortfolioAsset
        src={donorDirectoryAccessibilityDetails}
        alt="Accessibility and interaction-quality composition highlighting visible keyboard focus, row selection, drawer tabs, responsive mobile information priority, loading structure, and reduced-motion behavior."
        assetId="donor-directory-accessibility-details"
        aspectRatio="3 / 2"
        width={2400}
        height={1600}
        className="mt-10 sm:mt-14"
      />
      <div data-reveal="card-group" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.quality.cards.map((card, index) => (
          <ContentCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </div>
  </section>
);

const ImpactSection: React.FC = () => (
  <section
    id="impact"
    aria-labelledby="impact-title"
    data-case-study-section="impact"
    data-testid="case-study-section"
    className={`${sectionClassName} donor-directory-impact-section`}
  >
    <div className="mx-auto max-w-[1320px]">
      <div data-reveal="intro">
        <SectionIntro id="impact" label={content.impact.label} heading={content.impact.heading} reveal={false} />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.impact.cards.map((card, index) => (
            <ContentCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
      <PortfolioAsset
        src={donorDirectoryImpactSummary}
        alt="Calm summary of the reconstructed donor platform showing the directory, contextual donor drawer, relationship history, and connected next actions."
        assetId="donor-directory-impact-summary"
        aspectRatio="16 / 10"
        width={2400}
        height={1500}
        className="mt-10 sm:mt-14"
      />
      <div data-reveal="text">
        <p className="mx-auto mb-0 mt-12 max-w-[920px] text-center font-body text-[clamp(18px,2vw,28px)] font-normal leading-[1.55] tracking-[-0.02em] text-white/70">
          {content.impact.summary}
        </p>
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
      <DesignPrinciplesSection />
      <ExperienceSection />
      <SystemsSection />
      <ImplementationSection />
      <QualitySection />
      <ImpactSection />
    </div>
  );
};

export default DonorDirectoryCaseStudy;
