import React from 'react';
import { Icon } from '@iconify/react';
import { branchVisualThemes } from '../config/branchVisualThemes';
import type { ServiceBranch } from '../types/servicePlanner.types';

interface BranchPreviewProps {
  branch: ServiceBranch;
}

const BranchPreview: React.FC<BranchPreviewProps> = ({ branch }) => {
  const theme = branchVisualThemes[branch.id];

  return (
    <span
      aria-hidden="true"
      data-preview-variant={theme.previewVariant}
      className="relative block h-[190px] w-full overflow-hidden rounded-[17px] border border-white/[0.08] bg-[#0B0B0E] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:h-[210px]"
    >
      <span
        className="absolute inset-0 opacity-55 transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90 motion-reduce:transition-none"
        style={{
          background: `radial-gradient(circle at 74% 24%, ${theme.glow}, transparent 38%), linear-gradient(145deg, rgba(255,255,255,0.055), transparent 58%)`,
        }}
      />
      <span
        className="absolute -right-[18%] -top-[35%] h-[78%] w-[76%] rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-45 group-focus-visible:opacity-45 motion-reduce:transition-none"
        style={{ backgroundColor: branch.preview.accent }}
      />

      <span className="absolute inset-x-[9%] top-[16%] rounded-[14px] border border-white/[0.11] bg-[#111116]/90 p-3.5 shadow-[0_22px_60px_rgba(0,0,0,0.42)] transition-[transform,border-color,filter] duration-500 group-hover:-translate-y-1 group-hover:border-white/[0.17] group-hover:brightness-110 group-focus-visible:-translate-y-1 group-focus-visible:border-white/[0.17] group-focus-visible:brightness-110 motion-reduce:transform-none motion-reduce:transition-none">
        <span className="mb-3.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/14" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/9" />
          <span className="ml-auto h-1.5 w-9 rounded-full bg-white/8" />
        </span>
        <span className="grid grid-cols-[0.75fr_1fr] gap-2.5">
          <span className="h-[82px] rounded-[9px] border border-white/[0.07] bg-white/[0.035] p-2.5">
            <span className="block h-2 w-2/3 rounded-full bg-white/14" />
            <span className="mt-2 block h-2 w-full rounded-full bg-white/[0.07]" />
            <span className="mt-2 block h-8 rounded-[6px] border border-white/[0.05] bg-black/20" />
          </span>
          <span className="flex flex-col gap-2 pt-1">
            <span className="h-2 w-4/5 rounded-full bg-white/22" />
            <span className="h-2 w-full rounded-full bg-white/10" />
            <span className="h-2 w-2/3 rounded-full bg-white/10" />
            <span className="mt-1.5 h-6 w-[72%] rounded-full border border-white/[0.06]" style={{ backgroundColor: `${branch.preview.accent}32` }} />
          </span>
        </span>
      </span>

      <span className="absolute bottom-3.5 right-3.5 grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-black/35 text-white/68 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <Icon icon={branch.preview.icon ?? 'solar:stars-bold-duotone'} className="h-[18px] w-[18px]" />
      </span>
    </span>
  );
};

export default BranchPreview;
