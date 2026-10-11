import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@iconify/react';
import BrandLogo from '@/components/BrandLogo';
import portfolioBrandMark from '@/assets/portfolio/brand-mark.svg';
import downloadIcon from '@/assets/portfolio/download-icon.svg';
import NavigationMenuToggle from '@/components/navigation/NavigationMenuToggle';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { CONTACT_EMAIL_URL, RESUME_FILE_NAME, RESUME_URL } from '@/config/site';

type HomeNavigationProps = {
  variant?: 'home';
  onScrollTo: (id: string) => void;
  onOpenInquiry: () => void;
  activePortfolioSection?: never;
  activePortfolioChapter?: never;
  portfolioProjects?: never;
};

type PortfolioNavigationProps = {
  variant: 'portfolio';
  onScrollTo?: never;
  onOpenInquiry?: never;
  activePortfolioChapter: string;
  portfolioProjects: ReadonlyArray<{ sectionId: string; title: string }>;
};

export type GlobalNavigationProps = HomeNavigationProps | PortfolioNavigationProps;

const NAV_ITEMS = [
  { label: 'Services', target: 'services' },
  { label: 'Process', target: 'process' },
  { label: 'Projects', target: 'projects' },
  { label: 'FAQ', target: 'faq' },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  variant = 'home',
  onScrollTo,
  onOpenInquiry,
  activePortfolioChapter,
  portfolioProjects,
}) => {
  const [isGlass, setIsGlass] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactOpen, setCompactOpen] = useState<'projects' | 'navigation' | null>(null);
  const compactNavRef = useRef<HTMLElement>(null);
  const titleButtonRef = useRef<HTMLButtonElement>(null);
  const compactMenuButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isHome = variant === 'home';
  const isPortfolio = variant === 'portfolio';
  const compact = isPortfolio && activePortfolioChapter !== 'meet-the-founder';
  const activePortfolioSection = compact ? 'selected-work' : 'founder';
  const activeProject = portfolioProjects?.find(project => project.sectionId === activePortfolioChapter);

  useEffect(() => {
    if (!compact) setCompactOpen(null);
    if (compact) setMenuOpen(false);
  }, [compact]);

  useEffect(() => {
    if (!compactOpen) return;
    const onOutside = (event: PointerEvent) => {
      if (!compactNavRef.current?.contains(event.target as Node)) setCompactOpen(null);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const trigger = compactOpen === 'projects' ? titleButtonRef.current : compactMenuButtonRef.current;
      setCompactOpen(null);
      trigger?.focus();
    };
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [compactOpen]);

  useEffect(() => {
    const updateNavState = () => setIsGlass(window.scrollY > 200);
    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
    return () => window.removeEventListener('scroll', updateNavState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogoClick = () => {
    setMenuOpen(false);
    if (isHome) {
      onScrollTo?.('top');
      return;
    }
    if (isPortfolio) {
      document.querySelector('.portfolio-page')?.scrollTo({ top: 0, behavior: 'auto' });
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
  };

  const handleNavClick = (target: string) => {
    setMenuOpen(false);
    onScrollTo?.(target);
  };

  const handleInquiryClick = () => {
    setMenuOpen(false);
    setCompactOpen(null);
    onOpenInquiry?.();
  };

  return (
    <>
      <header className={`pointer-events-none fixed inset-x-0 z-80 flex justify-center px-4 ${isPortfolio ? 'portfolio-navigation-header' : 'top-7'}`}>
        <div className="relative flex w-full max-w-300 items-center justify-center">
          <motion.nav
            layout={isPortfolio && !reducedMotion ? 'size' : false}
            transition={{ layout: { duration: 0.36, ease } }}
            ref={compactNavRef}
            aria-label="Primary navigation"
            data-portfolio-mode={isPortfolio ? (compact ? 'compact' : 'full') : undefined}
            className={`pointer-events-auto relative flex max-w-[calc(100vw-32px)] items-center gap-2 rounded-[100px] py-2 pl-5 pr-2 transition-[background,border-color,box-shadow,backdrop-filter] duration-500 min-[840px]:pl-7 min-[1000px]:gap-4 ${compact ? 'portfolio-compact-nav' : ''} ${
              (isGlass || isPortfolio)
                ? 'nav-floating border'
                : 'border border-transparent bg-transparent shadow-none [backdrop-filter:blur(0px)] [-webkit-backdrop-filter:blur(0px)]'
            }`}
          >
            <button
              type="button"
              onClick={handleLogoClick}
              className={`mr-1 inline-flex cursor-pointer items-center whitespace-nowrap border-none bg-transparent p-0 min-[840px]:mr-2 ${compact ? 'portfolio-compact-logo' : ''}`}
              aria-label={isHome || isPortfolio ? 'Scroll to top' : 'Go to home page'}
            >
              <BrandLogo
                markSize={isPortfolio ? 25.309 : 26}
                textSize={14}
                gap={7}
                markSrc={isPortfolio ? portfolioBrandMark : undefined}
                text={isPortfolio ? 'devignUX' : undefined}
              />
            </button>

            {isHome && (
              <>
                <div className="hidden items-center gap-1 min-[840px]:flex">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.target}
                      type="button"
                      onClick={() => handleNavClick(item.target)}
                      className="cursor-pointer rounded-full border-none bg-transparent px-3 py-3 font-body text-[14px] font-normal tracking-[-0.02em] text-white/70 transition-[background,color] duration-200 hover:bg-white/6 hover:text-white min-[1000px]:px-4"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen(open => !open)}
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/80 transition-colors duration-200 hover:bg-white/12 min-[840px]:hidden"
                >
                  <Icon
                    icon={menuOpen ? 'solar:close-bold' : 'solar:hamburger-menu-bold'}
                    className="h-4 w-4"
                  />
                </button>
              </>
            )}

            {isPortfolio && !compact && (
              <>
                <div className="hidden items-center gap-1 min-[840px]:flex">
                  <a href="#meet-the-founder" aria-current={activePortfolioSection === 'founder' ? 'location' : undefined} className={`portfolio-nav-item${activePortfolioSection === 'founder' ? ' portfolio-nav-item--active' : ''}`}>Meet the Founder</a>
                  <a href="#selected-work" aria-current={activePortfolioSection === 'selected-work' ? 'location' : undefined} className={`portfolio-nav-item${activePortfolioSection === 'selected-work' ? ' portfolio-nav-item--active' : ''}`}>Selected Work</a>
                  <a href={RESUME_URL} download={RESUME_FILE_NAME} className="portfolio-nav-item portfolio-nav-item--resume">
                    Resume <img src={downloadIcon} alt="" width="20" height="20" />
                  </a>
                </div>
                <button
                  type="button"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen(open => !open)}
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/80 transition-colors duration-200 hover:bg-white/12 min-[840px]:hidden"
                >
                  <Icon icon={menuOpen ? 'solar:close-bold' : 'solar:hamburger-menu-bold'} className="h-4 w-4" />
                </button>
              </>
            )}

            {compact && (
              <>
                <button
                  ref={titleButtonRef}
                  type="button"
                  aria-label={`${activeProject?.title ?? 'Selected Work'}. Choose project`}
                  aria-expanded={compactOpen === 'projects'}
                  aria-controls="portfolio-project-selector"
                  onClick={() => setCompactOpen(current => current === 'projects' ? null : 'projects')}
                  className="portfolio-compact-title"
                >
                  <span className="portfolio-compact-title__viewport">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={activeProject?.sectionId ?? activePortfolioChapter}
                        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reducedMotion ? 0 : 0.3, ease }}
                        className="portfolio-compact-title__text"
                      >
                        {activeProject?.title ?? 'Selected Work'}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <Icon icon="lucide:chevron-down" className="portfolio-compact-title__chevron" aria-hidden="true" />
                </button>
                <NavigationMenuToggle
                  buttonRef={compactMenuButtonRef}
                  open={compactOpen === 'navigation'}
                  controls="portfolio-compact-menu"
                  openLabel="Open Portfolio navigation"
                  closeLabel="Close Portfolio navigation"
                  onClick={() => setCompactOpen(current => current === 'navigation' ? null : 'navigation')}
                  lineClassName="bg-[#C996EE]/65"
                  className="portfolio-compact-toggle"
                />
                <AnimatePresence initial={false}>
                  {compactOpen && (
                    <motion.div
                      key={compactOpen}
                      id={compactOpen === 'projects' ? 'portfolio-project-selector' : 'portfolio-compact-menu'}
                      initial={reducedMotion ? false : { opacity: 0, y: -8, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={reducedMotion ? undefined : { opacity: 0, y: -8, x: '-50%' }}
                      transition={{ duration: reducedMotion ? 0 : 0.22, ease }}
                      className="portfolio-compact-popover"
                    >
                      {compactOpen === 'projects' ? (
                        <div aria-label="Selected Work projects" className="portfolio-compact-popover__items">
                          {portfolioProjects?.map((project, index) => (
                            <motion.a
                              key={project.sectionId}
                              href={`#${project.sectionId}`}
                              aria-current={project.sectionId === activePortfolioChapter ? 'location' : undefined}
                              onClick={() => setCompactOpen(null)}
                              initial={reducedMotion ? false : { opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: reducedMotion ? 0 : 0.18, delay: reducedMotion ? 0 : index * 0.035 }}
                              className="portfolio-compact-popover__link"
                            >
                              <span className="portfolio-compact-popover__dot" aria-hidden="true" />{project.title}
                            </motion.a>
                          ))}
                        </div>
                      ) : (
                        <div aria-label="Portfolio destinations" className="portfolio-compact-popover__items">
                          <a href="#meet-the-founder" onClick={() => setCompactOpen(null)} className="portfolio-compact-popover__link">Meet the Founder</a>
                          <a href="#selected-work" aria-current="location" onClick={() => setCompactOpen(null)} className="portfolio-compact-popover__link">Selected Work</a>
                          <a href={RESUME_URL} download={RESUME_FILE_NAME} onClick={() => setCompactOpen(null)} className="portfolio-compact-popover__link">Resume <img src={downloadIcon} alt="" width="18" height="18" /></a>
                          <a href={CONTACT_EMAIL_URL} onClick={() => setCompactOpen(null)} className="portfolio-compact-popover__link portfolio-compact-popover__contact">Get in Touch</a>
                          <Link to="/studio" onClick={() => setCompactOpen(null)} className="portfolio-compact-popover__link portfolio-compact-popover__studio">Studio <Icon icon="lucide:arrow-up-right" aria-hidden="true" /></Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {isHome ? (
              <button
                type="button"
                onClick={handleInquiryClick}
                className="hidden cursor-pointer whitespace-nowrap rounded-full border-none bg-[#BE97ED]/23 px-5 py-3 font-body text-[14px] font-normal tracking-[-0.02em] text-white/76 transition-[background,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#BE97ED]/34 hover:text-white min-[840px]:block"
              >
                Lets Work
              </button>
            ) : !compact && (
              <a
                href={CONTACT_EMAIL_URL}
                className="portfolio-nav-contact hidden cursor-pointer whitespace-nowrap rounded-full border-none bg-[#BE97ED]/23 px-5 py-3 font-body text-[14px] font-normal tracking-[-0.02em] text-white/76 no-underline transition-[background,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#BE97ED]/34 hover:text-white min-[840px]:block"
              >
                Get in Touch
              </a>
            )}
          </motion.nav>

          {(isHome || isPortfolio) && (
            <Link
              to={isPortfolio ? '/studio' : '/portfolio'}
              className={`case-studies-nav-link portfolio-route-switch pointer-events-auto absolute right-0 hidden min-[840px]:inline-flex ${
                isGlass ? 'case-studies-nav-link--glass' : ''
              }`}
            >
              {isPortfolio ? 'Studio' : 'Portfolio'}
              <Icon icon="lucide:arrow-up-right" className="portfolio-route-switch__arrow" aria-hidden="true" />
            </Link>
          )}
        </div>
      </header>

      {(isHome || (isPortfolio && !compact)) && createPortal(
        <>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[75] bg-black/55 min-[840px]:hidden"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="panel"
                id="mobile-menu"
                role="dialog"
                aria-label="Navigation menu"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22, ease }}
                className="fixed inset-x-4 top-[84px] z-[79] rounded-[18px] border border-white/10 bg-black/88 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.55)] [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)] min-[840px]:hidden"
              >
                <nav className="flex flex-col" aria-label="Mobile">
                  {isHome ? NAV_ITEMS.map((item, index) => (
                    <motion.button
                      key={item.target}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: index * 0.04, ease }}
                      onClick={() => handleNavClick(item.target)}
                      className="w-full cursor-pointer rounded-[12px] border-none bg-transparent px-5 py-[14px] text-left font-body text-[16px] font-normal tracking-[-0.01em] text-white/76 transition-[background,color] duration-150 hover:bg-white/8 hover:text-white/95 active:bg-white/10"
                    >
                      {item.label}
                    </motion.button>
                  )) : (
                    <>
                      <a href="#meet-the-founder" aria-current={activePortfolioSection === 'founder' ? 'location' : undefined} onClick={() => setMenuOpen(false)} className={`portfolio-mobile-link${activePortfolioSection === 'founder' ? ' portfolio-mobile-link--active' : ''}`}>Meet the Founder</a>
                      <a href="#selected-work" aria-current={activePortfolioSection === 'selected-work' ? 'location' : undefined} onClick={() => setMenuOpen(false)} className={`portfolio-mobile-link${activePortfolioSection === 'selected-work' ? ' portfolio-mobile-link--active' : ''}`}>Selected Work</a>
                      <a href={RESUME_URL} download={RESUME_FILE_NAME} onClick={() => setMenuOpen(false)} className="portfolio-mobile-link">Resume <img src={downloadIcon} alt="" width="20" height="20" /></a>
                    </>
                  )}

                  {isHome ? <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: NAV_ITEMS.length * 0.04, ease }}
                  >
                    <Link
                      to="/portfolio"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-[12px] px-5 py-[14px] font-body text-[16px] font-normal tracking-[-0.01em] text-white/76 no-underline transition-[background,color] duration-150 hover:bg-white/8 hover:text-white/95 active:bg-white/10"
                    >
                      Portfolio <Icon icon="lucide:arrow-up-right" className="portfolio-route-switch__arrow" aria-hidden="true" />
                    </Link>
                  </motion.div> : <Link to="/studio" onClick={() => setMenuOpen(false)} className="portfolio-mobile-link">Studio <Icon icon="lucide:arrow-up-right" className="portfolio-route-switch__arrow" aria-hidden="true" /></Link>}

                  <div className="mx-4 my-1 h-px bg-white/8" />
                  {isHome ? (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: (NAV_ITEMS.length + 1) * 0.04, ease }}
                      onClick={handleInquiryClick}
                      className="mx-1 mb-1 cursor-pointer rounded-[12px] border-none bg-[#BE97ED]/14 px-5 py-[14px] text-left font-body text-[16px] font-normal tracking-[-0.01em] text-[#D4AEFF]/90 transition-[background,color] duration-150 hover:bg-[#BE97ED]/24 hover:text-white active:bg-[#BE97ED]/30"
                    >
                      Lets Work →
                    </motion.button>
                  ) : (
                    <motion.a
                      href={CONTACT_EMAIL_URL}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: (NAV_ITEMS.length + 1) * 0.04, ease }}
                      onClick={() => setMenuOpen(false)}
                      className="mx-1 mb-1 cursor-pointer rounded-[12px] border-none bg-[#BE97ED]/14 px-5 py-[14px] text-left font-body text-[16px] font-normal tracking-[-0.01em] text-[#D4AEFF]/90 no-underline transition-[background,color] duration-150 hover:bg-[#BE97ED]/24 hover:text-white active:bg-[#BE97ED]/30"
                    >
                      Get in Touch →
                    </motion.a>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
};

export default GlobalNavigation;
