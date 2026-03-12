import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';

const ResumeStrip: React.FC = () => {
  const { audienceMode } = useAudience();

  const title =
    audienceMode === 'dev'
      ? 'Resume · Senior Frontend Engineer'
      : 'Resume · UX/UI Engineer';

  return (
    <Box
      sx={{
        width: '100%',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: { xs: '28px 20px', md: '28px clamp(20px, 5vw, 56px)' },
        mt: 10,
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: '20px', sm: 0 },
        justifyContent: 'space-between',
      }}
    >
      {/* Left — title + caption */}
      <Box>
        <Typography
          sx={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 700,
            fontSize: { xs: '18px', md: '22px' },
            color: 'text.primary',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            mb: '4px',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--muted)',
            letterSpacing: '0.06em',
          }}
        >
          PDF · Updated 2025
        </Typography>
      </Box>

      {/* Right — CTAs */}
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Box
          component="a"
          href="/Jonaferreiraresume.pdf"
          download="Jonaferreiraresume.pdf"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            borderRadius: '100px',
            background: 'var(--accent-active)',
            color: '#0f0f0f',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease, background 0.4s ease',
            '&:hover': { opacity: 0.85 },
          }}
        >
          Download PDF
        </Box>
        <Box
          component="a"
          href="https://linkedin.com/in/jona-ferreira-"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '10px 20px',
            borderRadius: '100px',
            border: '1px solid var(--border)',
            color: 'var(--dim)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'border-color 0.22s ease, color 0.22s ease',
            '&:hover': {
              borderColor: 'var(--accent-active)',
              color: 'text.primary',
            },
          }}
        >
          LinkedIn →
        </Box>
      </Box>
    </Box>
  );
};

export default ResumeStrip;
