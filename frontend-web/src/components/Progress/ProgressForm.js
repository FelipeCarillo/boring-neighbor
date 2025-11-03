import React, { useState, useRef, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { FILE_LIMITS } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';

const ProgressForm = ({ open, onClose, onSubmit, construction, loading }) => {
  const [formData, setFormData] = useState({
    notes: '',
    photo: null,
    bim_reference_id: '',
  });
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [bimReferences, setBimReferences] = useState([]);
  const [loadingBims, setLoadingBims] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && construction?.bim_references) {
      setBimReferences(construction.bim_references);
      if (construction.bim_references.length === 1) {
        setFormData(prev => ({ ...prev, bim_reference_id: construction.bim_references[0].id }));
      }
    }
  }, [open, construction]);

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

    setFormData(prev => ({ ...prev, photo: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.bim_reference_id) {
      setError('Selecione uma imagem BIM de referência');
      return;
    }

    if (!formData.photo) {
      setError('Foto é obrigatória');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('file', formData.photo);
    submitFormData.append('bim_reference_id', formData.bim_reference_id);
    if (formData.notes) {
      submitFormData.append('notes', formData.notes);
    }

    await onSubmit(submitFormData, setUploadProgress);
  };

  const handleClose = () => {
    setFormData({ notes: '', photo: null, bim_reference_id: '' });
    setPreview(null);
    setError('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Registrar Progresso
        <Typography variant="body2" color="text.secondary">
          Adicione uma foto do progresso da obra
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {bimReferences.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Esta obra não possui imagens BIM cadastradas. Cadastre imagens BIM antes de registrar progresso.
            </Alert>
          ) : (
            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel>Selecione a Imagem BIM de Referência</InputLabel>
              <Select
                value={formData.bim_reference_id}
                onChange={(e) => setFormData(prev => ({ ...prev, bim_reference_id: e.target.value }))}
                label="Selecione a Imagem BIM de Referência"
                disabled={loading || loadingBims}
              >
                {bimReferences.map((bim, index) => (
                  <MenuItem key={bim.id} value={bim.id}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        src={bim.presigned_url} 
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          BIM #{index + 1}
                        </Typography>
                        {bim.description && (
                          <Typography variant="caption" color="text.secondary">
                            {bim.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Photo Upload */}
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
                    handleRemovePhoto();
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="caption" display="block" mt={1}>
                  {formData.photo?.name} - {formatFileSize(formData.photo?.size)}
                </Typography>
              </Box>
            ) : (
              <Box>
                <PhotoCameraIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Clique para selecionar uma foto
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

          {/* Notes */}
          <TextField
            fullWidth
            label="Observações"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            multiline
            rows={3}
            disabled={loading}
            sx={{ mt: 2 }}
            placeholder="Adicione observações sobre o progresso (opcional)"
          />

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption">Enviando foto...</Typography>
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
          disabled={loading || !formData.photo || !formData.bim_reference_id || bimReferences.length === 0}
          startIcon={<CloudUploadIcon />}
        >
          {loading ? 'Enviando...' : 'Registrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressForm;

