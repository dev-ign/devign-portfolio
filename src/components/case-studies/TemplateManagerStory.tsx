import React from 'react';
import { Link } from 'react-router-dom';
import TemplatesManagerDemo from '@/components/showcase/TemplatesManagerDemo';
import OwnershipTimeline from '@/components/case-studies/OwnershipTimeline';
import { getAssignedFirstDraftRule, templateManagerDemo as demo } from '@/data/templateManagerDemo';
import type { TemplateManagerCaseStudyNarrative } from '@/data/projects';

const sectionClass = 'relative scroll-mt-[152px] border-t border-white/[0.09] px-6 py-20 sm:scroll-mt-24 sm:px-10 sm:py-28 lg:px-14 xl:px-20';
const eyebrowClass = 'm-0 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[#D7B9FA]';
const titleClass = 'm-0 mt-4 font-disp text-[clamp(38px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-white';
const bodyClass = 'font-body text-[clamp(16px,1.2vw,19px)] leading-[1.68] text-white/75';
const smallClass = 'font-body text-[14px] leading-[1.65] text-white/70';
const assignedFirstDraftRule = getAssignedFirstDraftRule(demo.records.original.id);

type Props = { narrative: TemplateManagerCaseStudyNarrative };
type DetailProps = { index: number };

const DecisionDetail: React.FC<DetailProps> = ({ index }) => {
  const heading = ['Shared structure', 'Ownership in context', 'Two independent records', 'Find without digging'][index];
  return (
    <div className="w-full max-w-[540px] overflow-hidden rounded-[18px] border border-white/15 bg-[#111329] shadow-[0_22px_70px_rgba(5,6,20,0.25)]" aria-label={heading}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-body text-[12px] text-white/65">
        <strong className="font-semibold text-white/90">Templates Manager</strong>
        <span>{index === 2 ? 'Maya’s library' : index === 1 ? 'Template details' : 'Library'}</span>
      </div>
      {index === 0 && <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] divide-x divide-white/10">
        <div className="space-y-3 px-5 py-5 font-body text-[12px] text-white/65"><p className="m-0 text-[#DCC3FA]">▾ {demo.template.category}</p><p className="m-0 pl-4">Shared with me</p><p className="m-0 pl-4">My templates</p></div>
        <div className="flex flex-col justify-center px-5 py-5"><span className="font-mono text-[10px] uppercase tracking-wider text-[#CBA8F4]">Same model, different access</span><strong className="mt-3 font-disp text-[19px] text-white">{demo.template.title}</strong><span className="mt-2 font-body text-[12px] text-white/65">Category · owner · access</span></div>
      </div>}
      {index === 1 && <div className="px-5 py-5"><p className="m-0 font-body text-[11px] text-white/55">{demo.template.category} / Shared with me</p><strong className="mt-2 block font-disp text-[20px] text-white">{demo.template.title}</strong><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 font-body text-[12px] text-white/75"><span>Owner <b className="text-white">{demo.manager}</b></span><span>Access <b className="text-[#D7B9FA]">Read-only</b></span></div><p className="m-0 mt-4 font-body text-[12px] text-white/70">Assigned to Maya Rodriguez and Daniel Brooks</p></div>}
      {index === 2 && <div className="divide-y divide-white/10 px-5 py-2 font-body text-[12px]"><div className="flex items-center justify-between gap-4 py-4"><div><strong className="text-white">{demo.records.original.title}</strong><p className="m-0 mt-1 text-white/60">Shared original · Dana Whitfield</p></div><span className="shrink-0 text-[#D7B9FA]">Read-only</span></div><div className="flex items-center justify-between gap-4 py-4"><div><strong className="text-white">{demo.records.personalCopy.title}</strong><p className="m-0 mt-1 text-white/60">Personal copy · Maya Rodriguez</p></div><span className="shrink-0 text-[#9EDACD]">Editable</span></div></div>}
      {index === 3 && <div className="px-5 py-5 font-body text-[12px]"><div className="rounded-md border border-white/15 bg-white/[0.045] px-3 py-2 text-white/55">⌕ &nbsp; Search templates</div><div className="mt-4 flex items-center justify-between border-b border-white/10 pb-2 text-white/85"><span>▾ &nbsp; Annual Giving</span><span>12</span></div><div className="flex items-center justify-between border-b border-white/10 py-2 text-white/75"><span>▸ &nbsp; Stewardship</span><span>9</span></div><div className="flex items-center justify-between pt-2 text-white/75"><span>▸ &nbsp; Donor Follow-Up</span><span>11</span></div></div>}
    </div>
  );
};

const TemplateManagerStory: React.FC<Props> = ({ narrative }) => (
  <>
    <section id="opportunity" aria-labelledby="opportunity-title" data-case-study-section="opportunity" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div><p className={eyebrowClass}>01 / Problem</p><h2 id="opportunity-title" className={titleClass}>A template is only useful when the right person can find and use it.</h2><p className={`mt-7 max-w-[620px] ${bodyClass}`}>{narrative.opportunity.paragraphs[0]}</p></div>
        <div className="self-end border-l-2 border-[#C9AAF0] py-3 pl-7 sm:pl-10"><p className={eyebrowClass}>The design challenge</p><p className="m-0 mt-5 font-disp text-[clamp(25px,2.7vw,40px)] font-bold leading-[1.2] tracking-[-0.03em] text-white">{narrative.opportunity.designChallenge}</p></div>
      </div>
    </section>

    <section id="workflow" aria-labelledby="workflow-title" data-case-study-section="workflow" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto max-w-[1380px]"><p className={eyebrowClass}>02 / Ownership model</p><h2 id="workflow-title" className={`${titleClass} max-w-[980px]`}>Manager → Shared Library → Fundraiser</h2><p className={`mt-6 max-w-[770px] ${bodyClass}`}>Dana owns the reusable message. Maya receives read-only access, then creates a separate copy to personalize. The original remains in her shared library.</p>
        <OwnershipTimeline />
        <p className="m-0 mt-10 max-w-[790px] font-body text-[13px] leading-[1.65] text-white/60">Administrators had broader organizational access under configured permissions. Names and content here are illustrative; this interface reconstructs the documented workflow.</p>
      </div>
    </section>

    <section id="decisions" aria-labelledby="decisions-title" data-case-study-section="decisions" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto max-w-[1380px]"><p className={eyebrowClass}>03 / Product decisions</p><h2 id="decisions-title" className={titleClass}>Design the rules into the interface.</h2><p className={`mt-6 max-w-[750px] ${bodyClass}`}>Four decisions made the library easier to navigate and the ownership model visible at the moment of use.</p>
        <div className="mt-12 border-t border-white/15">
          {narrative.decisions.items.map((item, index) => <article key={item.title} className="grid items-center gap-10 border-b border-white/15 py-12 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className={index % 2 ? 'lg:order-2' : ''}><span className="font-mono text-[clamp(34px,4vw,58px)] leading-none text-[#CBA8F4]">0{index + 1}</span><h3 className="m-0 mt-5 max-w-[550px] font-disp text-[clamp(26px,3vw,42px)] font-bold leading-[1.12] tracking-[-0.03em] text-white">{item.title}</h3><p className={`m-0 mt-5 max-w-[520px] ${smallClass}`}>{item.problem}</p><p className="m-0 mt-4 max-w-[520px] font-body text-[15px] leading-[1.65] text-white/90">{item.final}</p><p className="m-0 mt-7 max-w-[520px] border-l-2 border-[#C9AAF0] pl-4 font-body text-[13px] leading-[1.55] text-[#E0C9FA]">{item.principle}</p></div>
            <div className={`flex ${index % 2 ? 'lg:order-1 lg:justify-start' : 'lg:justify-end'}`}><DecisionDetail index={index} /></div>
          </article>)}
        </div>
      </div>
    </section>

    <section id="experience" aria-labelledby="experience-title" data-case-study-section="experience" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto max-w-[1480px]"><p className={eyebrowClass}>04 / Working experience</p><div className="mb-10 grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-end"><h2 id="experience-title" className={titleClass}>Follow the template from one role to the next.</h2><p className={`m-0 max-w-[620px] ${bodyClass}`}>Share Dana’s template, then inspect it as Maya. Duplicate, edit, and save the personal copy. Both records stay available so you can compare their access states.</p></div><TemplatesManagerDemo variant="case-study" isActive isTransitionComplete /><p className="m-0 mt-6 max-w-[900px] font-body text-[13px] leading-[1.6] text-white/65">The update label appears on Dana’s shared original after the copy is made. It communicates availability only; this reconstruction does not simulate an unverified refresh action.</p></div>
    </section>

    <section id="first-draft" aria-labelledby="first-draft-title" data-case-study-section="first-draft" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20"><div><p className={eyebrowClass}>05 / Beyond the library</p><h2 id="first-draft-title" className={titleClass}>One rule. One designated default.</h2><p className={`mt-7 ${bodyClass}`}>Templates could also supply starting content for First Draft. Assigning a default rule linked a template configuration to a later fundraising scenario.</p><p className="m-0 mt-5 font-body text-[15px] leading-[1.65] text-white/78">Only one template can hold a particular default rule within its applicable scope. The assignment must be visible so managers understand which content will be used.</p><p className="m-0 mt-6 font-body text-[12px] leading-[1.6] text-white/60">“Top Donor” is an illustrative rule label from the supplied product brief. The precise historical rule list, uniqueness scope, and reassignment behavior need confirmation.</p></div>
        <div className="overflow-hidden rounded-[20px] border border-white/15 bg-[#111329] shadow-[0_25px_80px_rgba(5,6,20,0.22)]">
          <div className="border-b border-white/10 px-6 py-4 font-body text-[12px] text-white/65">Templates Manager / Default rules</div>
          <div className="px-6 py-7 sm:px-9"><span className="font-mono text-[11px] uppercase tracking-wider text-[#D7B9FA]">Template configuration</span><h3 className="m-0 mt-3 font-disp text-[clamp(22px,2.3vw,30px)] font-bold text-white">{demo.records.original.title}</h3><p className="m-0 mt-2 font-body text-[13px] text-white/65">Owned by {demo.manager}</p><div className="mt-6 flex flex-wrap items-center gap-4 border-y border-white/13 py-5"><span className="font-body text-[13px] text-white/70">Designated default rule</span><strong className="rounded-full border border-[#CBA8F4]/40 bg-[#CBA8F4]/12 px-4 py-2 font-body text-[13px] text-[#E6D4FF]">{assignedFirstDraftRule?.label ?? 'Unassigned'}</strong><span className="font-body text-[12px] text-white/58">{assignedFirstDraftRule ? `1 assigned in ${demo.firstDraft.scopeLabel}` : 'No assignment'}</span></div><div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><div><span className="font-mono text-[11px] uppercase tracking-wider text-[#D7B9FA]">Default rule</span><p className="m-0 mt-2 font-disp text-[21px] font-semibold text-white">{assignedFirstDraftRule?.label ?? 'Unassigned'}</p></div><span aria-hidden="true" className="text-[24px] text-[#D7B9FA]">→</span><div><span className="font-mono text-[11px] uppercase tracking-wider text-[#D7B9FA]">First Draft</span><p className="m-0 mt-2 font-body text-[13px] leading-[1.55] text-white/75">Eligible scenario begins with the designated template content.</p></div></div></div>
        </div>
      </div>
    </section>

    <section id="implementation" aria-labelledby="implementation-title" data-case-study-section="implementation" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20"><div><p className={eyebrowClass}>06 / Design to development</p><h2 id="implementation-title" className={titleClass}>The rules carried through to the frontend.</h2><p className={`mt-6 ${bodyClass}`}>I translated the interaction model into the React interface, using MUI patterns and TinyMCE for rich-text editing, and integrated the views with the Django REST API. The interface reflected capabilities and returned states; backend authorization remained a server responsibility.</p></div><div className="border-t border-white/20">{[
        ['01', 'Permission-aware interface', 'Owner, recipient, and access data determine what the user sees. The server enforces what they can do.'],
        ['02', 'Content editing', 'TinyMCE supports formatted donor messages; merge fields preserve reusable personalization.'],
        ['03', 'Content operations', 'Navigation, dialogs, sharing, copying, editing, and save feedback follow the same library model.'],
        ['04', 'Default rule constraints', 'A designated rule needs a clear active assignment and appropriate validation by backend services.'],
      ].map(([number, heading, copy]) => <div key={number} className="grid gap-3 border-b border-white/15 py-6 sm:grid-cols-[44px_1fr]"><span className="font-mono text-[12px] text-[#D7B9FA]">{number}</span><div><h3 className="m-0 font-disp text-[22px] font-bold text-white">{heading}</h3><p className="m-0 mt-2 font-body text-[14px] leading-[1.65] text-white/70">{copy}</p></div></div>)}</div></div>
    </section>

    <section id="impact" aria-labelledby="impact-title" data-case-study-section="impact" data-testid="case-study-section" className={sectionClass}>
      <div className="mx-auto max-w-[1380px]"><p className={eyebrowClass}>07 / Outcome</p><h2 id="impact-title" className={`${titleClass} max-w-[950px]`}>A clearer path from approved content to personal outreach.</h2><div className="mt-11 grid gap-10 border-t border-white/20 pt-9 lg:grid-cols-[.8fr_1.2fr]"><p className="m-0 font-disp text-[clamp(22px,2.5vw,32px)] font-bold leading-[1.25] text-white">A shared source and an editable personal copy can coexist.</p><div><p className={`m-0 ${bodyClass}`}>The delivered system covered discovery through categories, search, and filters; template creation and editing; sharing, copying, moving, and personal or organizational libraries; plus default rules and First Draft integration. This walkthrough goes deepest on the ownership transition.</p><p className="m-0 mt-6 font-body text-[13px] leading-[1.6] text-white/60">No project-specific adoption or efficiency measure was available, so this outcome describes delivered capabilities rather than a quantified impact claim.</p></div></div></div>
    </section>

    <section id="reflection" aria-labelledby="reflection-title" data-case-study-section="reflection" data-testid="case-study-section" className={`${sectionClass} pb-28 sm:pb-36`}><div className="mx-auto max-w-[1080px] text-center"><p className={eyebrowClass}>08 / Reflection</p><h2 id="reflection-title" className={titleClass}>The interface was the visible part of a content system.</h2><p className="mx-auto mb-0 mt-8 max-w-[800px] font-body text-[clamp(18px,1.7vw,24px)] leading-[1.6] text-white/80">{narrative.reflection.body[0]}</p><p className="mx-auto mb-0 mt-5 max-w-[760px] font-body text-[15px] leading-[1.7] text-white/65">The work reinforced a practical habit: define ownership and permissions before polishing screens, then carry those rules through every state and implementation handoff.</p><Link to="/portfolio#selected-work" className="mt-10 inline-flex rounded-full border border-white/18 bg-white/[0.055] px-5 py-3 font-body text-[12px] font-medium text-white/80 no-underline transition hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Back to Portfolio ↗</Link></div></section>
  </>
);

export default TemplateManagerStory;
