import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { usersService } from '../../src/services/users';
import { theme } from '../../src/theme/theme';
import { getInitials } from '../../src/utils/formatters';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import Toast from 'react-native-toast-message';

export default function PerfilScreen() {
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!name.trim() || !email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nome e email são obrigatórios',
      });
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await usersService.update(user.id, {
        name: name.trim(),
        email: email.trim(),
      });

      await updateUser(updatedUser);
      setEditing(false);
      
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Perfil atualizado com sucesso!',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.response?.data?.detail || 'Erro ao atualizar perfil',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Todos os campos são obrigatórios',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'As senhas não coincidem',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'A senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    setLoading(true);
    try {
      await usersService.updatePassword(user.id, currentPassword, newPassword);
      
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Senha alterada com sucesso!',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.response?.data?.detail || 'Erro ao alterar senha',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setName(user?.name || '');
    setEmail(user?.email || '');
  };

  const handleCancelPasswordChange = () => {
    setChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>

      {/* Profile Information */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Informações do Perfil</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Ionicons name="pencil" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                editable={!loading}
                placeholderTextColor={theme.colors.text.hint}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu.email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={theme.colors.text.hint}
              />
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                onPress={handleCancelEdit}
                variant="outlined"
                disabled={loading}
                style={styles.button}
              />
              <Button
                title="Salvar"
                onPress={handleSaveProfile}
                loading={loading}
                disabled={loading}
                style={styles.button}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="id-card-outline" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Registro</Text>
                <Text style={styles.infoValue}>{user.registro}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="shield-outline" size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Função</Text>
                <Text style={styles.infoValue}>{user.role}</Text>
              </View>
            </View>
          </>
        )}
      </Card>

      {/* Change Password */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Alterar Senha</Text>
        </View>

        {changingPassword ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha Atual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Sua senha atual"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={theme.colors.text.hint}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nova Senha</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={theme.colors.text.hint}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Digite novamente"
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={theme.colors.text.hint}
              />
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                onPress={handleCancelPasswordChange}
                variant="outlined"
                disabled={loading}
                style={styles.button}
              />
              <Button
                title="Alterar"
                onPress={handleChangePassword}
                loading={loading}
                disabled={loading}
                style={styles.button}
              />
            </View>
          </>
        ) : (
          <Button
            title="Alterar Senha"
            onPress={() => setChangingPassword(true)}
            variant="outlined"
            fullWidth
          />
        )}
      </Card>

      {/* Logout Button */}
      <Button
        title="Sair"
        onPress={handleLogout}
        color="error"
        fullWidth
        style={styles.logoutButton}
      />

      <Text style={styles.version}>Versão 1.0.0</Text>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  avatarText: {
    ...theme.textVariants.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  userName: {
    ...theme.textVariants.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userRole: {
    ...theme.textVariants.body1,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  card: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.textVariants.h6,
    color: theme.colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.textVariants.body1,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surfaceVariant,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  button: {
    flex: 1,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  version: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});

