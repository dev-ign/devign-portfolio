import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import BrandLogo from '@/components/BrandLogo';

type GatewayNavProps = {
  onScrollTo: (id: string) => void;
  onOpenInquiry: () => void;
};

const NAV_ITEMS = [
  { label: 'Services', target: 'services' },
  { label: 'Process', target: 'process' },
  { label: 'Projects', target: 'projects' },
  { label: 'FAQ', target: 'faq' },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const GatewayNav: React.FC<GatewayNavProps> = ({ onScrollTo, onOpenInquiry }) => {
  const [isGlass, setIsGlass] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateNavState = () => setIsGlass(window.scrollY > 200);
    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
    return () => window.removeEventListener('scroll', updateNavState);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (target: string) => {
    setMenuOpen(false);
    onScrollTo(target);
  };

  const handleInquiryClick = () => {
    setMenuOpen(false);
    onOpenInquiry();
  };

  return (
    <>
      <header className="fixed inset-x-0 top-7 z-80 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Primary"
          className={`pointer-events-auto flex max-w-[calc(100vw-32px)] items-center gap-2 rounded-[100px] py-2 pl-5 pr-2 transition-[background,border-color,box-shadow,backdrop-filter] duration-500 sm:gap-4 sm:pl-7 ${
            isGlass
              ? 'nav-floating border'
              : 'border border-transparent bg-transparent shadow-none [backdrop-filter:blur(0px)] [-webkit-backdrop-filter:blur(0px)]'
          }`}
        >
          <button
            type="button"
            onClick={() => handleNavClick('top')}
            className="mr-1 inline-flex cursor-pointer items-center whitespace-nowrap border-none bg-transparent p-0 sm:mr-2"
            aria-label="Scroll to top"
          >
            <BrandLogo markSize={26} textSize={14} gap={7} />
          </button>

          {/* Desktop nav items */}
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.target}
                type="button"
                onClick={() => handleNavClick(item.target)}
                className="cursor-pointer rounded-full border-none bg-transparent px-4 py-3 font-body text-[14px] font-normal tracking-[-0.02em] text-white/70 transition-[background,color] duration-200 hover:bg-white/6 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(o => !o)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/80 transition-colors duration-200 hover:bg-white/12 sm:hidden"
          >
            <Icon
              icon={menuOpen ? 'solar:close-bold' : 'solar:hamburger-menu-bold'}
              className="h-4 w-4"
            />
          </button>

          <button
            type="button"
            onClick={handleInquiryClick}
            className="hidden cursor-pointer whitespace-nowrap rounded-full border-none bg-[#BE97ED]/23 px-5 py-3 font-body text-[14px] font-normal tracking-[-0.02em] text-white/76 transition-[background,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#BE97ED]/34 hover:text-white sm:block"
          >
            Lets Work
          </button>
        </nav>
      </header>

      {createPortal(
        <>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[75] bg-black/55 sm:hidden"
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
                className="fixed inset-x-4 top-[84px] z-[79] rounded-[18px] border border-white/10 bg-black/88 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.55)] [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)] sm:hidden"
              >
                <nav className="flex flex-col">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.button
                      key={item.target}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: i * 0.04, ease }}
                      onClick={() => handleNavClick(item.target)}
                      className="w-full cursor-pointer rounded-[12px] border-none bg-transparent px-5 py-[14px] text-left font-body text-[16px] font-normal tracking-[-0.01em] text-white/76 transition-[background,color] duration-150 hover:bg-white/8 hover:text-white/95 active:bg-white/10"
                    >
                      {item.label}
                    </motion.button>
                  ))}
                  <div className="mx-4 my-1 h-px bg-white/8" />
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: NAV_ITEMS.length * 0.04, ease }}
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

export default GatewayNav;
