import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAudience } from '@/context/AudienceContext';
import useScrollReveal from '@/hooks/useScrollReveal';

const testimonial = {
  quote:
    "I worked directly with Jona for 2.5 years at Gravyty on the Raise product, and I feel truly fortunate to have collaborated with him.\n\nJona is a one-of-a-kind designer and teammate. He brings a passion for solving user experience and design challenges, always striving to create the best possible experiences for users. Our biggest ongoing collaboration is on MyRaise, a \"home and control center\" for Raise users. Working on this initiative, Jona eagerly joined client calls to gather feedback firsthand, thoughtfully incorporated that feedback into his designs, and then brought those designs to life, working seamlessly with full-stack developers to ensure a fully integrated front- and back-end experience.\n\nJona strikes the rare balance between creativity and pragmatism, never letting technical constraints limit his imagination, but always designing with implementation in mind. He delivers his vision at an impressive pace and continually pushes the boundaries of what great design can achieve.",
  author: 'Pete L.',
  role: 'Product Manager · Gravyty - Raise',
};

const TestimonialBlock: React.FC = () => {
  const { audienceMode } = useAudience();
  const revealRef = useScrollReveal();

  if (audienceMode !== 'ux') return null;

  return (
    <Box ref={revealRef} sx={{ mt: 8, mb: 2 }}>
      <Box
        sx={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent-active)',
          borderRadius: '14px',
          padding: { xs: '28px 24px', md: '36px 40px' },
          position: 'relative',
          transition: 'border-left-color 0.4s ease',
        }}
      >
        {/* Opening quote mark */}
        <Typography
          aria-hidden="true"
          sx={{
            fontFamily: 'var(--font-disp)',
            fontSize: '80px',
            lineHeight: 1,
            color: 'var(--accent-active)',
            opacity: 0.18,
            position: 'absolute',
            top: '12px',
            left: { xs: '20px', md: '32px' },
            userSelect: 'none',
            pointerEvents: 'none',
            transition: 'color 0.4s ease',
          }}
        >
          "
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: { xs: '14px', md: 'clamp(14px, 2vw, 17px)' },
            color: 'text.primary',
            lineHeight: 1.75,
            mb: '24px',
            pl: { xs: '12px', md: '16px' },
            whiteSpace: 'pre-line',
          }}
        >
          "{testimonial.quote}"
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', pl: { xs: '12px', md: '16px' } }}>
          <Box
            sx={{
              width: '24px',
              height: '1px',
              background: 'var(--accent-active)',
              flexShrink: 0,
              transition: 'background 0.4s ease',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
              lineHeight: 1.4,
            }}
          >
            {testimonial.author} · {testimonial.role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TestimonialBlock;
