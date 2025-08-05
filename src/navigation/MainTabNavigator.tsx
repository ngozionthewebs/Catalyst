import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SavedPromptsScreen from '../screens/SavedPromptsScreen';
import SettingsScreen from '../screens/SettingsScreen';


const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Generate" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Saved" component={SavedPromptsScreen} options={{ title: 'Saved Prompts' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;