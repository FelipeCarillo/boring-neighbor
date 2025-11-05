import { Tabs, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { METRO_COLORS } from '../../src/constants';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (segments[0] === '(tabs)') {
      }
    }
  }, [isAuthenticated, loading, segments]);

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: METRO_COLORS.PRIMARY,
        tabBarInactiveTintColor: METRO_COLORS.TEXT_SECONDARY,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: METRO_COLORS.SURFACE,
          borderTopColor: METRO_COLORS.BORDER,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="constructions"
        options={{
          title: 'Obras',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="construction" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Esconder esta tab
        }}
      />
    </Tabs>
  );
}
