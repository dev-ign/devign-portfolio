import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useServicePlanner } from '../hooks/useServicePlanner';
import type { PlannerResult, ServiceBranchId } from '../types/servicePlanner.types';
import PlannerEducationPanel from './PlannerEducationPanel';
import PlannerProgress from './PlannerProgress';
import PlannerQuestion from './PlannerQuestion';
import PlannerSummary from './PlannerSummary';

interface ServicePlannerStepperProps {
  branchId: ServiceBranchId;
  onComplete: (result: PlannerResult) => void;
}

const ServicePlannerStepper: React.FC<ServicePlannerStepperProps> = ({ branchId, onComplete }) => {
  const planner = useServicePlanner();
  const selectBranch = planner.selectBranch;

  useEffect(() => {
    selectBranch(branchId);
  }, [branchId, selectBranch]);

  if (!planner.branch || !planner.currentQuestion || !planner.recommendation || !planner.result) return null;

  if (planner.showSummary) {
    return (
      <>
        <PlannerProgress progress={100} current={planner.visibleQuestions.length} total={planner.visibleQuestions.length} summary />
        <div className="overflow-y-auto px-[clamp(18px,4vw,40px)] py-[clamp(24px,5vw,42px)]">
          <PlannerSummary branch={planner.branch} result={planner.result} match={planner.recommendation} onBack={planner.goBack} onComplete={onComplete} />
        </div>
      </>
    );
  }

  const atFirstQuestion = planner.currentIndex === 0;
  return (
    <>
      <PlannerProgress progress={planner.progress} current={planner.currentIndex + 1} total={planner.visibleQuestions.length} />
      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(220px,.72fr)_minmax(0,1.6fr)] lg:overflow-hidden">
        <aside className="border-b border-white/8 bg-white/[0.018] p-[clamp(18px,3vw,28px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="hidden lg:block">
            <span className="grid h-10 w-10 place-items-center rounded-[10px] border border-white/10 bg-white/5 text-white/65">
              <Icon icon={planner.branch.preview.icon ?? 'solar:stars-bold-duotone'} className="h-5 w-5" />
            </span>
            <p className="mb-0 mt-4 font-mono text-[9px] uppercase tracking-[0.13em] text-white/34">Planning</p>
            <h3 className="m-0 mt-2 font-disp text-[23px] font-extrabold tracking-[-0.03em] text-white/88">{planner.branch.title}</h3>
            <p className="mb-0 mt-3 font-body text-[12px] font-light leading-[1.65] text-white/42">{planner.branch.description}</p>
            <div className="my-6 h-px bg-white/8" />
          </div>
          <PlannerEducationPanel note={planner.currentQuestion.educationalNote} />
          <div className="mt-4 hidden rounded-[12px] border border-white/8 bg-black/10 p-4 lg:block" aria-live="polite">
            <p className="m-0 font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">Current direction</p>
            <p className="mb-0 mt-2 font-disp text-[15px] font-bold text-white/72">{planner.recommendation.recommendation.title}</p>
            <p className="mb-0 mt-1 font-body text-[11px] leading-[1.5] text-white/34">This updates as you answer.</p>
          </div>
        </aside>

        <div className="flex min-h-[500px] flex-col overflow-y-auto px-[clamp(18px,5vw,46px)] py-[clamp(24px,5vw,42px)]">
          <div className="flex-1">
            <PlannerQuestion
              key={planner.currentQuestion.id}
              question={planner.currentQuestion}
              answer={planner.answers[planner.currentQuestion.id]}
              onAnswer={answer => planner.answerQuestion(planner.currentQuestion!.id, answer)}
            />
          </div>
          <div className="sticky bottom-0 -mx-2 mt-8 flex items-center justify-between gap-4 border-t border-white/8 bg-[#0C0C0E]/95 px-2 pt-4 backdrop-blur-xl">
            <button
              type="button"
              onClick={planner.goBack}
              disabled={atFirstQuestion}
              className="rounded-full px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/45 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 disabled:invisible"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={planner.goNext}
              aria-disabled={!planner.canGoNext}
              className={`rounded-full px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.1em] outline-none transition-[background,color,transform] focus-visible:ring-2 focus-visible:ring-[#B887FF] ${planner.canGoNext ? 'bg-white text-[#0C0C0E] motion-safe:hover:-translate-y-0.5' : 'cursor-default bg-white/8 text-white/25'}`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePlannerStepper;
