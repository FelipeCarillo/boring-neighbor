// Animations and keyframes utilities

export const fadeIn = {
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  animation: 'fadeIn 0.3s ease-in-out',
};

export const fadeInUp = {
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  animation: 'fadeInUp 0.4s ease-out',
};

export const fadeInDown = {
  '@keyframes fadeInDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  animation: 'fadeInDown 0.4s ease-out',
};

export const slideInLeft = {
  '@keyframes slideInLeft': {
    from: {
      opacity: 0,
      transform: 'translateX(-30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  animation: 'slideInLeft 0.3s ease-out',
};

export const slideInRight = {
  '@keyframes slideInRight': {
    from: {
      opacity: 0,
      transform: 'translateX(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  animation: 'slideInRight 0.3s ease-out',
};

export const scaleIn = {
  '@keyframes scaleIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.9)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  animation: 'scaleIn 0.3s ease-out',
};

export const pulse = {
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  animation: 'pulse 2s ease-in-out infinite',
};

export const spin = {
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  animation: 'spin 1s linear infinite',
};

// Transition utilities
export const transitions = {
  fast: 'all 0.15s ease-in-out',
  normal: 'all 0.3s ease-in-out',
  slow: 'all 0.5s ease-in-out',
};

// Common animation configs
export const staggeredAnimation = (index, baseDelay = 0.1) => ({
  animation: `fadeInUp 0.4s ease-out ${baseDelay * index}s both`,
});

export const hoverLift = {
  transition: transitions.normal,
  '&:hover': {
    transform: 'translateY(-4px)',
  },
};

export const hoverScale = {
  transition: transitions.fast,
  '&:hover': {
    transform: 'scale(1.02)',
  },
};

export const hoverGlow = (color = 'rgba(4, 85, 191, 0.2)') => ({
  transition: transitions.normal,
  '&:hover': {
    boxShadow: `0 8px 24px ${color}`,
  },
});

