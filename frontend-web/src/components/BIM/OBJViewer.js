import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterFocusStrongIcon,
  GridOn as GridOnIcon,
} from '@mui/icons-material';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const OBJViewer = ({ objUrl, height = 600 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (!objUrl || !mountRef.current) return;

    // Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / height,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add Grid Helper
    const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0xcccccc);
    gridHelper.visible = showGrid;
    scene.add(gridHelper);

    // Add Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Load OBJ Model
    loadOBJModel(scene, objUrl);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [objUrl, height, showGrid]);

  const loadOBJModel = async (scene, url) => {
    try {
      setLoading(true);
      setError('');
      setProgress(0);

      console.log('Iniciando carregamento do OBJ:', url);

      const loader = new OBJLoader();
      
      // Load OBJ model
      loader.load(
        url,
        (object) => {
          console.log('Modelo OBJ carregado com sucesso:', object);

          // Remove previous model
          if (modelRef.current) {
            scene.remove(modelRef.current);
          }

          modelRef.current = object;
          scene.add(object);

          // Center and fit camera
          try {
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = cameraRef.current.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5; // Add some padding

            cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
            cameraRef.current.lookAt(center);
            controlsRef.current.target.copy(center);
            controlsRef.current.update();
          } catch (cameraErr) {
            console.warn('Erro ao posicionar câmera, usando posição padrão:', cameraErr);
          }

          setLoading(false);
          setProgress(100);
        },
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
            setProgress(Math.round(percentComplete));
            console.log(`Progresso: ${Math.round(percentComplete)}%`);
          }
        },
        (error) => {
          console.error('Erro ao carregar OBJ:', error);
          setError(`Erro ao carregar modelo OBJ: ${error.message || 'Verifique o arquivo e a conexão'}`);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Erro fatal ao inicializar visualizador OBJ:', err);
      setError(`Erro ao inicializar visualizador OBJ: ${err.message}`);
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current && cameraRef.current) {
      const direction = new THREE.Vector3();
      cameraRef.current.getWorldDirection(direction);
      cameraRef.current.position.addScaledVector(direction, 2);
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current && cameraRef.current) {
      const direction = new THREE.Vector3();
      cameraRef.current.getWorldDirection(direction);
      cameraRef.current.position.addScaledVector(direction, -2);
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current && modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5;

      cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
      cameraRef.current.lookAt(center);
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => {
      if (sceneRef.current) {
        const grid = sceneRef.current.children.find(child => child instanceof THREE.GridHelper);
        if (grid) grid.visible = !prev;
      }
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
            Carregando modelo OBJ... {progress}%
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

      {/* 3D Canvas Mount Point */}
      <Box ref={mountRef} sx={{ width: '100%', height }} />
    </Box>
  );
};

export default OBJViewer;

