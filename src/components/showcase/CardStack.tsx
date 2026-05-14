import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Project } from '@/data/projects';
import ShowcaseCard from './ShowcaseCard';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface CardStackProps {
  projects: Project[];
  activeIndex: number;
  direction: number;
  onJumpTo: (index: number) => void;
}

const EASE_IN = [0.16, 1, 0.3, 1] as [number, number, number, number];
const EASE_SLOW = [0.4, 0, 0.6, 1] as [number, number, number, number];

const cardVariants = {
  enter: () => ({
    y: 0,
    scale: 1,
    opacity: 1,
    zIndex: 1,
  }),
  center: {
    y: 0,
    scale: 1,
    rotateX: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (dir: number) => ({
    y: dir > 0 ? '82%' : 0,
    scale: dir > 0 ? 0.96 : 1,
    opacity: 0,
    rotateX: 0,
    zIndex: dir > 0 ? 2 : 1,
    transition: dir > 0
      ? { duration: 0.88, ease: EASE_SLOW }
      : { duration: 0 },
  }),
};

const CardStack: React.FC<CardStackProps> = ({
  projects,
  activeIndex,
  direction,
}) => {
  const isFirstMount = useRef(true);
  const isMobile = useIsMobile();
  useEffect(() => { isFirstMount.current = false; }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1400px',
      }}
    >
      {/* Card stack area */}
      <div
        style={{
          position: 'relative',
          width: 'min(660px, 94vw)',
          zIndex: 10,
        }}
      >
        {/* Peek cards — rendered back-to-front, peek from above the active card */}
        {[6, 5, 4, 3, 2, 1].map((offset) => {
          const idx = activeIndex + offset;
          if (idx >= projects.length) return null;

          const yValues   = isMobile
            ? [-14, -12, -10, -8, -5, -3]
            : [-24, -20, -16, -12, -8, -4];
          const scaleVals = [0.940, 0.950, 0.960, 0.970, 0.980, 0.990];
          const rotzVals  = [2.5, -2.5, 2, -2, 1.5, -1.5];
          const opacityVals = [1, 0.7, 1, 1, 1, 1];
          const i = offset - 1;

          const isCard6 = offset === 6;
          const maskStyle = isCard6
            ? { maskImage: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }
            : {};

          return (
            <motion.div
              key={`peek-${projects[idx].id}`}
              initial={isFirstMount.current ? { opacity: 0 } : false}
              animate={{
                y: yValues[i],
                scale: scaleVals[i],
                opacity: opacityVals[i],
                rotateZ: rotzVals[i],
              }}
              transition={{ duration: 0.55, ease: EASE_IN, delay: isFirstMount.current ? (6 - offset) * 0.08 : 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transformOrigin: 'center center',
                pointerEvents: 'none',
                zIndex: 10 - offset,
                ...maskStyle,
              }}
            >
              <ShowcaseCard project={projects[idx]} interactive={false} />
            </motion.div>
          );
        })}

        {/* Active card */}
        <div style={{ position: 'relative', zIndex: 20, width: '100%', aspectRatio: '4/3' }}>
          <AnimatePresence custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={cardVariants}
              initial={isFirstMount.current ? { opacity: 0 } : 'enter'}
              animate="center"
              exit="exit"
              transition={isFirstMount.current
                ? { duration: 0.5, ease: EASE_IN, delay: 0.48 }
                : { duration: 0.65, ease: EASE_IN }
              }
              style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            >
              <ShowcaseCard project={projects[activeIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CardStack;
