import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

/**
 * Hook para carregar recursos necessários antes de exibir o app
 */
export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Aqui você pode carregar fontes, imagens, etc
        // Por exemplo:
        // await Font.loadAsync({
        //   ...Ionicons.font,
        //   'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        // });

        // Por enquanto, apenas simula um pequeno delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}

