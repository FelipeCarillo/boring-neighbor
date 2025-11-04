import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/contexts/AuthContext';
import { constructionsService } from '../../src/services/constructions';
import { usersService } from '../../src/services/users';
import { Construction } from '../../src/types/construction';
import { theme } from '../../src/theme/theme';
import LoadingSpinner from '../../src/components/common/LoadingSpinner';
import EmptyState from '../../src/components/common/EmptyState';
import ErrorAlert from '../../src/components/common/ErrorAlert';
import Card from '../../src/components/common/Card';
import Toast from 'react-native-toast-message';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isSupervisor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    constructions: 0,
    users: 0,
  });
  const [recentConstructions, setRecentConstructions] = useState<Construction[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setError('');
      
      // Load constructions
      const constructionsData = await constructionsService.list();
      setRecentConstructions(constructionsData.slice(0, 3));

      const newStats = {
        constructions: constructionsData.length,
        users: 0,
      };

      // Load users count if supervisor
      if (isSupervisor()) {
        try {
          const usersData = await usersService.list();
          newStats.users = usersData.length;
        } catch (err) {
          console.error('Error loading users:', err);
        }
      }

      setStats(newStats);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isSupervisor]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const handleConstructionPress = (id: string) => {
    router.push(`/obra/${id}`);
  };

  const statsCards = [
    {
      title: 'Total de Obras',
      value: stats.constructions,
      icon: 'construct',
      color: theme.colors.primary,
      show: true,
    },
    {
      title: 'Usuários',
      value: stats.users,
      icon: 'people',
      color: theme.colors.success,
      show: isSupervisor(),
    },
  ].filter((card) => card.show);

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Bem-vindo, {user?.name}! 👋</Text>
        <Text style={styles.welcomeSubtext}>Acompanhe o andamento das obras</Text>
      </View>

      {error && (
        <ErrorAlert error={error} onRetry={loadDashboardData} />
      )}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {statsCards.map((card, index) => (
          <LinearGradient
            key={card.title}
            colors={[card.color, `${card.color}dd`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.statCard,
              statsCards.length === 1 && styles.statCardFull,
            ]}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name={card.icon as any} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statLabel}>{card.title}</Text>
            <Text style={styles.statValue}>{loading ? '...' : card.value}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Recent Constructions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Obras Recentes</Text>
            <Text style={styles.sectionSubtitle}>
              Acompanhe o andamento das suas obras
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/obras')}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>Ver Todas</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {recentConstructions.length > 0 ? (
          <View style={styles.constructionsList}>
            {recentConstructions.map((construction) => (
              <Card
                key={construction.id}
                onPress={() => handleConstructionPress(construction.id)}
                style={styles.constructionCard}
              >
                <View style={styles.constructionHeader}>
                  <View style={styles.constructionIconContainer}>
                    <Ionicons
                      name="construct"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.constructionName} numberOfLines={2}>
                    {construction.name}
                  </Text>
                </View>

                {construction.description && (
                  <Text style={styles.constructionDescription} numberOfLines={2}>
                    {construction.description}
                  </Text>
                )}

                <View style={styles.constructionInfo}>
                  <View style={styles.constructionInfoItem}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                    <Text style={styles.constructionInfoText} numberOfLines={1}>
                      {construction.location}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progresso</Text>
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
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card>
            <EmptyState
              icon="construct-outline"
              title="Nenhuma obra cadastrada"
              description="Comece criando sua primeira obra para acompanhar o progresso"
            />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  welcomeSection: {
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    ...theme.textVariants.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  welcomeSubtext: {
    ...theme.textVariants.body1,
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minHeight: 120,
    ...theme.shadows.md,
  },
  statCardFull: {
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    ...theme.textVariants.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    ...theme.textVariants.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.textVariants.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    ...theme.textVariants.body2,
    color: theme.colors.text.secondary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  seeAllText: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.primary,
  },
  constructionsList: {
    gap: theme.spacing.md,
  },
  constructionCard: {
    padding: theme.spacing.md,
  },
  constructionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  constructionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  constructionName: {
    flex: 1,
    ...theme.textVariants.subtitle1,
    color: theme.colors.text.primary,
  },
  constructionDescription: {
    ...theme.textVariants.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  constructionInfo: {
    marginBottom: theme.spacing.md,
  },
  constructionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  constructionInfoText: {
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
});

