import React, { useRef, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useAudience } from '@/context/AudienceContext';
// import HeroStats from '@/components/hero/HeroStats';

const ghost = {
  WebkitTextStroke: '1px var(--ghost-stroke)',
  color: 'transparent',
} as const;

const ORB_SIZE = 720;

const technologies = [
  'React',
  'TypeScript',
  'Next.js',
  'Figma',
  'Material UI',
  'Emotion',
  'TinyMCE',
  'Web Audio API',
  'Django REST',
  'REST API',
  'Wix',
  'Design Systems',
  'Component Libraries',
  'UX Research',
  'AI Tools',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
  },
};

const HeroSection: React.FC = () => {
  const { audienceMode } = useAudience();
  const isUX = audienceMode === 'ux';

  const heroRef = useRef<HTMLDivElement>(null);

  // Motion values for orb position — start at top-right equivalent
  const orbX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth - 300 : 600);
  const orbY = useMotionValue(-180);
  const smoothX = useSpring(orbX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(orbY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      orbX.set(e.clientX - rect.left - ORB_SIZE / 2);
      orbY.set(e.clientY - rect.top - ORB_SIZE / 2);
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [orbX, orbY]);

  const eyebrow = isUX
    ? 'UX/UI Engineer · Tampa, FL · Available for work'
    : 'Senior Frontend Engineer · React · TypeScript · Next.js';

  const ctaPrimary = isUX ? 'View Case Studies' : 'View Shipped Projects';

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      ref={heroRef}
      sx={{
        position: 'relative',
        pt: { xs: 5, md: 8 },
        pb: { xs: 4, md: 6 },
        overflow: 'hidden',
      }}
    >
      {/* Accent glow orb — follows mouse */}
      <motion.div
        aria-hidden="true"
        style={{
          x: smoothX,
          y: smoothY,
          position: 'absolute',
          width: `${ORB_SIZE}px`,
          height: `${ORB_SIZE}px`,
          background: 'var(--accent-active)',
          opacity: 0.07,
          borderRadius: '50%',
          filter: 'blur(110px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content — stagger-animated rows */}
      <motion.div
        key={audienceMode}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
      >
        {/* Name */}
        <motion.div variants={rowVariants}>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: { xs: '28px', md: '36px' },
              letterSpacing: '1px',
              color: 'text.primary',
              mb: 6,
            }}
          >
            Jona.
          </Box>
        </motion.div>

        {/* Eyebrow */}
        <motion.div variants={rowVariants}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', mb: 3 }}>
            <Box
              sx={{
                width: '28px',
                height: '1px',
                backgroundColor: 'var(--accent-active)',
                flexShrink: 0,
                transition: 'background-color 0.4s ease',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-active)',
                transition: 'color 0.4s ease',
              }}
            >
              {eyebrow}
            </Typography>
          </Box>
        </motion.div>

        {/* Headline — each line is its own row */}
        {isUX ? (
          <>
            <motion.div variants={rowVariants}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: 'clamp(30px, 5.5vw, 72px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  mb: 0,
                }}
              >
                I{' '}
                <Box
                  component="span"
                  sx={{ color: 'var(--accent-active)', transition: 'color 0.4s ease' }}
                >
                  design
                </Box>
              </Box>
            </motion.div>
            <motion.div variants={rowVariants}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: 'clamp(30px, 5.5vw, 72px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  ...ghost,
                }}
              >
                &amp; build
              </Box>
            </motion.div>
            <motion.div variants={rowVariants}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: 'clamp(30px, 5.5vw, 72px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  mb: 4,
                }}
              >
                interfaces.
              </Box>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div variants={rowVariants}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: 'clamp(30px, 5.5vw, 72px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                I{' '}
                <Box component="span" sx={ghost}>
                  design
                </Box>
              </Box>
            </motion.div>
            <motion.div variants={rowVariants}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: 'clamp(30px, 5.5vw, 72px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                }}
              >
                <Box component="span" sx={ghost}>
                  &amp;
                </Box>{' '}
                <Box
                  component="span"
                  sx={{ color: 'var(--accent-active)', transition: 'color 0.4s ease' }}
                >
                  build
                </Box>
              </Box>
            </motion.div>
            <motion.div variants={rowVariants}>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 800,
                  fontSize: 'clamp(30px, 5.5vw, 72px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  mb: 4,
                }}
              >
                interfaces.
              </Box>
            </motion.div>
          </>
        )}

        {/* Tech pill marquee */}
        <motion.div variants={rowVariants}>
          <Box
            className="marquee-mask"
            sx={{ overflow: 'hidden', maxWidth: '480px', mx: 'auto', mb: 5 }}
          >
            <Box className="marquee-track" sx={{ display: 'flex', gap: '8px', width: 'max-content' }}>
              {[...technologies, ...technologies].map((tech, i) => (
                <Box
                  key={`${tech}-${i}`}
                  component="span"
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    px: '10px',
                    py: '4px',
                    color: 'var(--dim)',
                    background: 'transparent',
                    display: 'inline-block',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tech}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={rowVariants}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: '60px', justifyContent: 'center' }}>
            <Button
              onClick={scrollToWork}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                px: '24px',
                py: '12px',
                borderRadius: '100px',
                backgroundColor: 'var(--accent-active)',
                color: '#0f0f0f',
                fontWeight: 500,
                boxShadow: 'none',
                transition: 'all 0.22s ease',
                '&:hover': {
                  backgroundColor: 'var(--accent-active)',
                  opacity: 0.85,
                  boxShadow: 'none',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {ctaPrimary}
            </Button>
            <Button
              component="a"
              href="/Jona_Ferreira_Resume-devign.pdf"
              download="Jona_Ferreira_Resume-devign.pdf"
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                px: '24px',
                py: '12px',
                borderRadius: '100px',
                border: '1px solid var(--border)',
                color: 'var(--dim)',
                fontWeight: 400,
                transition: 'all 0.22s ease',
                '&:hover': {
                  border: '1px solid var(--accent-active)',
                  color: 'var(--accent-active)',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Download Resume
            </Button>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div variants={rowVariants}>
          {/* <HeroStats /> */}
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default HeroSection;
