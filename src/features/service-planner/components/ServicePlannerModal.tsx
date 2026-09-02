import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import type { PlannerResult, ServiceBranchId } from '../types/servicePlanner.types';
import { getServiceBranch } from '../config/serviceBranches';
import ServicePlannerStepper from './ServicePlannerStepper';

interface ServicePlannerModalProps {
  open: boolean;
  branchId: ServiceBranchId | null;
  onClose: () => void;
  onComplete: (result: PlannerResult) => void;
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ServicePlannerModal: React.FC<ServicePlannerModalProps> = ({ open, branchId, onClose, onComplete }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const branch = branchId ? getServiceBranch(branchId) : undefined;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
      previousFocusRef.current = null;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && branchId && branch && (
        <motion.div
          className="fixed inset-0 z-[125] flex items-center justify-center p-0 sm:p-[clamp(12px,3vw,28px)]"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-black/72 backdrop-blur-[18px]" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-planner-title"
            aria-describedby="service-planner-description"
            className="relative z-[1] flex h-dvh max-h-dvh w-full max-w-none flex-col overflow-hidden bg-[#0C0C0E]/98 text-white shadow-[0_30px_120px_rgba(0,0,0,.62)] sm:h-[min(92dvh,900px)] sm:max-w-[1120px] sm:rounded-[16px] sm:border sm:border-white/12 sm:bg-[#0C0C0E]/95"
            initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.38, ease }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/8 px-[clamp(18px,4vw,34px)] py-3.5">
              <div className="min-w-0">
                <p className="m-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/32">Guided project planner</p>
                <h2 id="service-planner-title" className="m-0 mt-1 truncate font-disp text-[clamp(18px,3vw,24px)] font-extrabold tracking-[-0.025em] text-white/90">{branch.shortTitle}</h2>
                <p id="service-planner-description" className="sr-only">Answer a short series of questions to receive a preliminary project direction.</p>
              </div>
              <button ref={closeButtonRef} type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/54 outline-none transition-colors hover:border-white/24 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70" aria-label="Close project planner">
                <Icon icon="solar:close-circle-bold" className="h-5 w-5" />
              </button>
            </div>
            <ServicePlannerStepper branchId={branchId} onComplete={onComplete} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ServicePlannerModal;
