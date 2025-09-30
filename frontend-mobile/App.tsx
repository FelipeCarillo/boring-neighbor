// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Routes from './src/routes';

const theme = {
  ...MD3LightTheme,
  // opcional: personalize cores aqui
};

export default function App() {
  return (
    <PaperProvider
      theme={theme}
      // Faz o Paper resolver strings como 'home', 'camera', etc. usando MaterialCommunityIcons
      settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}
    >
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </PaperProvider>
  );
}