import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ControlBarProps {
  show: boolean;
}

const ControlBar: React.FC<ControlBarProps> = ({ show }) => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-7 left-0 right-0 flex justify-center z-100 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-1 p-[5px_6px] bg-white/18 [backdrop-filter:blur(28px)_saturate(1.4)] [-webkit-backdrop-filter:blur(28px)_saturate(1.4)] border border-white/36 rounded-full [box-shadow:inset_0_1px_0_rgba(255,255,255,0.52),0_12px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]"
        style={{ pointerEvents: show ? 'auto' : 'none' }}
      >
        <div className="relative">
          <span
            className="absolute left-1/2 font-mono font-semibold tracking-[0.08em] uppercase whitespace-nowrap pointer-events-none z-10 select-none bg-[#F2EDD7] text-[#1A1A1A] rounded-[5px] text-[9px] [box-shadow:0_2px_0_rgba(0,0,0,0.22),0_4px_10px_rgba(0,0,0,0.10)]"
            style={{
              top: '-13px',
              transform: 'translateX(-50%) rotate(-6deg)',
              padding: '3px 9px',
            }}
          >
            Coming soon!
          </span>
          <div
            className="inline-flex items-center font-body text-[13px] font-medium tracking-[0.01em] whitespace-nowrap opacity-35 cursor-default select-none bg-[#1A1A1A] text-editorial rounded-full"
            style={{ padding: isMobile ? '9px 14px' : '10px 22px' }}
          >
            Work together
          </div>
        </div>

        <a
          href="/Jona_Ferreira_Resume-devign.pdf"
          download
          className="inline-flex items-center gap-1.5 bg-transparent text-[rgba(10,10,10,0.72)] rounded-full font-body text-[13px] font-medium tracking-[0.01em] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[rgba(10,10,10,1)]"
          style={{ padding: isMobile ? '9px 14px' : '10px 22px' }}
        >
          <Icon icon="solar:file-text-bold" style={{ width: 14, height: 14, flexShrink: 0 }} />
          Resume
        </a>
      </motion.div>
    </div>
  );
};

export default ControlBar;
