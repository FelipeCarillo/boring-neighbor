import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Drawer,
  Slider,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Chip,
  Badge,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterFocusStrongIcon,
  GridOn as GridOnIcon,
  Palette as PaletteIcon,
  Brightness6 as BrightnessIcon,
  Close as CloseIcon,
  CameraAlt as CameraAltIcon,
  CloudUpload as CloudUploadIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// FBXLoader requires additional package, commenting for now
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const Model3DViewer = React.forwardRef(({ 
  modelUrl, 
  height = 600, 
  autoLoad = true, 
  onCapture, 
  captureMode = false, 
  showControls = true,
  initialBackgroundColor = '#f5f5f5',
  initialAmbientLightIntensity = 0.6,
  initialDirectionalLightIntensity = 0.8,
  initialDirectionalLightColor = '#ffffff',
  initialWireframe = false,
  initialShowGrid = true,
  onSettingsChange
}, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showGrid, setShowGrid] = useState(initialShowGrid);
  const [showColorPanel, setShowColorPanel] = useState(false);
  
  
  // Estados para ajustes de cor e iluminação
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(initialAmbientLightIntensity);
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(initialDirectionalLightIntensity);
  const [directionalLightColor, setDirectionalLightColor] = useState(initialDirectionalLightColor);
  const [wireframe, setWireframe] = useState(initialWireframe);
  
  const ambientLightRef = useRef(null);
  const directionalLightRef = useRef(null);

  useEffect(() => {
    if (!modelUrl || !mountRef.current || !autoLoad) return;

    // Limpar canvas existente ANTES de criar novo
    if (rendererRef.current && rendererRef.current.domElement) {
      if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Limpar TODOS os canvas filhos do container para evitar duplicação
    if (mountRef.current) {
      const existingCanvases = mountRef.current.querySelectorAll('canvas');
      existingCanvases.forEach(canvas => {
        if (mountRef.current.contains(canvas)) {
          mountRef.current.removeChild(canvas);
        }
      });
    }

    // Verificar suporte WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setError('WebGL não está disponível no seu navegador. Tente atualizar ou usar outro navegador.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('Erro ao verificar suporte WebGL: ' + err.message);
      setLoading(false);
      return;
    }

    // Verificar se o container tem tamanho válido
    if (!mountRef.current || mountRef.current.clientWidth === 0 || height === 0) {
      // Aguardar próximo frame para tentar novamente
      const timeoutId = setTimeout(() => {
        if (mountRef.current && mountRef.current.clientWidth > 0 && height > 0) {
          // Tentar novamente após o container ter tamanho
        } else {
          setError('Container não tem tamanho válido para renderizar o modelo 3D');
          setLoading(false);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }

    let animationFrameId = null;
    let handleResizeFn = null;

    try {
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

      // Setup Renderer com tratamento de erro
      let renderer;
            try {
              renderer = new THREE.WebGLRenderer({
                antialias: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
                preserveDrawingBuffer: true,
              });
      } catch (rendererError) {
        console.error('Erro ao criar WebGL renderer:', rendererError);
        setError('Erro ao criar contexto WebGL. Verifique se seu navegador suporta WebGL e se não está bloqueado.');
        setLoading(false);
        return;
      }

      // Validar se o renderer foi criado corretamente
      if (!renderer || !renderer.domElement) {
        setError('Falha ao criar renderer WebGL');
        setLoading(false);
        return;
      }

      renderer.setSize(mountRef.current.clientWidth, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar pixel ratio para melhor performance
      renderer.shadowMap.enabled = true;
      
      // Garantir que não há canvas duplicado antes de adicionar
      if (!mountRef.current.querySelector('canvas')) {
        mountRef.current.appendChild(renderer.domElement);
      }
      
      rendererRef.current = renderer;

      // Setup Controls
      const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Configurar controles do mouse
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,    // Botão esquerdo: rotacionar (segurar e arrastar)
        MIDDLE: THREE.MOUSE.DOLLY,   // Botão do meio: zoom
        RIGHT: THREE.MOUSE.PAN,      // Botão direito: pan (mover)
      };
      
      // Desabilitar pan com botão esquerdo + tecla
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      
      controlsRef.current = controls;

      // Add Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
      sceneRef.current.add(ambientLight);
      ambientLightRef.current = ambientLight;

      const directionalLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
      directionalLight.position.set(10, 20, 10);
      directionalLight.castShadow = true;
      directionalLight.color.set(directionalLightColor);
      sceneRef.current.add(directionalLight);
      directionalLightRef.current = directionalLight;
      
      // Aplicar cor de fundo inicial
      sceneRef.current.background = new THREE.Color(backgroundColor);

      // Add Grid Helper
      const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0xcccccc);
      gridHelper.visible = showGrid;
      sceneRef.current.add(gridHelper);

      // Add Axes Helper
      const axesHelper = new THREE.AxesHelper(5);
      sceneRef.current.add(axesHelper);

      // Load 3D Model
      load3DModel(sceneRef.current, modelUrl);

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (controlsRef.current && cameraRef.current && rendererRef.current && sceneRef.current) {
          controlsRef.current.update();
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();

      // Handle Resize
      handleResizeFn = () => {
        if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
        
        const width = mountRef.current.clientWidth;
        if (width > 0) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      };
      window.addEventListener('resize', handleResizeFn);

    } catch (initError) {
      console.error('Erro ao inicializar Three.js:', initError);
      setError('Erro ao inicializar visualizador 3D: ' + initError.message);
      setLoading(false);
    }

    // Cleanup - executar sempre que o componente desmontar ou dependências mudarem
    return () => {
      if (handleResizeFn) {
        window.removeEventListener('resize', handleResizeFn);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      if (rendererRef.current) {
        if (mountRef.current && rendererRef.current.domElement && mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (sceneRef.current) {
        // Limpar geometrias e materiais da cena
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current = null;
      }
      if (cameraRef.current) {
        cameraRef.current = null;
      }
    };
  }, [modelUrl, height, showGrid, autoLoad]);

  const getFileExtension = (url) => {
    if (!url) return '';
    const path = url.toLowerCase();
    if (path.endsWith('.obj')) return 'obj';
    if (path.endsWith('.gltf') || path.endsWith('.glb')) return 'gltf';
    if (path.endsWith('.fbx')) return 'fbx';
    return 'obj'; // default
  };

  const load3DModel = async (scene, url) => {
    try {
      setLoading(true);
      setError('');
      setProgress(0);

      console.log('Iniciando carregamento do modelo 3D:', url);

      const fileType = getFileExtension(url);
      let loader;

      // Selecionar loader baseado na extensão
      switch (fileType) {
        case 'obj':
          loader = new OBJLoader();
          break;
        case 'gltf':
          loader = new GLTFLoader();
          break;
        case 'fbx':
          // FBXLoader requires additional package
          setError('Formato FBX requer biblioteca adicional. Use OBJ ou GLTF.');
          setLoading(false);
          return;
          // loader = new FBXLoader();
          // break;
        default:
          loader = new OBJLoader();
      }

      // Load model
      let model;
      if (fileType === 'gltf') {
        const gltf = await loader.loadAsync(url, (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            setProgress(Math.round(percent));
          }
        });
        model = gltf.scene;
      } else if (fileType === 'fbx') {
        model = await loader.loadAsync(url, (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            setProgress(Math.round(percent));
          }
        });
      } else {
        // OBJ
        model = await new Promise((resolve, reject) => {
          loader.load(
            url,
            (object) => {
              setProgress(100);
              resolve(object);
            },
            (progressEvent) => {
              if (progressEvent.lengthComputable) {
                const percent = (progressEvent.loaded / progressEvent.total) * 100;
                setProgress(Math.round(percent));
              }
            },
            (error) => reject(error)
          );
        });
      }

      console.log('Modelo 3D carregado com sucesso:', model);

      // Remove previous model
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      modelRef.current = model;
      scene.add(model);

      // Aplicar wireframe se estiver ativado
      if (wireframe) {
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat) mat.wireframe = true;
              });
            } else {
              child.material.wireframe = true;
            }
          }
        });
      }

      // Center and fit camera
      try {
        const box = new THREE.Box3().setFromObject(model);
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
    } catch (err) {
      console.error('Erro ao carregar modelo 3D:', err);
      setError(`Erro ao carregar modelo 3D: ${err.message || 'Verifique o arquivo e a conexão'}`);
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
      const newValue = !prev;
      if (sceneRef.current) {
        const grid = sceneRef.current.children.find(child => child instanceof THREE.GridHelper);
        if (grid) grid.visible = newValue;
      }
      if (onSettingsChange) {
        onSettingsChange({ showGrid: newValue });
      }
      return newValue;
    });
  };

  // Handlers para ajustes de cor
  const handleBackgroundColorChange = (event) => {
    const color = event.target.value;
    setBackgroundColor(color);
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(color);
    }
    if (onSettingsChange) {
      onSettingsChange({ backgroundColor: color });
    }
  };

  const handleAmbientLightChange = (event, value) => {
    setAmbientLightIntensity(value);
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = value;
    }
    if (onSettingsChange) {
      onSettingsChange({ ambientLightIntensity: value });
    }
  };

  const handleDirectionalLightChange = (event, value) => {
    setDirectionalLightIntensity(value);
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = value;
    }
    if (onSettingsChange) {
      onSettingsChange({ directionalLightIntensity: value });
    }
  };

  const handleDirectionalLightColorChange = (event) => {
    const color = event.target.value;
    setDirectionalLightColor(color);
    if (directionalLightRef.current) {
      directionalLightRef.current.color.set(color);
    }
    if (onSettingsChange) {
      onSettingsChange({ directionalLightColor: color });
    }
  };

  const handleWireframeToggle = (event) => {
    const enabled = event.target.checked;
    setWireframe(enabled);
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat) mat.wireframe = enabled;
            });
          } else {
            child.material.wireframe = enabled;
          }
        }
      });
    }
    if (onSettingsChange) {
      onSettingsChange({ wireframe: enabled });
    }
  };

  const handleResetColors = () => {
    setBackgroundColor('#f5f5f5');
    setAmbientLightIntensity(0.6);
    setDirectionalLightIntensity(0.8);
    setDirectionalLightColor('#ffffff');
    setWireframe(false);
    
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color('#f5f5f5');
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = 0.6;
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 0.8;
      directionalLightRef.current.color.set('#ffffff');
    }
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat) mat.wireframe = false;
            });
          } else {
            child.material.wireframe = false;
          }
        }
      });
    }
  };

  const handleScreenshot = () => {
    if (rendererRef.current) {
      const dataURL = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `model-3d-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const handleQuickCapture = useCallback(() => {
    if (rendererRef.current && cameraRef.current) {
      const dataURL = rendererRef.current.domElement.toDataURL('image/png');
      
      const newCapture = {
        id: Date.now(),
        preview: dataURL,
        dataURL: dataURL,
        timestamp: new Date(),
        cameraPosition: {
          x: cameraRef.current.position.x,
          y: cameraRef.current.position.y,
          z: cameraRef.current.position.z,
        }
      };
      
      if (onCapture) {
        onCapture(newCapture);
      }
    }
  }, [onCapture]);

  React.useImperativeHandle(ref, () => ({
    captureScreen: handleQuickCapture,
  }));

  useEffect(() => {
    if (!captureMode) return;

    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleQuickCapture();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [captureMode, handleQuickCapture]);

  if (!autoLoad || !modelUrl) {
    return null;
  }

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
            Carregando modelo 3D... {progress}%
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
      {!loading && !error && showControls && (
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

          <Tooltip title="Ajustes de Cor e Iluminação" placement="left">
            <IconButton
              sx={{
                bgcolor: showColorPanel ? 'primary.main' : 'background.paper',
                color: showColorPanel ? 'white' : 'inherit',
                '&:hover': { bgcolor: showColorPanel ? 'primary.dark' : 'primary.light' }
              }}
              onClick={() => setShowColorPanel(!showColorPanel)}
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Capturar Tela" placement="left">
            <IconButton
              sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.light' } }}
              onClick={handleScreenshot}
            >
              <CameraAltIcon />
            </IconButton>
          </Tooltip>

        </Box>
      )}

      {/* Color and Lighting Panel */}
      <Drawer
        anchor="right"
        open={showColorPanel}
        onClose={() => setShowColorPanel(false)}
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            width: 320,
            p: 2,
          },
        }}
      >
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              <PaletteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Ajustes de Cor
            </Typography>
            <IconButton size="small" onClick={() => setShowColorPanel(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Cor de Fundo */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Cor de Fundo
            </Typography>
            <TextField
              type="color"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Intensidade da Luz Ambiente */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              <BrightnessIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} />
              Intensidade Luz Ambiente
            </Typography>
            <Slider
              value={ambientLightIntensity}
              onChange={handleAmbientLightChange}
              min={0}
              max={2}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
              ]}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              {ambientLightIntensity.toFixed(1)}
            </Typography>
          </Box>

          {/* Intensidade da Luz Direcional */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Intensidade Luz Direcional
            </Typography>
            <Slider
              value={directionalLightIntensity}
              onChange={handleDirectionalLightChange}
              min={0}
              max={2}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
              ]}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              {directionalLightIntensity.toFixed(1)}
            </Typography>
          </Box>

          {/* Cor da Luz Direcional */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Cor da Luz Direcional
            </Typography>
            <TextField
              type="color"
              value={directionalLightColor}
              onChange={handleDirectionalLightColorChange}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Wireframe */}
          <Box mb={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={wireframe}
                  onChange={handleWireframeToggle}
                />
              }
              label="Modo Wireframe"
            />
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              Mostra apenas as arestas do modelo
            </Typography>
          </Box>

          {/* Botão Reset */}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleResetColors}
            sx={{ mt: 2 }}
          >
            Restaurar Padrões
          </Button>
        </Box>
      </Drawer>

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
            zIndex: 5
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
      <Box 
        ref={mountRef} 
        sx={{ 
          width: '100%', 
          height,
          minHeight: 400,
          position: 'relative',
          bgcolor: '#f5f5f5',
        }} 
      />
    </Box>
  );
});

export default React.memo(Model3DViewer);

