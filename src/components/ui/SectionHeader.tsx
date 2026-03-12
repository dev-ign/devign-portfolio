import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ kicker, title, subtitle }) => {
  return (
    <Box sx={{ mb: 6 }}>
      {/* Kicker with line */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 2 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--accent-active)',
            flexShrink: 0,
            transition: 'color 0.4s ease',
          }}
        >
          {kicker}
        </Typography>
        <Box sx={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </Box>

      {/* Title */}
      <Typography
        component="h2"
        sx={{
          fontFamily: 'var(--font-disp)',
          fontWeight: 800,
          fontSize: { xs: '32px', md: '42px' },
          letterSpacing: '-0.02em',
          color: 'text.primary',
          lineHeight: 1,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: { xs: '14px', md: '15px' },
          color: 'var(--dim)',
          lineHeight: 1.6,
          maxWidth: '520px',
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
