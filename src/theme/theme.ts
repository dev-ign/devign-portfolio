import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FAFAFA',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#333333',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#252525',
      paper: '#252525',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.8)',
    },
  },
});

export type ThemeMode = 'light' | 'dark';
