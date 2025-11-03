import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  ViewInAr as ViewInArIcon,
} from '@mui/icons-material';
import { FILE_LIMITS } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';

const Model3DUpload = ({ open, onClose, onSubmit, construction, loading }) => {
  const [formData, setFormData] = useState({
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');

    // Validar extensão - suporta múltiplos formatos
    const fileName = file.name.toLowerCase();
    const isValidExtension = FILE_LIMITS.ACCEPTED_3D_MODEL_TYPES.some(ext => 
      fileName.endsWith(ext)
    );

    if (!isValidExtension) {
      setError(`Formato inválido. Use um dos formatos: ${FILE_LIMITS.ACCEPTED_3D_MODEL_TYPES.join(', ')}`);
      return;
    }

    // Sem validação de tamanho para modelos 3D
    setFormData(prev => ({ ...prev, file }));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.file) {
      setError('Arquivo de modelo 3D é obrigatório');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('file', formData.file);

    await onSubmit(submitFormData, setUploadProgress);
  };

  const handleClose = () => {
    setFormData({ file: null });
    setError('');
    setUploadProgress(0);
    onClose();
  };

  const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toUpperCase();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Upload Modelo 3D
        <Typography variant="body2" color="text.secondary">
          Adicione um modelo 3D para esta obra (OBJ, GLTF, GLB ou FBX)
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* File Upload */}
          <Box
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: formData.file ? 'primary.main' : 'divider',
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
            onClick={() => !formData.file && fileInputRef.current?.click()}
          >
            {formData.file ? (
              <Box>
                <ViewInArIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  {formData.file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {formatFileSize(formData.file.size)} • {getFileExtension(formData.file.name)}
                </Typography>
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
                    handleRemoveFile();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <ViewInArIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Clique para selecionar modelo 3D
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Formatos: {FILE_LIMITS.ACCEPTED_3D_MODEL_TYPES.join(', ')} - Sem limite de tamanho
                </Typography>
              </Box>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_LIMITS.ACCEPTED_3D_MODEL_TYPES.join(',')}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption">Enviando modelo...</Typography>
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
          disabled={loading || !formData.file}
          startIcon={<CloudUploadIcon />}
        >
          {loading ? 'Enviando...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Model3DUpload;

