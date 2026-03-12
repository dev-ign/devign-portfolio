import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import useScrollReveal from '@/hooks/useScrollReveal';

const ContextBanner: React.FC = () => {
  const { audienceMode } = useAudience();
  const isUX = audienceMode === 'ux';
  const revealRef = useScrollReveal();

  return (
    <Box
      ref={revealRef}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '18px 24px',
        border: '1px dashed var(--banner-border)',
        borderRadius: '14px',
        background: 'var(--banner-bg)',
        mx: 'clamp(0px, 2vw, 32px)',
        mb: 5,
        transition: 'border-color 0.4s ease, background-color 0.4s ease',
      }}
    >
      <Box component="span" sx={{ fontSize: '16px', flexShrink: 0, mt: '1px' }}>
        {isUX ? '🎨' : '⚙️'}
      </Box>
      <Typography
        sx={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--banner-text)',
          lineHeight: 1.65,
          transition: 'color 0.4s ease',
        }}
      >
        {isUX ? (
          <>
            <Box component="strong" sx={{ fontWeight: 600 }}>
              Viewing: UX &amp; Product Design mode.
            </Box>{' '}
            Showing research process, design systems, and user impact. Toggle above to see the
            engineering view.
          </>
        ) : (
          <>
            <Box component="strong" sx={{ fontWeight: 600 }}>
              Viewing: Frontend Engineering mode.
            </Box>{' '}
            Showing tech stack, code architecture, and engineering metrics. Toggle above to see
            the design view.
          </>
        )}
      </Typography>
    </Box>
  );
};

export default ContextBanner;
