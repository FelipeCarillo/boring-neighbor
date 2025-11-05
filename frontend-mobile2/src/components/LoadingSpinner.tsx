import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { METRO_COLORS } from '../constants';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={METRO_COLORS.PRIMARY} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: METRO_COLORS.TEXT_SECONDARY,
  },
});

