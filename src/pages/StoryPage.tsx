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
  "From research to polished production, I focus on creating experiences that people don't just use, they connect with.",
];

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.04 } },
};

const headingContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.55, staggerChildren: 0.075 },
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
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-editorial relative overflow-x-hidden">
      <ProjectOrb show={bodyDone} />

      {/* Top-right nav link */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-7 right-9 z-1"
      >
        <Link
          to="/projects"
          className="font-disp text-[14px] font-bold tracking-[0.04em] text-[#1A1A1A] no-underline opacity-55 transition-opacity duration-200 hover:opacity-90"
        >
          projects
        </Link>
      </motion.div>

      {/* Main content column */}
      <div
        className="max-w-[560px] mx-auto px-7 relative z-1"
        style={{
          paddingTop: isMobile ? '12vh' : '18vh',
          paddingBottom: isMobile ? '80px' : '140px',
        }}
      >
        {/* Typewriter heading */}
        <motion.h1
          variants={headingContainerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setHeadingDone(true)}
          className="text-[clamp(44px,6vw,72px)] text-center font-bold leading-[1.08] text-[#1A1A1A] mb-10 tracking-[-0.025em]"
        >
          {Array.from(HEADING).map((char, i) => (
            <motion.span key={i} variants={charVariants}>
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Body paragraphs */}
        <motion.div
          variants={bodyContainerVariants}
          initial="hidden"
          animate={headingDone ? 'visible' : 'hidden'}
          className="flex flex-col items-center"
          style={{ gap: isMobile ? 14 : 22 }}
        >
          {PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              variants={paraVariants}
              className="text-[clamp(15px,1.55vw,17px)] leading-[1.78] text-[#3A3A38] m-0 font-light text-center"
            >
              {para}
            </motion.p>
          ))}

          {/* Continue to projects — glass button with complex hover */}
          <motion.div
            variants={paraVariants}
            className="mt-3"
            onAnimationComplete={() => setBodyDone(true)}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-disp text-[14px] font-bold tracking-[0.01em] text-[#F8FBFF] no-underline py-[13px] px-[26px] rounded-full border border-white/42 [background:linear-gradient(135deg,rgba(25,92,255,0.78)_0%,rgba(72,157,255,0.58)_52%,rgba(255,255,255,0.28)_100%)] [backdrop-filter:blur(18px)_saturate(1.25)] [-webkit-backdrop-filter:blur(18px)_saturate(1.25)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-16px_28px_rgba(10,52,180,0.18),0_12px_28px_rgba(31,106,255,0.22)] transition-[background,box-shadow,transform,border-color,gap] duration-[350ms] ease-out"
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                const arrow = el.querySelector('svg') as SVGElement | null;
                el.style.gap = '13px';
                el.style.transform = 'translateY(-2px) scale(1.025)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.68)';
                el.style.background = 'linear-gradient(135deg, rgba(10, 76, 255, 0.84) 0%, rgba(8, 96, 168, 0.7) 48%, rgba(255, 255, 255, 0.36) 100%)';
                el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.58), inset 0 -18px 32px rgba(10,52,180,0.22), 0 18px 38px rgba(31,106,255,0.34)';
                if (arrow) arrow.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                const arrow = el.querySelector('svg') as SVGElement | null;
                el.style.gap = '8px';
                el.style.transform = '';
                el.style.borderColor = 'rgba(255, 255, 255, 0.42)';
                el.style.background = 'linear-gradient(135deg, rgba(25, 92, 255, 0.78) 0%, rgba(72, 157, 255, 0.58) 52%, rgba(255, 255, 255, 0.28) 100%)';
                el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -16px 28px rgba(10,52,180,0.18), 0 12px 28px rgba(31,106,255,0.22)';
                if (arrow) arrow.style.transform = '';
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

      <ControlBar show={bodyDone} />
    </main>
  );
};

export default StoryPage;
