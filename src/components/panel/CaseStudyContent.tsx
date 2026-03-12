import React from 'react';
import { Box, Typography } from '@mui/material';
import { CaseStudySection } from '@/data/projects';

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      mt: 4,
      mb: 1.5,
    }}
  >
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
      {label}
    </Typography>
    <Box sx={{ flex: 1, height: '1px', background: 'var(--border)' }} />
  </Box>
);

interface CaseStudyContentProps {
  sections: CaseStudySection[];
}

const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ sections }) => {
  return (
    <Box>
      {sections.map((section, i) => (
        <Box key={i}>
          <SectionLabel label={section.label} />

          {section.type === 'paragraph' && (
            <Typography
              sx={{
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                color: 'var(--dim)',
                lineHeight: 1.75,
                mb: 1,
              }}
            >
              {section.content as string}
            </Typography>
          )}

          {section.type === 'bullets' && (
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 1 }}>
              {(section.content as string[]).map((item, j) => (
                <Box
                  component="li"
                  key={j}
                  sx={{ display: 'flex', gap: '10px', mb: 1.5, alignItems: 'flex-start' }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: 'var(--accent-active)',
                      flexShrink: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      lineHeight: '1.75',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    →
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      color: 'var(--dim)',
                      lineHeight: 1.65,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {section.type === 'metrics' && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                mb: 1,
              }}
            >
              {(section.content as Array<{ value: string; description: string }>).map(
                (metric, j) => (
                  <Box
                    key={j}
                    sx={{
                      padding: '20px',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-disp)',
                        fontWeight: 800,
                        fontSize: '32px',
                        color: 'var(--accent-active)',
                        lineHeight: 1,
                        mb: 1,
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-body)',
                        color: 'var(--dim)',
                        lineHeight: 1.5,
                      }}
                    >
                      {metric.description}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          )}

          {section.type === 'imagestrip' && (
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                pb: 1,
                mb: 1,
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  background: 'var(--border)',
                  borderRadius: '2px',
                },
              }}
            >
              {(section.content as Array<{ label: string }>).map((item, j) => (
                <Box
                  key={j}
                  sx={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    width: '200px',
                    aspectRatio: '4/3',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--muted)',
                      textAlign: 'center',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CaseStudyContent;
