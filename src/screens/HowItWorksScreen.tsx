import React from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  StatusBar, Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Firebase imports
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Reusable Progress Bar
import OnboardingProgressBar from '../components/OnboardingProgressBar';

type HowItWorksScreenProps = NativeStackScreenProps<RootStackParamList, 'HowItWorks'>;

const HowItWorksScreen = ({ navigation }: HowItWorksScreenProps) => {

  const handleFinishOnboarding = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        // This is the final trigger that tells the app the user is fully onboarded.
        await updateDoc(userDocRef, {
          hasCompletedOnboarding: true,
        });
        console.log('Onboarding complete! AppNavigator will now switch stacks.');
        // No navigation is needed here; the central navigator will handle it.
      } catch (error) {
        console.error("Error finishing onboarding: ", error);
        Alert.alert("Error", "There was a problem saving your progress. Please try again.");
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/3.png')} // Using the same background as Welcome
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* The Progress Bar (Step 3 of 3) */}
        <OnboardingProgressBar step={3} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Shake to{'\n'}Generate</Text>
          <Text style={styles.subtitle}>
            Physically shake your phone to get a new creative prompt!
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishOnboarding}
          >
            <Text style={styles.finishButtonText}>Let's Go!</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontFamily: 'Quicksand-Bold', // Using Bold for the title
    fontSize: 48, // Larger font size for impact
    color: '#250243',
    textAlign: 'center',
    lineHeight: 56, // Adjust line height for the two lines
  },
  subtitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  footer: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#7116BC', // Primary purple
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80, 
  },
  finishButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HowItWorksScreen;