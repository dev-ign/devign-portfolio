import React from 'react';
import { Icon } from '@iconify/react';
import { getAnswerLabels } from '../engine/buildProjectSummary';
import { formatInvestmentRange } from '../utils/formatInvestmentRange';
import { formatTimeline } from '../utils/formatTimeline';
import type {
  PlannerResult,
  RecommendationMatch,
  ServiceBranch,
} from '../types/servicePlanner.types';

interface PlannerSummaryProps {
  branch: ServiceBranch;
  result: PlannerResult;
  match: RecommendationMatch;
  onBack: () => void;
  onComplete: (result: PlannerResult) => void;
}

const PlannerSummary: React.FC<PlannerSummaryProps> = ({ branch, result, match, onBack, onComplete }) => {
  const selections = getAnswerLabels(branch.questions, result.answers).slice(0, 7);
  return (
    <div className="mx-auto max-w-[880px]">
      <p className="m-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/36">Your project direction</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h3 className="m-0 font-disp text-[clamp(30px,5vw,48px)] font-extrabold leading-[1] tracking-[-0.04em] text-white/94">
          {match.recommendation.title}
        </h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/48">
          {result.complexity} level
        </span>
      </div>
      <p className="mb-0 mt-4 max-w-[700px] font-body text-[14px] font-light leading-[1.7] text-white/54">{match.recommendation.description}</p>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <div className="rounded-[12px] border border-white/9 bg-white/[0.035] p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/34">Typical timeline</span>
          <strong className="mt-2 block font-disp text-[21px] text-white/88">{formatTimeline(result.estimatedTimelineWeeks)}</strong>
        </div>
        <div className="rounded-[12px] border border-white/9 bg-white/[0.035] p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/34">Preliminary investment</span>
          <strong className="mt-2 block font-disp text-[21px] text-white/88">{formatInvestmentRange(result.estimatedInvestmentRange)}</strong>
        </div>
        <div className="rounded-[12px] border border-white/9 bg-white/[0.035] p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/34">Direction confidence</span>
          <strong className="mt-2 block font-disp text-[21px] capitalize text-white/88">{result.confidence}</strong>
        </div>
      </div>

      {result.followUpRequired && (
        <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-[#FFD28A]/18 bg-[#FFD28A]/[0.055] p-4">
          <Icon icon="solar:chat-round-dots-bold-duotone" className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD28A]/75" />
          <p className="m-0 font-body text-[12px] font-light leading-[1.6] text-white/55">
            This project needs a human scope review. We’ll use this direction as a starting point and confirm the right approach together.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-7 lg:grid-cols-2">
        <section aria-labelledby="planner-based-on">
          <h4 id="planner-based-on" className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-white/38">Based on what you selected</h4>
          <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
            {selections.map(item => (
              <li key={item.question} className="border-l border-white/12 pl-3">
                <span className="block font-body text-[11px] text-white/35">{item.question}</span>
                <span className="mt-1 block font-body text-[13px] leading-[1.45] text-white/72">{item.labels.join(', ')}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="planner-likely-needs">
          <h4 id="planner-likely-needs" className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-white/38">Likely project needs</h4>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            {match.recommendation.includedDeliverables.map(deliverable => (
              <li key={deliverable} className="flex items-center gap-2 font-body text-[13px] text-white/66">
                <Icon icon="solar:check-circle-linear" className="h-4 w-4 shrink-0 text-white/38" />
                {deliverable}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mb-0 mt-8 border-t border-white/8 pt-5 font-body text-[11px] font-light leading-[1.6] text-white/34">
        These ranges are directional planning guidance, not a quote. Final scope is confirmed after reviewing goals, content, and technical or production requirements.
      </p>
      <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={onBack} className="rounded-full px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/45 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/70">← Review answers</button>
        <button type="button" onClick={() => onComplete(result)} className="rounded-full bg-white px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#0C0C0E] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[#B887FF] motion-safe:hover:-translate-y-0.5">
          Continue with this project →
        </button>
      </div>
    </div>
  );
};

export default PlannerSummary;
