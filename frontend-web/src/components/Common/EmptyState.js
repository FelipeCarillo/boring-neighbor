import React from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'Nenhum item encontrado',
  description,
  action,
  actionLabel,
}) => {
  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Icon 
            sx={{ 
              fontSize: 56, 
              color: 'text.disabled',
            }} 
          />
        </Box>
        <Typography 
          variant="h5" 
          color="text.primary" 
          gutterBottom
          fontWeight={600}
        >
          {title}
        </Typography>
        {description && (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: 400 }}
          >
            {description}
          </Typography>
        )}
        {action && actionLabel && (
          <Button 
            variant="contained" 
            onClick={action}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Fade>
  );
};

export default EmptyState;

