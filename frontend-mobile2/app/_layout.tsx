import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../src/contexts/AuthContext';
import { METRO_COLORS } from '../src/constants';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: METRO_COLORS.SURFACE,
          },
          headerTintColor: METRO_COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            presentation: 'fullScreenModal',
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="construction/[id]" 
          options={{ 
            title: 'Detalhes da Obra',
            presentation: 'card',
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
