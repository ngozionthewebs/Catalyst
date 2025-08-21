import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Import all the screens this navigator will manage
import HomeScreen from '../screens/HomeScreen';
import SavedPromptsScreen from '../screens/SavedPromptsScreen';
import PromptDetailScreen from '../screens/PromptDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// --- Type Definitions 
export type MainTabParamList = { Generate: undefined; Saved: undefined; Settings: undefined; };
export type MainStackParamList = { Tabs: undefined; PromptDetail: { prompt: any }; };

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();



const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap;
          let label = options.title || route.name;

          if (route.name === 'Generate') {
            iconName = isFocused ? 'sparkles' : 'sparkles-outline';
            label = 'Create'; // Custom label
          } else if (route.name === 'Saved') {
            iconName = isFocused ? 'bookmark' : 'bookmark-outline';
          } else { // Settings
            iconName = isFocused ? 'person' : 'person-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={[styles.tabButtonInner, isFocused && styles.tabButtonActive]}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? '#FFFFFF' : '#250243'}
                />
                {isFocused && <Text style={styles.tabLabel}>{label}</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const Tabs = () => {
  return (
    // We add the screenOptions prop here to hide the header for all tab screens
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Generate" component={HomeScreen} />
      <Tab.Screen name="Saved" component={SavedPromptsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// The main stack navigator remains the same
const MainTabNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="PromptDetail" component={PromptDetailScreen} options={{ title: 'View Prompt' }} />
    </Stack.Navigator>
  );
};

// --- START OF NEW STYLESHEET ---
const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 30, // Pushes it up from the bottom
    left: 20,
    right: 20,
    height: 70,
  },
  blurView: {
    flex: 1,
    borderRadius: 35, // Half of height for a perfect pill shape
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border for the glass effect
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  tabButtonActive: {
    backgroundColor: '#7116BC',
    height: 50,
  },
  tabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 8,
  },
});


export default MainTabNavigator;