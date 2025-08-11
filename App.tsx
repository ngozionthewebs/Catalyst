import React from 'react';
import { useFonts } from 'expo-font';
import LoadingScreen from './src/screens/LoadingScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  // The main App component renders the AppNavigator which contains our navigation logic
  // This allows us to switch between different screens like Login and Home
    const [fontsLoaded] = useFonts({
      'Yellowtail': require('./assets/fonts/Yellowtail-Regular.ttf'),
      'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
      'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
      'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
      'Quicksand-Semibold': require('./assets/fonts/Quicksand-Semibold.ttf'),
      'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
    });

    // While the fonts are loading, we can show a loading screen or nothing.
    if (!fontsLoaded) {
      return <LoadingScreen />;
    }

    return <AppNavigator />;
}