import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTheme } from '@/context/ThemeContext';
import AudienceToggle from '@/components/nav/AudienceToggle';

const Navigation: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.default' }}>
      <Toolbar sx={{ paddingTop: '20px', paddingBottom: '20px', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '1.5px',
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            devign
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '1.5px',
              color: 'var(--accent-active)',
              lineHeight: 1,
              transition: 'color 0.4s ease',
            }}
          >
            UX
          </Typography>
        </Box>
        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AudienceToggle />
          <IconButton
            onClick={toggleTheme}
            aria-label="toggle theme"
            sx={{
              color: 'text.primary',
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '& svg': {
                width: '24px',
                height: '24px',
              },
            }}
          >
            {mode === 'light' ? (
              <Icon icon="solar:moon-bold" />
            ) : (
              <Icon icon="solar:sun-bold" />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
