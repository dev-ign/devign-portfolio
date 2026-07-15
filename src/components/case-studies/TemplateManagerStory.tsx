import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import editorToolbarImage from '../../assets/template-manager-editor-toolbar.png';
import type {
  CaseStudyNarrativeSection,
  TemplateManagerCaseStudyNarrative,
} from '../../data/projects';
import { useGSAPContext } from '../../hooks/useGSAPContext';

gsap.registerPlugin(ScrollTrigger);

interface StorySectionProps {
  section: CaseStudyNarrativeSection;
  visual: React.ReactNode;
  visualSide?: 'left' | 'right';
  children?: React.ReactNode;
}

const StorySection: React.FC<StorySectionProps> = ({
  section,
  visual,
  visualSide = 'right',
  children,
}) => {
  const copy = (
    <div className={`relative z-10 ${visualSide === 'left' ? 'lg:order-2' : 'lg:order-1'}`}>
      <h2
        id={`${section.id}-title`}
        className="m-0 max-w-[640px] font-disp text-[clamp(38px,4.7vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white"
      >
        {section.title}
      </h2>
      <p className="mb-0 mt-5 max-w-[620px] font-body text-[clamp(18px,1.65vw,24px)] font-medium leading-[1.35] tracking-[-0.025em] text-white/86">
        {section.subtitle}
      </p>
      <div className="mt-8 max-w-[650px] space-y-4 font-body text-[clamp(14px,1.12vw,17px)] font-normal leading-[1.72] text-white/67">
        {children ?? section.paragraphs.map((paragraph) => <p key={paragraph} className="m-0">{paragraph}</p>)}
      </div>
    </div>
  );

  const visualColumn = (
    <div
      className={`relative z-10 flex min-h-[340px] items-center justify-center sm:min-h-[430px] lg:min-h-0 ${
        visualSide === 'left' ? 'lg:order-1' : 'lg:order-2'
      }`}
    >
      {visual}
    </div>
  );

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      data-case-study-section={section.id}
      data-testid="case-study-section"
      className="relative flex min-h-screen min-h-[100svh] scroll-mt-[152px] items-center overflow-hidden border-t border-white/[0.055] px-6 py-20 sm:scroll-mt-24 sm:px-10 lg:px-14 lg:py-16 xl:px-20"
    >
      <div className="relative mx-auto grid w-full max-w-[1480px] items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] lg:gap-[clamp(48px,7vw,112px)]">
        {copy}
        {visualColumn}
      </div>
    </section>
  );
};

const VisualStage: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`template-story-stage relative w-full max-w-[680px] rounded-[28px] p-4 sm:p-7 ${className}`}>
    <div aria-hidden="true" className="absolute inset-x-[14%] bottom-[-8%] h-[28%] rounded-full bg-[#0E143F]/45 blur-[42px]" />
    <div className="relative">{children}</div>
  </div>
);

const OldEmailClientVisual: React.FC = () => (
  <VisualStage>
    <div className="overflow-hidden rounded-[18px] border border-slate-300/70 bg-[#f6f7f9] text-slate-800 shadow-[0_30px_85px_rgba(21,27,58,0.42)]">
      <div className="flex h-11 items-center gap-2 border-b border-slate-200 bg-white px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b68]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffc45b]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#64c466]" />
        <span className="ml-3 font-body text-[11px] font-semibold text-slate-500">Mail</span>
        <span className="ml-auto rounded border border-slate-200 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-slate-400">Legacy workflow</span>
      </div>
      <div className="grid min-h-[350px] grid-cols-[112px_1fr] sm:grid-cols-[150px_1fr]">
        <aside className="border-r border-slate-200 bg-[#eef0f4] p-3 sm:p-4">
          <button type="button" tabIndex={-1} className="mb-5 w-full rounded-md bg-[#3c6ee8] px-2 py-2 text-left font-body text-[9px] font-semibold text-white">+ New message</button>
          {['Inbox  24', 'Starred', 'Sent', 'Drafts  3', 'Archive'].map((item, index) => (
            <div key={item} className={`mb-1 rounded px-2 py-2 font-body text-[9px] ${index === 0 ? 'bg-white font-semibold text-slate-700 shadow-sm' : 'text-slate-500'}`}>{item}</div>
          ))}
        </aside>
        <div className="bg-white">
          <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-700 font-body text-[10px] font-semibold text-white">ST</span>
              <div>
                <p className="m-0 font-body text-[11px] font-semibold text-slate-700">Support Team</p>
                <p className="m-0 mt-0.5 font-body text-[8px] text-slate-400">Re: template change request</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <p className="m-0 font-body text-[13px] font-semibold text-slate-800">Year-end appeal update</p>
            <p className="m-0 mt-5 font-body text-[10px] leading-[1.7] text-slate-500">Hi Support,</p>
            <p className="m-0 mt-3 max-w-[330px] font-body text-[10px] leading-[1.7] text-slate-500">Could you update the greeting and CTA in our year-end email? I attached the revised copy below.</p>
            <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="m-0 font-body text-[8px] font-semibold uppercase tracking-[0.08em] text-amber-700">Attachment</p>
              <p className="m-0 mt-1 font-body text-[9px] text-amber-800/70">template_changes_final_v3.docx</p>
            </div>
            <div className="mt-7 inline-flex rounded border border-slate-200 bg-slate-50 px-3 py-2 font-body text-[9px] text-slate-400">Waiting for support · 2 days</div>
          </div>
        </div>
      </div>
    </div>
  </VisualStage>
);

type WorkflowVisualRole = 'manager' | 'fundraiser';

interface WorkflowVisualRow {
  name: string;
  category: string;
  access: 'Shared' | 'Assigned' | 'Personal' | 'Favorite';
  rate: string;
}

const workflowVisualViews: Record<
  WorkflowVisualRole,
  { title: string; subtitle: string; rows: WorkflowVisualRow[]; highlightIndex: number }
> = {
  manager: {
    title: 'Organization templates',
    subtitle: '48 templates across 7 fundraisers',
    highlightIndex: 1,
    rows: [
      { name: 'Spring campaign master', category: 'Annual giving', access: 'Shared', rate: '82%' },
      { name: 'First-time donor welcome', category: 'Stewardship', access: 'Assigned', rate: '79%' },
      { name: 'Event follow-up', category: 'Events', access: 'Shared', rate: '71%' },
      { name: 'Monthly impact update', category: 'Newsletters', access: 'Personal', rate: '68%' },
      { name: 'Lapsed donor outreach', category: 'Retention', access: 'Personal', rate: '57%' },
    ],
  },
  fundraiser: {
    title: 'My template library',
    subtitle: 'Personal and manager-assigned templates',
    highlightIndex: 0,
    rows: [
      { name: 'First-time donor welcome', category: 'Stewardship', access: 'Assigned', rate: '79%' },
      { name: 'Spring campaign master', category: 'Annual giving', access: 'Shared', rate: '82%' },
      { name: 'Personal donor thank-you', category: 'Stewardship', access: 'Personal', rate: '76%' },
      { name: 'Event follow-up', category: 'Events', access: 'Shared', rate: '71%' },
      { name: 'Monthly impact update', category: 'Newsletters', access: 'Favorite', rate: '68%' },
    ],
  },
};

const WorkflowTemplateListVisual: React.FC = () => {
  const [activeRole, setActiveRole] = useState<WorkflowVisualRole>('manager');
  const activeView = workflowVisualViews[activeRole];

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = window.setInterval(() => {
      setActiveRole((current) => (current === 'manager' ? 'fundraiser' : 'manager'));
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <VisualStage>
      <div className="template-manager-panel overflow-hidden rounded-[20px]">
        <div className="flex items-center border-b border-white/8 px-4 py-4 sm:px-6">
          <div key={`${activeRole}-heading`} className="min-w-0">
            <p className="m-0 truncate font-body text-[12px] font-semibold text-white/82">{activeView.title}</p>
            <p className="m-0 mt-1 truncate font-body text-[8px] text-white/35">{activeView.subtitle}</p>
          </div>
          <div className="ml-auto flex shrink-0 rounded-full border border-white/8 bg-black/15 p-1">
            {(['manager', 'fundraiser'] as WorkflowVisualRole[]).map((role) => (
              <span
                key={role}
                data-testid={activeRole === role ? 'workflow-active-role' : undefined}
                className={`rounded-full px-2 py-1 font-mono text-[6px] uppercase tracking-[0.08em] transition duration-500 ${
                  activeRole === role
                    ? 'bg-[#B06EF3]/22 text-[#DEC5FA] shadow-[0_0_16px_rgba(176,110,243,0.14)]'
                    : 'text-white/24'
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[1fr_78px] border-b border-white/7 bg-white/[0.025] px-4 py-2.5 sm:grid-cols-[1.4fr_0.85fr_78px_55px] sm:px-6">
          {['Template', 'Category', 'Access', 'Rate'].map((heading, index) => <span key={heading} className={`${index === 1 ? 'hidden sm:block' : ''} ${index === 3 ? 'hidden sm:block text-right' : ''} font-mono text-[7px] uppercase tracking-[0.12em] text-white/28`}>{heading}</span>)}
        </div>
        <div>
          {activeView.rows.map(({ name, category, access, rate }, index) => {
            const isShared = access === 'Shared' || access === 'Assigned';
            const isHighlighted = index === activeView.highlightIndex;
            return (
            <div key={name} className={`grid min-h-[58px] grid-cols-[1fr_78px] items-center border-b border-white/[0.055] px-4 transition-colors duration-500 sm:grid-cols-[1.4fr_0.85fr_78px_55px] sm:px-6 ${isHighlighted ? 'bg-[#B06EF3]/[0.075]' : ''}`}>
              <div className="flex min-w-0 items-center gap-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-[7px] ${isHighlighted ? 'bg-[#B06EF3]/22 text-[#DFC4FA] shadow-[0_0_18px_rgba(176,110,243,0.16)]' : 'bg-white/6 text-white/35'} font-body text-[9px] transition duration-500`}>✉</span>
                <span className="truncate font-body text-[9px] font-medium text-white/68 sm:text-[10px]">{name}</span>
              </div>
              <span className="hidden font-body text-[8px] text-white/37 sm:block">{category}</span>
              <span className={`justify-self-start rounded-full border px-2 py-1 font-mono text-[6px] uppercase tracking-[0.08em] ${isShared ? 'border-[#68E0C1]/18 bg-[#68E0C1]/10 text-[#8BE5D0]' : access === 'Favorite' ? 'border-[#B06EF3]/20 bg-[#B06EF3]/10 text-[#DABDF7]' : 'border-white/9 bg-white/5 text-white/38'}`}>{access}</span>
              <span className="hidden text-right font-mono text-[8px] text-white/42 sm:block">{rate}</span>
            </div>
          )})}
        </div>
        <div key={`${activeRole}-footer`} className="flex min-h-[48px] items-center px-4 py-3 sm:px-6">
          {activeRole === 'manager' ? (
            <>
              <div className="flex -space-x-1.5">{['JF', 'AR', 'MK', '+4'].map((initials, index) => <span key={initials} className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#17182d] font-body text-[6px] text-white/65" style={{ backgroundColor: ['#665AB0', '#3B777A', '#82557C', '#34354E'][index] }}>{initials}</span>)}</div>
              <span className="ml-3 font-body text-[8px] text-white/30">Assign approved messaging across the team</span>
            </>
          ) : (
            <>
              <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#17182d] bg-[#82557C] font-body text-[6px] text-white/65">MK</span>
              <span className="mx-2 font-mono text-[9px] text-[#84DCC5]/60">→</span>
              <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#17182d] bg-[#3B777A] font-body text-[6px] text-white/65">AR</span>
              <span className="ml-3 font-body text-[8px] text-white/30">Manager-assigned templates appear instantly</span>
            </>
          )}
        </div>
      </div>
    </VisualStage>
  );
};

const accordionCategories = [
  { name: 'Annual Giving', count: 12, items: ['Year-end appeal', 'Giving Tuesday', 'Spring campaign'] },
  { name: 'Donor Stewardship', count: 8, items: ['Welcome series', 'Thank-you note', 'Impact follow-up'] },
  { name: 'Events', count: 6, items: ['Save the date', 'Post-event thank you', 'Unable to attend'] },
];

const CategoryAccordionVisual: React.FC = () => {
  const [openCategory, setOpenCategory] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = window.setInterval(() => {
      setOpenCategory((current) => (current + 1) % accordionCategories.length);
    }, 2300);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <VisualStage>
      <div className="template-manager-panel overflow-hidden rounded-[20px] p-4 sm:p-6">
        <div className="mb-5 flex items-center">
          <div>
            <p className="m-0 font-body text-[12px] font-semibold text-white/80">Template categories</p>
            <p className="m-0 mt-1 font-body text-[8px] text-white/31">Browse your organization library</p>
          </div>
          <button type="button" tabIndex={-1} className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-2 font-body text-[8px] text-white/48">+ Category</button>
        </div>
        <div className="space-y-2">
          {accordionCategories.map((category, index) => {
            const isOpen = openCategory === index;
            return (
              <div key={category.name} className={`overflow-hidden rounded-[12px] border transition-colors duration-500 ${isOpen ? 'border-[#B796EF]/28 bg-[#A97AE8]/[0.08]' : 'border-white/8 bg-white/[0.025]'}`}>
                <div className="flex min-h-[54px] items-center px-4">
                  <span className={`mr-3 grid h-6 w-6 place-items-center rounded-[7px] transition duration-500 ${isOpen ? 'rotate-180 bg-[#B06EF3]/20 text-[#D9BDF7]' : 'bg-white/5 text-white/34'}`}>⌄</span>
                  <span className="font-body text-[10px] font-medium text-white/68">{category.name}</span>
                  <span className="ml-auto font-mono text-[8px] text-white/28">{category.count}</span>
                </div>
                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="min-h-0 overflow-hidden">
                    <div className="space-y-1 border-t border-white/7 px-3 py-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={item} className={`flex items-center rounded-[8px] px-3 py-2.5 ${itemIndex === 0 ? 'bg-white/[0.055]' : ''}`}>
                          <span className="mr-3 h-1.5 w-1.5 rounded-full bg-[#B799ED]/70" />
                          <span className="font-body text-[8px] text-white/48">{item}</span>
                          <span className="ml-auto text-[10px] text-white/20">···</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </VisualStage>
  );
};

const EditorExperienceVisual: React.FC = () => (
  <img
    src={editorToolbarImage}
    alt="TinyMCE formatting toolbar examples"
    className="h-auto w-full max-w-[680px] object-contain drop-shadow-[0_34px_70px_rgba(5,8,35,0.42)]"
  />
);

const ShareFundraisersVisual: React.FC = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const rules = [
    ['All fundraisers', 'Everyone on the advancement team'],
    ['Northeast portfolio', 'Fundraisers assigned to the Northeast region'],
    ['Major gifts team', 'Gift officers managing $25K+ portfolios'],
  ];
  const fundraiserOptions = [
    ['AR', 'Avery Reed', 'Northeast portfolio'],
    ['MC', 'Maya Chen', 'Major gifts team'],
    ['JB', 'Jon Bell', 'Events and stewardship'],
  ];
  const isDropdownOpen = animationStep === 1 || animationStep === 2;
  const isFundraiserSelected = animationStep >= 2;
  const isAssignmentSelected = animationStep >= 3;
  const isReadyToShare = animationStep >= 4;

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setAnimationStep(4);
      return undefined;
    }
    const interval = window.setInterval(() => {
      setAnimationStep((current) => (current + 1) % 5);
    }, 1350);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <VisualStage>
      <div
        data-testid="share-animation"
        data-animation-step={animationStep}
        className="template-manager-panel overflow-hidden rounded-[22px] p-5 sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#B06EF3]/18 text-[16px] text-[#DEC5FA]">↗</span>
          <div>
            <p className="m-0 font-body text-[14px] font-semibold text-white/86">Spring Campaign Appeal</p>
            <p className="m-0 mt-1 font-body text-[9px] text-white/38">Assign fundraisers to this template</p>
          </div>
        </div>

        <div className="relative z-20 mt-6">
          <p className="m-0 font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">Fundraiser</p>
          <div className={`mt-2 flex min-h-[46px] items-center rounded-[10px] border bg-white/[0.035] px-3.5 ${isDropdownOpen ? 'border-[#B994EB]/42 shadow-[0_0_0_3px_rgba(176,110,243,0.07)]' : 'border-white/10'}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full font-body text-[7px] ${isFundraiserSelected ? 'bg-[#527E80] text-white' : 'border border-white/12 bg-white/5 text-white/28'}`}>{isFundraiserSelected ? 'AR' : '+'}</span>
            <span className={`ml-2.5 font-body text-[9px] ${isFundraiserSelected ? 'text-white/68' : 'text-white/30'}`}>{isFundraiserSelected ? 'Avery Reed' : 'Choose a fundraiser'}</span>
            <span className={`ml-auto text-[10px] text-white/28 ${isDropdownOpen ? 'rotate-180' : ''}`}>⌄</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute inset-x-0 top-[calc(100%+6px)]">
              <div className="overflow-hidden rounded-[12px] border border-white/12 bg-[#12142B] p-1.5 shadow-[0_20px_46px_rgba(3,5,20,0.5)]">
                {fundraiserOptions.map(([initials, name, portfolio], index) => {
                  const isTarget = animationStep === 2 && index === 0;
                  return (
                    <div key={name} className={`flex items-center rounded-[9px] px-2.5 py-2 ${isTarget ? 'bg-[#B06EF3]/16 shadow-[0_0_0_1px_rgba(176,110,243,0.12)]' : 'bg-transparent'}`}>
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#527E80]/80 font-body text-[6px] text-white/74">{initials}</span>
                      <div className="ml-2.5 min-w-0">
                        <p className="m-0 truncate font-body text-[8px] font-medium text-white/65">{name}</p>
                        <p className="m-0 mt-0.5 truncate font-body text-[6px] text-white/28">{portfolio}</p>
                      </div>
                      {isTarget && <span className="ml-auto text-[9px] text-[#8BE5D0]">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={`relative z-10 mt-5 space-y-2 ${isDropdownOpen ? 'opacity-35' : 'opacity-100'}`}>
          <p className="m-0 mb-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">Assignment rule</p>
          {rules.map(([title, description], index) => (
            <div key={title} className={`flex items-start gap-3 rounded-[11px] border px-3.5 py-3 ${isAssignmentSelected && index === 1 ? 'border-[#B06EF3]/34 bg-[#B06EF3]/11 shadow-[0_0_0_1px_rgba(176,110,243,0.08)]' : 'border-white/8 bg-white/[0.02]'}`}>
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${isAssignmentSelected && index === 1 ? 'border-[#C69DF4]' : 'border-white/20'}`}>{isAssignmentSelected && index === 1 && <span className="h-2 w-2 rounded-full bg-[#C69DF4]" />}</span>
              <div>
                <p className="m-0 font-body text-[9px] font-medium text-white/66">{title}</p>
                <p className="m-0 mt-1 font-body text-[7px] leading-[1.45] text-white/30">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2.5 border-t border-white/8 pt-4">
          <span className="rounded-[9px] border border-white/10 px-4 py-2.5 font-body text-[8px] font-medium text-white/42">Cancel</span>
          <span className={`rounded-[9px] border px-4 py-2.5 font-body text-[8px] font-semibold ${isReadyToShare ? 'border-[#C5A3EE]/32 bg-[#8D63C2] text-white shadow-[0_8px_28px_rgba(155,105,215,0.32)]' : 'border-white/8 bg-white/5 text-white/24'}`}>Share template</span>
        </div>
      </div>
    </VisualStage>
  );
};

const TemplateFiltersVisual: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    const visual = visualRef.current;
    if (!visual) return undefined;

    const searchText = visual.querySelector<HTMLElement>('[data-filter-search]');
    const sharedFilter = visual.querySelector<HTMLElement>('[data-filter-control="shared"]');
    const favoriteFilter = visual.querySelector<HTMLElement>('[data-filter-control="favorites"]');
    const annualGivingFilter = visual.querySelector<HTMLElement>('[data-filter-control="annual-giving"]');
    const slider = visual.querySelector<HTMLElement>('[data-filter-slider]');
    const rateLabel = visual.querySelector<HTMLElement>('[data-filter-rate]');
    const matchingCount = visual.querySelector<HTMLElement>('[data-filter-matches]');
    const resultRows = Array.from(visual.querySelectorAll<HTMLElement>('[data-filter-result]'));
    const animatedControls = [sharedFilter, favoriteFilter, annualGivingFilter].filter(
      (element): element is HTMLElement => Boolean(element)
    );
    const query = 'spring appeal';
    const typingState = { value: 0 };
    const rateState = { value: 20 };
    const countState = { value: 36 };

    if (!searchText || !slider || !rateLabel || !matchingCount) return undefined;

    const setControlState = (control: HTMLElement, active: boolean) => {
      control.dataset.active = active ? 'true' : 'false';
      gsap.set(control, {
        borderColor: active ? 'rgba(176,110,243,0.34)' : 'rgba(255,255,255,0.08)',
        backgroundColor: active ? 'rgba(176,110,243,0.13)' : 'rgba(255,255,255,0.02)',
        color: active ? 'rgba(226,205,249,0.9)' : 'rgba(255,255,255,0.34)',
      });
      const check = control.querySelector<HTMLElement>('[data-filter-check]');
      if (check) gsap.set(check, { autoAlpha: active ? 1 : 0, scale: active ? 1 : 0.7 });
    };

    const resetFilters = () => {
      visual.dataset.animationPhase = 'idle';
      typingState.value = 0;
      rateState.value = 20;
      countState.value = 36;
      searchText.textContent = 'Search template name or keywords';
      searchText.dataset.hasValue = 'false';
      rateLabel.textContent = '20%+';
      matchingCount.textContent = '36 matching templates';
      animatedControls.forEach((control) => setControlState(control, false));
      gsap.set(slider, { '--filter-position': '20%' });
      gsap.set(resultRows, { autoAlpha: 1, x: 0 });
    };

    const showFinalState = () => {
      resetFilters();
      visual.dataset.animationPhase = 'results';
      searchText.textContent = query;
      searchText.dataset.hasValue = 'true';
      rateLabel.textContent = '68%+';
      matchingCount.textContent = '8 matching templates';
      animatedControls.forEach((control) => setControlState(control, true));
      gsap.set(slider, { '--filter-position': '68%' });
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      showFinalState();
      return undefined;
    }

    resetFilters();
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.6,
      defaults: { duration: 0.45, ease: 'power2.inOut' },
      onRepeat: resetFilters,
      scrollTrigger: {
        trigger: visual,
        start: 'top 88%',
        end: 'bottom 12%',
        toggleActions: 'restart pause resume pause',
      },
    });

    timeline
      .addLabel('type', 0.65)
      .call(() => {
        visual.dataset.animationPhase = 'search';
        searchText.dataset.hasValue = 'true';
      }, [], 'type')
      .to(typingState, {
        value: query.length,
        duration: 1.05,
        ease: 'none',
        onUpdate: () => {
          searchText.textContent = query.slice(0, Math.round(typingState.value));
        },
      }, 'type')
      .addLabel('ownership', '+=0.25')
      .call(() => {
        visual.dataset.animationPhase = 'ownership';
        if (sharedFilter) setControlState(sharedFilter, true);
      }, [], 'ownership')
      .call(() => {
        if (favoriteFilter) setControlState(favoriteFilter, true);
      }, [], 'ownership+=0.42')
      .addLabel('category', '+=0.55')
      .call(() => {
        visual.dataset.animationPhase = 'category';
        if (annualGivingFilter) setControlState(annualGivingFilter, true);
      }, [], 'category')
      .addLabel('engagement', '+=0.5')
      .call(() => {
        visual.dataset.animationPhase = 'engagement';
      }, [], 'engagement')
      .to(slider, { '--filter-position': '68%', duration: 1.05, ease: 'power3.inOut' }, 'engagement')
      .to(rateState, {
        value: 68,
        duration: 1.05,
        ease: 'power3.inOut',
        onUpdate: () => {
          rateLabel.textContent = `${Math.round(rateState.value)}%+`;
        },
      }, 'engagement')
      .addLabel('results', '+=0.25')
      .call(() => {
        visual.dataset.animationPhase = 'results';
      }, [], 'results')
      .to(resultRows, { x: 5, autoAlpha: 0.42, duration: 0.18, stagger: 0.04 }, 'results')
      .to(countState, {
        value: 8,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          matchingCount.textContent = `${Math.round(countState.value)} matching templates`;
        },
      }, 'results')
      .to(resultRows, { x: 0, autoAlpha: 1, duration: 0.38, stagger: 0.05 }, 'results+=0.22');

    return undefined;
  }, { scope: visualRef });

  const ownershipFilters = ['Shared', 'Personal', 'Favorites'];
  const categories = [
    ['Annual Giving', '12', 'annual-giving'],
    ['Stewardship', '8', 'stewardship'],
    ['Events', '6', 'events'],
    ['Newsletters', '10', 'newsletters'],
  ];

  return (
  <VisualStage>
    <div ref={visualRef} data-testid="discovery-filter-animation" data-animation-phase="idle" className="template-manager-panel overflow-hidden rounded-[22px]">
      <div className="border-b border-white/8 p-4 sm:p-6">
        <div className="flex min-h-[48px] items-center rounded-[12px] border border-[#B9A0ED]/22 bg-[#0F1023]/50 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <span className="text-[16px] text-white/30">⌕</span>
          <span data-filter-search data-has-value="false" className="ml-3 min-w-0 truncate font-body text-[10px] text-white/52 data-[has-value=false]:text-white/31">Search template name or keywords</span>
          <span aria-hidden="true" className="template-filter-caret ml-0.5 h-3 w-px bg-[#CDB2EF]/70" />
          <span className="ml-auto rounded border border-white/9 bg-white/5 px-2 py-1 font-mono text-[6px] text-white/25">⌘ K</span>
        </div>
      </div>
      <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-white/8 p-4 sm:border-b-0 sm:border-r sm:p-5">
          <div className="mb-5">
            <p className="m-0 font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">Assigned fundraiser</p>
            <div className="mt-2 flex items-center rounded-[9px] border border-white/9 bg-white/[0.025] px-3 py-2.5">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#665AB0] font-body text-[6px] text-white">JF</span>
              <span className="ml-2 font-body text-[8px] text-white/54">Jonathan + 3</span>
              <span className="ml-auto text-[9px] text-white/25">⌄</span>
            </div>
          </div>
          <div className="mb-5">
            <p className="m-0 font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">Ownership</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ownershipFilters.map((label) => <span key={label} data-filter-control={label.toLowerCase()} data-active="false" className="rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1.5 font-body text-[7px] text-white/34"><span data-filter-check className="mr-1 inline-block opacity-0">✓</span>{label}</span>)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between"><p className="m-0 font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">Engagement rate</p><span data-filter-rate className="font-mono text-[7px] text-white/45">20%+</span></div>
            <div data-filter-slider className="relative mt-3 h-1 rounded-full bg-white/8" style={{ '--filter-position': '20%' } as React.CSSProperties}><span className="absolute inset-y-0 left-0 w-[var(--filter-position)] rounded-full bg-gradient-to-r from-[#9C72D8] to-[#70D3C1]" /><span className="absolute left-[var(--filter-position)] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#D5B9F5] bg-[#7E59B4] shadow-[0_0_14px_rgba(176,110,243,0.35)]" /></div>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center"><p className="m-0 font-body text-[9px] font-semibold text-white/62">Category</p><span className="ml-auto font-mono text-[7px] text-[#CFB1F2]">Clear all</span></div>
          <div className="mt-3 space-y-2">
            {categories.map(([label, count, id]) => (
              <div key={label} data-filter-control={id} data-active="false" data-filter-result className="flex items-center rounded-[9px] border border-white/8 bg-white/[0.02] px-3 py-2.5 text-white/34">
                <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-white/15 text-[8px]"><span data-filter-check className="opacity-0">✓</span></span>
                <span className="ml-2.5 font-body text-[8px] text-white/48">{label}</span>
                <span className="ml-auto font-mono text-[7px] text-white/24">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center border-t border-white/8 bg-white/[0.018] px-4 py-3.5 sm:px-6">
        <span data-filter-matches aria-live="polite" className="font-body text-[8px] text-white/32">36 matching templates</span>
        <span className="ml-auto rounded-[8px] bg-[#A577DD] px-3 py-2 font-body text-[8px] font-semibold text-white">View results</span>
      </div>
    </div>
  </VisualStage>
  );
};

const DefaultConflictVisual: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    const visual = visualRef.current;
    if (!visual) return undefined;

    const field = visual.querySelector<HTMLElement>('[data-default-field]');
    const fieldIcon = visual.querySelector<HTMLElement>('[data-default-icon]');
    const fieldTitle = visual.querySelector<HTMLElement>('[data-default-title]');
    const fieldSubtitle = visual.querySelector<HTMLElement>('[data-default-subtitle]');
    const dropdown = visual.querySelector<HTMLElement>('[data-default-dropdown]');
    const option = visual.querySelector<HTMLElement>('[data-default-option]');
    const conflict = visual.querySelector<HTMLElement>('[data-default-conflict]');
    const saveButton = visual.querySelector<HTMLElement>('[data-default-save]');

    if (!field || !fieldIcon || !fieldTitle || !fieldSubtitle || !dropdown || !option || !conflict || !saveButton) return undefined;

    const resetValidation = () => {
      visual.dataset.animationPhase = 'idle';
      fieldTitle.textContent = 'Choose a default rule';
      fieldSubtitle.textContent = 'No rule selected';
      fieldIcon.textContent = '+';
      gsap.set(field, { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' });
      gsap.set(dropdown, { autoAlpha: 0, y: -6 });
      gsap.set(option, { backgroundColor: 'transparent' });
      gsap.set(conflict, { autoAlpha: 0, y: 8 });
      gsap.set(saveButton, { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.28)' });
    };

    const selectDefault = () => {
      visual.dataset.animationPhase = 'selected';
      fieldTitle.textContent = 'Organization-wide default';
      fieldSubtitle.textContent = 'Applied to all campaign emails';
      fieldIcon.textContent = '◎';
    };

    const showConflict = () => {
      selectDefault();
      visual.dataset.animationPhase = 'conflict';
      gsap.set(dropdown, { autoAlpha: 0, y: -6 });
      gsap.set(conflict, { autoAlpha: 1, y: 0 });
      gsap.set(saveButton, { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' });
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      resetValidation();
      showConflict();
      return undefined;
    }

    resetValidation();
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.8,
      defaults: { duration: 0.42, ease: 'power2.out' },
      onRepeat: resetValidation,
      scrollTrigger: {
        trigger: visual,
        start: 'top 88%',
        end: 'bottom 12%',
        toggleActions: 'restart pause resume pause',
      },
    });

    timeline
      .addLabel('open', 0.9)
      .call(() => {
        visual.dataset.animationPhase = 'open';
      }, [], 'open')
      .to(field, { borderColor: 'rgba(185,148,235,0.5)', boxShadow: '0 0 0 3px rgba(176,110,243,0.07)' }, 'open')
      .to(dropdown, { autoAlpha: 1, y: 0 }, 'open')
      .to(option, { backgroundColor: 'rgba(176,110,243,0.16)', duration: 0.35 }, '+=0.7')
      .addLabel('select', '+=0.45')
      .call(selectDefault, [], 'select')
      .to(dropdown, { autoAlpha: 0, y: -6, duration: 0.28 }, 'select')
      .to(field, { borderColor: 'rgba(176,110,243,0.34)', boxShadow: '0 0 0 1px rgba(176,110,243,0.08)' }, 'select')
      .addLabel('conflict', '+=0.45')
      .call(() => {
        visual.dataset.animationPhase = 'conflict';
      }, [], 'conflict')
      .to(conflict, { autoAlpha: 1, y: 0, duration: 0.48 }, 'conflict');

    return undefined;
  }, { scope: visualRef });

  return (
  <VisualStage>
    <div ref={visualRef} data-testid="validation-conflict-animation" data-animation-phase="idle" className="template-manager-panel overflow-hidden rounded-[22px] p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#7B8CDE]/18 text-[15px] text-[#C5D0FF]">☆</span>
        <div>
          <p className="m-0 font-body text-[14px] font-semibold text-white/86">Set default template</p>
          <p className="m-0 mt-1 font-body text-[9px] text-white/39">Year-End Stewardship</p>
        </div>
      </div>
      <div className="relative z-20 mt-6">
        <p className="m-0 font-mono text-[7px] uppercase tracking-[0.14em] text-white/31">Set as default for</p>
        <div data-default-field className="mt-2 flex min-h-[47px] items-center rounded-[10px] border border-white/10 bg-white/[0.035] px-3.5">
          <span data-default-icon className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#7B8CDE]/20 text-[10px] text-[#CAD3FC]">+</span>
          <div className="ml-3">
            <p data-default-title className="m-0 font-body text-[9px] text-white/64">Choose a default rule</p>
            <p data-default-subtitle className="m-0 mt-0.5 font-body text-[7px] text-white/27">No rule selected</p>
          </div>
          <span className="ml-auto text-[10px] text-white/26">⌄</span>
        </div>
        <div data-default-dropdown className="invisible absolute inset-x-0 top-[calc(100%+6px)] rounded-[12px] border border-white/12 bg-[#12142B] p-1.5 opacity-0 shadow-[0_20px_46px_rgba(3,5,20,0.5)]">
          <div data-default-option className="flex items-center rounded-[9px] px-3 py-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#7B8CDE]/20 text-[10px] text-[#CAD3FC]">◎</span>
            <div className="ml-3">
              <p className="m-0 font-body text-[8px] text-white/68">Organization-wide default</p>
              <p className="m-0 mt-0.5 font-body text-[6px] text-white/29">Applied to all campaign emails</p>
            </div>
            <span className="ml-auto text-[8px] text-[#8BE5D0]">Select</span>
          </div>
        </div>
      </div>
      <div data-default-conflict className="invisible mt-5 rounded-[14px] border border-[#E8AD5E]/28 bg-[#D99336]/[0.08] p-4 opacity-0">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#E1A350]/15 text-[12px]">⚠</span>
          <p className="m-0 font-body text-[10px] font-semibold text-[#F0C98F]">Default Template Conflict</p>
        </div>
        <p className="m-0 mt-3 font-body text-[8px] leading-[1.6] text-[#EAD5B5]/58">“Annual Giving Master” is already the organization-wide default. Resolve the conflict before saving this template.</p>
        <span className="mt-4 inline-flex rounded-[8px] border border-[#E3AE62]/22 bg-[#E3AE62]/10 px-3 py-2 font-body text-[8px] font-medium text-[#F0CA91]">Go to conflicting template ↗</span>
      </div>
      <div className="mt-6 flex justify-end gap-2.5 border-t border-white/8 pt-4">
        <span className="rounded-[9px] border border-white/10 px-4 py-2.5 font-body text-[8px] text-white/40">Cancel</span>
        <span data-default-save className="rounded-[9px] bg-white/8 px-4 py-2.5 font-body text-[8px] text-white/28">Set default</span>
      </div>
    </div>
  </VisualStage>
  );
};

const TechnicalImplementationSection: React.FC<{
  section: TemplateManagerCaseStudyNarrative['implementation'];
}> = ({ section }) => (
  <section id={section.id} aria-labelledby={`${section.id}-title`} data-case-study-section={section.id} data-testid="case-study-section" className="template-technical-section relative flex min-h-screen min-h-[100svh] scroll-mt-[152px] items-center overflow-hidden border-t border-white/[0.055] px-6 py-20 sm:scroll-mt-24 sm:px-10">
    <div aria-hidden="true" className="template-technical-orbit absolute left-1/2 top-1/2 h-[min(78vw,980px)] w-[min(78vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full" />
    <div className="relative mx-auto w-full max-w-[1240px] text-center">
      <h2 id={`${section.id}-title`} className="mx-auto m-0 max-w-[980px] font-disp text-[clamp(44px,7vw,104px)] font-extrabold leading-[0.92] tracking-[-0.055em] text-white">{section.title}</h2>
      <p className="m-0 mt-5 font-body text-[clamp(18px,1.7vw,25px)] font-medium tracking-[-0.025em] text-white/74">{section.subtitle}</p>
      {section.paragraphs.map((paragraph) => <p key={paragraph} className="mx-auto mb-0 mt-5 max-w-[620px] font-body text-[15px] leading-[1.7] text-white/48">{paragraph}</p>)}
      <div className="mx-auto mt-12 grid max-w-[1100px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {section.responsibilities.map((responsibility, index) => (
          <div key={responsibility} className="template-technical-pill flex min-h-[74px] items-center justify-center rounded-[18px] px-3 py-4" style={{ animationDelay: `${index * -0.47}s` }}>
            <span className="font-body text-[11px] font-medium leading-[1.35] text-white/68 sm:text-[12px]">{responsibility}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ImpactSection: React.FC<{ section: TemplateManagerCaseStudyNarrative['impact'] }> = ({ section }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const metricRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useGSAPContext(() => {
    const sectionElement = sectionRef.current;
    const metricElements = metricRefs.current.filter(
      (element): element is HTMLParagraphElement => Boolean(element)
    );
    if (!sectionElement || metricElements.length < 3) return undefined;

    const zeroMetric = metricElements[0];
    const oneMetric = metricElements[1];
    const hundredsMetric = metricElements[2];
    const oneCounter = { value: 0 };
    const hundredsCounter = { value: 0 };

    const resetMetrics = () => {
      zeroMetric.textContent = '0';
      oneMetric.textContent = '0';
      hundredsMetric.textContent = '0s';
      sectionElement.dataset.counterState = 'idle';
      gsap.set(metricElements, { scale: 1, color: 'rgba(255,255,255,1)' });
    };

    const showFinalMetrics = () => {
      zeroMetric.textContent = '0';
      oneMetric.textContent = '1';
      hundredsMetric.textContent = '100s';
      sectionElement.dataset.counterState = 'complete';
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      showFinalMetrics();
      return undefined;
    }

    resetMetrics();
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: sectionElement,
        start: 'top 72%',
        end: 'bottom 22%',
        toggleActions: 'restart none restart reset',
        onLeaveBack: resetMetrics,
      },
      onStart: () => {
        oneCounter.value = 0;
        hundredsCounter.value = 0;
        sectionElement.dataset.counterState = 'counting';
      },
      onComplete: () => {
        sectionElement.dataset.counterState = 'complete';
      },
    });

    timeline
      .to(zeroMetric, { scale: 1.04, duration: 0.22, yoyo: true, repeat: 1 })
      .to(oneCounter, {
        value: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          oneMetric.textContent = String(Math.round(oneCounter.value));
        },
      }, '+=0.12')
      .fromTo(oneMetric, { scale: 0.92 }, { scale: 1, duration: 0.35 }, '<')
      .to(hundredsCounter, {
        value: 100,
        duration: 1.55,
        ease: 'power3.out',
        onUpdate: () => {
          hundredsMetric.textContent = `${Math.round(hundredsCounter.value)}s`;
        },
      }, '+=0.18')
      .fromTo(hundredsMetric, { scale: 0.92 }, { scale: 1, duration: 0.5 }, '<');

    return undefined;
  }, { scope: sectionRef });

  return (
  <section ref={sectionRef} id={section.id} aria-labelledby={`${section.id}-title`} data-case-study-section={section.id} data-counter-state="idle" data-testid="case-study-section" className="relative flex min-h-screen min-h-[100svh] scroll-mt-[152px] items-center overflow-hidden border-t border-white/[0.055] px-6 py-20 sm:scroll-mt-24 sm:px-10">
    <div aria-hidden="true" className="absolute left-1/2 top-[24%] h-[380px] w-[min(90vw,920px)] -translate-x-1/2 rounded-full bg-[#9F78D7]/15 blur-[100px]" />
    <div className="relative mx-auto w-full max-w-[1300px] text-center">
      <h2 id={`${section.id}-title`} className="m-0 font-disp text-[clamp(48px,7vw,96px)] font-extrabold leading-none tracking-[-0.05em] text-white">{section.title}</h2>
      <div className="mx-auto mt-10 grid max-w-[960px] grid-cols-3 gap-4 sm:mt-14">
        {section.metrics.map((metric, index) => (
          <div key={metric.label} className="border-l border-white/10 px-2 first:border-l-0 sm:px-6">
            <p ref={(element) => { metricRefs.current[index] = element; }} data-impact-metric={index} className="m-0 font-disp text-[clamp(42px,7vw,96px)] font-extrabold leading-none tracking-[-0.06em] text-white">{index === 2 ? '0s' : '0'}</p>
            <p className="mx-auto mb-0 mt-3 max-w-[150px] font-body text-[9px] uppercase leading-[1.4] tracking-[0.12em] text-white/38 sm:text-[11px]">{metric.label}</p>
          </div>
        ))}
      </div>
      <h3 className="m-0 mt-12 font-disp text-[clamp(25px,3vw,40px)] font-bold tracking-[-0.035em] text-white/92 sm:mt-16">{section.outcomeTitle}</h3>
      <div className="mt-7 grid gap-3 text-left md:grid-cols-3 md:gap-4">
        {section.outcomes.map((outcome, index) => (
          <article key={outcome.title} className="template-outcome-card relative overflow-hidden rounded-[20px] p-5 sm:p-6">
            <span className="font-mono text-[8px] text-white/26">0{index + 1}</span>
            <h4 className="mb-0 mt-5 font-disp text-[21px] font-bold tracking-[-0.025em] text-white/86">{outcome.title}</h4>
            <p className="mb-0 mt-3 font-body text-[13px] leading-[1.65] text-white/48">{outcome.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
  );
};

const ReflectionSection: React.FC<{ section: TemplateManagerCaseStudyNarrative['reflection'] }> = ({ section }) => (
  <section id={section.id} aria-labelledby={`${section.id}-title`} data-case-study-section={section.id} data-testid="case-study-section" className="template-reflection-section relative flex min-h-screen min-h-[100svh] scroll-mt-[152px] items-center overflow-hidden border-t border-white/[0.055] px-6 py-20 sm:scroll-mt-24 sm:px-10">
    <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-disp text-[clamp(110px,20vw,330px)] font-extrabold leading-none tracking-[-0.075em] text-white/[0.028]">Reflection</div>
    <div className="relative mx-auto max-w-[1120px] text-center">
      <h2 id={`${section.id}-title`} className="m-0 font-disp text-[clamp(64px,12vw,178px)] font-extrabold leading-[0.82] tracking-[-0.07em] text-white">{section.title}</h2>
      <p className="mx-auto mb-0 mt-10 max-w-[900px] font-body text-[clamp(18px,2.05vw,30px)] font-normal leading-[1.52] tracking-[-0.025em] text-white/68">{section.body}</p>
      <LinkToCaseStudies />
    </div>
  </section>
);

const LinkToCaseStudies: React.FC = () => (
  <Link to="/case-studies" className="mt-12 inline-flex rounded-full border border-white/13 bg-white/[0.055] px-5 py-3 font-body text-[11px] font-medium text-white/62 no-underline backdrop-blur-md transition hover:border-white/25 hover:text-white">Back to case studies ↗</Link>
);

interface TemplateManagerStoryProps {
  narrative: TemplateManagerCaseStudyNarrative;
}

const TemplateManagerStory: React.FC<TemplateManagerStoryProps> = ({ narrative }) => (
  <>
    <StorySection section={narrative.opportunity} visual={<OldEmailClientVisual />} />

    <StorySection section={narrative.workflow} visual={<WorkflowTemplateListVisual />} visualSide="left">
      {narrative.workflow.paragraphs.map((paragraph) => <p key={paragraph} className="m-0">{paragraph}</p>)}
      <div className="grid gap-4 pt-1 sm:grid-cols-2">
        {narrative.workflow.roles.map((role) => (
          <div key={role.title} className="rounded-[16px] border border-white/9 bg-white/[0.035] p-4">
            <p className="m-0 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-white/84">{role.title}</p>
            <ul className="mb-0 mt-3 space-y-2 p-0">
              {role.responsibilities.map((responsibility) => <li key={responsibility} className="flex list-none gap-2 text-[13px] leading-[1.45] text-white/54"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#C5A8EE]" />{responsibility}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="m-0 border-l border-[#C5A8EE]/40 pl-4 text-white/78">{narrative.workflow.conclusion}</p>
    </StorySection>

    <StorySection section={narrative.organization} visual={<CategoryAccordionVisual />} />
    <StorySection section={narrative.editing} visual={<EditorExperienceVisual />} visualSide="left" />
    <StorySection section={narrative.sharing} visual={<ShareFundraisersVisual />} />
    <StorySection section={narrative.discovery} visual={<TemplateFiltersVisual />} visualSide="left">
      {narrative.discovery.paragraphs.map((paragraph) => <p key={paragraph} className="m-0">{paragraph}</p>)}
      <ul className="grid gap-x-6 gap-y-2 p-0 sm:grid-cols-2">
        {narrative.discovery.filters.map((filter) => <li key={filter} className="flex list-none gap-2 text-[13px] leading-[1.5] text-white/58"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#C5A8EE]" />{filter}</li>)}
      </ul>
    </StorySection>
    <StorySection section={narrative.errors} visual={<DefaultConflictVisual />} />
    <TechnicalImplementationSection section={narrative.implementation} />
    <ImpactSection section={narrative.impact} />
    <ReflectionSection section={narrative.reflection} />
  </>
);

export default TemplateManagerStory;
