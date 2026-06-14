import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@iconify/react';
import InquiryStepperForm from './InquiryStepperForm';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const InquiryModal: React.FC<InquiryModalProps> = ({ open, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const activeElement = document.activeElement;
    previouslyFocusedElementRef.current = activeElement instanceof HTMLElement ? activeElement : null;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const panel = panelRef.current;
      if (!panel) {
        event.preventDefault();
        return;
      }

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, a, input, select, textarea, [tabindex]',
        ),
      ).filter(
        element =>
          !element.matches(':disabled') &&
          element.getAttribute('tabindex') !== '-1',
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElementRef.current?.isConnected) {
        previouslyFocusedElementRef.current.focus();
      }
      previouslyFocusedElementRef.current = null;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:px-[clamp(12px,3vw,28px)] sm:py-[clamp(16px,4vh,40px)]"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 cursor-default border-0 bg-black/62 backdrop-blur-[18px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            className="relative z-[1] grid h-dvh max-h-dvh w-full max-w-none grid-rows-[auto_1fr] overflow-hidden rounded-none border-0 bg-[#0C0C0E]/96 text-white shadow-[0_28px_120px_rgba(0,0,0,0.58)] backdrop-blur-2xl sm:h-auto sm:max-h-[min(88dvh,820px)] sm:max-w-[720px] sm:rounded-[8px] sm:border sm:border-white/12 sm:bg-[#0C0C0E]/92"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.42, ease }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/8 px-[clamp(18px,4vw,34px)] py-4">
              <div>
                <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
                  Start a Project
                </p>
                <h2
                  id="inquiry-modal-title"
                  className="m-0 mt-1 font-disp text-[clamp(20px,3vw,28px)] font-extrabold tracking-[-0.025em] text-white/90"
                >
                  Project inquiry
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/54 transition-[border-color,color,background] duration-200 hover:border-white/24 hover:bg-white/8 hover:text-white"
                aria-label="Close inquiry form"
              >
                <Icon icon="solar:close-circle-bold" className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-[clamp(18px,4vw,34px)] py-[clamp(22px,4vw,34px)]">
              <InquiryStepperForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
