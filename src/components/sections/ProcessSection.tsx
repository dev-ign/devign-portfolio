import React from 'react';
import { Box } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import SectionHeader from '@/components/ui/SectionHeader';

/*
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
*/


const ProcessSection: React.FC = () => {
  const { audienceMode } = useAudience();

  if (audienceMode !== 'ux') return null;

  return (
    <Box sx={{ mt: 10, mb: 8 }}>
      <SectionHeader
        kicker="Track Record"
        title="Numbers & Results"
        subtitle="Shipped at scale. Measured by impact."
      />

      {/* Numbers grid */}
      {/* <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: '12px',
        }}
      >
        {metrics.map((m) => (
          <motion.div key={m.label} variants={cardVariants}>
            <Box
              sx={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '28px',
                height: '100%',
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
          </motion.div>
        ))}
      </Box> */}

      {/*
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
                <Box sx={{ fontSize: '24px', mb: '14px', lineHeight: 1 }}>
                  {step.icon}
                </Box>
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
      */}
    </Box>
  );
};

export default ProcessSection;
