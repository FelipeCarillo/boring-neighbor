import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingSpinner = ({ 
  message = 'Carregando...', 
  size = 48,
  fullScreen = false,
}) => {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: fullScreen ? '100vh' : '200px',
          gap: 3,
          p: 4,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
          }}
        >
          <CircularProgress 
            size={size}
            thickness={3.5}
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            fontWeight={500}
            sx={{
              animation: 'fadeIn 0.5s ease-in-out',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;

