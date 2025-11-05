import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { METRO_COLORS, CONSTRUCTION_STATUS_COLORS, CONSTRUCTION_STATUS_LABELS } from '../constants';
import { Construction } from '../types';

interface ConstructionCardProps {
  construction: Construction;
  onPress: () => void;
}

export const ConstructionCard = ({ construction, onPress }: ConstructionCardProps) => {
  const statusColor = CONSTRUCTION_STATUS_COLORS[construction.status as keyof typeof CONSTRUCTION_STATUS_COLORS] || METRO_COLORS.TEXT_SECONDARY;
  const statusLabel = CONSTRUCTION_STATUS_LABELS[construction.status as keyof typeof CONSTRUCTION_STATUS_LABELS] || construction.status;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusIcon = () => {
    switch (construction.status) {
      case 'PLANNED':
        return 'schedule';
      case 'IN_PROGRESS':
        return 'build';
      case 'COMPLETED':
        return 'check-circle';
      case 'ON_HOLD':
        return 'pause-circle';
      case 'CANCELLED':
        return 'cancel';
      default:
        return 'construction';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name={getStatusIcon()} size={20} color={statusColor} style={styles.statusIcon} />
          <Text style={styles.title} numberOfLines={2}>{construction.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      
      {construction.location && (
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={16} color={METRO_COLORS.TEXT_SECONDARY} />
          <Text style={styles.location} numberOfLines={1}>{construction.location}</Text>
        </View>
      )}

      {construction.description && (
        <Text style={styles.description} numberOfLines={2}>{construction.description}</Text>
      )}

      <View style={styles.infoRow}>
        {construction.start_date && (
          <View style={styles.infoItem}>
            <MaterialIcons name="event" size={14} color={METRO_COLORS.TEXT_SECONDARY} />
            <Text style={styles.infoText}>{formatDate(construction.start_date)}</Text>
          </View>
        )}
        {construction.assigned_users && construction.assigned_users.length > 0 && (
          <View style={styles.infoItem}>
            <MaterialIcons name="people" size={14} color={METRO_COLORS.TEXT_SECONDARY} />
            <Text style={styles.infoText}>{construction.assigned_users.length} usuário(s)</Text>
          </View>
        )}
      </View>
      
      {construction.progress_percentage !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressText}>{Math.round(construction.progress_percentage)}%</Text>
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
                    : METRO_COLORS.PRIMARY
                }
              ]} 
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 8,
  },
  statusIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  location: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  progressBar: {
    height: 8,
    backgroundColor: METRO_COLORS.BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
  },
});

