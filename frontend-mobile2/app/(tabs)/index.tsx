import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { constructionsAPI } from '../../src/api/constructions';
import { progressAPI } from '../../src/api/progress';
import { Construction, Progress } from '../../src/types';
import { METRO_COLORS, CONSTRUCTION_STATUS } from '../../src/constants';
import { ConstructionCard } from '../../src/components/ConstructionCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2 - 8;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  onPress?: () => void;
}

const StatCard = ({ title, value, icon, color, onPress }: StatCardProps) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[styles.statCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statCardIcon}>
          <MaterialIcons name={icon} size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.statCardValue}>{value}</Text>
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
    </CardComponent>
  );
};

export default function DashboardScreen() {
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [allConstructions, setAllConstructions] = useState<Construction[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    totalProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout, isSupervisor } = useAuth();
  const router = useRouter();

  const loadDashboardData = async () => {
    try {
      const data = await constructionsAPI.list();
      setAllConstructions(data);
      
      const sortedConstructions = [...data].sort((a, b) => {
        const progressA = a.progress_percentage || 0;
        const progressB = b.progress_percentage || 0;
        return progressB - progressA;
      });
      
      setConstructions(sortedConstructions);

      const inProgress = data.filter(
        c => c.status === CONSTRUCTION_STATUS.IN_PROGRESS
      ).length;
      
      const completed = data.filter(
        c => c.status === CONSTRUCTION_STATUS.COMPLETED
      ).length;

      const totalProgress = data.length > 0
        ? Math.round(
            data.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) /
            data.length
          )
        : 0;

      setStats({
        total: data.length,
        inProgress,
        completed,
        totalProgress,
      });
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
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

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Olá, {user?.nome || 'Usuário'}</Text>
          <Text style={styles.role}>{user?.role || 'OPERADOR'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color={METRO_COLORS.SECONDARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Total de Obras"
              value={stats.total}
              icon="construction"
              color={METRO_COLORS.PRIMARY}
            />
            <StatCard
              title="Em Andamento"
              value={stats.inProgress}
              icon="trending-up"
              color={METRO_COLORS.SUCCESS}
            />
            <StatCard
              title="Concluídas"
              value={stats.completed}
              icon="check-circle"
              color={METRO_COLORS.SUCCESS}
            />
            <StatCard
              title="Progresso Médio"
              value={`${stats.totalProgress}%`}
              icon="speed"
              color={METRO_COLORS.WARNING}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Obras Recentes</Text>
            {constructions.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/constructions' as any)}>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>

          {constructions.length === 0 ? (
            <EmptyState
              title="Nenhuma obra encontrada"
              description="Não há obras cadastradas no sistema."
              actionLabel="Atualizar"
              onAction={onRefresh}
            />
          ) : (
            <View style={styles.constructionsList}>
              {constructions.slice(0, 3).map((construction) => (
                <ConstructionCard
                  key={construction.id}
                  construction={construction}
                  onPress={() => handleConstructionPress(construction)}
                />
              ))}
              
              {constructions.length > 3 && (
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => router.push('/(tabs)/constructions' as any)}
                >
                  <Text style={styles.moreButtonText}>
                    Ver mais {constructions.length - 3} obra(s)
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color={METRO_COLORS.PRIMARY} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
  },
  role: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: METRO_COLORS.PRIMARY,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCardContent: {
    alignItems: 'flex-start',
  },
  statCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statCardTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  constructionsList: {
    gap: 12,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: METRO_COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
    marginTop: 8,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: METRO_COLORS.PRIMARY,
    marginRight: 8,
  },
});
