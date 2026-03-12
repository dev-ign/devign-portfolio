import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import SectionHeader from '@/components/ui/SectionHeader';
import useScrollReveal from '@/hooks/useScrollReveal';

const stackItems = [
  {
    category: 'Core',
    name: 'React + TypeScript',
    barWidth: 95,
    note: '8+ yrs · hooks, context, custom libs, perf optimization',
  },
  {
    category: 'Framework',
    name: 'Next.js',
    barWidth: 85,
    note: 'App router · SSR/SSG · API routes · Edge',
  },
  {
    category: 'State',
    name: 'Redux Toolkit',
    barWidth: 88,
    note: 'RTK Query · slices · normalized state',
  },
  {
    category: 'Design ↔ Code',
    name: 'Figma + Tokens',
    barWidth: 94,
    note: 'Automated token pipeline · zero handoff',
  },
  {
    category: 'Backend',
    name: 'Python / Django',
    barWidth: 70,
    note: 'REST APIs · DRF · Django ORM',
  },
  {
    category: 'DX / Testing',
    name: 'Storybook + Vitest',
    barWidth: 78,
    note: 'Component-driven dev · unit + integration',
  },
];

const StackSection: React.FC = () => {
  const { audienceMode } = useAudience();
  const revealRef = useScrollReveal();

  if (audienceMode !== 'dev') return null;

  return (
    <Box ref={revealRef} sx={{ mt: 10, mb: 8 }}>
      <SectionHeader
        kicker="Technical Stack"
        title="What I Build With"
        subtitle="8 years of production React. I also design, which means I ship better UI faster."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: '12px',
        }}
      >
        {stackItems.map((item) => (
          <Box
            key={item.name}
            sx={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
              transition: 'border-color 0.22s ease',
              '&:hover': {
                borderColor: 'rgba(77, 240, 198, 0.3)',
              },
            }}
          >
            {/* Category label */}
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: '8px',
              }}
            >
              {item.category}
            </Typography>

            {/* Tech name */}
            <Typography
              sx={{
                fontFamily: 'var(--font-disp)',
                fontWeight: 700,
                fontSize: '17px',
                color: 'text.primary',
                mb: '10px',
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </Typography>

            {/* Proficiency bar */}
            <Box
              sx={{
                height: '2px',
                background: 'var(--border)',
                borderRadius: '2px',
                mb: '8px',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${item.barWidth}%`,
                  background: 'var(--accent-teal)',
                  borderRadius: '2px',
                }}
              />
            </Box>

            {/* Note */}
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                lineHeight: 1.5,
              }}
            >
              {item.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StackSection;
