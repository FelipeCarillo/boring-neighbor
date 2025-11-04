import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { theme } from '../../src/theme/theme';
import Button from '../../src/components/common/Button';
import { validateRegistro, validateRequired } from '../../src/utils/formatters';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [registro, setRegistro] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validações
    if (!validateRequired(registro)) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Registro é obrigatório',
      });
      return;
    }

    if (!validateRegistro(registro)) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Registro deve ter 7 dígitos',
      });
      return;
    }

    if (!validateRequired(password)) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Senha é obrigatória',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await login(registro, password);

      if (!result.success) {
        Toast.show({
          type: 'error',
          text1: 'Erro no Login',
          text2: result.error || 'Erro ao fazer login',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao fazer login. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroChange = (text: string) => {
    // Remove non-numeric characters and limit to 7 digits
    const numericValue = text.replace(/\D/g, '').substring(0, 7);
    setRegistro(numericValue);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0455BF', '#00903E']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIconContainer}>
                <Ionicons name="cube-outline" size={64} color="#FFFFFF" />
              </View>
              <Text style={styles.logoTitle}>Metro SP</Text>
              <Text style={styles.logoSubtitle}>Sistema de Gestão de Obras</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.welcomeText}>Bem-vindo!</Text>
              <Text style={styles.instructionText}>
                Entre com suas credenciais para continuar
              </Text>

              {/* Registro Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Registro</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="0000000"
                    value={registro}
                    onChangeText={handleRegistroChange}
                    keyboardType="numeric"
                    maxLength={7}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    placeholderTextColor={theme.colors.text.hint}
                  />
                </View>
                <Text style={styles.helperText}>Seu registro de 7 dígitos</Text>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    placeholderTextColor={theme.colors.text.hint}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <Button
                title={loading ? 'Entrando...' : 'Entrar'}
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                fullWidth
                style={styles.loginButton}
              />

              {/* Footer */}
              <Text style={styles.footerText}>© 2024 Metrô de São Paulo</Text>
            </View>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
  },
  content: {
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  logoIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.xl,
  },
  logoTitle: {
    ...theme.textVariants.h2,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  logoSubtitle: {
    ...theme.textVariants.body1,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows['2xl'],
  },
  welcomeText: {
    ...theme.textVariants.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  instructionText: {
    ...theme.textVariants.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: theme.spacing.md,
    height: theme.dimensions.inputHeight,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: '400',
  },
  passwordInput: {
    flex: 1,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  helperText: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  loginButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  footerText: {
    ...theme.textVariants.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

