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
    className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full opacity-36 pointer-events-none z-1 [filter:blur(130px)]"
    style={{ transform: 'translate(-50%, -50%)' }}
  />
);

export default AmbientOrb;
