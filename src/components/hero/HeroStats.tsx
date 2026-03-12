import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';

const HeroStats: React.FC = () => {
  const { audienceMode } = useAudience();
  const isUX = audienceMode === 'ux';

  const stats = [
    { value: '8+', label: 'Years shipped' },
    { value: '4', label: 'Products featured' },
    {
      value: isUX ? 'Figma → React' : 'Design-to-Ship',
      label: 'Full pipeline',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        borderTop: '1px solid var(--border)',
        paddingTop: '40px',
        marginTop: '56px',
      }}
    >
      {stats.map((stat) => (
        <Box key={stat.label}>
          <Typography
            sx={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 40px)',
              letterSpacing: '-0.04em',
              color: 'var(--accent-active)',
              lineHeight: 1,
              transition: 'color 0.4s ease',
            }}
          >
            {stat.value}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default HeroStats;
