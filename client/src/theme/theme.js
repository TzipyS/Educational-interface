import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'ltr',
  palette: {
    primary: { main: '#6C63FF' },
    secondary: { main: '#FF6584' },
    background: { default: '#F8F9FE', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Rubik", "Segoe UI", sans-serif',
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 24px rgba(108,99,255,0.08)' } } },
  },
});

export default theme;
