import React from 'react';
import { Box, ButtonBase, useMediaQuery } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';

const AudienceToggle: React.FC = () => {
  const { audienceMode, setAudienceMode } = useAudience();
  const isNarrow = useMediaQuery('(max-width: 400px)');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '100px',
        padding: '4px',
        gap: '2px',
      }}
    >
      {(['ux', 'dev'] as const).map((mode) => {
        const isActive = audienceMode === mode;
        const label =
          mode === 'ux'
            ? isNarrow ? 'UX' : 'UX / Product'
            : isNarrow ? 'Dev' : 'Frontend Dev';

        return (
          <ButtonBase
            key={mode}
            onClick={() => setAudienceMode(mode)}
            sx={{
              borderRadius: '100px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '7px 18px',
              transition: 'all 0.22s ease',
              backgroundColor: isActive ? 'var(--accent-active)' : 'transparent',
              color: isActive ? '#0f0f0f' : 'var(--muted)',
              fontWeight: isActive ? 500 : 400,
              whiteSpace: 'nowrap',
              '&:focus-visible': {
                outline: '2px solid var(--accent-active)',
                outlineOffset: '2px',
              },
            }}
          >
            {label}
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default AudienceToggle;
