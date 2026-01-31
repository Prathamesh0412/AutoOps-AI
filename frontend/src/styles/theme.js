import { createTheme } from '@mui/material/styles'

const baseFont = '"Space Grotesk", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1d4ed8', contrastText: '#ffffff' },
    secondary: { main: '#f97316' },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475467',
    },
    success: { main: '#12b76a' },
    warning: { main: '#f79009' },
    error: { main: '#d92d20' },
    info: { main: '#0ba5ec' },
  },
  typography: {
    fontFamily: baseFont,
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
    subtitle1: { color: '#475467' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          background: '#ffffff',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
})

export default theme
