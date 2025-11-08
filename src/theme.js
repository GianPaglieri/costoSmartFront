import { createTheme } from '@mui/material/styles';

const fontFamily = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
      light: '#1e293b',
      dark: '#020617',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#7c3aed',
      contrastText: '#f8fafc',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(15,23,42,0.12)',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    subtitle1: { color: '#475569' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f1f5f9',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(148,163,184,0.25)',
          boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 20,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform .2s ease, box-shadow .2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 18px 35px rgba(15,23,42,0.12)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#e2e8f0',
        },
      },
    },
  },
});

export default theme;
