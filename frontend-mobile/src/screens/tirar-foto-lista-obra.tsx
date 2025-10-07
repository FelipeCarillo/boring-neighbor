import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Image
} from 'react-native';
import { 
  Text, 
  IconButton,
  Card,
  Avatar,
  Menu,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions, FlashMode, CameraCapturedPicture } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

interface Obra {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Planejada';
  dataInicio: string;
  progresso: number;
  analistas: number;
}

interface TirarFotoListaObraScreenProps {
  obra: Obra;
  onBack?: () => void;
}

export default function TirarFotoListaObraScreen({ obra, onBack }: TirarFotoListaObraScreenProps) {
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [flash, setFlash] = React.useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [capturedPhotos, setCapturedPhotos] = React.useState<CameraCapturedPicture[]>([]);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<CameraCapturedPicture | null>(null);
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);

  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
    if (!mediaLibraryPermission?.granted) {
      requestMediaLibraryPermission();
    }
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setCapturedPhotos(prev => [...prev, photo]);
        console.log('Foto capturada:', photo.uri);
      } catch (error) {
        console.error('Erro ao capturar foto:', error);
        Alert.alert('Erro', 'Não foi possível capturar a foto');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const savePhoto = async (photo: CameraCapturedPicture) => {
    try {
      if (mediaLibraryPermission?.granted) {
        const asset = await MediaLibrary.saveToLibraryAsync(photo.uri);
        console.log('Foto salva na galeria:', asset);
        Alert.alert('Sucesso', 'Foto salva na galeria!');
      } else {
        Alert.alert('Permissão necessária', 'É necessário permitir acesso à galeria para salvar fotos');
      }
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto na galeria');
    }
  };

  const saveAllPhotos = async () => {
    if (capturedPhotos.length === 0) {
      Alert.alert('Aviso', 'Nenhuma foto foi capturada ainda');
      return;
    }

    try {
      for (const photo of capturedPhotos) {
        await savePhoto(photo);
      }
      Alert.alert('Sucesso', `${capturedPhotos.length} foto(s) salva(s) na galeria!`);
    } catch (error) {
      console.error('Erro ao salvar fotos:', error);
      Alert.alert('Erro', 'Erro ao salvar as fotos');
    }
  };

  const viewPhoto = (photo: CameraCapturedPicture) => {
    console.log('Abrindo modal para foto:', photo.uri);
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
  };

  const cameraRef = React.useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="camera-off" size={64} color="#666" />
          <Text variant="headlineSmall" style={styles.permissionTitle}>
            Permissão de Câmera Necessária
          </Text>
          <Text variant="bodyMedium" style={styles.permissionText}>
            Para tirar fotos, é necessário permitir o acesso à câmera.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permitir Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        flash={flash}
        ref={cameraRef}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#fff"
              onPress={onBack}
            />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                Tirar Foto - {obra.nome}
              </Text>
              <Text style={styles.headerSubtitle}>
                {obra.localizacao}
              </Text>
            </View>
          </View>
        </View>

        {/* Controles da Câmera */}
        <View style={styles.controls}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <MaterialCommunityIcons 
                name={flash === 'off' ? 'flash-off' : flash === 'on' ? 'flash' : 'flash-auto'} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <MaterialCommunityIcons name="camera-flip" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <View style={styles.galleryContainer}>
              {capturedPhotos.length > 0 && (
                <TouchableOpacity style={styles.galleryButton} onPress={() => {}}>
                  <MaterialCommunityIcons name="image-multiple" size={24} color="#fff" />
                  <Text style={styles.galleryText}>{capturedPhotos.length}</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]} 
              onPress={takePicture}
              disabled={isCapturing}
            >
              <MaterialCommunityIcons 
                name={isCapturing ? "loading" : "camera"} 
                size={32} 
                color="#fff" 
              />
            </TouchableOpacity>

            <View style={styles.saveContainer}>
              {capturedPhotos.length > 0 && (
                <TouchableOpacity style={styles.saveButton} onPress={saveAllPhotos}>
                  <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Lista de fotos capturadas */}
        {capturedPhotos.length > 0 && (
          <View style={styles.photosListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosList}
            >
              {capturedPhotos.map((photo, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.photoItem}
                  onPress={() => viewPhoto(photo)}
                >
                  <Image 
                    source={{ uri: photo.uri }} 
                    style={styles.photoThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.photoOverlay}>
                    <MaterialCommunityIcons name="eye" size={16} color="#fff" />
                    <Text style={styles.photoText}>Ver</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Informações da Obra */}
        <View style={styles.obraInfoContainer}>
          <Card style={styles.obraInfoCard}>
            <Card.Content>
              <View style={styles.obraInfoHeader}>
                <MaterialCommunityIcons name="hammer" size={20} color="#1976d2" />
                <Text variant="titleSmall" style={styles.obraInfoTitle}>
                  {obra.nome}
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.obraInfoDescription}>
                {obra.descricao}
              </Text>
              <View style={styles.obraInfoDetails}>
                <View style={styles.obraInfoRow}>
                  <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
                  <Text variant="bodySmall" style={styles.obraInfoText}>
                    {obra.localizacao}
                  </Text>
                </View>
                <View style={styles.obraInfoRow}>
                  <MaterialCommunityIcons name="calendar" size={14} color="#666" />
                  <Text variant="bodySmall" style={styles.obraInfoText}>
                    Iniciada em {obra.dataInicio}
                  </Text>
                </View>
                <View style={styles.obraInfoRow}>
                  <MaterialCommunityIcons name="account-group" size={14} color="#666" />
                  <Text variant="bodySmall" style={styles.obraInfoText}>
                    {obra.analistas} analista(s)
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </CameraView>

      {/* Modal de visualização de foto */}
      {showPhotoModal && selectedPhoto && (
        <View style={styles.photoModalOverlay}>
          <View style={styles.photoModalContainer}>
            <View style={styles.photoModalContent}>
              <View style={styles.photoModalHeader}>
                <Text variant="titleMedium" style={styles.photoModalTitle}>
                  Foto da Obra: {obra.nome}
                </Text>
                <TouchableOpacity onPress={closePhotoModal} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <Image 
                source={{ uri: selectedPhoto.uri }} 
                style={styles.photoModalImage}
                resizeMode="contain"
                onError={(error) => console.log('Erro ao carregar imagem:', error)}
                onLoad={() => console.log('Imagem carregada com sucesso')}
              />
              
              <View style={styles.photoModalActions}>
                <TouchableOpacity 
                  style={styles.photoModalButton}
                  onPress={() => {
                    console.log('Salvando foto:', selectedPhoto.uri);
                    savePhoto(selectedPhoto);
                    closePhotoModal();
                  }}
                >
                  <MaterialCommunityIcons name="download" size={20} color="#fff" />
                  <Text style={styles.photoModalButtonText}>Salvar na Galeria</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Debug info */}
      {showPhotoModal && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Modal ativo: {showPhotoModal ? 'SIM' : 'NÃO'}</Text>
          <Text style={styles.debugText}>Foto selecionada: {selectedPhoto ? 'SIM' : 'NÃO'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionTitle: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  permissionText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 2,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 25,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  galleryContainer: {
    flex: 1,
  },
  galleryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  galleryText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  captureButton: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  captureButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  saveButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 25,
  },
  photosListContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  photosList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  obraInfoContainer: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  obraInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 3,
  },
  obraInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  obraInfoTitle: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  obraInfoDescription: {
    color: '#666',
    marginBottom: 12,
  },
  obraInfoDetails: {
    gap: 4,
  },
  obraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  obraInfoText: {
    color: '#666',
    flex: 1,
  },
  photoModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalContainer: {
    backgroundColor: '#000',
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  photoModalContent: {
    flex: 1,
  },
  photoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  photoModalTitle: {
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 8,
  },
  photoModalImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#111',
  },
  photoModalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  photoModalButton: {
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  photoModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugInfo: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1001,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
