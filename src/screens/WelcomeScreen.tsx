import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import OnboardingProgressBar from '../components/OnboardingProgressBar';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const goToNextScreen = () => {
    navigation.navigate('Discipline');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/3.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      {/* We still keep the screen tappable as a secondary action */}
      <TouchableOpacity
        activeOpacity={1} // Set to 1 so there's no feedback when tapping the background
        style={styles.container}
        onPress={goToNextScreen}
      >
        {/* The Progress Bar (Step 1 of 3) */}
        <OnboardingProgressBar step={1} />
        
        {/* The main content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.titleLogo}>Catalyst</Text>
          <Text style={styles.subtitle}>
            Ignite your creativity with Catalyst. Your next great idea might just start right here.
          </Text>
        </View>

        {/* --- START OF NEW CODE --- */}
        {/* This is the new, explicit "Next" button at the bottom */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={goToNextScreen}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        {/* --- END OF NEW CODE --- */}

      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 24,
    color: '#250243',
  },
  titleLogo: {
    fontFamily: 'Yellowtail',
    fontSize: 64,
    color: '#250243',
    marginTop: -10,
  },
  subtitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  // New styles for the footer and the button
  footer: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#7116BC', 
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80, // Space from the bottom of the screen
  },
  nextButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default WelcomeScreen;