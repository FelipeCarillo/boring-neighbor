import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { METRO_COLORS, API_BASE_URL } from '../constants';
import { progressAPI } from '../api/progress';
import { Construction, BIMReference } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface PhotoCaptureProps {
  construction: Construction;
  onSuccess?: () => void;
}

export const PhotoCapture = ({ construction, onSuccess }: PhotoCaptureProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBimReference, setSelectedBimReference] = useState<BIMReference | null>(null);
  const [showBimSelector, setShowBimSelector] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const hasBIMReferences = construction.bim_references && construction.bim_references.length > 0;
  const bimReferences = construction.bim_references || [];

  useEffect(() => {
    if (bimReferences.length === 1 && !selectedBimReference) {
      setSelectedBimReference(bimReferences[0]);
    }
  }, [bimReferences]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permitir acesso à câmera para tirar fotos.');
        return false;
      }
    }
    return true;
  };

  const showBIMRequiredAlert = () => {
    Alert.alert(
      'Referência BIM necessária',
      'Esta obra não possui referências BIM cadastradas. É necessário cadastrar pelo menos uma referência BIM antes de enviar fotos para análise.'
    );
  };

  const takePhoto = async () => {
    if (!hasBIMReferences) {
      showBIMRequiredAlert();
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const pickFromGallery = async () => {
    if (!hasBIMReferences) {
      showBIMRequiredAlert();
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map(asset => asset.uri);
        setPhotos([...photos, ...uris]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto.');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSelectBimReference = () => {
    if (photos.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos uma foto antes de selecionar a referência BIM.');
      return;
    }
    setShowBimSelector(true);
  };

  const handleBimSelected = (bim: BIMReference) => {
    setSelectedBimReference(bim);
    setShowBimSelector(false);
  };

  const uploadPhotos = async () => {
    if (!hasBIMReferences) {
      showBIMRequiredAlert();
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos uma foto.');
      return;
    }

    if (!selectedBimReference) {
      Alert.alert('Atenção', 'Selecione uma referência BIM antes de enviar.');
      setShowBimSelector(true);
      return;
    }

    setLoading(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const uri of photos) {
        try {
          const formData = new FormData();
          
          const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          
          let fileUri = uri;
          if (Platform.OS === 'android' && !uri.startsWith('file://') && !uri.startsWith('http')) {
            fileUri = `file://${uri}`;
          }
          
          formData.append('file', {
            uri: fileUri,
            type: type,
            name: filename,
          } as any);
          
          formData.append('construction_id', String(construction.id));
          formData.append('bim_reference_id', String(selectedBimReference.id));
          
          if (notes.trim()) {
            formData.append('notes', notes.trim());
          }

          await progressAPI.register(formData);
          successCount++;
        } catch (error: any) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        Alert.alert(
          'Sucesso',
          `${successCount} foto(s) enviada(s) com sucesso!${errorCount > 0 ? `\n${errorCount} foto(s) falharam.` : ''}`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                setPhotos([]);
                setSelectedBimReference(null);
                setNotes('');
                setShowNotesInput(false);
                onSuccess?.();
              }
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível enviar as fotos. Tente novamente.'        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.detail || 'Não foi possível enviar as fotos. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Enviando fotos..." />;
  }

  if (!hasBIMReferences) {
    return (
      <View style={styles.container}>
        <View style={styles.warningContainer}>
          <MaterialIcons name="warning" size={48} color={METRO_COLORS.WARNING} />
          <Text style={styles.warningTitle}>Referência BIM Necessária</Text>
          <Text style={styles.warningText}>
            Esta obra não possui referências BIM cadastradas.{'\n\n'}
            Para enviar fotos para análise, é necessário cadastrar pelo menos uma referência BIM primeiro.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capturar Fotos para Análise BIM</Text>
      <Text style={styles.subtitle}>{construction.name}</Text>

      {bimReferences.length > 0 && (
        <View style={styles.bimInfo}>
          <MaterialIcons name="info" size={16} color={METRO_COLORS.PRIMARY} />
          <Text style={styles.bimInfoText}>
            {bimReferences.length} referência(s) BIM disponível(is)
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={pickFromGallery}>
          <MaterialIcons name="photo-library" size={20} color={METRO_COLORS.PRIMARY} />
          <Text style={styles.buttonTextSecondary}>Galeria</Text>
        </TouchableOpacity>
      </View>

      {photos.length > 0 && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.photoCount}>{photos.length} foto(s) selecionada(s)</Text>

          <View style={styles.bimSelectorContainer}>
            <Text style={styles.bimSelectorLabel}>Referência BIM *</Text>
            <TouchableOpacity
              style={[
                styles.bimSelectorButton,
                !selectedBimReference && styles.bimSelectorButtonEmpty
              ]}
              onPress={handleSelectBimReference}
            >
              {selectedBimReference ? (
                <View style={styles.bimSelectorContent}>
                  {selectedBimReference.presigned_url && (
                    <Image
                      source={{ uri: selectedBimReference.presigned_url }}
                      style={styles.bimSelectorImage}
                    />
                  )}
                  <View style={styles.bimSelectorTextContainer}>
                    <Text style={styles.bimSelectorText}>
                      BIM #{bimReferences.findIndex(b => b.id === selectedBimReference.id) + 1}
                    </Text>
                    {selectedBimReference.description && (
                      <Text style={styles.bimSelectorDescription} numberOfLines={1}>
                        {selectedBimReference.description}
                      </Text>
                    )}
                  </View>
                  <MaterialIcons name="check-circle" size={20} color={METRO_COLORS.SUCCESS} />
                </View>
              ) : (
                <View style={styles.bimSelectorContent}>
                  <MaterialIcons name="image" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
                  <Text style={styles.bimSelectorPlaceholder}>Selecione a referência BIM</Text>
                  <MaterialIcons name="chevron-right" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {showNotesInput ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Observações (Opcional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Adicione observações sobre o progresso..."
                placeholderTextColor={METRO_COLORS.TEXT_SECONDARY}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles.notesRemoveButton}
                onPress={() => {
                  setNotes('');
                  setShowNotesInput(false);
                }}
              >
                <Text style={styles.notesRemoveButtonText}>Remover observações</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.notesAddButton}
              onPress={() => setShowNotesInput(true)}
            >
              <MaterialIcons name="note-add" size={16} color={METRO_COLORS.PRIMARY} />
              <Text style={styles.notesAddButtonText}>Adicionar observações</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.uploadButton,
              !selectedBimReference && styles.uploadButtonDisabled
            ]}
            onPress={uploadPhotos}
            disabled={!selectedBimReference}
          >
            <Text style={styles.uploadButtonText}>
              Enviar {photos.length} foto(s) para Análise
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={showBimSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBimSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Referência BIM</Text>
              <TouchableOpacity onPress={() => setShowBimSelector(false)}>
                <MaterialIcons name="close" size={24} color={METRO_COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {bimReferences.map((bim, index) => (
                <TouchableOpacity
                  key={bim.id}
                  style={[
                    styles.bimOption,
                    selectedBimReference?.id === bim.id && styles.bimOptionSelected
                  ]}
                  onPress={() => handleBimSelected(bim)}
                >
                  {bim.presigned_url ? (
                    <Image
                      source={{ uri: bim.presigned_url }}
                      style={styles.bimOptionImage}
                    />
                  ) : (
                    <View style={styles.bimOptionImagePlaceholder}>
                      <MaterialIcons name="image" size={32} color={METRO_COLORS.TEXT_SECONDARY} />
                    </View>
                  )}
                  <View style={styles.bimOptionContent}>
                    <Text style={styles.bimOptionTitle}>BIM #{index + 1}</Text>
                    {bim.description && (
                      <Text style={styles.bimOptionDescription} numberOfLines={2}>
                        {bim.description}
                      </Text>
                    )}
                  </View>
                  {selectedBimReference?.id === bim.id && (
                    <MaterialIcons name="check-circle" size={24} color={METRO_COLORS.SUCCESS} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: METRO_COLORS.BACKGROUND,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: METRO_COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  bimInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: METRO_COLORS.PRIMARY + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  bimInfoText: {
    flex: 1,
    fontSize: 13,
    color: METRO_COLORS.PRIMARY,
    fontWeight: '600',
  },
  warningContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: METRO_COLORS.SURFACE,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: METRO_COLORS.WARNING,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 15,
    color: METRO_COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: METRO_COLORS.PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonSecondary: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderWidth: 2,
    borderColor: METRO_COLORS.PRIMARY,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: METRO_COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  photosContainer: {
    marginBottom: 16,
  },
  photoWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: METRO_COLORS.BORDER,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: METRO_COLORS.SECONDARY,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  photoCount: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  bimSelectorContainer: {
    marginBottom: 16,
  },
  bimSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  bimSelectorButton: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderWidth: 2,
    borderColor: METRO_COLORS.BORDER,
    borderRadius: 12,
    padding: 12,
  },
  bimSelectorButtonEmpty: {
    borderColor: METRO_COLORS.WARNING,
    borderStyle: 'dashed',
  },
  bimSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bimSelectorImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: METRO_COLORS.BORDER,
  },
  bimSelectorTextContainer: {
    flex: 1,
  },
  bimSelectorText: {
    fontSize: 15,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  bimSelectorDescription: {
    fontSize: 12,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  bimSelectorPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: METRO_COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: METRO_COLORS.TEXT_PRIMARY,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  notesAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  notesAddButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
  },
  notesRemoveButton: {
    alignSelf: 'flex-start',
  },
  notesRemoveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: METRO_COLORS.SECONDARY,
  },
  uploadButton: {
    backgroundColor: METRO_COLORS.SUCCESS,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: METRO_COLORS.TEXT_SECONDARY,
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: METRO_COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  modalBody: {
    padding: 20,
  },
  bimOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: METRO_COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: METRO_COLORS.BORDER,
    gap: 12,
  },
  bimOptionSelected: {
    borderColor: METRO_COLORS.SUCCESS,
    backgroundColor: METRO_COLORS.SUCCESS + '10',
  },
  bimOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: METRO_COLORS.BORDER,
  },
  bimOptionImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: METRO_COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bimOptionContent: {
    flex: 1,
  },
  bimOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  bimOptionDescription: {
    fontSize: 13,
    color: METRO_COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
});
