import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import HeroStats from '@/components/hero/HeroStats';

const ghost = {
  WebkitTextStroke: '1px var(--ghost-stroke)',
  color: 'transparent',
} as const;

const HeroSection: React.FC = () => {
  const { audienceMode } = useAudience();
  const [visible, setVisible] = useState(true);
  const isUX = audienceMode === 'ux';

  // Fade content out/in on mode change
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [audienceMode]);

  const eyebrow = isUX
    ? 'UX/UI Engineer · Tampa, FL · Available for work'
    : 'Senior Frontend Engineer · React · TypeScript · Next.js';

  const subRest = isUX
    ? " — 8+ years turning Figma files into production React. I'm the designer who codes, and the engineer who designs. No handoff. No translation loss."
    : ' — 8+ years in React + TypeScript. I design at a professional level too, which means I ship cleaner, more intentional UI faster than any pure dev.';

  const ctaPrimary = isUX ? 'View Case Studies' : 'View Shipped Projects';

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 5, md: 8 },
        pb: { xs: 4, md: 6 },
        overflow: 'hidden',
      }}
    >
      {/* Accent glow orb — top-right */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-180px',
          right: '-140px',
          width: { xs: '420px', md: '720px' },
          height: { xs: '420px', md: '720px' },
          background: 'var(--accent-active)',
          opacity: 0.07,
          borderRadius: '50%',
          filter: 'blur(110px)',
          pointerEvents: 'none',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 6 }}>
          <Typography
            component="span"
            sx={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: { xs: '28px', md: '36px' },
              letterSpacing: '2px',
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            devign
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: { xs: '28px', md: '36px' },
              letterSpacing: '2px',
              color: 'var(--accent-active)',
              lineHeight: 1,
              transition: 'color 0.4s ease',
            }}
          >
            UX
          </Typography>
        </Box>

        {/* Eyebrow */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: 3 }}>
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

        {/* Headline */}
        <Box
          component="h1"
          sx={{
            margin: 0,
            mb: 4,
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(40px, 10vw, 112px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
          }}
        >
          {isUX ? (
            <>
              {/* UX: "design" accent, "& build" ghost */}
              <Box component="span" sx={{ display: 'block', color: 'text.primary' }}>
                I{' '}
                <Box
                  component="span"
                  sx={{ color: 'var(--accent-active)', transition: 'color 0.4s ease' }}
                >
                  design
                </Box>
              </Box>
              <Box component="span" sx={{ display: 'block', ...ghost }}>
                &amp; build
              </Box>
              <Box component="span" sx={{ display: 'block', color: 'text.primary' }}>
                interfaces.
              </Box>
            </>
          ) : (
            <>
              {/* Dev: "build" accent, "design" + "&" ghost */}
              <Box component="span" sx={{ display: 'block', color: 'text.primary' }}>
                I{' '}
                <Box component="span" sx={ghost}>
                  design
                </Box>
              </Box>
              <Box component="span" sx={{ display: 'block' }}>
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
              <Box component="span" sx={{ display: 'block', color: 'text.primary' }}>
                interfaces.
              </Box>
            </>
          )}
        </Box>

        {/* Subheadline */}
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 300,
            lineHeight: 1.75,
            color: 'var(--dim)',
            mb: 5,
            maxWidth: '640px',
          }}
        >
          <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
            Jona Ferreira
          </Box>
          {subRest}
        </Typography>

        {/* CTAs */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
            href="/Jonaferreiraresume.pdf"
            download="Jonaferreiraresume.pdf"
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

        {/* Stats */}
        <HeroStats />
      </Box>
    </Box>
  );
};

export default HeroSection;
