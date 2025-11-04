import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { progressService } from '../../src/services/progress';
import { Progress } from '../../src/types/progress';
import { theme } from '../../src/theme/theme';
import { formatDateTime, getDeviationLabel, getDeviationColor } from '../../src/utils/formatters';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';
import ErrorAlert from '../../src/components/common/ErrorAlert';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';

const { width } = Dimensions.get('window');

export default function ProgressDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!id) return;

    try {
      setError('');
      const data = await progressService.getById(id);
      setProgress(data);
    } catch (err: any) {
      console.error('Error loading progress:', err);
      setError('Erro ao carregar detalhes do progresso');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  if (loading) {
    return <LoadingSpinner message="Carregando progresso..." />;
  }

  if (error || !progress) {
    return (
      <View style={styles.errorContainer}>
        <ErrorAlert error={error || 'Progresso não encontrado'} onRetry={loadProgress} />
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="outlined"
          style={styles.backButton}
        />
      </View>
    );
  }

  const hasComparison = progress.deviation_score !== null && progress.bim_reference;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Detalhes do Progresso</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <Card style={styles.imageCard}>
          <Image
            source={{ uri: progress.presigned_url || progress.photo_url }}
            style={styles.mainImage}
            contentFit="contain"
            transition={200}
          />
        </Card>

        {/* Deviation Score */}
        {hasComparison && (
          <Card style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={styles.scoreIconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={32}
                  color={getDeviationColor(progress.deviation_score!)}
                />
              </View>
              <View style={styles.scoreContent}>
                <Text style={styles.scoreLabel}>Similaridade com BIM</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { color: getDeviationColor(progress.deviation_score!) },
                  ]}
                >
                  {Math.round(progress.deviation_score!)}%
                </Text>
                <Text style={styles.scoreQuality}>
                  {getDeviationLabel(progress.deviation_score!)}
                </Text>
              </View>
            </View>

            {progress.bim_reference && (
              <Button
                title={showComparison ? 'Ocultar Comparação' : 'Ver Comparação'}
                onPress={() => setShowComparison(!showComparison)}
                variant="outlined"
                fullWidth
                style={styles.comparisonButton}
              />
            )}
          </Card>
        )}

        {/* BIM Comparison */}
        {showComparison && progress.bim_reference && (
          <Card style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Imagem de Referência BIM</Text>
            <Image
              source={{ uri: progress.bim_reference.presigned_url }}
              style={styles.comparisonImage}
              contentFit="contain"
              transition={200}
            />
            <Text style={styles.comparisonSubtitle}>{progress.bim_reference.name}</Text>
          </Card>
        )}

        {/* Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informações</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="calendar" size={20} color={theme.colors.text.secondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Data e Hora</Text>
              <Text style={styles.infoValue}>{formatDateTime(progress.created_at)}</Text>
            </View>
          </View>

          {progress.user && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Registrado por</Text>
                <Text style={styles.infoValue}>{progress.user.name}</Text>
              </View>
            </View>
          )}

          {progress.construction && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="construct" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Obra</Text>
                <Text style={styles.infoValue}>{progress.construction.name}</Text>
              </View>
            </View>
          )}

          {progress.bim_reference && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="cube" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Referência BIM</Text>
                <Text style={styles.infoValue}>{progress.bim_reference.name}</Text>
              </View>
            </View>
          )}

          {progress.notes && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="document-text" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Observações</Text>
                <Text style={styles.infoValue}>{progress.notes}</Text>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...theme.textVariants.h6,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
  },
  imageCard: {
    padding: 0,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  scoreCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scoreIconContainer: {
    marginRight: theme.spacing.md,
  },
  scoreContent: {
    flex: 1,
  },
  scoreLabel: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  scoreValue: {
    ...theme.textVariants.h3,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreQuality: {
    ...theme.textVariants.body2,
    color: theme.colors.text.secondary,
  },
  comparisonButton: {
    marginTop: theme.spacing.sm,
  },
  comparisonCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  comparisonTitle: {
    ...theme.textVariants.subtitle1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  comparisonImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    marginBottom: theme.spacing.sm,
  },
  comparisonSubtitle: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
  },
  infoCard: {
    padding: theme.spacing.md,
  },
  cardTitle: {
    ...theme.textVariants.h6,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    ...theme.textVariants.body1,
    color: theme.colors.text.primary,
  },
});

