import React from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTheme } from '../context/ThemeContext';

const Navigation: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.default' }}>
      <Toolbar sx={{ paddingTop: '20px', paddingBottom: '20px', justifyContent: 'flex-end' }}>
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
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
