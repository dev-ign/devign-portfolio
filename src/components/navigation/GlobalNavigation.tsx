import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@iconify/react';
import BrandLogo from '@/components/BrandLogo';

type HomeNavigationProps = {
  variant?: 'home';
  onScrollTo: (id: string) => void;
  onOpenInquiry: () => void;
};

type CaseStudiesNavigationProps = {
  variant: 'case-studies';
  onScrollTo?: never;
  onOpenInquiry: () => void;
};

export type GlobalNavigationProps = HomeNavigationProps | CaseStudiesNavigationProps;

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
}) => {
  const navigate = useNavigate();
  const [isGlass, setIsGlass] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = variant === 'home';

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
    navigate('/');
  };

  const handleNavClick = (target: string) => {
    setMenuOpen(false);
    onScrollTo?.(target);
  };

  const handleInquiryClick = () => {
    setMenuOpen(false);
    onOpenInquiry();
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-7 z-80 flex justify-center px-4">
        <div className="relative flex w-full max-w-300 items-center justify-center">
          <nav
            aria-label="Primary navigation"
            className={`pointer-events-auto flex max-w-[calc(100vw-32px)] items-center gap-2 rounded-[100px] py-2 pl-5 pr-2 transition-[background,border-color,box-shadow,backdrop-filter] duration-500 min-[840px]:pl-7 min-[1000px]:gap-4 ${
              isGlass
                ? 'nav-floating border'
                : 'border border-transparent bg-transparent shadow-none [backdrop-filter:blur(0px)] [-webkit-backdrop-filter:blur(0px)]'
            }`}
          >
            <button
              type="button"
              onClick={handleLogoClick}
              className="mr-1 inline-flex cursor-pointer items-center whitespace-nowrap border-none bg-transparent p-0 min-[840px]:mr-2"
              aria-label={isHome ? 'Scroll to top' : 'Go to home page'}
            >
              <BrandLogo markSize={26} textSize={14} gap={7} />
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

            <button
              type="button"
              onClick={handleInquiryClick}
              className={`${isHome ? 'hidden min-[840px]:block' : 'block'} cursor-pointer whitespace-nowrap rounded-full border-none bg-[#BE97ED]/23 px-5 py-3 font-body text-[14px] font-normal tracking-[-0.02em] text-white/76 transition-[background,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#BE97ED]/34 hover:text-white`}
            >
              Lets Work
            </button>
          </nav>

          {isHome && (
            <Link
              to="/case-studies"
              className={`case-studies-nav-link pointer-events-auto absolute right-0 hidden min-[840px]:inline-flex ${
                isGlass ? 'case-studies-nav-link--glass' : ''
              }`}
            >
              Case Studies
            </Link>
          )}
        </div>
      </header>

      {isHome && createPortal(
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
                  {NAV_ITEMS.map((item, index) => (
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
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: NAV_ITEMS.length * 0.04, ease }}
                  >
                    <Link
                      to="/case-studies"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-[12px] px-5 py-[14px] font-body text-[16px] font-normal tracking-[-0.01em] text-white/76 no-underline transition-[background,color] duration-150 hover:bg-white/8 hover:text-white/95 active:bg-white/10"
                    >
                      Case Studies
                    </Link>
                  </motion.div>

                  <div className="mx-4 my-1 h-px bg-white/8" />
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
