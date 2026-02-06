// Design tokens for ReMake - Entrepreneur Social Platform

export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: '#2D3748',
    light: '#4A5568',
    dark: '#1A202C',
  },
  accent: {
    DEFAULT: '#3182CE',
    light: '#63B3ED',
    dark: '#2C5282',
  },

  // Semantic colors
  success: '#38A169',
  warning: '#D69E2E',
  error: '#E53E3E',
  info: '#3182CE',

  // Neutral colors
  surface: '#F7FAFC',
  border: '#E2E8F0',
  'text-primary': '#1A202C',
  'text-secondary': '#718096',
  'text-muted': '#A0AEC0',
  'text-inverse': '#FFFFFF',

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F7FAFC',
    tertiary: '#EDF2F7',
  },

  // Status colors
  status: {
    online: '#38A169',
    offline: '#A0AEC0',
    away: '#D69E2E',
    busy: '#E53E3E',
  },

  // Tag colors for different categories
  tags: {
    product: '#3182CE',
    engineering: '#38A169',
    design: '#D69E2E',
    marketing: '#805AD5',
    sales: '#E53E3E',
    finance: '#38B2AC',
    legal: '#4A5568',
    operations: '#718096',
  },
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const

export const borderRadius = {
  sm: '4px',
  DEFAULT: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Animation keyframes (to be used with CSS-in-JS or Tailwind)
export const keyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideInFromBottom: {
    '0%': { transform: 'translateY(100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
} as const