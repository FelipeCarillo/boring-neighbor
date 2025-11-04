// Common reusable styles

export const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
};

export const absoluteCenter = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export const ellipsis = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const lineClamp = (lines = 2) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
});

export const scrollbar = {
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
};

export const thinScrollbar = {
  '&::-webkit-scrollbar': {
    width: '4px',
    height: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
  },
};

export const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

export const cardHover = {
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  },
};

export const gradientBackground = (color1 = '#0455BF', color2 = '#00903E') => ({
  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
});

export const subtleGradient = {
  background: 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)',
};

export const focusRing = {
  outline: 'none',
  '&:focus-visible': {
    boxShadow: '0 0 0 3px rgba(4, 85, 191, 0.2)',
  },
};

export const disabled = {
  opacity: 0.5,
  pointerEvents: 'none',
  cursor: 'not-allowed',
};

export const hideScrollbar = {
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

// Responsive utilities
export const mobileOnly = (theme) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
});

export const desktopOnly = (theme) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
});

// Shadow utilities
export const elevation = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.04)',
  md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0 12px 28px rgba(0, 0, 0, 0.12)',
  xl: '0 24px 48px rgba(0, 0, 0, 0.16)',
};

