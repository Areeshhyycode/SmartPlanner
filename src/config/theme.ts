/**
 * Smart Trip Planner - Dark Mode Premium Theme
 *
 * Dark theme with blue accents for a professional, modern look
 */

export const theme = {
  colors: {
    // Dark Background Colors
    dark: {
      bg: '#0a0a0f',           // Main dark background
      card: '#12121a',          // Card background
      elevated: '#1a1a24',      // Elevated surfaces
      border: '#2a2a3a',        // Border color
    },

    // Blue Accent Palette
    blue: {
      50: '#e6f4ff',
      100: '#b3dfff',
      200: '#80c9ff',
      300: '#4db4ff',
      400: '#1a9eff',
      500: '#0080e6',           // Primary blue
      600: '#0066b3',
      700: '#004d80',
      800: '#00334d',
      900: '#001a26',
    },

    // Cyan Accent (for highlights)
    cyan: {
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
    },

    // Semantic Colors
    primary: '#0080e6',         // Main primary blue
    primaryLight: '#1a9eff',    // Light blue for hover
    primaryDark: '#0066b3',     // Dark blue for active
    accent: '#22d3ee',          // Cyan accent

    // Text Colors
    text: {
      primary: '#f8fafc',       // White text
      secondary: '#94a3b8',     // Gray text
      muted: '#64748b',         // Muted text
      accent: '#22d3ee',        // Cyan accent text
    },

    // Utility Colors
    white: '#ffffff',
    black: '#000000',

    // Alert Colors
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
} as const;

export default theme;

