import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import all the screens this navigator will manage
import HomeScreen from '../screens/HomeScreen';
import SavedPromptsScreen from '../screens/SavedPromptsScreen';
import PromptDetailScreen from '../screens/PromptDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Define the types for the props for our two new navigators
// This helps with type safety when navigating
export type MainTabParamList = {
  Generate: undefined;
  Saved: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  Tabs: undefined; // This route will render our Bottom Tab navigator
  PromptDetail: { prompt: any }; // This is our detail screen
};

// Create the navigator instances
const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// --- This is the component for the Bottom Tabs ---
const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Generate" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Saved" component={SavedPromptsScreen} options={{ title: 'Saved Prompts' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

// --- This is the main exported component ---
// It's a Stack Navigator that has the Tabs as its primary screen
const MainTabNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Tabs" 
        component={Tabs} 
        options={{ headerShown: false }} // We hide the header for the main tab view
      />
      <Stack.Screen 
        name="PromptDetail" 
        component={PromptDetailScreen} 
        options={{ title: 'View Prompt' }} // The detail screen gets a default header
      />
    </Stack.Navigator>
  );
};

export default MainTabNavigator;