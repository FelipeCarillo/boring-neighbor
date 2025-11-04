import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import Button from './Button';

interface ErrorAlertProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  title = 'Erro',
  onRetry,
  retryLabel = 'Tentar novamente',
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message || 'Ocorreu um erro inesperado';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{errorMessage}</Text>
      </View>
      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="outlined"
          color="error"
          size="small"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    ...theme.textVariants.subtitle2,
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  message: {
    ...theme.textVariants.body2,
    color: theme.colors.text.primary,
  },
  button: {
    marginLeft: theme.spacing.sm,
  },
});

export default ErrorAlert;

