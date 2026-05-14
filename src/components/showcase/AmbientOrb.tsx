import React from 'react';
import { motion } from 'motion/react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AmbientOrbProps {
  color: string;
}

const AmbientOrb: React.FC<AmbientOrbProps> = ({ color }) => {
  const isMobile = useIsMobile();
  const orbSize = isMobile ? 500 : 900;
  const blur = isMobile ? 80 : 130;

  return (
    <motion.div
      animate={{
        backgroundColor: color,
        scale: [1, 1.06, 1],
      }}
      transition={{
        backgroundColor: { duration: 1.4, ease: 'easeInOut' },
        scale: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: orbSize,
        height: orbSize,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        filter: `blur(${blur}px)`,
        opacity: 0.36,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default AmbientOrb;
