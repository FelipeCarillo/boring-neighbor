import { colors } from './colors';
import { typography, textVariants } from './typography';

// Sistema de espaçamento (múltiplos de 8)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Sombras
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// Tema completo
export const theme = {
  colors,
  typography,
  textVariants,
  spacing,
  borderRadius,
  shadows,
  
  // Dimensões padrão
  dimensions: {
    headerHeight: 64,
    tabBarHeight: 60,
    buttonHeight: 48,
    buttonHeightSmall: 36,
    buttonHeightLarge: 56,
    inputHeight: 48,
    iconSize: 24,
    iconSizeSmall: 20,
    iconSizeLarge: 32,
    avatarSize: 40,
    avatarSizeSmall: 32,
    avatarSizeLarge: 64,
    cardMinHeight: 120,
    touchableMinSize: 44, // Acessibilidade
  },
  
  // Opacidades
  opacity: {
    disabled: 0.38,
    hover: 0.08,
    selected: 0.12,
    focus: 0.12,
    activated: 0.24,
  },
  
  // Animações
  animation: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
} as const;

export type Theme = typeof theme;

