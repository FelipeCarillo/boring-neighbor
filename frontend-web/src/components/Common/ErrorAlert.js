import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

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
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {errorMessage}
    </Alert>
  );
};

export default ErrorAlert;

