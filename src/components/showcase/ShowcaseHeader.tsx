import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '@/data/projects';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ShowcaseHeaderProps {
  projects: Project[];
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
}

const ShowcaseHeader: React.FC<ShowcaseHeaderProps> = ({
  projects,
  activeIndex,
  onThumbnailClick,
}) => {
  const active = projects[activeIndex];
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="absolute top-0 left-0 right-0 flex flex-col items-center z-50 pointer-events-none"
      style={{ paddingTop: isMobile ? 16 : 28 }}
    >
      {/* Brand */}
      <Link
        to="/portfolio"
        className="font-disp text-[#333333] no-underline pointer-events-auto transition-opacity duration-200 hover:opacity-70"
        style={{ fontSize: isMobile ? 18 : 24, fontWeight: 400, letterSpacing: '0.03em' }}
      >
        devign
      </Link>

      {/* Active project subtitle */}
      <div
        className="overflow-hidden"
        style={{
          height: isMobile ? 20 : 26,
          marginTop: isMobile ? 8 : 12,
          marginBottom: isMobile ? 10 : 14,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="font-body text-[#555555] m-0 font-bold tracking-[0.14em] whitespace-nowrap"
            style={{ fontSize: isMobile ? 13 : 16 }}
          >
            {active.title}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Thumbnail tabs */}
      <div
        className="flex items-center pointer-events-auto"
        style={{ gap: isMobile ? 3 : 5 }}
      >
        {projects.map((project, i) => (
          <button
            key={project.id}
            onClick={() => onThumbnailClick(i)}
            title={project.title}
            className="rounded-[6px] overflow-hidden cursor-pointer p-0 transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] shrink-0 bg-transparent"
            style={{
              width: i === activeIndex ? (isMobile ? 42 : 68) : (isMobile ? 32 : 52),
              height: i === activeIndex ? (isMobile ? 32 : 52) : (isMobile ? 25 : 40),
              border: i === activeIndex
                ? '1.5px solid rgba(0,0,0,0.22)'
                : '1px solid rgba(0,0,0,0.09)',
              opacity: i === activeIndex ? 1 : 0.42,
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              draggable={false}
              className="w-full h-full object-cover block"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ShowcaseHeader;
