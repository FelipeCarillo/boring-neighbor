import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { FILE_LIMITS } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';

const BIMUpload = ({ open, onClose, onSubmit, construction, loading }) => {
  const [formData, setFormData] = useState({
    description: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!FILE_LIMITS.ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Formato inválido. Use JPEG, PNG ou WEBP');
      return;
    }

    // Validate file size
    if (file.size > FILE_LIMITS.IMAGE_MAX_SIZE) {
      setError(`Arquivo muito grande. Máximo: ${formatFileSize(FILE_LIMITS.IMAGE_MAX_SIZE)}`);
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      setError('Imagem é obrigatória');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('file', formData.image);
    if (formData.description) {
      submitFormData.append('description', formData.description);
    }

    await onSubmit(submitFormData, setUploadProgress);
  };

  const handleClose = () => {
    setFormData({ description: '', image: null });
    setPreview(null);
    setError('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Upload Imagem BIM
        <Typography variant="body2" color="text.secondary">
          Adicione uma imagem de referência BIM para comparação
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Image Upload */}
          <Box
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: preview ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            {preview ? (
              <Box>
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 1,
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'error.light' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="caption" display="block" mt={1}>
                  {formData.image?.name} - {formatFileSize(formData.image?.size)}
                </Typography>
              </Box>
            ) : (
              <Box>
                <ImageIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Clique para selecionar imagem BIM
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPEG, PNG ou WEBP - Máx. {formatFileSize(FILE_LIMITS.IMAGE_MAX_SIZE)}
                </Typography>
              </Box>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={2}
            disabled={loading}
            sx={{ mt: 2 }}
            placeholder="Adicione uma descrição (opcional)"
          />

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption">Enviando imagem...</Typography>
                <Typography variant="caption">{uploadProgress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.image || !formData.phase_id}
          startIcon={<CloudUploadIcon />}
        >
          {loading ? 'Enviando...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BIMUpload;

