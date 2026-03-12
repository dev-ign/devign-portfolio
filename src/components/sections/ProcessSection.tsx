import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import SectionHeader from '@/components/ui/SectionHeader';
import useScrollReveal from '@/hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Discover',
    description:
      'User interviews, competitive audits, journey mapping. I validate the problem before picking up a pen.',
  },
  {
    number: '02',
    icon: '✏️',
    title: 'Define',
    description:
      'Wireframes, flows, IA — all in Figma. I align stakeholders at low-fi before investing in hi-fi.',
  },
  {
    number: '03',
    icon: '🧱',
    title: 'Systematize',
    description:
      'Design tokens, component libraries, interaction specs. Built for scale from day one.',
  },
  {
    number: '04',
    icon: '🚀',
    title: 'Ship',
    description:
      'I implement what I design in React + TypeScript. Zero handoff friction — I am the handoff.',
  },
];

const ProcessSection: React.FC = () => {
  const { audienceMode } = useAudience();
  const revealRef = useScrollReveal();

  if (audienceMode !== 'ux') return null;

  return (
    <Box ref={revealRef} sx={{ mt: 10, mb: 8 }}>
      <SectionHeader
        kicker="Design Process"
        title="How I Work"
        subtitle="Research-grounded. Systems-minded. Every design ends in working code."
      />

      {/* Cards grid with border-gap trick */}
      <Box
        sx={{
          border: '1px solid var(--border)',
          borderRadius: '22px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {steps.map((step) => (
            <Box
              key={step.number}
              sx={{
                background: 'var(--card)',
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Faint step number — background decoration */}
              <Typography
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '12px',
                  fontFamily: 'var(--font-disp)',
                  fontSize: '56px',
                  fontWeight: 800,
                  color: 'var(--step-number-color)',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {step.number}
              </Typography>

              {/* Emoji icon */}
              <Box sx={{ fontSize: '24px', mb: '14px', lineHeight: 1 }}>
                {step.icon}
              </Box>

              {/* Step title */}
              <Typography
                sx={{
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: 'text.primary',
                  mb: 1,
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--dim)',
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProcessSection;
