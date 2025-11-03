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
  ViewInAr as ViewInArIcon,
} from '@mui/icons-material';
import { FILE_LIMITS } from '../../utils/constants';
import { formatFileSize } from '../../utils/formatters';

const IFCUpload = ({ open, onClose, onSubmit, construction, loading }) => {
  const [formData, setFormData] = useState({
    phase_id: '',
    description: '',
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');

    // Validate file extension
    if (!file.name.toLowerCase().endsWith('.obj')) {
      setError('Formato inválido. Use arquivo .obj');
      return;
    }

        // Sem validação de tamanho para arquivos OBJ
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
      setError('Arquivo OBJ é obrigatório');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('file', formData.file);
    if (formData.phase_id) {
      submitFormData.append('phase_id', formData.phase_id);
    }
    if (formData.description) {
      submitFormData.append('description', formData.description);
    }

    await onSubmit(submitFormData, setUploadProgress);
  };

  const handleClose = () => {
    setFormData({ phase_id: '', description: '', file: null });
    setError('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Upload Modelo OBJ
        <Typography variant="body2" color="text.secondary">
          Adicione um modelo 3D no formato OBJ
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Phase Select (Optional) */}
          <TextField
            fullWidth
            select
            label="Fase (Opcional)"
            value={formData.phase_id}
            onChange={(e) => setFormData(prev => ({ ...prev, phase_id: e.target.value }))}
            disabled={loading}
            sx={{ mb: 2 }}
            SelectProps={{
              native: true,
            }}
            helperText="Deixe em branco para associar à obra inteira"
          >
            <option value="">Obra completa</option>
            {construction?.phases?.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.phase_name}
              </option>
            ))}
          </TextField>

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
                  {formatFileSize(formData.file.size)}
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
                  Clique para selecionar arquivo OBJ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Arquivo .obj - Sem limite de tamanho
                </Typography>
              </Box>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept=".obj"
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
            placeholder="Adicione uma descrição do modelo (opcional)"
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

export default IFCUpload;

