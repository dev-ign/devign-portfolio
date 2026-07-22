import React, { useEffect, useRef, useState } from 'react';

export interface CaseStudySectionLink {
  id: string;
  label: string;
  menuLabel: string;
}

type NavigationTone = 'template-manager' | 'donor-directory';

interface CaseStudySectionNavigationProps {
  sections: CaseStudySectionLink[];
  tone?: NavigationTone;
}

const toneClasses: Record<
  NavigationTone,
  {
    pinnedMenu: string;
    idleMenu: string;
    menuLine: string;
    popover: string;
    activeItem: string;
    activeDot: string;
  }
> = {
  'template-manager': {
    pinnedMenu:
      'border-[rgba(167,178,235,0.48)] bg-[#11152B]/80 shadow-[0_14px_38px_rgba(4,6,20,0.34),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[16px]',
    idleMenu:
      'border-[rgba(147,160,226,0.22)] bg-black/10 shadow-[2px_2px_6.5px_rgba(0,0,0,0.12)]',
    menuLine: 'bg-[#94A2E7]',
    popover: 'bg-[#101329]/88',
    activeItem: 'border-[#94A2E7]/38 bg-[#94A2E7]/16 text-white',
    activeDot: 'bg-[#AAB5F0] shadow-[0_0_10px_rgba(170,181,240,0.8)]',
  },
  'donor-directory': {
    pinnedMenu:
      'border-[#C996EE]/48 bg-[#24132F]/82 shadow-[0_14px_38px_rgba(18,7,28,0.38),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[16px]',
    idleMenu:
      'border-[#C996EE]/24 bg-black/10 shadow-[2px_2px_6.5px_rgba(0,0,0,0.14)]',
    menuLine: 'bg-[#C996EE]',
    popover: 'bg-[#21112D]/90',
    activeItem: 'border-[#C996EE]/40 bg-[#C996EE]/16 text-white',
    activeDot: 'bg-[#D9B2F5] shadow-[0_0_10px_rgba(217,178,245,0.8)]',
  },
};

const getStickyOffset = () => {
  const value = window.getComputedStyle(document.body).getPropertyValue('--case-study-sticky-offset');
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : window.innerWidth < 640 ? 112 : 104;
};

const CaseStudySectionNavigation: React.FC<CaseStudySectionNavigationProps> = ({
  sections,
  tone = 'template-manager',
}) => {
  const [activeSection, setActiveSection] = useState(() => {
    const hashSection = window.location.hash.replace(/^#/, '');
    return sections.some(({ id }) => id === hashSection)
      ? hashSection
      : sections[0]?.id ?? 'hero';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const colors = toneClasses[tone];

  useEffect(() => {
    let frameId = 0;

    const updateNavigation = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const pinOffset = Number.parseFloat(
          window.getComputedStyle(document.body).getPropertyValue('--case-study-control-top')
        ) || (window.innerWidth < 640 ? 12 : 20);
        const slotTop = slotRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        setIsPinned(slotTop <= pinOffset);

        const marker = getStickyOffset() + Math.min(96, window.innerHeight * 0.12);
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
    const offset = getStickyOffset();
    const top = window.scrollY + section.getBoundingClientRect().top - offset;
    window.scrollTo({
      top: Math.max(0, top),
      left: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  const activeLabel =
    sections.find(({ id }) => id === activeSection)?.menuLabel ?? sections[0]?.menuLabel ?? 'Hero';

  return (
    <div ref={slotRef} className="relative z-[90] mt-12 h-[58px] w-full sm:mt-14">
      <div
        ref={menuRef}
        data-testid="case-study-section-navigation"
        data-pinned={isPinned ? 'true' : 'false'}
        className={`z-[90] w-max transition-[filter] duration-300 ${
          isPinned ? 'case-study-section-navigation--pinned' : 'relative mx-auto'
        }`}
      >
        <nav
          aria-label="Case study sections"
          data-pinned={isPinned ? 'true' : 'false'}
          className={`case-study-section-menu flex items-center gap-1.5 rounded-[100px] border px-3 py-2 backdrop-blur-[8px] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 sm:gap-4 sm:px-8 sm:py-3 ${
            isPinned ? colors.pinnedMenu : colors.idleMenu
          }`}
        >
          <span
            aria-live="polite"
            data-testid="active-section-label"
            className="whitespace-nowrap font-body text-[13px] font-bold leading-8 text-white sm:text-[14px]"
          >
            {activeLabel}
          </span>
          <button
            type="button"
            aria-label={isOpen ? 'Close section navigation' : 'Open section navigation'}
            aria-expanded={isOpen}
            aria-controls="case-study-section-popover"
            onClick={() => setIsOpen((current) => !current)}
            className="group grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          >
            <span aria-hidden="true" className="relative block h-[17px] w-5">
              <span
                className={`absolute left-0 top-0 h-[3px] w-5 rounded-full transition-transform duration-300 ease-out ${colors.menuLine} ${
                  isOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[3px] w-5 rounded-full transition-[opacity,transform] duration-200 ${colors.menuLine} ${
                  isOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[3px] w-5 rounded-full transition-transform duration-300 ease-out ${colors.menuLine} ${
                  isOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </nav>

        {isOpen && (
          <div
            id="case-study-section-popover"
            role="menu"
            className={`case-study-section-popover absolute left-1/2 top-[calc(100%+12px)] max-h-[min(70vh,520px)] w-[min(370px,calc(100vw-32px))] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-[22px] border border-white/14 p-3 shadow-[0_24px_70px_rgba(4,6,20,0.48)] backdrop-blur-[20px] ${colors.popover} ${
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
                        ? colors.activeItem
                        : 'border-transparent bg-white/[0.025] text-white/52 hover:bg-white/[0.065] hover:text-white/84'
                    }`}
                  >
                    <span
                      className={`mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        isActive ? colors.activeDot : 'bg-white/18'
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

export default CaseStudySectionNavigation;
