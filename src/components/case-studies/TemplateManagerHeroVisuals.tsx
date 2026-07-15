import React from 'react';

type FloatingPanelStyle = React.CSSProperties & {
  '--tm-delay': string;
  '--tm-duration': string;
  '--tm-rotate': string;
  '--tm-shift': string;
};

const floatingStyle = (
  rotate: string,
  shift: string,
  duration: string,
  delay: string
): FloatingPanelStyle => ({
  '--tm-delay': delay,
  '--tm-duration': duration,
  '--tm-rotate': rotate,
  '--tm-shift': shift,
});

const WindowControls: React.FC<{ label: string; meta?: string }> = ({ label, meta }) => (
  <div className="flex items-center gap-2 border-b border-white/8 px-3.5 py-2.5">
    <span className="h-2 w-2 rounded-full bg-[#B06EF3] shadow-[0_0_12px_rgba(176,110,243,0.75)]" />
    <span className="font-body text-[10px] font-semibold tracking-[-0.01em] text-white/75">
      {label}
    </span>
    {meta && (
      <span className="ml-auto font-mono text-[7px] uppercase tracking-[0.12em] text-white/28">
        {meta}
      </span>
    )}
  </div>
);

const SkeletonLine: React.FC<{ width: string; accent?: boolean }> = ({ width, accent }) => (
  <span
    className={`block h-1.5 rounded-full ${accent ? 'bg-[#C39AF2]/80' : 'bg-[#8588BE]/45'}`}
    style={{ width }}
  />
);

const TemplateLibraryPanel: React.FC = () => (
  <div
    className="template-manager-float template-manager-float--library absolute left-[clamp(28px,4vw,64px)] top-[13%] hidden w-[clamp(250px,22vw,320px)] md:block"
    style={floatingStyle('-3deg', '-11px', '8.6s', '-2.4s')}
  >
    <div className="template-manager-panel overflow-hidden rounded-[16px]">
      <WindowControls label="Template library" meta="48 templates" />
      <div className="p-3.5">
        <div className="mb-3 flex h-8 items-center rounded-[8px] border border-white/8 bg-white/[0.035] px-2.5">
          <span className="mr-2 grid h-4 w-4 place-items-center rounded-full border border-white/20 text-[8px] text-white/35">
            ⌕
          </span>
          <span className="font-body text-[9px] text-white/30">Search templates</span>
          <span className="ml-auto rounded border border-white/10 px-1.5 py-0.5 font-mono text-[6px] text-white/22">
            ⌘ K
          </span>
        </div>

        <div className="space-y-1.5">
          {[
            ['Annual Giving', '12'],
            ['Stewardship', '08'],
            ['Campaign Updates', '16'],
          ].map(([label, count], index) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 rounded-[7px] border px-2.5 py-2 ${
                index === 0
                  ? 'border-[#B06EF3]/25 bg-[#B06EF3]/12'
                  : 'border-transparent bg-white/[0.025]'
              }`}
            >
              <span
                className={`grid h-4 w-4 place-items-center rounded-[4px] text-[7px] ${
                  index === 0 ? 'bg-[#B06EF3]/25 text-[#D7B9FA]' : 'bg-white/6 text-white/25'
                }`}
              >
                {index === 0 ? '−' : '+'}
              </span>
              <span className="font-body text-[8px] font-medium text-white/58">{label}</span>
              <span className="ml-auto font-mono text-[7px] text-white/25">{count}</span>
            </div>
          ))}
        </div>

        <div className="mt-2.5 space-y-1 pl-6">
          {['First-time donor welcome', 'Year-end appeal'].map((label, index) => (
            <div
              key={label}
              className={`flex items-center rounded-[6px] px-2 py-1.5 ${
                index === 1 ? 'bg-white/[0.055]' : ''
              }`}
            >
              <span className="font-body text-[7px] text-white/40">{label}</span>
              {index === 1 && (
                <span className="ml-auto rounded-full bg-[#B06EF3]/18 px-1.5 py-0.5 font-mono text-[5px] uppercase tracking-[0.08em] text-[#D7B9FA]/75">
                  shared
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FilterPanel: React.FC = () => (
  <div
    className="template-manager-float template-manager-float--filter absolute right-[clamp(28px,5vw,76px)] top-[12%] hidden w-[clamp(235px,21vw,300px)] md:block"
    style={floatingStyle('2.5deg', '-8px', '7.8s', '-4.2s')}
  >
    <div className="template-manager-panel rounded-[15px] p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="m-0 font-body text-[10px] font-semibold text-white/72">Filter templates</p>
          <p className="m-0 mt-0.5 font-body text-[7px] font-normal text-white/28">
            Narrow your library
          </p>
        </div>
        <span className="rounded-full border border-[#B06EF3]/25 bg-[#B06EF3]/12 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-[#D3AEFA]/80">
          3 active
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['All teams', 'Email', 'Shared', 'Recently edited'].map((label, index) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1.5 font-body text-[7px] ${
              index < 3
                ? 'border-[#B06EF3]/24 bg-[#B06EF3]/13 text-[#E0CBF8]/80'
                : 'border-white/8 bg-white/[0.025] text-white/28'
            }`}
          >
            {index < 3 && <span className="mr-1 text-[#C9A1F4]">✓</span>}
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center border-t border-white/7 pt-2.5">
        <span className="font-mono text-[6px] uppercase tracking-[0.12em] text-white/22">
          Updated by
        </span>
        <div className="ml-auto flex -space-x-1.5">
          {['#B06EF3', '#7B8CDE', '#6EC6CA'].map((color) => (
            <span
              key={color}
              className="h-5 w-5 rounded-full border-2 border-[#17172A]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SideDrawerPanel: React.FC = () => (
  <div
    className="template-manager-float template-manager-float--drawer absolute bottom-[7%] left-[clamp(24px,3.5vw,54px)] hidden w-[280px] xl:block"
    style={floatingStyle('2deg', '-9px', '9.4s', '-5.5s')}
  >
    <div className="template-manager-panel overflow-hidden rounded-[16px]">
      <WindowControls label="Template details" meta="autosaved" />
      <div className="p-3.5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <SkeletonLine width="116px" accent />
            <div className="mt-2"><SkeletonLine width="78px" /></div>
          </div>
          <span className="rounded-full bg-[#4DF0C6]/10 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.08em] text-[#79E8CD]/75">
            Published
          </span>
        </div>
        <div className="space-y-2.5 rounded-[9px] border border-white/7 bg-black/10 p-3">
          {[
            ['Owner', 'Advancement team'],
            ['Category', 'Annual giving'],
            ['Access', '12 fundraisers'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-body text-[7px] text-white/25">{label}</span>
              <span className="font-body text-[7px] text-white/55">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="rounded-[7px] border border-white/8 py-2 text-center font-body text-[7px] text-white/38">
            Duplicate
          </span>
          <span className="rounded-[7px] border border-[#B06EF3]/25 bg-[#B06EF3]/16 py-2 text-center font-body text-[7px] text-[#E0C8FA]/80">
            Edit template
          </span>
        </div>
      </div>
    </div>
  </div>
);

const EditorPanel: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => (
  <div
    className={
      mobile
        ? 'template-manager-float template-manager-float--mobile-editor absolute inset-x-5 bottom-[5%] md:hidden'
        : 'template-manager-float template-manager-float--editor absolute bottom-[3%] right-[clamp(24px,3.5vw,56px)] hidden w-[clamp(320px,29vw,420px)] md:block'
    }
    style={floatingStyle(mobile ? '-1deg' : '-2deg', '-8px', mobile ? '8.2s' : '9s', '-3.1s')}
  >
    <div className="template-manager-panel overflow-hidden rounded-[16px]">
      <WindowControls label="Email editor" meta={mobile ? 'draft' : 'TinyMCE · saved'} />
      <div className="flex items-center gap-1.5 border-b border-white/7 bg-white/[0.018] px-3 py-2">
        {['B', 'I', '≡', '↗'].map((item, index) => (
          <span
            key={item}
            className={`grid h-5 w-5 place-items-center rounded-[4px] font-mono text-[7px] ${
              index === 0 ? 'bg-[#B06EF3]/20 text-[#D7B6FA]' : 'bg-white/5 text-white/34'
            }`}
          >
            {item}
          </span>
        ))}
        <span className="ml-1 h-4 w-px bg-white/8" />
        <span className="rounded-full bg-white/5 px-2.5 py-1 font-body text-[6px] text-white/30">
          Merge field
        </span>
        <span className="ml-auto h-1.5 w-10 rounded-full bg-[#4DF0C6]/50" />
      </div>
      <div className="border-b border-white/7 px-3 py-2">
        <div className="flex items-center gap-2 rounded-[5px] bg-black/12 px-2.5 py-1.5">
          <span className="font-mono text-[6px] uppercase tracking-[0.08em] text-white/20">Subject</span>
          <span className="font-body text-[7px] text-white/52">Your impact starts here</span>
        </div>
      </div>
      <div className={`bg-[#10101F] p-3 ${mobile ? 'h-[92px]' : 'h-[168px]'}`}>
        <div className="mx-auto h-full max-w-[88%] rounded-[7px] border border-white/8 bg-[#19192D] p-3 shadow-[0_16px_38px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-2 border-b border-white/7 pb-2">
            <span className="h-3 w-7 rounded-[3px] bg-[#B06EF3]/35" />
            <SkeletonLine width="50px" />
            <span className="ml-auto"><SkeletonLine width="34px" /></span>
          </div>
          <div className="pt-3">
            <SkeletonLine width="46%" accent />
            {!mobile && (
              <div className="mt-2 space-y-1.5">
                <SkeletonLine width="92%" />
                <SkeletonLine width="84%" />
                <SkeletonLine width="74%" />
              </div>
            )}
            <span className="mt-3 block h-4 w-16 rounded-full bg-[#B06EF3]/75" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MobileTemplateStrip: React.FC = () => (
  <div
    className="template-manager-float template-manager-float--mobile-list absolute inset-x-5 top-[13%] md:hidden"
    style={floatingStyle('1deg', '-7px', '7.6s', '-1.8s')}
  >
    <div className="template-manager-panel rounded-[14px] p-3">
      <div className="mb-2.5 flex items-center">
        <span className="font-body text-[9px] font-semibold text-white/65">Template library</span>
        <span className="ml-auto rounded-full bg-[#B06EF3]/13 px-2 py-1 font-mono text-[6px] text-[#D1AFF6]/70">
          48 total
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {['Appeals', 'Welcome', 'Updates'].map((label, index) => (
          <div
            key={label}
            className={`rounded-[7px] border p-2 ${
              index === 0
                ? 'border-[#B06EF3]/24 bg-[#B06EF3]/11'
                : 'border-white/7 bg-white/[0.025]'
            }`}
          >
            <span className="mb-2 block h-2.5 w-2.5 rounded-[3px] bg-[#B06EF3]/25" />
            <span className="block font-body text-[6px] text-white/42">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TemplateManagerHeroVisuals: React.FC = () => (
  <div
    aria-hidden="true"
    data-testid="template-manager-hero-visuals"
    className="pointer-events-none absolute inset-x-0 top-0 z-0 h-screen h-[100svh] overflow-hidden"
  >
    <div className="absolute -left-[10%] top-[20%] h-[46vw] w-[46vw] rounded-full bg-[#AFC0FF]/12 blur-[100px]" />
    <div className="absolute -right-[8%] bottom-[-16%] h-[50vw] w-[50vw] rounded-full bg-[#171D52]/28 blur-[90px]" />

    <TemplateLibraryPanel />
    <FilterPanel />
    <SideDrawerPanel />
    <EditorPanel />
    <MobileTemplateStrip />
    <EditorPanel mobile />
  </div>
);

export default TemplateManagerHeroVisuals;
