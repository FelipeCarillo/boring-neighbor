// Paleta de Cores do Metrô SP
export const colors = {
  // Cores primárias das linhas do Metrô SP
  primary: '#0455BF',      // Azul Linha 1
  primaryLight: '#4A8CD9',
  primaryDark: '#023E8A',
  
  secondary: '#EE3124',    // Vermelho Linha 3
  secondaryLight: '#F26659',
  secondaryDark: '#C1251A',
  
  success: '#00903E',      // Verde Linha 2
  successLight: '#4CAF50',
  successDark: '#00632B',
  
  warning: '#FBD12D',      // Amarelo Linha 4
  warningLight: '#FFE566',
  warningDark: '#F9A825',
  
  info: '#0288D1',
  infoLight: '#03A9F4',
  infoDark: '#01579B',
  
  error: '#EE3124',        // Usa o vermelho da linha 3
  errorLight: '#F26659',
  errorDark: '#C1251A',
  
  // Cores de fundo
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  
  // Cores de texto
  text: {
    primary: '#1A1A1A',
    secondary: '#6B6B6B',
    disabled: '#9E9E9E',
    hint: '#BDBDBD',
  },
  
  // Bordas e divisores
  border: 'rgba(0, 0, 0, 0.08)',
  divider: 'rgba(0, 0, 0, 0.12)',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdropBlur: 'rgba(255, 255, 255, 0.9)',
  
  // Status de construções
  statusColors: {
    PLANNED: '#0288D1',
    IN_PROGRESS: '#0455BF',
    COMPLETED: '#00903E',
    ON_HOLD: '#FBD12D',
    CANCELLED: '#EE3124',
  },
  
  // Gradientes
  gradients: {
    primary: ['#0455BF', '#00903E'],
    secondary: ['#EE3124', '#F9A825'],
    background: ['#0455BF', '#00903E'],
  },
} as const;

export type ColorKeys = keyof typeof colors;

