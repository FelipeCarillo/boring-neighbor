import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';
import { constructionsService } from '../../src/services/constructions';
import { progressService } from '../../src/services/progress';
import { theme } from '../../src/theme/theme';
import { FILE_LIMITS } from '../../src/utils/constants';
import Button from '../../src/components/common/Button';
import Card from '../../src/components/common/Card';
import Toast from 'react-native-toast-message';

export default function CameraCaptureScreen() {
  const { constructionId } = useLocalSearchParams<{ constructionId: string }>();
  const router = useRouter();
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [bimReferenceId, setBimReferenceId] = useState<string>('');
  const [bimReferences, setBimReferences] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBIMReferences();
  }, [constructionId]);

  const loadBIMReferences = async () => {
    if (!constructionId) {
      setLoading(false);
      return;
    }

    try {
      const construction = await constructionsService.getById(constructionId);
      if (construction.bim_references && construction.bim_references.length > 0) {
        setBimReferences(construction.bim_references);
        if (construction.bim_references.length === 1) {
          setBimReferenceId(construction.bim_references[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading BIM references:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={theme.colors.text.disabled} />
        <Text style={styles.permissionTitle}>Permissão de Câmera Necessária</Text>
        <Text style={styles.permissionText}>
          Precisamos de acesso à câmera para registrar o progresso das obras
        </Text>
        <Button
          title="Conceder Permissão"
          onPress={requestPermission}
          style={styles.permissionButton}
        />
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="outlined"
        />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: FILE_LIMITS.IMAGE_QUALITY,
      });

      // Compress image
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1920 } }], // Max width 1920px
        {
          compress: FILE_LIMITS.IMAGE_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setCapturedPhoto(manipResult.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao capturar foto',
      });
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setNotes('');
  };

  const handleUpload = async () => {
    if (!capturedPhoto || !constructionId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('construction_id', constructionId);
      
      if (bimReferenceId) {
        formData.append('bim_reference_id', bimReferenceId);
      }
      
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }

      // Add photo
      const filename = `progress_${Date.now()}.jpg`;
      formData.append('photo', {
        uri: capturedPhoto,
        type: 'image/jpeg',
        name: filename,
      } as any);

      await progressService.register(formData, (progress) => {
        setUploadProgress(progress);
      });

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Progresso registrado com sucesso!',
      });

      router.back();
    } catch (error: any) {
      console.error('Error uploading progress:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.response?.data?.detail || 'Erro ao registrar progresso',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.reviewContainer}
          contentContainerStyle={styles.reviewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.reviewHeader}>
            <TouchableOpacity onPress={retakePhoto} disabled={uploading}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.reviewTitle}>Confirmar Foto</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Photo Preview */}
          <Card style={styles.photoPreviewCard}>
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.photoPreview}
              contentFit="cover"
            />
          </Card>

          {/* Form */}
          <Card style={styles.formCard}>
            {/* BIM Reference Selector */}
            {bimReferences.length > 1 && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Referência BIM (Opcional)</Text>
                <View style={styles.bimSelectorContainer}>
                  {bimReferences.map((ref) => (
                    <TouchableOpacity
                      key={ref.id}
                      style={[
                        styles.bimOption,
                        bimReferenceId === ref.id && styles.bimOptionSelected,
                      ]}
                      onPress={() => setBimReferenceId(ref.id)}
                      disabled={uploading}
                    >
                      <Text
                        style={[
                          styles.bimOptionText,
                          bimReferenceId === ref.id && styles.bimOptionTextSelected,
                        ]}
                      >
                        {ref.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.bimOption,
                      !bimReferenceId && styles.bimOptionSelected,
                    ]}
                    onPress={() => setBimReferenceId('')}
                    disabled={uploading}
                  >
                    <Text
                      style={[
                        styles.bimOptionText,
                        !bimReferenceId && styles.bimOptionTextSelected,
                      ]}
                    >
                      Nenhuma
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Notes */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Observações (Opcional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Adicione observações sobre o progresso..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                editable={!uploading}
                placeholderTextColor={theme.colors.text.hint}
              />
            </View>

            {/* Upload Progress */}
            {uploading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${uploadProgress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  Enviando... {uploadProgress}%
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <Button
                title="Refazer"
                onPress={retakePhoto}
                variant="outlined"
                disabled={uploading}
                style={styles.button}
              />
              <Button
                title={uploading ? 'Enviando...' : 'Enviar'}
                onPress={handleUpload}
                loading={uploading}
                disabled={uploading}
                style={styles.button}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        enableTorch={flash === 'on'}
      >
        {/* Header */}
        <View style={styles.cameraHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.cameraControls}>
          {/* Flash Toggle */}
          <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
            <Ionicons
              name={flash === 'on' ? 'flash' : 'flash-off'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {/* Flip Camera */}
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.textVariants.body1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  permissionTitle: {
    ...theme.textVariants.h5,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    ...theme.textVariants.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  permissionButton: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
  },
  reviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  reviewContent: {
    padding: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  reviewTitle: {
    ...theme.textVariants.h6,
    color: theme.colors.text.primary,
  },
  photoPreviewCard: {
    padding: 0,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  formCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  bimSelectorContainer: {
    gap: theme.spacing.sm,
  },
  bimOption: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceVariant,
  },
  bimOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}15`,
  },
  bimOptionText: {
    ...theme.textVariants.body1,
    color: theme.colors.text.primary,
  },
  bimOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.textVariants.body1,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surfaceVariant,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  progressText: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
});

