import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { projects } from '@/data/projects';
import ShowcaseHeader from '@/components/showcase/ShowcaseHeader';
import AmbientOrb from '@/components/showcase/AmbientOrb';
import CardStack from '@/components/showcase/CardStack';
import ControlBar from '@/components/story/ControlBar';
import { useIsMobile } from '@/hooks/useMediaQuery';

const EASE_IN   = [0.16, 1, 0.3, 1] as const;
const EASE_SLOW = [0.4, 0, 0.6, 1] as const;

const ProjectsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [introPhase, setIntroPhase] = useState<'hint' | 'cards'>('hint');
  const introPhaseRef = useRef<'hint' | 'cards'>('hint');
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.setAttribute('data-page', 'projects');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.removeAttribute('data-page');
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => { introPhaseRef.current = introPhase; }, [introPhase]);

  const unlock = () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      isAnimating.current = false;
    }, 820);
  };

  const goNext = useCallback(() => {
    if (introPhaseRef.current === 'hint') {
      setIntroPhase('cards');
      isAnimating.current = true;
      unlock();
      return;
    }
    if (isAnimating.current) return;
    setActiveIndex((prev) => {
      if (prev >= projects.length - 1) return prev;
      isAnimating.current = true;
      setDirection(1);
      unlock();
      return prev + 1;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPrev = useCallback(() => {
    if (introPhaseRef.current === 'hint') {
      setIntroPhase('cards');
      isAnimating.current = true;
      unlock();
      return;
    }
    if (isAnimating.current) return;
    setActiveIndex((prev) => {
      if (prev <= 0) return prev;
      isAnimating.current = true;
      setDirection(-1);
      unlock();
      return prev - 1;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpTo = useCallback((index: number) => {
    if (introPhaseRef.current === 'hint') setIntroPhase('cards');
    if (isAnimating.current) return;
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      isAnimating.current = true;
      setDirection(index > prev ? 1 : -1);
      unlock();
      return index;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desktop: wheel events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev]);

  // Mobile: touch swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) goNext();
      else goPrev();
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#E8E7E1',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AmbientOrb color={projects[activeIndex].accentColor} />

      <ShowcaseHeader
        projects={projects}
        activeIndex={activeIndex}
        onThumbnailClick={jumpTo}
      />

      {/* Card area — switches between hint text and card stack */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: isMobile ? 120 : 150,
          paddingBottom: 40,
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          {introPhase === 'hint' ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_IN } }}
              exit={{ x: '110vw', opacity: 1, transition: { duration: 0.52, ease: EASE_SLOW } }}
              style={{ textAlign: 'center', padding: '0 24px', userSelect: 'none' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-disp)',
                  fontSize: 'clamp(28px, 4vw, 52px)',
                  fontWeight: 300,
                  color: 'rgba(26,26,26,0.22)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Scroll to navigate projects
              </p>
            </motion.div>
          ) : (
            <motion.div key="cards" style={{ width: '100%', height: '100%' }}>
              <CardStack
                projects={projects}
                activeIndex={activeIndex}
                direction={direction}
                onJumpTo={jumpTo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ControlBar show={true} />
    </div>
  );
};

export default ProjectsPage;
