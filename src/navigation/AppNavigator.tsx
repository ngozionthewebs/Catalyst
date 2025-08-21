import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase imports
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Screen imports
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DisciplineScreen from '../screens/DisciplineScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  Discipline: undefined;
  HowItWorks: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// --- Navigator for users who are LOGGED OUT or need to ONBOARD ---
const AuthStack = ({ initialRouteName }: { initialRouteName: keyof RootStackParamList }) => (
  <Stack.Navigator initialRouteName={initialRouteName}>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Discipline" component={DisciplineScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HowItWorks" component={HowItWorksScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// --- Navigator for users who are LOGGED IN and ONBOARDED ---
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  // This state now determines which stack to show and where to start inside it.
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Main' | 'Welcome'>('Login');

  useEffect(() => {
    // This is a more complex setup, so we define a variable for our Firestore listener
    let firestoreUnsubscribe: () => void;

    // The main auth listener remains
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      // If a previous Firestore listener is active, unsubscribe from it first
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }

      if (user) {
        // If a user is logged in, we now set up a REAL-TIME listener on their document
        const userDocRef = doc(db, 'users', user.uid);
        
        firestoreUnsubscribe = onSnapshot(userDocRef, (doc) => {
          // This code runs immediately, AND every time the document changes
          if (doc.exists() && doc.data().hasCompletedOnboarding) {
            // User is fully onboarded
            setInitialRoute('Main');
          } else {
            // User is new or hasn't finished onboarding
            setInitialRoute('Welcome');
          }
        }, (error) => {
          console.error("Error listening to user document:", error);
          // If there's an error (e.g., permissions), default to onboarding
          setInitialRoute('Welcome');
        });

      } else {
        // No user is logged in
        setInitialRoute('Login');
      }
    });

    // The splash screen timer remains
    setTimeout(() => {
      setIsAppReady(true);
    }, 5000);

    // The cleanup function now needs to unsubscribe from both listeners
    return () => {
      authUnsubscribe();
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }
    };
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }


return (

    <NavigationContainer key={initialRoute}>
      {initialRoute === 'Main' ? (
        <AppStack />
      ) : (
        <AuthStack initialRouteName={initialRoute} />
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;