import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the auth service from Firebase
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Import all our screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoadingScreen from '../screens/LoadingScreen'; // Import the new loading screen
import WelcomeScreen from '../screens/WelcomeScreen';
import DisciplineScreen from '../screens/DisciplineScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';

// We can re-use this from our other files
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Loading: undefined; // Add Loading to our param list
  Welcome: undefined;
  Discipline: undefined;
  HowItWorks: undefined;
  Main: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // State to hold the user object if they are logged in.
  const [user, setUser] = useState<User | null>(null);
  // State to determine if we are done checking for a user.
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect hook is the core of our session persistence.
  useEffect(() => {
    // onAuthStateChanged is a real-time listener from Firebase.
    // It fires once on app startup, and again any time the user logs in or out.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // If a user is found, we set them in state; otherwise, it's null.
      setIsLoading(false); // We're done checking, so we can stop showing the loading screen.
    });

    // The cleanup function unsubscribes from the listener when the component unmounts.
    return unsubscribe;
  }, []);

  // If we are still checking for a user, show the loading screen.
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* We now use conditional rendering to decide which screens to show. */}
        {user ? (
          // If a user object exists, they are logged in.
          // We show only the main app screens.
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          // If there is no user, they are logged out.
          // We show only the auth and onboarding screens.
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Discipline" component={DisciplineScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HowItWorks" component={HowItWorksScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;