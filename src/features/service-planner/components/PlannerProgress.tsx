import React from 'react';

interface PlannerProgressProps {
  progress: number;
  current: number;
  total: number;
  summary?: boolean;
}

const PlannerProgress: React.FC<PlannerProgressProps> = ({ progress, current, total, summary }) => (
  <div className="border-b border-white/8 px-[clamp(18px,4vw,34px)] py-3">
    <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-white/36">
      <span>{summary ? 'Project direction' : `Question ${Math.max(1, current)} of ${total}`}</span>
      <span>{progress}%</span>
    </div>
    <div className="h-1 overflow-hidden rounded-full bg-white/8" aria-hidden="true">
      <div className="h-full rounded-full bg-white/75 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default PlannerProgress;
