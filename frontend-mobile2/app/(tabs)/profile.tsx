import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { METRO_COLORS } from '../../src/constants';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return null;
  }

  // Função auxiliar para obter a inicial do nome
  const getInitial = () => {
    if (user.nome && user.nome.length > 0) {
      return user.nome.charAt(0).toUpperCase();
    }
    return 'U'; // Default para usuário
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        <Text style={styles.name}>{user.nome || 'Usuário'}</Text>
        <Text style={styles.role}>{user.role || 'OPERADOR'}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Registro:</Text>
          <Text style={styles.value}>{user.registro || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Função:</Text>
          <Text style={styles.value}>{user.role || '-'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: METRO_COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: METRO_COLORS.SURFACE,
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: METRO_COLORS.BORDER,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: METRO_COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  section: {
    backgroundColor: METRO_COLORS.SURFACE,
    marginTop: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: METRO_COLORS.BORDER,
  },
  label: {
    fontSize: 16,
    color: METRO_COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: METRO_COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: METRO_COLORS.SECONDARY,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

