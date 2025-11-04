import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterFocusStrongIcon,
  GridOn as GridOnIcon,
} from '@mui/icons-material';
import { IFCLoader } from '@ifcjs/viewer';

const IFCViewer = ({ ifcUrl, height = 600 }) => {
  const mountRef = useRef(null);
  const viewerRef = useRef(null);
  const controlsRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (!ifcUrl || !mountRef.current) return;

    // Criar container para o viewer
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = `${height}px`;
    mountRef.current.appendChild(container);

    // Criar IFCLoader/viewer
    const loader = new IFCLoader();
    loader.setWasmPath('https://unpkg.com/web-ifc@0.0.50/');
    
    viewerRef.current = { loader, container };

    // Carregar modelo
    loadModel();

    // Cleanup
    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (viewerRef.current?.viewer) {
        viewerRef.current.viewer.dispose();
      }
    };
  }, [ifcUrl, height]);

  const loadModel = async () => {
    if (!viewerRef.current) return;

    try {
      setLoading(true);
      setError('');
      setProgress(0);

      console.log('Iniciando carregamento do IFC:', ifcUrl);

      const { loader, container } = viewerRef.current;

      // Carregar modelo IFC
      const model = await loader.loadAsync(
        ifcUrl,
        (progress) => {
          if (progress.total) {
            const percent = (progress.loaded / progress.total) * 100;
            setProgress(Math.round(percent));
            console.log(`Progresso: ${Math.round(percent)}%`);
          }
        }
      );

      // Criar viewer Three.js
      const { createViewer } = await import('@ifcjs/viewer');
      const viewer = createViewer({
        container,
        backgroundColor: [0.96, 0.96, 0.96], // #F5F5F5
      });

      // Adicionar modelo ao viewer
      await viewer.ifc.loader.ifcManager.loadModel(model, async () => {
        console.log('Modelo IFC carregado com sucesso');
        
        // Ajustar câmera
        viewer.ifc.cameraControls.fitToModel(model, false);
        
        viewerRef.current.viewer = viewer;
        setLoading(false);
        setProgress(100);
      });

    } catch (err) {
      console.error('Erro ao carregar IFC:', err);
      setError(`Erro ao carregar modelo IFC: ${err.message || 'Verifique o arquivo e a conexão'}`);
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current?.viewer) {
      const camera = viewerRef.current.viewer.ifc.camera;
      camera.position.multiplyScalar(0.9);
      viewerRef.current.viewer.ifc.cameraControls.update();
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current?.viewer) {
      const camera = viewerRef.current.viewer.ifc.camera;
      camera.position.multiplyScalar(1.1);
      viewerRef.current.viewer.ifc.cameraControls.update();
    }
  };

  const handleResetCamera = () => {
    if (viewerRef.current?.viewer && viewerRef.current?.loader) {
      const model = viewerRef.current.viewer.ifc.models[0];
      if (model) {
        viewerRef.current.viewer.ifc.cameraControls.fitToModel(model, false);
      }
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => {
      // Toggle grid helper se existir
      // O viewer já gerencia isso internamente
      return !prev;
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height }}>
      {/* Loading */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Carregando modelo IFC... {progress}%
          </Typography>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 }}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Controls */}
      {!loading && !error && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 5,
          }}
        >
          <Tooltip title="Zoom In" placement="left">
            <IconButton
              sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.light' } }}
              onClick={handleZoomIn}
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Zoom Out" placement="left">
            <IconButton
              sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.light' } }}
              onClick={handleZoomOut}
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Resetar Câmera" placement="left">
            <IconButton
              sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.light' } }}
              onClick={handleResetCamera}
            >
              <CenterFocusStrongIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={showGrid ? 'Ocultar Grid' : 'Mostrar Grid'} placement="left">
            <IconButton
              sx={{
                bgcolor: showGrid ? 'primary.main' : 'background.paper',
                color: showGrid ? 'white' : 'inherit',
                '&:hover': { bgcolor: showGrid ? 'primary.dark' : 'primary.light' }
              }}
              onClick={handleToggleGrid}
            >
              <GridOnIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Instructions */}
      {!loading && !error && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            boxShadow: 2,
            zIndex: 5,
          }}
        >
          <Typography variant="caption" display="block">
            🖱️ Clique e arraste para rotacionar
          </Typography>
          <Typography variant="caption" display="block">
            🔄 Scroll para zoom
          </Typography>
          <Typography variant="caption" display="block">
            ⌨️ Botão direito para mover
          </Typography>
        </Box>
      )}

      {/* Canvas Mount Point */}
      <Box ref={mountRef} sx={{ width: '100%', height }} />
    </Box>
  );
};

export default IFCViewer;
