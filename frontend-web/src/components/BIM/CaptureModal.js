import React, { useState } from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  CameraAlt as CameraAltIcon,
  CloudUpload as CloudUploadIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Model3DViewer from './Model3DViewer';

const CaptureModal = ({ open, onClose, modelUrl, constructionId, onBIMUpload, onNotify, viewerSettings, onSettingsChange }) => {
  const [captures, setCaptures] = useState([]);
  const [uploading, setUploading] = useState(false);
  const viewerRef = React.useRef(null);

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const showCaptureFlash = () => {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.8;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => {
      flash.style.transition = 'opacity 0.2s';
      flash.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }, 200);
    }, 50);
  };

  const handleCapture = (captureData) => {
    setCaptures(prev => [...prev, captureData]);
    showCaptureFlash();
  };

  const handleSaveAll = async () => {
    if (!constructionId || !onBIMUpload) {
      console.error('constructionId ou onBIMUpload não fornecido');
      return;
    }

    setUploading(true);
    const totalCaptures = captures.length;
    
    try {
      const uploadPromises = captures.map((capture, i) => {
        const blob = dataURLtoBlob(capture.dataURL);
        
        const formData = new FormData();
        formData.append('file', blob, `reference-${i + 1}-${Date.now()}.png`);
        formData.append('description', `Referência ${i + 1} - Capturada em ${capture.timestamp.toLocaleString()}`);
        
        return onBIMUpload(formData);
      });
      
      await Promise.all(uploadPromises);
      
      if (onNotify) {
        onNotify(`${totalCaptures} referência${totalCaptures > 1 ? 's' : ''} BIM salva${totalCaptures > 1 ? 's' : ''} com sucesso!`, 'success');
      }
      
      setCaptures([]);
      onClose();
      
    } catch (error) {
      console.error('Erro ao salvar referências:', error);
      if (onNotify) {
        onNotify('Erro ao salvar algumas referências', 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const removeCapture = (indexToRemove) => {
    setCaptures(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClose = () => {
    if (captures.length > 0) {
      const confirm = window.confirm(`Você tem ${captures.length} captura(s) não salva(s). Deseja sair mesmo assim?`);
      if (!confirm) return;
    }
    setCaptures([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
        }
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <PhotoCameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Modo Captura Rápida de Referências BIM
          </Typography>
          
          <Chip 
            icon={<PhotoCameraIcon />} 
            label={`${captures.length} captura${captures.length !== 1 ? 's' : ''}`}
            color="secondary"
            sx={{ mr: 2 }}
          />
          
          {captures.length > 0 && (
            <Button
              variant="contained"
              color="success"
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              onClick={handleSaveAll}
              disabled={uploading}
              sx={{ mr: 2 }}
            >
              {uploading ? 'Salvando...' : `Salvar ${captures.length}`}
            </Button>
          )}
          
          <IconButton color="inherit" onClick={handleClose} disabled={uploading}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <Model3DViewer
            ref={viewerRef}
            modelUrl={modelUrl}
            height={window.innerHeight - 64}
            autoLoad={true}
            onCapture={handleCapture}
            captureMode={true}
            showControls={true}
            initialBackgroundColor={viewerSettings?.backgroundColor}
            initialAmbientLightIntensity={viewerSettings?.ambientLightIntensity}
            initialDirectionalLightIntensity={viewerSettings?.directionalLightIntensity}
            initialDirectionalLightColor={viewerSettings?.directionalLightColor}
            initialWireframe={viewerSettings?.wireframe}
            initialShowGrid={viewerSettings?.showGrid}
            onSettingsChange={onSettingsChange}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              boxShadow: 8,
              borderRadius: 3,
              p: 2,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              zIndex: 10,
              border: 3,
              borderColor: 'success.main',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<CameraAltIcon />}
              onClick={() => {
                if (viewerRef.current?.captureScreen) {
                  viewerRef.current.captureScreen();
                }
              }}
              disabled={uploading}
              sx={{ 
                minWidth: 200,
                height: 64,
                fontSize: '1.2rem',
                boxShadow: 6,
              }}
            >
              CAPTURAR (Enter)
            </Button>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontSize: '0.95rem',
              zIndex: 9,
              boxShadow: 4,
            }}
          >
            💡 <strong>Enter/Space</strong> para capturar • <strong>Ctrl+S</strong> para salvar tudo • <strong>Esc</strong> para sair
          </Box>
        </Box>

        <Box
          sx={{
            width: 320,
            bgcolor: 'background.paper',
            borderLeft: 1,
            borderColor: 'divider',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoCameraIcon />
            Capturas ({captures.length})
          </Typography>

          {captures.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
              <Typography variant="body2">
                Nenhuma captura ainda
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Use Enter/Space para capturar
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {captures.map((capture, idx) => (
                <Box
                  key={capture.id}
                  sx={{
                    position: 'relative',
                    border: 2,
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={capture.preview}
                    sx={{
                      width: '100%',
                      display: 'block',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Tooltip title="Remover captura">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' },
                        }}
                        onClick={() => removeCapture(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="caption">
                      Captura {idx + 1}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default CaptureModal;

