import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja realizar esta ação?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmColor = 'primary',
  loading = false,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          sx={{ px: 3 }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          autoFocus
          sx={{ px: 3 }}
        >
          {loading ? 'Processando...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

