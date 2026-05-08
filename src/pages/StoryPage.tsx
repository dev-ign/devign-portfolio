import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ControlBar from '@/components/story/ControlBar';
import ProjectOrb from '@/components/story/ProjectOrb';
import { useIsMobile } from '@/hooks/useMediaQuery';

const HEADING = "Hey, I'm Jona.";

const PARAGRAPHS = [
  'I design and build digital experiences that live between product, engineering, and storytelling.',
  "With a background in UX engineering and software development, I turn complex ideas into products that feel intuitive, immersive, and memorable.",
  "From research to polished production, I focus on creating experiences that people don’t just use, they connect with.",
];

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.04 } },
};

const headingContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.55,
      staggerChildren: 0.075,
    },
  },
};

const paraVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const bodyContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.28 } },
};

const StoryPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [headingDone, setHeadingDone] = useState(false);
  const [bodyDone, setBodyDone] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-page', 'story');
    return () => document.body.removeAttribute('data-page');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#E8E7E1',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background orbit — project images circling behind text */}
      <ProjectOrb show={bodyDone} />

      {/* projects link — top right */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', top: 28, right: 36, zIndex: 1 }}
      >
        <Link
          to="/projects"
          style={{
            fontFamily: 'var(--font-disp)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#1A1A1A',
            textDecoration: 'none',
            opacity: 0.55,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.55'; }}
        >
          projects
        </Link>
      </motion.div>

      {/* Main content column */}
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          paddingTop: isMobile ? '12vh' : '18vh',
          paddingLeft: 28,
          paddingRight: 28,
          paddingBottom: isMobile ? 80 : 140,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Typewriter heading */}
        <motion.h1
          variants={headingContainerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setHeadingDone(true)}
          style={{
            fontFamily: 'var(--font-disp)',
            fontSize: 'clamp(44px, 6vw, 72px)',
            textAlign: 'center',
            fontWeight: 700,
            lineHeight: 1.08,
            color: '#1A1A1A',
            marginBottom: 40,
            letterSpacing: '-0.025em',
          }}
        >
          {Array.from(HEADING).map((char, i) => (
            <motion.span key={i} variants={charVariants}>
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Body paragraphs — staggered after heading */}
        <motion.div
          variants={bodyContainerVariants}
          initial="hidden"
          animate={headingDone ? 'visible' : 'hidden'}
          style={{ display: 'flex', flexDirection: 'column', alignItems: "center", gap: isMobile ? 14 : 22 }}
        >
          {PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              variants={paraVariants}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 1.55vw, 17px)',
                lineHeight: 1.78,
                color: '#3A3A38',
                margin: 0,
                fontWeight: 300,
                textAlign: "center",
              }}
            >
              {para}
            </motion.p>
          ))}

          {/* projects → link */}
          <motion.div
            variants={paraVariants}
            style={{ marginTop: 12 }}
            onAnimationComplete={() => setBodyDone(true)}
          >
            <Link
              to="/projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-disp)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.01em',
                color: '#F8FBFF',
                textDecoration: 'none',
                padding: '13px 26px',
                borderRadius: 100,
                border: '1px solid rgba(255, 255, 255, 0.42)',
                background:
                  'linear-gradient(135deg, rgba(25, 92, 255, 0.78) 0%, rgba(72, 157, 255, 0.58) 52%, rgba(255, 255, 255, 0.28) 100%)',
                backdropFilter: 'blur(18px) saturate(1.25)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.25)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -16px 28px rgba(10,52,180,0.18), 0 12px 28px rgba(31,106,255,0.22)',
                transform: 'translateY(0) scale(1)',
                transition:
                  'background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease, gap 0.35s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                const arrow = el.querySelector('svg') as SVGElement | null;
                el.style.gap = '13px';
                el.style.transform = 'translateY(-2px) scale(1.025)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.68)';
                el.style.background =
                  'linear-gradient(135deg, rgba(10, 76, 255, 0.84) 0%, rgba(8, 96, 168, 0.7) 48%, rgba(255, 255, 255, 0.36) 100%)';
                el.style.boxShadow =
                  'inset 0 1px 0 rgba(255,255,255,0.58), inset 0 -18px 32px rgba(10,52,180,0.22), 0 18px 38px rgba(31,106,255,0.34)';
                if (arrow) arrow.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                const arrow = el.querySelector('svg') as SVGElement | null;
                el.style.gap = '8px';
                el.style.transform = 'translateY(0) scale(1)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.42)';
                el.style.background =
                  'linear-gradient(135deg, rgba(25, 92, 255, 0.78) 0%, rgba(72, 157, 255, 0.58) 52%, rgba(255, 255, 255, 0.28) 100%)';
                el.style.boxShadow =
                  'inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -16px 28px rgba(10,52,180,0.18), 0 12px 28px rgba(31,106,255,0.22)';
                if (arrow) arrow.style.transform = 'translateX(0)';
              }}
            >
              Continue to projects
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                style={{ transition: 'transform 0.35s ease' }}
              >
                <path
                  d="M1.5 6.5h10M7.5 2.5l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Fixed bottom bar */}
      <ControlBar show={bodyDone} />
    </div>
  );
};

export default StoryPage;
