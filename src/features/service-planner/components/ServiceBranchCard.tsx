import React from 'react';
import { Icon } from '@iconify/react';
import { branchVisualThemes } from '../config/branchVisualThemes';
import type { ServiceBranch } from '../types/servicePlanner.types';
import BranchPreview from './BranchPreview';

interface ServiceBranchCardProps {
  branch: ServiceBranch;
  onSelect: (branch: ServiceBranch, trigger: HTMLButtonElement) => void;
}

const ServiceBranchCard: React.FC<ServiceBranchCardProps> = ({ branch, onSelect }) => {
  const theme = branchVisualThemes[branch.id];

  return (
    <button
      type="button"
      className="services-card service-card group relative flex h-full min-h-[400px] flex-col overflow-hidden rounded-[24px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.052),rgba(255,255,255,0.022))] p-3.5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition-[transform,border-color,background,box-shadow] duration-[420ms] ease-out hover:border-white/[0.17] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.066),rgba(255,255,255,0.028))] hover:shadow-[0_28px_72px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.07)] focus-visible:border-white/25 focus-visible:ring-2 focus-visible:ring-[#C7A7F4]/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C0C0E] active:scale-[0.99] motion-safe:hover:-translate-y-2 motion-safe:hover:scale-[1.005] motion-safe:focus-visible:-translate-y-2 motion-safe:focus-visible:scale-[1.005] motion-reduce:transform-none motion-reduce:transition-colors sm:min-h-[430px] sm:p-4"
      onClick={event => onSelect(branch, event.currentTarget)}
      aria-label={`${theme.ctaLabel}: ${branch.title}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] top-[8%] h-[46%] rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        style={{ backgroundColor: theme.glow }}
      />

      <BranchPreview branch={branch} />

      <span className="relative flex flex-1 flex-col px-[clamp(6px,1vw,10px)] pb-2 pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/36">{branch.eyebrow}</span>
        <span className="mt-3 font-disp text-[clamp(23px,2.25vw,29px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-white/92">{branch.title}</span>
        <span className="mt-3.5 font-body text-[13px] font-light leading-[1.65] text-white/50">{branch.description}</span>
        <span className="mt-auto flex items-center justify-between gap-4 pt-7 font-mono text-[10px] uppercase tracking-[0.1em] text-white/64 transition-colors duration-300 group-hover:text-white/86 group-focus-visible:text-white/86">
          {theme.ctaLabel}
          <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none" />
        </span>
      </span>
    </button>
  );
};

export default ServiceBranchCard;
