import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { constructionsService } from '../../src/services/constructions';
import { progressService } from '../../src/services/progress';
import { Construction } from '../../src/types/construction';
import { Progress } from '../../src/types/progress';
import { theme } from '../../src/theme/theme';
import { CONSTRUCTION_STATUS_LABELS, CONSTRUCTION_STATUS_COLORS } from '../../src/utils/constants';
import { formatDate } from '../../src/utils/formatters';
import { useAuth } from '../../src/contexts/AuthContext';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';
import EmptyState from '../../src/components/common/EmptyState';
import ErrorAlert from '../../src/components/common/ErrorAlert';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function ObraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isSupervisor } = useAuth();
  
  const [construction, setConstruction] = useState<Construction | null>(null);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'progress'>('info');

  const loadData = useCallback(async () => {
    if (!id) return;
    
    try {
      setError('');
      const [constructionData, progressData] = await Promise.all([
        constructionsService.getById(id),
        progressService.listByConstruction(id),
      ]);
      
      setConstruction(constructionData);
      setProgressList(progressData);
    } catch (err: any) {
      console.error('Error loading construction detail:', err);
      setError('Erro ao carregar detalhes da obra');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleCapturePhoto = () => {
    router.push(`/progresso/camera?constructionId=${id}`);
  };

  const handleProgressPress = (progressId: string) => {
    router.push(`/progresso/${progressId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando obra..." />;
  }

  if (error || !construction) {
    return (
      <View style={styles.errorContainer}>
        <ErrorAlert error={error || 'Obra não encontrada'} onRetry={loadData} />
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="outlined"
          style={styles.backButton}
        />
      </View>
    );
  }

  const statusColor = CONSTRUCTION_STATUS_COLORS[construction.status];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {construction.name}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progresso Total da Obra</Text>
            <Text style={styles.progressValue}>
              {Math.round(construction.progress_percentage)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${construction.progress_percentage}%`,
                  backgroundColor:
                    construction.progress_percentage === 100
                      ? theme.colors.success
                      : construction.progress_percentage >= 70
                      ? theme.colors.primary
                      : theme.colors.warning,
                },
              ]}
            />
          </View>
        </Card>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.tabActive]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
              Informações
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'progress' && styles.tabActive]}
            onPress={() => setActiveTab('progress')}
          >
            <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>
              Progresso ({progressList.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'info' ? (
          <Card style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {CONSTRUCTION_STATUS_LABELS[construction.status]}
                </Text>
              </View>
            </View>

            {construction.description && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Descrição</Text>
                <Text style={styles.infoValue}>{construction.description}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Local</Text>
              <View style={styles.infoValueRow}>
                <Ionicons name="location" size={16} color={theme.colors.primary} />
                <Text style={styles.infoValue}>{construction.location}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data de Início</Text>
              <View style={styles.infoValueRow}>
                <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                <Text style={styles.infoValue}>{formatDate(construction.start_date)}</Text>
              </View>
            </View>

            {construction.end_date && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data de Término</Text>
                <View style={styles.infoValueRow}>
                  <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                  <Text style={styles.infoValue}>{formatDate(construction.end_date)}</Text>
                </View>
              </View>
            )}

            {construction.assigned_users && construction.assigned_users.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Usuários Atribuídos</Text>
                <View style={styles.usersList}>
                  {construction.assigned_users.map((user) => (
                    <View key={user.id} style={styles.userItem}>
                      <Ionicons name="person" size={16} color={theme.colors.text.secondary} />
                      <Text style={styles.userName}>{user.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>
        ) : (
          <>
            {progressList.length > 0 ? (
              <View style={styles.progressGrid}>
                {progressList.map((progress) => (
                  <TouchableOpacity
                    key={progress.id}
                    style={styles.progressItem}
                    onPress={() => handleProgressPress(progress.id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: progress.presigned_url || progress.photo_url }}
                      style={styles.progressImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.progressOverlay}>
                      <Text style={styles.progressDate}>
                        {formatDate(progress.created_at, true)}
                      </Text>
                      {progress.deviation_score !== null && (
                        <View style={styles.scoreContainer}>
                          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                          <Text style={styles.scoreText}>
                            {Math.round(progress.deviation_score)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Card>
                <EmptyState
                  icon="camera-outline"
                  title="Nenhum progresso registrado"
                  description="Comece registrando fotos do progresso da obra"
                  actionLabel="Capturar Foto"
                  onAction={handleCapturePhoto}
                />
              </Card>
            )}
          </>
        )}
      </ScrollView>

      {/* FAB - Capture Photo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCapturePhoto}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
  },
  progressCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: `${theme.colors.primary}10`,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    ...theme.textVariants.subtitle1,
    color: theme.colors.text.primary,
  },
  progressValue: {
    ...theme.textVariants.h4,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  progressBar: {
    height: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    padding: theme.spacing.md,
  },
  infoRow: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  infoValue: {
    ...theme.textVariants.body1,
    color: theme.colors.text.primary,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    ...theme.textVariants.body2,
    fontWeight: '600',
  },
  usersList: {
    gap: theme.spacing.xs,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  userName: {
    ...theme.textVariants.body2,
    color: theme.colors.text.primary,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  progressItem: {
    width: (width - theme.spacing.md * 3) / 2,
    height: (width - theme.spacing.md * 3) / 2,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  progressImage: {
    width: '100%',
    height: '100%',
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressDate: {
    ...theme.textVariants.caption,
    color: '#FFFFFF',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    ...theme.textVariants.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.xl,
  },
});

