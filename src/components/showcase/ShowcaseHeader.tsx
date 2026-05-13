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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: isMobile ? 16 : 28,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* Brand */}
      <Link
        to="/portfolio"
        style={{
          fontFamily: 'var(--font-disp)',
          fontSize: isMobile ? 18 : 24,
          fontWeight: 400,
          letterSpacing: '0.03em',
          color: '#333333',
          textDecoration: 'none',
          pointerEvents: 'auto',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      >
        devign
      </Link>

      {/* Active project subtitle */}
      <div style={{ height: isMobile ? 20 : 26, overflow: 'hidden', marginTop: isMobile ? 8 : 12, marginBottom: isMobile ? 10 : 14 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? 13 : 16,
              color: '#555555',
              margin: 0,
              fontWeight: 700,
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
            }}
          >
            {active.title}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Thumbnail tabs */}
      <div
        style={{
          display: 'flex',
          gap: isMobile ? 3 : 5,
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        {projects.map((project, i) => (
          <button
            key={project.id}
            onClick={() => onThumbnailClick(i)}
            title={project.title}
            style={{
              width: i === activeIndex ? (isMobile ? 42 : 68) : (isMobile ? 32 : 52),
              height: i === activeIndex ? (isMobile ? 32 : 52) : (isMobile ? 25 : 40),
              borderRadius: 6,
              border: i === activeIndex
                ? '1.5px solid rgba(0,0,0,0.22)'
                : '1px solid rgba(0,0,0,0.09)',
              overflow: 'hidden',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              opacity: i === activeIndex ? 1 : 0.42,
              flexShrink: 0,
              background: 'transparent',
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ShowcaseHeader;
