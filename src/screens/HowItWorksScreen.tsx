import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Import the necessary Firebase tools
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Define the correct props for type-safety.
type HowItWorksScreenProps = NativeStackScreenProps<RootStackParamList, 'HowItWorks'>;

const HowItWorksScreen = ({ navigation }: HowItWorksScreenProps) => {

  // This is the final action the user takes in the onboarding process.
  const handleFinishOnboarding = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Get a reference to the user's document in the 'users' collection.
        const userDocRef = doc(db, 'users', user.uid);
        
        // Update their document, setting the onboarding flag to true.
        // This is the "trigger" that our AppNavigator is listening for.
        await updateDoc(userDocRef, {
          hasCompletedOnboarding: true,
        });

        console.log('Onboarding complete! AppNavigator will now switch stacks.');
        // We no longer navigate from here. The AppNavigator will automatically
        // detect the change and switch the user to the main app stack.
        
      } catch (error) {
        console.error("Error finishing onboarding: ", error);
        Alert.alert("Error", "There was a problem saving your progress. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shake to Generate</Text>
      <Text style={styles.subtitle}>Physically shake your phone to get a new creative prompt!</Text>
      <Button
        title="Let's Go!"
        onPress={handleFinishOnboarding} // Call our new async function
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 8, marginBottom: 30 },
});

export default HowItWorksScreen;