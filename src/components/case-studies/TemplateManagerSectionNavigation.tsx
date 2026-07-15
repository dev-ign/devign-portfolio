import React, { useEffect, useRef, useState } from 'react';

export interface TemplateManagerSectionLink {
  id: string;
  label: string;
  menuLabel: string;
}

interface TemplateManagerSectionNavigationProps {
  sections: TemplateManagerSectionLink[];
}

const TemplateManagerSectionNavigation: React.FC<TemplateManagerSectionNavigationProps> = ({
  sections,
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'hero');
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateNavigation = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const pinOffset = window.innerWidth < 640 ? 80 : 24;
        const slotTop = slotRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        setIsPinned(slotTop <= pinOffset);

        const marker = window.innerHeight * 0.38;
        const currentSection = sections.find(({ id }) => {
          const element = document.getElementById(id);
          if (!element) return false;
          const bounds = element.getBoundingClientRect();
          return bounds.top <= marker && bounds.bottom > marker;
        });

        if (currentSection) setActiveSection(currentSection.id);
      });
    };

    updateNavigation();
    window.addEventListener('scroll', updateNavigation, { passive: true });
    window.addEventListener('resize', updateNavigation);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateNavigation);
      window.removeEventListener('resize', updateNavigation);
    };
  }, [sections]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsidePress = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const navigateToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    setActiveSection(sectionId);
    setIsOpen(false);
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView?.({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  const activeLabel =
    sections.find(({ id }) => id === activeSection)?.menuLabel ?? sections[0]?.menuLabel ?? 'Hero';

  return (
    <div ref={slotRef} className="relative z-[90] mt-12 h-[58px] w-full sm:mt-14">
      <div
        ref={menuRef}
        data-testid="template-section-navigation"
        data-pinned={isPinned ? 'true' : 'false'}
        className={`z-[90] w-max transition-[filter] duration-300 ${
          isPinned
            ? 'fixed right-3 top-16 min-[350px]:top-3 sm:left-1/2 sm:right-auto sm:top-6 sm:-translate-x-1/2'
            : 'relative mx-auto'
        }`}
      >
        <nav
          aria-label="Case study sections"
          data-pinned={isPinned ? 'true' : 'false'}
          className={`template-section-menu flex items-center gap-3 rounded-[100px] border px-5 py-3 backdrop-blur-[8px] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 sm:gap-4 sm:px-8 ${
            isPinned
              ? 'border-[rgba(167,178,235,0.48)] bg-[#11152B]/80 shadow-[0_14px_38px_rgba(4,6,20,0.34),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[16px]'
              : 'border-[rgba(147,160,226,0.22)] bg-black/10 shadow-[2px_2px_6.5px_rgba(0,0,0,0.12)]'
          }`}
        >
          <span
            aria-live="polite"
            data-testid="active-section-label"
            className="whitespace-nowrap font-body text-[14px] font-bold leading-8 text-white"
          >
            {activeLabel}
          </span>
          <button
            type="button"
            aria-label={isOpen ? 'Close section navigation' : 'Open section navigation'}
            aria-expanded={isOpen}
            aria-controls="template-section-popover"
            onClick={() => setIsOpen((current) => !current)}
            className="group relative h-[17px] w-5 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
          >
            <span
              className={`absolute left-0 top-0 h-[3px] w-5 rounded-full bg-[#94A2E7] transition-transform duration-300 ease-out ${
                isOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[3px] w-5 rounded-full bg-[#94A2E7] transition-[opacity,transform] duration-200 ${
                isOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[3px] w-5 rounded-full bg-[#94A2E7] transition-transform duration-300 ease-out ${
                isOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </nav>

        {isOpen && (
          <div
            id="template-section-popover"
            role="menu"
            className={`template-section-popover absolute left-1/2 top-[calc(100%+12px)] max-h-[min(70vh,520px)] w-[min(370px,calc(100vw-32px))] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-[22px] border border-white/14 bg-[#101329]/88 p-3 shadow-[0_24px_70px_rgba(4,6,20,0.48)] backdrop-blur-[20px] ${
              isPinned
                ? 'max-sm:left-auto max-sm:right-0 max-sm:translate-x-0'
                : 'max-sm:bottom-[calc(100%+12px)] max-sm:top-auto'
            }`}
          >
            <div className="grid grid-cols-2 gap-1.5">
              {sections.map((section) => {
                const isActive = section.id === activeSection;
                return (
                  <button
                    key={section.id}
                    type="button"
                    role="menuitem"
                    aria-current={isActive ? 'location' : undefined}
                    onClick={() => navigateToSection(section.id)}
                    className={`flex min-h-11 cursor-pointer items-center rounded-[12px] border px-3 py-2.5 text-left font-body text-[11px] leading-[1.25] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/70 ${
                      isActive
                        ? 'border-[#94A2E7]/38 bg-[#94A2E7]/16 text-white'
                        : 'border-transparent bg-white/[0.025] text-white/52 hover:bg-white/[0.065] hover:text-white/84'
                    }`}
                  >
                    <span
                      className={`mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        isActive ? 'bg-[#AAB5F0] shadow-[0_0_10px_rgba(170,181,240,0.8)]' : 'bg-white/18'
                      }`}
                    />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManagerSectionNavigation;
