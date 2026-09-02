import React from 'react';
import { Icon } from '@iconify/react';

interface PlannerEducationPanelProps {
  note?: string;
}

const PlannerEducationPanel: React.FC<PlannerEducationPanelProps> = ({ note }) => {
  if (!note) return null;
  return (
    <details className="group rounded-[12px] border border-white/8 bg-white/[0.035] p-4 lg:open:border-white/10" open>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
        <Icon icon="solar:lightbulb-bolt-bold-duotone" className="h-4 w-4 text-white/62" />
        Why we ask
        <Icon icon="solar:alt-arrow-down-linear" className="ml-auto h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mb-0 mt-3 font-body text-[12px] font-light leading-[1.65] text-white/48">{note}</p>
    </details>
  );
};

export default PlannerEducationPanel;
