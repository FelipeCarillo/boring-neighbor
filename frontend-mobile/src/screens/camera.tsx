import React, { useState, useRef, useEffect } from "react";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
  CameraCapturedPicture,
} from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { 
  IconButton,
  Card,
  Avatar,
  Menu,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

interface CameraScreenProps {
  obra?: Obra;
  onBack?: () => void;
}

export default function CameraScreen({ obra, onBack }: CameraScreenProps = {}) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [flash, setFlash] = useState<FlashMode>("off");
  const [capturedPhotos, setCapturedPhotos] = useState<CameraCapturedPicture[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<CameraCapturedPicture | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(obra || null);
  const [obraMenuVisible, setObraMenuVisible] = useState(false);
  const camRef = useRef<CameraView | null>(null);

  // Lista de obras disponíveis
  const [obras] = useState<Obra[]>([
    {
      id: '1',
      nome: 'Estação São Paulo-Morumbi',
      descricao: 'Construção da estação São Paulo-Morumbi da Linha 4-Amarela',
      localizacao: 'Av. Morumbi, 1000 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '14/01/2024',
      progresso: 0.65,
      analistas: 2
    },
    {
      id: '2',
      nome: 'Túnel Avenida Paulista',
      descricao: 'Perfuração do túnel sob a Avenida Paulista',
      localizacao: 'Av. Paulista, 500 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '31/01/2024',
      progresso: 0.45,
      analistas: 1
    },
    {
      id: '3',
      nome: 'Estação Faria Lima',
      descricao: 'Reforma e ampliação da estação Faria Lima',
      localizacao: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '09/08/2023',
      progresso: 1.0,
      analistas: 2
    },
    {
      id: '4',
      nome: 'Viaduto do Chá',
      descricao: 'Manutenção estrutural do Viaduto do Chá',
      localizacao: 'Viaduto do Chá - São Paulo, SP',
      status: 'Pausada',
      dataInicio: '15/03/2023',
      progresso: 0.30,
      analistas: 1
    }
  ]);

  useEffect(() => {
    if (capturedPhotos.length > 0) {
      console.log("Fotos capturadas:", capturedPhotos.length);
    }
  }, [capturedPhotos]);
  
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="camera-off" size={64} color="#666" />
          <Text style={styles.permissionTitle}>
            Permissão da Câmera
          </Text>
          <Text style={styles.permissionMessage}>
            Precisamos da sua permissão para acessar a câmera
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlashMode() {
    setFlash((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  }

  async function takePicture() {
    if (camRef.current) {
      try {
        const photo = await camRef.current.takePictureAsync({ 
          quality: 0.8,
          base64: false 
        });
        
        if (photo && photo.uri) {
          setCapturedPhotos(prev => [...prev, photo]);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível capturar a foto");
        console.log("Erro ao capturar foto:", error);
      }
    }
  }

  function openGallery() {
    if (capturedPhotos.length > 0) {
      setIsGalleryMode(true);
      setIsModalVisible(true);
    }
  }

  function closeModal() {
    setIsModalVisible(false);
    setIsGalleryMode(false);
  }

  function removePhoto(index: number) {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
  }

  function clearAllPhotos() {
    setCapturedPhotos([]);
    closeModal();
  }

  async function saveAllPhotos() {
    if (capturedPhotos.length === 0) return;

    try {
      // Verificar permissão da galeria
      if (!mediaLibraryPermission?.granted) {
        const { status } = await requestMediaLibraryPermission();
        if (status !== 'granted') {
          Alert.alert(
            "Permissão Necessária",
            "Precisamos da permissão para salvar fotos na galeria.",
            [{ text: "OK" }]
          );
          return;
        }
      }

      // Salvar todas as fotos na galeria
      const savePromises = capturedPhotos.map(photo => 
        MediaLibrary.saveToLibraryAsync(photo.uri)
      );
      
      await Promise.all(savePromises);
      
      Alert.alert(
        "Fotos Salvas",
        `${capturedPhotos.length} foto(s) foram salvas com sucesso na galeria!`,
        [{ text: "OK", onPress: clearAllPhotos }]
      );
      
      console.log("Fotos salvas na galeria:", capturedPhotos.length);
    } catch (error) {
      console.error("Erro ao salvar fotos:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar as fotos na galeria.",
        [{ text: "OK" }]
      );
    }
  }

  const viewPhoto = (photo: CameraCapturedPicture) => {
    console.log('Abrindo modal para foto:', photo.uri);
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
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
  
  return (
    <View style={styles.container}>
      <CameraView
        ref={camRef}
        style={styles.camera}
        flash={flash}
        facing={facing}
      >
        {/* Header com título e botão voltar */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {onBack && (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                Tirar Foto - {selectedObra?.nome || 'Selecionar Obra'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {selectedObra?.localizacao || 'Selecione uma obra'}
              </Text>
            </View>
          </View>
        </View>

        {/* Card de informações da obra */}
        {selectedObra ? (
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <MaterialCommunityIcons name="hammer" size={20} color="#1976d2" />
              <Text style={styles.infoCardTitle}>{selectedObra.nome}</Text>
            </View>
            <Text style={styles.infoCardDescription}>{selectedObra.descricao}</Text>
            <View style={styles.infoCardDetails}>
              <View style={styles.infoDetailItem}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                <Text style={styles.infoDetailText}>{selectedObra.localizacao}</Text>
              </View>
              <View style={styles.infoDetailItem}>
                <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                <Text style={styles.infoDetailText}>Iniciada em {selectedObra.dataInicio}</Text>
              </View>
              <View style={styles.infoDetailItem}>
                <MaterialCommunityIcons name="account-group" size={16} color="#666" />
                <Text style={styles.infoDetailText}>{selectedObra.analistas} analista(s)</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.obraSelectorCard}>
            <Text style={styles.obraSelectorTitle}>Selecione uma obra</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.obraSelectorScroll}
            >
              {obras.map((obraItem) => (
                <TouchableOpacity
                  key={obraItem.id}
                  style={styles.obraSelectorItem}
                  onPress={() => setSelectedObra(obraItem)}
                >
                  <MaterialCommunityIcons name="hammer" size={16} color="#1976d2" />
                  <Text style={styles.obraSelectorText} numberOfLines={1}>
                    {obraItem.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Controles da câmera */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlashMode}>
            <MaterialCommunityIcons 
              name={flash === "off" ? "flash-off" : flash === "on" ? "flash" : "flash-auto"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <MaterialCommunityIcons name="camera-switch" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Botão da galeria */}
        {capturedPhotos.length > 0 && (
          <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
            <MaterialCommunityIcons name="image-multiple" size={20} color="#fff" />
            <Text style={styles.galleryButtonText}>{capturedPhotos.length}</Text>
          </TouchableOpacity>
        )}
      </CameraView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                {isGalleryMode ? `Galeria` : 'Foto Capturada'}
              </Text>
              {isGalleryMode && (
                <View style={styles.photoCountBadge}>
                  <Text style={styles.photoCountText}>{capturedPhotos.length}</Text>
                </View>
              )}
            </View>
            
            {isGalleryMode ? (
              <ScrollView 
                style={styles.galleryContainer}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.galleryScrollContent}
              >
                <View style={styles.galleryGrid}>
                  {capturedPhotos.map((photo, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.photoItem}
                      onPress={() => viewPhoto(photo)}
                    >
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.galleryImage}
                      />
                      <View style={styles.photoOverlay}>
                        <MaterialCommunityIcons name="eye" size={16} color="#fff" />
                        <Text style={styles.photoOverlayText}>Ver</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removePhoto(index)}
                      >
                        <MaterialCommunityIcons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              capturedPhotos.length > 0 && capturedPhotos[capturedPhotos.length - 1] ? (
                <Image
                  source={{ uri: capturedPhotos[capturedPhotos.length - 1].uri }}
                  style={styles.capturedImage}
                />
              ) : (
                <Text>Sem foto capturada</Text>
              )
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <MaterialCommunityIcons name="close" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
              
              {isGalleryMode ? (
                <>
                  <TouchableOpacity style={[styles.modalButton, styles.clearButton]} onPress={clearAllPhotos}>
                    <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Limpar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveAllPhotos}>
                    <MaterialCommunityIcons name="download" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Salvar Todas</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={openGallery}>
                  <MaterialCommunityIcons name="image-multiple" size={20} color="#fff" />
                  <Text style={styles.modalButtonText}>Ver Galeria</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de visualização de foto */}
      {showPhotoModal && selectedPhoto && (
        <View style={styles.photoModalOverlay}>
          <View style={styles.photoModalContainer}>
            <View style={styles.photoModalContent}>
              <View style={styles.photoModalHeader}>
                <Text style={styles.photoModalTitle}>
                  Foto da Obra: {selectedObra?.nome || 'Obra Selecionada'}
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
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  infoCard: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoCardDetails: {
    gap: 8,
  },
  infoDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoDetailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  obraSelectorCard: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  obraSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  obraSelectorScroll: {
    gap: 12,
  },
  obraSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  obraSelectorText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#f5f5f5',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  galleryContainer: {
    width: '100%',
    maxHeight: 500,
  },
  galleryScrollContent: {
    paddingBottom: 20,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  photoItem: {
    width: '45%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  photoCountBadge: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  photoCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  photoOverlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '600',
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
});