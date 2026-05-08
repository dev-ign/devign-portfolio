import React from 'react';
import { motion } from 'motion/react';

interface AmbientOrbProps {
  color: string;
}

const AmbientOrb: React.FC<AmbientOrbProps> = ({ color }) => (
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
      width: 900,
      height: 900,
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      filter: 'blur(130px)',
      opacity: 0.36,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  />
);

export default AmbientOrb;
