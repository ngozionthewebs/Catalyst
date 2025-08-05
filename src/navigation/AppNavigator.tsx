import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';

// This part defines what screens are available in our stack
// I use TypeScript to make sure we don't try to navigate to a screen that doesn't exist
export type RootStackParamList = {
  Login: undefined; // No parameters are needed to go to the Login screen
  SignUp: undefined; // No parameters are needed to go to the Sign Up screen
  Home: undefined;  // No parameters are needed to go to the Home screen
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Catalyst' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;