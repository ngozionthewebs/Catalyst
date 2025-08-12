import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Import all screens
import SplashScreen from '../screens/SplashScreen'; // The new splash screen
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoadingScreen from '../screens/LoadingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DisciplineScreen from '../screens/DisciplineScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import MainTabNavigator from './MainTabNavigator';

// Define all possible screens
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  Discipline: undefined;
  HowItWorks: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// --- Navigator for the Authentication Flow ---
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Discipline" component={DisciplineScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HowItWorks" component={HowItWorksScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// --- Navigator for the Main App Flow ---
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  // This state now tracks the combined loading of fonts AND our minimum splash time.
  const [isAppReady, setIsAppReady] = useState(false); 

  useEffect(() => {
    // This listener checks for the user's login state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // We set a timer to ensure the splash screen is visible for at least 3 seconds.
    setTimeout(() => {
      setIsAppReady(true); // After 3 seconds, we declare the app "ready".
    }, 5000); // 3000 milliseconds = 3 seconds

    // Cleanup the auth listener when the component unmounts.
    return unsubscribe;
  }, []);

  // While the app is NOT ready, show the splash screen.
  if (!isAppReady) {
    return <SplashScreen />;
  }

  // Once the app is ready, render the correct navigator.
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;