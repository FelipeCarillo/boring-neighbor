import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { METRO_COLORS } from '../src/constants';
import { LoadingSpinner } from '../src/components/LoadingSpinner';

export default function LoginScreen() {
  const [registro, setRegistro] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!registro.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(registro.trim(), password);
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro de Login', result.error || 'Não foi possível fazer login.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.detail || 'Ocorreu um erro inesperado.';
      Alert.alert(
        'Erro de Conexão', 
        errorMessage + '\n\nVerifique:\n- Se o servidor está rodando\n- Se está usando o IP correto da máquina\n- Sua conexão de rede'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fazendo login..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🚇</Text>
          <Text style={styles.title}>Metrô SP</Text>
          <Text style={styles.subtitle}>Gestão de Obras</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Registro</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu registro"
            value={registro}
            onChangeText={setRegistro}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Apenas Operadores e Supervisores podem acessar
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: METRO_COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: METRO_COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: METRO_COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: METRO_COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: METRO_COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: METRO_COLORS.BORDER,
  },
  loginButton: {
    backgroundColor: METRO_COLORS.PRIMARY,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    fontSize: 14,
    color: METRO_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 32,
  },
});

