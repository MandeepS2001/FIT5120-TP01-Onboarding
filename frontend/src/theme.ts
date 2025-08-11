import { createTheme } from '@mui/material/styles';

// Light theme colors
export const lightColors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },
  accent: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

// Dark theme colors
export const darkColors = {
  primary: {
    50: '#0A0A0A',
    100: '#1A1A2E',
    200: '#16213E',
    300: '#0F3460',
    400: '#00D4FF',
    500: '#00E6FF',
    600: '#00B3E6',
    700: '#0099CC',
    800: '#0077B3',
    900: '#005580',
  },
  secondary: {
    50: '#0A0A0A',
    100: '#1A1A2E',
    200: '#16213E',
    300: '#0F3460',
    400: '#00FF88',
    500: '#00E676',
    600: '#00C853',
    700: '#00B248',
    800: '#009624',
    900: '#007B1F',
  },
  accent: {
    50: '#0A0A0A',
    100: '#1A1A2E',
    200: '#16213E',
    300: '#0F3460',
    400: '#FFD700',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },
  neutral: {
    50: '#212121',
    100: '#424242',
    200: '#616161',
    300: '#757575',
    400: '#9E9E9E',
    500: '#BDBDBD',
    600: '#E0E0E0',
    700: '#EEEEEE',
    800: '#F5F5F5',
    900: '#FAFAFA',
  },
  success: '#00FF88',
  warning: '#FF6B35',
  error: '#FF5252',
  info: '#00D4FF',
};

export const colors = lightColors; // Default to light colors

// Create light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightColors.primary[500],
      light: lightColors.primary[300],
      dark: lightColors.primary[700],
    },
    secondary: {
      main: lightColors.secondary[500],
      light: lightColors.secondary[300],
      dark: lightColors.secondary[700],
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Create dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkColors.primary[400],
      light: darkColors.primary[500],
      dark: darkColors.primary[600],
    },
    secondary: {
      main: darkColors.secondary[400],
      light: darkColors.secondary[500],
      dark: darkColors.secondary[600],
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
      },
    },
  },
});

// Theme context types
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentColors: typeof lightColors | typeof darkColors;
  currentTheme: typeof lightTheme | typeof darkTheme;
}


