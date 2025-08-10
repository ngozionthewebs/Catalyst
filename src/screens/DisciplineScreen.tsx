import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Import our configured services and the necessary firestore functions.
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Define the correct props for type-safety with navigation.
type DisciplineScreenProps = NativeStackScreenProps<RootStackParamList, 'Discipline'>;

const DisciplineScreen = ({ navigation }: DisciplineScreenProps) => {
  // An array containing all the disciplines.
  const disciplines = [
    'Writer', 'Journalist', 'Artist', 'Illustrator', 'Potter',
    'Designer', 'Developer', 'Hobbyist', 'Product Designer'
  ];

  // State to hold the array of selected disciplines.
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

  // Toggles a discipline's selection status.
  const handleToggleDiscipline = (discipline: string) => {
    if (selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines(prev => prev.filter(item => item !== discipline));
    } else {
      setSelectedDisciplines(prev => [...prev, discipline]);
    }
  };

  // Saves the user's choices to Firestore and completes onboarding.
  const handleConfirmSelection = async () => {
    // Gets the currently logged-in user.
    const user = auth.currentUser;

    // Checks if the user object exists before proceeding.
    if (user) {
      try {
        // Creates a reference to this user's specific document in the 'users' collection.
        const userDocRef = doc(db, 'users', user.uid);

        // Saves the data to Firestore.
        // `setDoc` with `{ merge: true }` will create or update the document
        // without deleting other existing fields.
        await setDoc(userDocRef, {
          disciplines: selectedDisciplines,   // Save the array of choices.
          hasCompletedOnboarding: true,   // Set the onboarding flag to true.
          email: user.email,                // Also a good idea to save the email for reference.
        }, { merge: true });

        console.log('User profile updated successfully!');

        // Navigates to the final onboarding step.
        navigation.navigate('HowItWorks');

      } catch (error) {
        console.error("Error updating user profile: ", error);
        Alert.alert('Error', 'Could not save your preferences. Please try again.');
      }
    } else {
      // This is a failsafe in case the user is somehow not logged in.
      Alert.alert('Error', 'No user is currently logged in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What Are Your Creative Fields?</Text>
      <Text style={styles.subtitle}>Select one or more to get tailored prompts.</Text>
      
      <ScrollView contentContainerStyle={styles.pillsContainer}>
        {disciplines.map((item) => {
          const isSelected = selectedDisciplines.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => handleToggleDiscipline(item)}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.confirmButtonContainer}>
        <Button
          title="Confirm"
          onPress={handleConfirmSelection}
          disabled={selectedDisciplines.length === 0}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  // New style for the pill container.
  pillsContainer: {
    flexDirection: 'row', // Arrange items in a row.
    flexWrap: 'wrap', // Allow items to wrap to the next line.
    justifyContent: 'center', // Center the pills.
  },
  // Style for an individual pill.
  pill: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // This makes it pill-shaped.
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5, // Add some space around each pill.
  },
  // Style for a selected pill.
  pillSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  pillText: {
    fontSize: 16,
    color: '#333',
  },
  // Style for the text of a selected pill.
  pillTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Container to position the confirm button at the bottom.
  confirmButtonContainer: {
    paddingVertical: 20,
  },
});

export default DisciplineScreen;