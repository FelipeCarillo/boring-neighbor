import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { constructionsService } from '../../src/services/constructions';
import { Construction } from '../../src/types/construction';
import { theme } from '../../src/theme/theme';
import { CONSTRUCTION_STATUS_LABELS, CONSTRUCTION_STATUS_COLORS } from '../../src/utils/constants';
import { formatDate } from '../../src/utils/formatters';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';
import EmptyState from '../../src/components/common/EmptyState';
import ErrorAlert from '../../src/components/common/ErrorAlert';
import Card from '../../src/components/common/Card';

export default function ObrasScreen() {
  const router = useRouter();
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [filteredConstructions, setFilteredConstructions] = useState<Construction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadConstructions = useCallback(async () => {
    try {
      setError('');
      const data = await constructionsService.list();
      setConstructions(data);
      setFilteredConstructions(data);
    } catch (err: any) {
      console.error('Error loading constructions:', err);
      setError('Erro ao carregar obras');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadConstructions();
  }, [loadConstructions]);

  useEffect(() => {
    // Filter constructions based on search query
    if (searchQuery.trim() === '') {
      setFilteredConstructions(constructions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = constructions.filter(
        (construction) =>
          construction.name.toLowerCase().includes(query) ||
          construction.location?.toLowerCase().includes(query) ||
          construction.description?.toLowerCase().includes(query)
      );
      setFilteredConstructions(filtered);
    }
  }, [searchQuery, constructions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadConstructions();
  }, [loadConstructions]);

  const handleConstructionPress = (id: string) => {
    router.push(`/obra/${id}`);
  };

  const renderConstructionCard = ({ item }: { item: Construction }) => {
    const statusColor = CONSTRUCTION_STATUS_COLORS[item.status];

    return (
      <Card
        onPress={() => handleConstructionPress(item.id)}
        style={styles.constructionCard}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="construct" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.constructionName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusColor },
                ]}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {CONSTRUCTION_STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>
        </View>

        {item.description && (
          <Text style={styles.constructionDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons
              name="location-outline"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.infoText}>
              Início: {formatDate(item.start_date)}
            </Text>
          </View>

          {item.assigned_users && item.assigned_users.length > 0 && (
            <View style={styles.infoItem}>
              <Ionicons
                name="people-outline"
                size={16}
                color={theme.colors.text.secondary}
              />
              <Text style={styles.infoText}>
                {item.assigned_users.length}{' '}
                {item.assigned_users.length === 1 ? 'usuário' : 'usuários'}
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso Total</Text>
            <Text style={styles.progressValue}>
              {Math.round(item.progress_percentage)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.progress_percentage}%`,
                  backgroundColor:
                    item.progress_percentage === 100
                      ? theme.colors.success
                      : item.progress_percentage >= 70
                      ? theme.colors.primary
                      : theme.colors.warning,
                },
              ]}
            />
          </View>
        </View>
      </Card>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Carregando obras..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      {constructions.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar obras por nome, local ou descrição..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.text.hint}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <ErrorAlert error={error} onRetry={loadConstructions} />
        </View>
      )}

      {!error && constructions.length === 0 ? (
        <EmptyState
          icon="construct-outline"
          title="Nenhuma obra cadastrada"
          description="Não há obras disponíveis no momento"
        />
      ) : filteredConstructions.length === 0 && searchQuery ? (
        <EmptyState
          icon="search-outline"
          title="Nenhuma obra encontrada"
          description={`Nenhuma obra corresponde à busca "${searchQuery}"`}
        />
      ) : (
        <FlatList
          data={filteredConstructions}
          renderItem={renderConstructionCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.textVariants.body1,
    color: theme.colors.text.primary,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  errorContainer: {
    padding: theme.spacing.md,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  constructionCard: {
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
  },
  constructionName: {
    ...theme.textVariants.subtitle1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
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
    ...theme.textVariants.caption,
    fontWeight: '600',
  },
  constructionDescription: {
    ...theme.textVariants.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  infoContainer: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    flex: 1,
    ...theme.textVariants.body2,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  progressValue: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  separator: {
    height: theme.spacing.md,
  },
});

