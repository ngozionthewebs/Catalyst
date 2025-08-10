import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // For the settings icon

// Import all our screens and the new tab navigator
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SettingsScreen from '../screens/SettingsScreen';
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
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Auth screens have no header */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

        {/* Onboarding screens also have no header */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Discipline" component={DisciplineScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HowItWorks" component={HowItWorksScreen} options={{ headerShown: false }} />
        
        {/* The main app experience is the Tab Navigator */}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={({ navigation }) => ({
            headerShown: false // We hide the stack's header and let the Tab Navigator manage its own
          })}
        />

        {/* The Settings screen is a normal screen we can navigate to */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;