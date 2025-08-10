import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const HomeScreen = () => {
  // State for the prompt remains the same.
  const [prompt, setPrompt] = useState('Shake your device to generate a new idea!');
  // New state to hold the user's selected disciplines.
  const [userDisciplines, setUserDisciplines] = useState<string[]>([]);
  // New state to cache the fetched prompts to avoid re-fetching constantly.
  const [promptCache, setPromptCache] = useState<{ [key: string]: string[] }>({});

  // Fetches the user's disciplines from Firestore when the component mounts.
  useEffect(() => {
    const fetchUserDisciplines = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().disciplines) {
          // If we find the disciplines, we save them to our state.
          setUserDisciplines(userDoc.data().disciplines);
        }
      }
    };
    fetchUserDisciplines();
  }, []);

  // This is our new, database-driven prompt generator.
  const generatePrompt = async () => {
    // Checks if we have the user's disciplines first.
    if (userDisciplines.length === 0) {
      Alert.alert("No Disciplines Found", "Please select your creative fields in your profile.");
      return;
    }

    // Randomly picks one of the user's selected disciplines.
    const randomDiscipline = userDisciplines[Math.floor(Math.random() * userDisciplines.length)];
    
    // Checks if we have already fetched prompts for this discipline and cached them.
    if (promptCache[randomDiscipline]) {
      const prompts = promptCache[randomDiscipline];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setPrompt(randomPrompt);
      return; // Exit the function early.
    }

    try {
      // Fetches the prompt list for the chosen discipline from the 'prompts' collection.
      const promptDocRef = doc(db, 'prompts', randomDiscipline);
      const promptDoc = await getDoc(promptDocRef);

      if (promptDoc.exists()) {
        const prompts = promptDoc.data().promptStrings;
        if (prompts && prompts.length > 0) {
          // Cache the fetched prompts for next time.
          setPromptCache(prevCache => ({ ...prevCache, [randomDiscipline]: prompts }));
          
          // Select a random prompt from the fetched list and update the state.
          const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
          setPrompt(randomPrompt);
        } else {
          setPrompt(`No prompts found for ${randomDiscipline}.`);
        }
      } else {
        setPrompt(`Could not find a prompt list for ${randomDiscipline}.`);
      }
    } catch (error) {
      console.error("Error fetching prompts: ", error);
      Alert.alert("Error", "Could not fetch new prompts.");
    }
  };

  // The shake listener remains the same, but it will now call our new async generatePrompt function.
  useEffect(() => {
    const SHAKE_THRESHOLD = 1.8;
    let lastShakeTime = 0;

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      const now = Date.now();

      if (magnitude > SHAKE_THRESHOLD && now - lastShakeTime > 1000) {
        lastShakeTime = now;
        generatePrompt(); // This now calls our powerful new function.
      }
    });

    return () => {
      subscription.remove();
    };
  }, [userDisciplines, promptCache]); // We re-run this effect if the user's disciplines change.


  // The placeholder for saving prompts remains. We'll implement this in the next phase.
  const handleSavePrompt = () => {
    console.log('Saving prompt:', prompt);
  };

  // Renders the component's UI.
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Displays the prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>{prompt}</Text>
        </View>

        {/* Contains the action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSavePrompt}>
            <Text style={styles.buttonText}>Save Prompt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles for the component.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  promptText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 