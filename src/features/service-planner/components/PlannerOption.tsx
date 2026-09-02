import React from 'react';
import { Icon } from '@iconify/react';
import type { PlannerOption as PlannerOptionType } from '../types/servicePlanner.types';

interface PlannerOptionProps {
  option: PlannerOptionType;
  selected: boolean;
  disabled?: boolean;
  multiple: boolean;
  onSelect: () => void;
}

const PlannerOption: React.FC<PlannerOptionProps> = ({ option, selected, disabled, multiple, onSelect }) => (
  <button
    type="button"
    role={multiple ? 'checkbox' : 'radio'}
    aria-checked={selected}
    disabled={disabled}
    onClick={onSelect}
    className={`group relative flex min-h-[64px] w-full items-start gap-3 rounded-[10px] border p-3.5 text-left outline-none transition-[border-color,background,transform,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-white/70 motion-safe:hover:-translate-y-0.5 ${
      selected
        ? 'border-[#B887FF]/65 bg-[#8F4DFF]/12'
        : 'border-white/10 bg-white/[0.025] hover:border-white/22 hover:bg-white/[0.045]'
    } ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
  >
    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${multiple ? 'rounded-[5px]' : 'rounded-full'} ${selected ? 'border-[#CDA7FF] bg-[#A75CFF] text-white' : 'border-white/20 bg-white/[0.03] text-transparent'}`}>
      <Icon icon={multiple ? 'solar:check-read-linear' : 'solar:record-circle-linear'} className="h-3 w-3" />
    </span>
    <span className="min-w-0">
      <span className="block font-body text-[13px] font-medium leading-[1.35] text-white/86">{option.label}</span>
      {option.description && <span className="mt-1.5 block font-body text-[11px] font-light leading-[1.5] text-white/43">{option.description}</span>}
    </span>
  </button>
);

export default PlannerOption;
