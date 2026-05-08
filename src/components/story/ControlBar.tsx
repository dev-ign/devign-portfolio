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
  <div
    style={{
      position: 'fixed',
      bottom: 28,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 100,
      pointerEvents: 'none',
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        gap: 4,
        padding: '5px 6px',
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(28px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.36)',
        borderRadius: 100,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.52), 0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      {/* Work together — deactivated, Coming soon sticker */}
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            top: '-13px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-6deg)',
            backgroundColor: '#F2EDD7',
            color: '#1A1A1A',
            padding: '3px 9px',
            borderRadius: 5,
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 0 rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.10)',
            pointerEvents: 'none',
            zIndex: 10,
            userSelect: 'none',
          }}
        >
          Coming soon!
        </span>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: isMobile ? '9px 14px' : '10px 22px',
            backgroundColor: '#1A1A1A',
            color: '#E8E7E1',
            borderRadius: 100,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            opacity: 0.35,
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          Work together
        </div>
      </div>

      <a
        href="/Jonaferreiraresume.pdf"
        download
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: isMobile ? '9px 14px' : '10px 22px',
          backgroundColor: 'transparent',
          color: 'rgba(10, 10, 10, 0.72)',
          borderRadius: 100,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.01em',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(10,10,10,1)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(10,10,10,0.72)'; }}
      >
        <Icon icon="solar:file-text-bold" style={{ width: 14, height: 14, flexShrink: 0 }} />
        Resume
      </a>
    </motion.div>
  </div>
  );
};

export default ControlBar;
