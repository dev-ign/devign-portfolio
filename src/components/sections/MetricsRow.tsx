import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import useScrollReveal from '@/hooks/useScrollReveal';

const uxMetrics = [
  { value: '35%', label: 'Avg. conversion lift', note: 'across tested product changes' },
  { value: '200+', label: 'Screens delivered', note: 'from wireframe to hi-fi to code' },
  { value: '0', label: 'Handoff rounds', note: 'I design it and ship it myself' },
];

const devMetrics = [
  { value: '8+', label: 'Years in React / TS', note: 'hooks, context, perf, custom libs' },
  { value: '60%', label: 'Avg. bundle size cut', note: 'across optimization engagements' },
  { value: '1×', label: 'Design-to-ship ratio', note: 'no translation layer, ever' },
];

const MetricsRow: React.FC = () => {
  const { audienceMode } = useAudience();
  const metrics = audienceMode === 'dev' ? devMetrics : uxMetrics;
  const revealRef = useScrollReveal();

  return (
    <Box
      ref={revealRef}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: '12px',
        mt: 8,
        mb: 2,
      }}
    >
      {metrics.map((m) => (
        <Box
          key={m.label}
          sx={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '28px',
            transition: 'border-color 0.22s ease',
            '&:hover': {
              borderColor: 'var(--accent-active)',
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: '42px',
              lineHeight: 1,
              color: 'var(--accent-active)',
              mb: '8px',
              transition: 'color 0.4s ease',
            }}
          >
            {m.value}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '13px',
              color: 'text.primary',
              mb: '4px',
              lineHeight: 1.3,
            }}
          >
            {m.label}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--muted)',
              lineHeight: 1.5,
            }}
          >
            {m.note}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MetricsRow;
