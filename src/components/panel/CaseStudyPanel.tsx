import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import { Project } from '@/data/projects';
import CaseStudyContent from '@/components/panel/CaseStudyContent';

interface CaseStudyPanelProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudyPanel: React.FC<CaseStudyPanelProps> = ({ project, isOpen, onClose }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 639px)');

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Ken Burns on open / per project
  useEffect(() => {
    if (!isOpen) { setImageZoomed(false); return; }
    setImageZoomed(false);
    const t = setTimeout(() => setImageZoomed(true), 50);
    return () => clearTimeout(t);
  }, [isOpen, project?.id]);

  // Scroll to top + reset progress on open
  useEffect(() => {
    if (isOpen && scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [isOpen, project?.id]);

  // ESC to close (Section 19)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setScrollProgress(Math.min(isNaN(pct) ? 0 : pct, 100));
  };

  const panelPositionSx = isMobile
    ? {
        bottom: 0,
        left: 0,
        right: 0,
        height: '92svh',
        width: '100vw',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      }
    : {
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(680px, 100vw)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      };

  return (
    <>
      {/* Scrim — click to close */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'transparent',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 200,
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          ...panelPositionSx,
        }}
      >
        {/* Scroll progress bar (Section 18) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--border)',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              height: '100%',
              background: 'var(--accent-active)',
              width: `${scrollProgress}%`,
              transition: 'width 0.1s linear, background-color 0.4s ease',
            }}
          />
        </Box>

        {/* Hero image zone */}
        <Box
          sx={{
            height: { xs: '180px', md: '240px' },
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {project && (
            <Box
              component="img"
              src={project.caseStudy.heroBackground}
              alt={project.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 8s linear',
                transform: imageZoomed ? 'scale(1.06)' : 'scale(1)',
              }}
            />
          )}

          {/* Bottom gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(12,12,14,0.5) 50%, rgba(12,12,14,1) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Close button */}
          <IconButton
            onClick={onClose}
            aria-label="close case study"
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              background: 'rgba(12,12,14,0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              color: 'var(--dim)',
              fontSize: '16px',
              fontFamily: 'var(--font-body)',
              '&:hover': { background: 'rgba(12,12,14,0.9)', color: '#fff' },
            }}
          >
            ✕
          </IconButton>

          {/* Tag pills — bottom-left */}
          {project && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                pointerEvents: 'none',
              }}
            >
              {project.tags.map((tag) => (
                <Box
                  key={tag}
                  sx={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    background: 'rgba(12,12,14,0.6)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    color: 'var(--dim)',
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Scrollable body */}
        <Box
          ref={scrollBodyRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: { xs: '16px 16px 48px', md: '24px 28px 48px' },
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--border)',
              borderRadius: '2px',
            },
          }}
        >
          {project && (
            <>
              <Typography
                sx={{
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: { xs: '22px', md: '28px' },
                  color: 'text.primary',
                  mb: 0.5,
                  lineHeight: 1.1,
                }}
              >
                {project.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  mb: 3,
                }}
              >
                {project.category}
              </Typography>
              <CaseStudyContent sections={project.caseStudy.sections} />
            </>
          )}
        </Box>

        {/* Sticky footer */}
        {project && (
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderTop: '1px solid var(--border)',
              padding: { xs: '12px 16px', md: '16px 28px' },
              background: 'var(--surface)',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-active)',
                transition: 'color 0.4s ease',
              }}
            >
              {project.caseStudy.footerImpact}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {project.liveUrl && (
                <Button
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    textTransform: 'none',
                    px: '16px',
                    py: '7px',
                    borderRadius: '100px',
                    border: '1px solid var(--border)',
                    color: 'var(--dim)',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      borderColor: 'var(--accent-active)',
                      color: 'var(--accent-active)',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Live Site →
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    textTransform: 'none',
                    px: '16px',
                    py: '7px',
                    borderRadius: '100px',
                    backgroundColor: 'var(--accent-active)',
                    color: '#0f0f0f',
                    fontWeight: 500,
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      backgroundColor: 'var(--accent-active)',
                      opacity: 0.85,
                    },
                  }}
                >
                  View on GitHub
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* ESC hint (Section 19) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 300,
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--muted)',
          pointerEvents: 'none',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: { xs: 'none', md: 'block' },
        }}
      >
        Press ESC to close
      </Box>
    </>
  );
};

export default CaseStudyPanel;
