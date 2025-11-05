import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { constructionsAPI } from '../../src/api/constructions';
import { Construction } from '../../src/types';
import { METRO_COLORS, CONSTRUCTION_STATUS, CONSTRUCTION_STATUS_LABELS } from '../../src/constants';
import { ConstructionCard } from '../../src/components/ConstructionCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';

type FilterType = 'all' | 'assigned';
type StatusFilter = string | null;
type SortType = 'name' | 'date' | 'progress';
type ProgressFilter = 'all' | '0-25' | '25-50' | '50-75' | '75-100';

export default function ConstructionsListScreen() {
  const [allConstructions, setAllConstructions] = useState<Construction[]>([]);
  const [filteredConstructions, setFilteredConstructions] = useState<Construction[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');
  const [sortType, setSortType] = useState<SortType>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const loadConstructions = async () => {
    try {
      const data = await constructionsAPI.list();
      setAllConstructions(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConstructions();
    }
  }, [user]);

  const stats = useMemo(() => {
    const total = allConstructions.length;
    const inProgress = allConstructions.filter(c => c.status === CONSTRUCTION_STATUS.IN_PROGRESS).length;
    const completed = allConstructions.filter(c => c.status === CONSTRUCTION_STATUS.COMPLETED).length;
    const planned = allConstructions.filter(c => c.status === CONSTRUCTION_STATUS.PLANNED).length;
    const onHold = allConstructions.filter(c => c.status === CONSTRUCTION_STATUS.ON_HOLD).length;

    return { total, inProgress, completed, planned, onHold };
  }, [allConstructions]);

  useEffect(() => {
    let filtered = [...allConstructions];

    if (filter === 'assigned' && user?.id) {
      filtered = filtered.filter(construction => 
        construction.assigned_users?.some(assignedUser => assignedUser.id === user.id)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(construction =>
        construction.name.toLowerCase().includes(query) ||
        construction.location?.toLowerCase().includes(query) ||
        construction.description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(construction => construction.status === statusFilter      );
    }

    if (progressFilter !== 'all') {
      filtered = filtered.filter(construction => {
        const progress = construction.progress_percentage || 0;
        switch (progressFilter) {
          case '0-25':
            return progress >= 0 && progress <= 25;
          case '25-50':
            return progress > 25 && progress <= 50;
          case '50-75':
            return progress > 50 && progress <= 75;
          case '75-100':
            return progress > 75 && progress <= 100;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortType) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        case 'progress':
          const progressA = a.progress_percentage || 0;
          const progressB = b.progress_percentage || 0;
          return progressB - progressA;
        default:
          return 0;
      }
    });

    setFilteredConstructions(filtered);
  }, [allConstructions, filter, searchQuery, statusFilter, progressFilter, sortType, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConstructions();
  };

  const handleConstructionPress = (construction: Construction) => {
    router.push({
      pathname: '/construction/[id]' as any,
      params: { 
        id: construction.id.toString(),
        constructionData: JSON.stringify(construction),
      },
    });
  };

  const isAssignedToUser = (construction: Construction): boolean => {
    if (!user?.id) return false;
    return construction.assigned_users?.some(
      assignedUser => assignedUser.id === user.id
    ) || false;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setProgressFilter('all');
    setSortType('name');
  };

  const hasActiveFilters = searchQuery || statusFilter || progressFilter !== 'all' || sortType !== 'name';

  if (loading) {
    return <LoadingSpinner message="Carregando obras..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Obras</Text>
          <Text style={styles.subtitle}>
            {filteredConstructions.length} de {allConstructions.length} obra(s)
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterIconButton}>
          <MaterialIcons name="tune" size={24} color={METRO_COLORS.PRIMARY} />
          {hasActiveFilters && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {allConstructions.length > 0 && (
        <View style={styles.statsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.statsScroll}
          >
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: METRO_COLORS.SUCCESS }]}>{stats.inProgress}</Text>
              <Text style={styles.statLabel}>Em Andamento</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: METRO_COLORS.SUCCESS }]}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: METRO_COLORS.PRIMARY }]}>{stats.planned}</Text>
              <Text style={styles.statLabel}>Planejadas</Text>
            </View>
            {stats.onHold > 0 && (
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: METRO_COLORS.WARNING }]}>{stats.onHold}</Text>
                <Text style={styles.statLabel}>Em Espera</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, localização..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={METRO_COLORS.TEXT_SECONDARY}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color={METRO_COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        )}
      </View>

      {filteredConstructions.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'Nenhuma obra encontrada' : 'Nenhuma obra disponível'}
          description={
            hasActiveFilters
              ? 'Tente ajustar os filtros ou buscar por outros termos.'
              : 'Não há obras cadastradas no sistema.'
          }
          actionLabel={hasActiveFilters ? 'Limpar Filtros' : 'Atualizar'}
          onAction={hasActiveFilters ? clearFilters : onRefresh}
        />
      ) : (
        <ScrollView
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredConstructions.map((construction) => (
            <View key={construction.id}>
              <ConstructionCard
                construction={construction}
                onPress={() => handleConstructionPress(construction)}
              />
              {isAssignedToUser(construction) && (
                <View style={styles.assignedBadge}>
                  <MaterialIcons name="check-circle" size={14} color={METRO_COLORS.SUCCESS} />
                  <Text style={styles.assignedBadgeText}>Atribuída a você</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros e Ordenação</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialIcons name="close" size={24} color={METRO_COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Status</Text>
                <View style={styles.filterOptions}>
                  {Object.entries(CONSTRUCTION_STATUS).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.filterOption,
                        statusFilter === value && styles.filterOptionActive,
                      ]}
                      onPress={() => setStatusFilter(statusFilter === value ? null : value)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          statusFilter === value && styles.filterOptionTextActive,
                        ]}
                      >
                        {CONSTRUCTION_STATUS_LABELS[value as keyof typeof CONSTRUCTION_STATUS_LABELS]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Progresso</Text>
                <View style={styles.filterOptions}>
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: '0-25', label: '0-25%' },
                    { value: '25-50', label: '25-50%' },
                    { value: '50-75', label: '50-75%' },
                    { value: '75-100', label: '75-100%' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        progressFilter === option.value && styles.filterOptionActive,
                      ]}
                      onPress={() => setProgressFilter(option.value as ProgressFilter)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          progressFilter === option.value && styles.filterOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Ordenar por</Text>
                <View style={styles.filterOptions}>
                  {[
                    { value: 'name', label: 'Nome (A-Z)', icon: 'sort-by-alpha' },
                    { value: 'date', label: 'Data (Mais Recente)', icon: 'access-time' },
                    { value: 'progress', label: 'Progresso (Maior)', icon: 'trending-up' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        sortType === option.value && styles.filterOptionActive,
                      ]}
                      onPress={() => setSortType(option.value as SortType)}
                    >
                      <MaterialIcons
                        name={option.icon as any}
                        size={16}
                        color={sortType === option.value ? '#FFFFFF' : METRO_COLORS.TEXT_SECONDARY}
                      />
                      <Text
                        style={[
                          styles.filterOptionText,
                          sortType === option.value && styles.filterOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={clearFilters}
              >
                <Text style={styles.modalButtonSecondaryText}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.modalButtonPrimaryText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: METRO_COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: METRO_COLORS.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: METRO_COLORS.BORDER,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  filterIconButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: METRO_COLORS.SECONDARY,
  },
  statsContainer: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: METRO_COLORS.BORDER,
    paddingVertical: 12,
  },
  statsScroll: {
    paddingHorizontal: 16,
    gap: 16,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: METRO_COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: METRO_COLORS.SURFACE,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: METRO_COLORS.SUCCESS + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -8,
    marginLeft: 16,
    marginBottom: 8,
    gap: 4,
  },
  assignedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: METRO_COLORS.SUCCESS,
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
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: METRO_COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
    gap: 6,
  },
  filterOptionActive: {
    backgroundColor: METRO_COLORS.PRIMARY,
    borderColor: METRO_COLORS.PRIMARY,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
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
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
