import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'Nenhum item encontrado',
  description,
  action,
  actionLabel,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="300px"
      textAlign="center"
      p={4}
    >
      <Icon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.disabled" mb={3}>
          {description}
        </Typography>
      )}
      {action && actionLabel && (
        <Button variant="contained" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;

