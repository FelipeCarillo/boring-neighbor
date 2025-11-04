import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import useCachedResources from '../src/hooks/useCachedResources';
import LoadingSpinner from '../src/components/common/LoadingSpinner';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to tabs if authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="obra/[id]" options={{ headerShown: false }} />
        <Stack.Screen 
          name="progresso/camera" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="progresso/[id]" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
