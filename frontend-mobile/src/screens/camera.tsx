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
  Avatar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [flash, setFlash] = useState<FlashMode>("off");
  const [capturedPhotos, setCapturedPhotos] = useState<CameraCapturedPicture[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const camRef = useRef<CameraView | null>(null);

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
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Câmera</Text>
        <View style={styles.headerActions}>
          <IconButton
            icon={facing === "back" ? "camera-front" : "camera-rear"}
            size={24}
            iconColor="#fff"
            onPress={toggleCameraFacing}
          />
          <IconButton
            icon={
              flash === "off" ? "flash-off" : 
              flash === "on" ? "flash" : "flash-auto"
            }
            size={24}
            iconColor="#fff"
            onPress={toggleFlashMode}
          />
        </View>
      </View>

      {/* Contador de fotos */}
      {capturedPhotos.length > 0 && (
        <View style={styles.photoCounter}>
          <Text style={styles.photoCounterText}>
            {capturedPhotos.length} foto(s) capturada(s)
          </Text>
        </View>
      )}

      <CameraView
        ref={camRef}
        style={styles.camera}
        flash={flash}
        facing={facing}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
          
          {/* Botão da galeria */}
          {capturedPhotos.length > 0 && (
            <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
              <MaterialCommunityIcons name="image-multiple" size={24} color="#fff" />
              <Text style={styles.galleryButtonText}>Ver Fotos</Text>
            </TouchableOpacity>
          )}
        </View>
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
                    <View key={index} style={styles.photoItem}>
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.galleryImage}
                      />
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removePhoto(index)}
                      >
                        <MaterialCommunityIcons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
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
    </View>
  );
  }
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButtonContainer: {
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
  photoCounter: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  photoCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
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
    justifyContent: 'space-between',
    gap: 8,
  },
  photoItem: {
    width: '48%',
    aspectRatio: 1,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});