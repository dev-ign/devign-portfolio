import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTheme } from '@/context/ThemeContext';
import AudienceToggle from '@/components/nav/AudienceToggle';
import BrandLogo from '@/components/BrandLogo';

const Navigation: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.default' }}>
      <Toolbar sx={{ paddingTop: '20px', paddingBottom: '20px', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BrandLogo markSize={28} textSize={16} />
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
