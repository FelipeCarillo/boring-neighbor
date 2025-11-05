import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { constructionsAPI } from '../../src/api/constructions';
import { progressAPI } from '../../src/api/progress';
import { Construction, Progress, BIMReference } from '../../src/types';
import { METRO_COLORS, CONSTRUCTION_STATUS, CONSTRUCTION_STATUS_LABELS, CONSTRUCTION_STATUS_COLORS } from '../../src/constants';
import { PhotoCapture } from '../../src/components/PhotoCapture';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ConstructionDetailScreen() {
  const { id, constructionData } = useLocalSearchParams<{ id: string; constructionData?: string }>();
  const [construction, setConstruction] = useState<Construction | null>(null);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
  const [selectedBimFilter, setSelectedBimFilter] = useState<string | null>(null);
  const [selectedBimReference, setSelectedBimReference] = useState<BIMReference | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const loadConstruction = async () => {
    if (!id) return;
    
    if (constructionData) {
      try {
        const parsed = JSON.parse(constructionData);
        setConstruction(parsed);
        setLoading(false);
      } catch (e) {
      }
    }
    
    try {
      const data = await constructionsAPI.getById(id);
      setConstruction(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadProgress = async () => {
    if (!id) return;
    
    try {
      const data = await progressAPI.listByConstruction(id);
      setProgressList(data);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (id) {
      loadConstruction();
      loadProgress();
    }
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadConstruction(), loadProgress()]);
  };

  const handleSuccess = () => {
    loadConstruction();
    loadProgress();
  };

  const replaceLocalhostUrl = (url: string | undefined): string | undefined => {
    if (!url) return url;
    return url.replace(/localhost|127\.0\.0\.1/g, '10.2.0.177');
  };

  const groupedProgress = useMemo(() => {
    const groups: Record<string, { bim: BIMReference | null; entries: Progress[] }> = {};
    
    progressList.forEach((progress) => {
      const bimId = progress.bim_reference_id || 'sem-bim';
      if (!groups[bimId]) {
        groups[bimId] = {
          bim: progress.bim_reference || null,
          entries: [],
        };
      }
      groups[bimId].entries.push(progress);
    });
    
    Object.values(groups).forEach((group) => {
      group.entries.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    });
    
    return groups;
  }, [progressList]);

  const filteredProgress = useMemo(() => {
    if (!selectedBimFilter || selectedBimFilter === 'all') {
      return progressList;
    }
    return progressList.filter((p) => p.bim_reference_id === selectedBimFilter);
  }, [progressList, selectedBimFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    return CONSTRUCTION_STATUS_COLORS[status as keyof typeof CONSTRUCTION_STATUS_COLORS] || METRO_COLORS.TEXT_SECONDARY;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case CONSTRUCTION_STATUS.PLANNED:
        return 'schedule';
      case CONSTRUCTION_STATUS.IN_PROGRESS:
        return 'build';
      case CONSTRUCTION_STATUS.COMPLETED:
        return 'check-circle';
      case CONSTRUCTION_STATUS.ON_HOLD:
        return 'pause-circle';
      case CONSTRUCTION_STATUS.CANCELLED:
        return 'cancel';
      default:
        return 'construction';
    }
  };

  const getDeviationColor = (score?: number) => {
    if (!score) return METRO_COLORS.TEXT_SECONDARY;
    if (score >= 90) return METRO_COLORS.SUCCESS;
    if (score >= 70) return METRO_COLORS.WARNING;
    return METRO_COLORS.SECONDARY;
  };

  const getDeviationLabel = (score?: number) => {
    if (!score && score !== 0) return '';
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Regular';
    return 'Precisa Atenção';
  };

  if (loading) {
    return <LoadingSpinner message="Carregando obra..." />;
  }

  if (!construction) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={METRO_COLORS.TEXT_SECONDARY} />
          <Text style={styles.errorText}>Obra não encontrada</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {construction.progress_percentage !== undefined && (
          <View style={[styles.section, styles.firstSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Progresso Geral</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(construction.progress_percentage)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.max(0, construction.progress_percentage))}%`,
                    backgroundColor: construction.progress_percentage >= 75
                      ? METRO_COLORS.SUCCESS
                      : construction.progress_percentage >= 50
                      ? METRO_COLORS.WARNING
                      : METRO_COLORS.PRIMARY,
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          {construction.location && (
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>{construction.location}</Text>
            </View>
          )}

          {construction.start_date && (
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>
                Início: {formatDate(construction.start_date)}
              </Text>
            </View>
          )}

          {construction.end_date && (
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>
                Término: {formatDate(construction.end_date)}
              </Text>
            </View>
          )}

          {construction.description && (
            <View style={styles.infoRow}>
              <MaterialIcons name="description" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
              <Text style={styles.infoText}>{construction.description}</Text>
            </View>
          )}
        </View>

        {construction.assigned_users && construction.assigned_users.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Equipe</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{construction.assigned_users.length}</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.usersScroll}>
              {construction.assigned_users.map((assignedUser) => (
                <View key={assignedUser.id} style={styles.userCard}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {assignedUser.nome?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <Text style={styles.userName} numberOfLines={1}>{assignedUser.nome || 'Usuário'}</Text>
                  <Text style={styles.userRole}>{assignedUser.role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {construction.bim_references && construction.bim_references.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Referências BIM</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{construction.bim_references.length}</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bimScroll}>
              {construction.bim_references.map((bim, index) => (
                <TouchableOpacity
                  key={bim.id}
                  style={styles.bimCard}
                  onPress={() => {
                    if (bim.presigned_url) {
                      setSelectedBimReference(bim);
                    }
                  }}
                >
                  {bim.presigned_url ? (
                    <Image
                      source={{ uri: replaceLocalhostUrl(bim.presigned_url)! }}
                      style={styles.bimImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.bimImagePlaceholder}>
                      <MaterialIcons name="image" size={32} color={METRO_COLORS.TEXT_SECONDARY} />
                    </View>
                  )}
                  <View style={styles.bimCardContent}>
                    <Text style={styles.bimName} numberOfLines={1}>
                      BIM #{index + 1}
                    </Text>
                    {bim.description && (
                      <Text style={styles.bimDescription} numberOfLines={2}>
                        {bim.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <PhotoCapture construction={construction} onSuccess={handleSuccess} />
        </View>

        {progressList.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Histórico de Progresso</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{progressList.length}</Text>
              </View>
            </View>

            {Object.keys(groupedProgress).length > 1 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedBimFilter === 'all' && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedBimFilter('all')}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedBimFilter === 'all' && styles.filterChipTextActive,
                  ]}>
                    Todas ({progressList.length})
                  </Text>
                </TouchableOpacity>
                {Object.entries(groupedProgress).map(([bimId, group]) => (
                  <TouchableOpacity
                    key={bimId}
                    style={[
                      styles.filterChip,
                      selectedBimFilter === bimId && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedBimFilter(bimId)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedBimFilter === bimId && styles.filterChipTextActive,
                    ]}>
                      {group.bim?.description || `BIM ${bimId.substring(0, 8)}`} ({group.entries.length})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {filteredProgress.map((progress) => (
              <TouchableOpacity
                key={progress.id}
                style={styles.progressCard}
                onPress={() => setSelectedProgress(progress)}
              >
                {progress.presigned_url && (
                  <Image
                    source={{ uri: replaceLocalhostUrl(progress.presigned_url)! }}
                    style={styles.progressImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.progressCardContent}>
                  <View style={styles.progressCardHeader}>
                    {progress.bim_reference && (
                      <View style={styles.progressBadge}>
                        <MaterialIcons name="image" size={14} color={METRO_COLORS.PRIMARY} />
                        <Text style={styles.progressBadgeText} numberOfLines={1}>
                          {progress.bim_reference.description || 'Referência BIM'}
                        </Text>
                      </View>
                    )}
                    {progress.deviation_score !== undefined && progress.deviation_score !== null && (
                      <View style={[
                        styles.deviationBadge,
                        { backgroundColor: getDeviationColor(progress.deviation_score) + '20' }
                      ]}>
                        <MaterialIcons 
                          name="trending-up" 
                          size={14} 
                          color={getDeviationColor(progress.deviation_score)} 
                        />
                        <Text style={[
                          styles.deviationText,
                          { color: getDeviationColor(progress.deviation_score) }
                        ]}>
                          {progress.deviation_score.toFixed(1)}%
                        </Text>
                      </View>
                    )}
                  </View>
                  {progress.notes && (
                    <Text style={styles.progressNotes} numberOfLines={2}>{progress.notes}</Text>
                  )}
                  <Text style={styles.progressDate}>{formatDateTime(progress.created_at)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedProgress !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProgress(null)}
      >
        {selectedProgress && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes do Progresso</Text>
                <TouchableOpacity onPress={() => setSelectedProgress(null)}>
                  <MaterialIcons name="close" size={24} color={METRO_COLORS.TEXT_PRIMARY} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {selectedProgress.presigned_url && (
                  <Image
                    source={{ uri: replaceLocalhostUrl(selectedProgress.presigned_url)! }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}

                {selectedProgress.deviation_score !== undefined && selectedProgress.deviation_score !== null && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Índice de Conformidade</Text>
                    <View style={styles.deviationInfo}>
                      <View style={[
                        styles.deviationBadgeLarge,
                        { backgroundColor: getDeviationColor(selectedProgress.deviation_score) + '20' }
                      ]}>
                        <Text style={[
                          styles.deviationTextLarge,
                          { color: getDeviationColor(selectedProgress.deviation_score) }
                        ]}>
                          {selectedProgress.deviation_score.toFixed(2)}%
                        </Text>
                      </View>
                      <Text style={styles.deviationLabel}>
                        {getDeviationLabel(selectedProgress.deviation_score)}
                      </Text>
                    </View>
                    <Text style={styles.deviationDescription}>
                      Baseado na comparação SSIM com a imagem BIM de referência
                    </Text>
                  </View>
                )}

                {selectedProgress.bim_reference && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Referência BIM</Text>
                    <View style={styles.bimReferenceCard}>
                      <Text style={styles.bimReferenceText}>
                        {selectedProgress.bim_reference.description || 'Referência BIM'}
                      </Text>
                      {selectedProgress.bim_reference.presigned_url && (
                        <TouchableOpacity
                          style={styles.viewBimButton}
                          onPress={() => Linking.openURL(replaceLocalhostUrl(selectedProgress.bim_reference!.presigned_url!)!)}
                        >
                          <MaterialIcons name="open-in-new" size={16} color={METRO_COLORS.PRIMARY} />
                          <Text style={styles.viewBimButtonText}>Ver Referência</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}

                {selectedProgress.notes && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Observações</Text>
                    <Text style={styles.modalNotes}>{selectedProgress.notes}</Text>
                  </View>
                )}

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Informações</Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Data e Hora:</Text>
                    <Text style={styles.modalInfoValue}>
                      {formatDateTime(selectedProgress.created_at)}
                    </Text>
                  </View>
                  {selectedProgress.registered_by && (
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Registrado por:</Text>
                      <Text style={styles.modalInfoValue}>{selectedProgress.registered_by}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      <Modal
        visible={selectedBimReference !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedBimReference(null)}
      >
        {selectedBimReference && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedBimReference.description || 'Referência BIM'}
                </Text>
                <TouchableOpacity onPress={() => setSelectedBimReference(null)}>
                  <MaterialIcons name="close" size={24} color={METRO_COLORS.TEXT_PRIMARY} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {selectedBimReference.presigned_url && (
                  <Image
                    source={{ uri: replaceLocalhostUrl(selectedBimReference.presigned_url)! }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}

                {selectedBimReference.description && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Descrição</Text>
                    <Text style={styles.modalNotes}>{selectedBimReference.description}</Text>
                  </View>
                )}

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Informações</Text>
                  {selectedBimReference.created_at && (
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Adicionado em:</Text>
                      <Text style={styles.modalInfoValue}>
                        {formatDateTime(selectedBimReference.created_at)}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    if (selectedBimReference.presigned_url) {
                      Linking.openURL(replaceLocalhostUrl(selectedBimReference.presigned_url)!);
                    }
                  }}
                >
                  <MaterialIcons name="open-in-new" size={20} color={METRO_COLORS.PRIMARY} />
                  <Text style={styles.modalButtonSecondaryText}>Abrir em Navegador</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={() => setSelectedBimReference(null)}
                >
                  <Text style={styles.modalButtonPrimaryText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: METRO_COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: METRO_COLORS.SURFACE,
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: METRO_COLORS.BORDER,
  },
  firstSection: {
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: METRO_COLORS.PRIMARY,
  },
  progressBar: {
    height: 12,
    backgroundColor: METRO_COLORS.BORDER,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: METRO_COLORS.TEXT_PRIMARY,
    lineHeight: 22,
  },
  countBadge: {
    backgroundColor: METRO_COLORS.PRIMARY + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
  },
  usersScroll: {
    marginTop: 8,
  },
  userCard: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: METRO_COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 11,
    color: METRO_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  bimScroll: {
    marginTop: 8,
  },
  bimCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: METRO_COLORS.BACKGROUND,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
  },
  bimImage: {
    width: '100%',
    height: 120,
    backgroundColor: METRO_COLORS.BORDER,
  },
  bimImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: METRO_COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bimCardContent: {
    padding: 12,
  },
  bimName: {
    fontSize: 14,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  bimDescription: {
    fontSize: 12,
    color: METRO_COLORS.TEXT_SECONDARY,
    lineHeight: 16,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: METRO_COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: METRO_COLORS.PRIMARY,
    borderColor: METRO_COLORS.PRIMARY,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  progressCard: {
    backgroundColor: METRO_COLORS.BACKGROUND,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
  },
  progressImage: {
    width: '100%',
    height: 120,
    backgroundColor: METRO_COLORS.BORDER,
  },
  progressCardContent: {
    padding: 10,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: METRO_COLORS.PRIMARY + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    flex: 1,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
    flex: 1,
  },
  deviationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  deviationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressNotes: {
    fontSize: 13,
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 6,
    lineHeight: 18,
  },
  progressDate: {
    fontSize: 11,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_SECONDARY,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: METRO_COLORS.PRIMARY + '20',
    borderRadius: 8,
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
    maxHeight: '90%',
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
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: METRO_COLORS.BORDER,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  deviationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  deviationBadgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deviationTextLarge: {
    fontSize: 18,
    fontWeight: '700',
  },
  deviationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  deviationDescription: {
    fontSize: 12,
    color: METRO_COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  bimReferenceCard: {
    backgroundColor: METRO_COLORS.BACKGROUND,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
  },
  bimReferenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  viewBimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  viewBimButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
  },
  modalNotes: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_PRIMARY,
    lineHeight: 22,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  modalInfoValue: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_PRIMARY,
    flex: 1,
    textAlign: 'right',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: METRO_COLORS.BORDER,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  modalButtonSecondary: {
    backgroundColor: METRO_COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
  },
  modalButtonPrimary: {
    backgroundColor: METRO_COLORS.PRIMARY,
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
