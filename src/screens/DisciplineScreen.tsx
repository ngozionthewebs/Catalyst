import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ImageBackground, StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Firebase and BlurView imports
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { BlurView } from 'expo-blur';

// Reusable Progress Bar
import OnboardingProgressBar from '../components/OnboardingProgressBar';

type DisciplineScreenProps = NativeStackScreenProps<RootStackParamList, 'Discipline'>;

const DisciplineScreen = ({ navigation }: DisciplineScreenProps) => {
  const disciplines = [
    'Writer', 'Journalist', 'Artist', 'Illustrator', 'Potter',
    'Designer', 'Developer', 'Hobbyist', 'Product Designer'
  ];

  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

  const handleToggleDiscipline = (discipline: string) => {
    if (selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines(prev => prev.filter(item => item !== discipline));
    } else {
      setSelectedDisciplines(prev => [...prev, discipline]);
    }
  };

  const handleConfirmSelection = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        // We only save the disciplines here, not the onboarding flag yet.
        await setDoc(userDocRef, {
          disciplines: selectedDisciplines,
          email: user.email,
        }, { merge: true });
        navigation.navigate('HowItWorks');
      } catch (error) {
        console.error("Error updating user profile: ", error);
        Alert.alert('Error', 'Could not save your preferences. Please try again.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/3.png')} // Using your new background
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* The Progress Bar (Step 2 of 3) */}
        <OnboardingProgressBar step={2} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Select the role {'\n'} that fits you best</Text>
          <Text style={styles.subtitle}>
            Before we start generating prompts we need to find out more about you to cater your {'\n'}experience a little more!
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.pillsContainer}>
          {disciplines.map((item) => {
            const isSelected = selectedDisciplines.includes(item);
            return (
              // We wrap the TouchableOpacity in the BlurView for the glass effect
              <BlurView
                key={item}
                intensity={80}
                tint="light"
                style={[
                  styles.pillContainer,
                  isSelected && styles.pillSelectedContainer
                ]}
              >
                <TouchableOpacity
                  style={styles.pill}
                  onPress={() => handleToggleDiscipline(item)}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              </BlurView>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, selectedDisciplines.length === 0 && styles.disabledButton]}
            onPress={handleConfirmSelection}
            disabled={selectedDisciplines.length === 0}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
  header: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 32,
    color: '#250243',
    textAlign: 'center',
    paddingBottom: 15,
  },
  subtitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  pillContainer: {
    height: 51,
    borderRadius: 25.5, // Half of height for perfect pill shape
    margin: 6,
    overflow: 'hidden', // Crucial for BlurView
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', // Subtle white border for glass effect
  },
  pillSelectedContainer: {
    borderColor: 'transparent', // No border when selected
  },
  pill: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  pillText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
  },
  pillTextSelected: {
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
  },
  footer: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#7116BC',
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  disabledButton: {
    backgroundColor: '#B885E1', // Lighter purple when disabled
  },
  continueButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default DisciplineScreen;