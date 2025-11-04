import React from 'react';
import { Alert, AlertTitle, Button, Fade } from '@mui/material';

const ErrorAlert = ({
  error,
  title = 'Erro',
  onRetry,
  retryLabel = 'Tentar novamente',
}) => {
  const errorMessage = typeof error === 'string'
    ? error
    : error?.response?.data?.detail || error?.message || 'Ocorreu um erro inesperado';

  return (
    <Fade in timeout={300}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              sx={{ fontWeight: 600 }}
            >
              {retryLabel}
            </Button>
          )
        }
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'error.light',
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
        {errorMessage}
      </Alert>
    </Fade>
  );
};

export default ErrorAlert;

