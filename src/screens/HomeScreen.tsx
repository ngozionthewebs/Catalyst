import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ImageBackground
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  // --- All state and logic functions remain exactly the same ---
  const [prompt, setPrompt] = useState('SHAKE YOUR DEVICE TO GENERATE');
  const [userName, setUserName] = useState('');
  const [userDisciplines, setUserDisciplines] = useState<string[]>([]);
  const [promptCache, setPromptCache] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserDisciplines(userDoc.data().disciplines || []);
          setUserName(userDoc.data().displayName || 'Creative');
        }
      };
      fetchUserData();
    }
  }, []);

  const generatePrompt = async () => {
    if (userDisciplines.length === 0) return;
    const randomDiscipline = userDisciplines[Math.floor(Math.random() * userDisciplines.length)];
    if (promptCache[randomDiscipline]) {
      const prompts = promptCache[randomDiscipline];
      setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
      return;
    }
    try {
      const promptDocRef = doc(db, 'prompts', randomDiscipline);
      const promptDoc = await getDoc(promptDocRef);
      if (promptDoc.exists()) {
        const prompts = promptDoc.data().promptStrings;
        if (prompts && prompts.length > 0) {
          setPromptCache(prevCache => ({ ...prevCache, [randomDiscipline]: prompts }));
          setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        }
      }
    } catch (error) { console.error("Error fetching prompts: ", error); }
  };

  useEffect(() => {
    const SHAKE_THRESHOLD = 1.8;
    let lastShakeTime = 0;
    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      const now = Date.now();
      if (magnitude > SHAKE_THRESHOLD && now - lastShakeTime > 1000) {
        lastShakeTime = now;
        generatePrompt();
      }
    });
    return () => subscription.remove();
  }, [userDisciplines, promptCache]);

  const handleSavePrompt = async () => {
    if (prompt === 'SHAKE YOUR DEVICE TO GENERATE') {
      Alert.alert("Generate a Prompt", "Shake the device to get a new idea before saving.");
      return;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        const savedPromptsColRef = collection(db, 'users', user.uid, 'savedPrompts');
        await addDoc(savedPromptsColRef, {
          promptText: prompt,
          createdAt: new Date(),
          note: ""
        });
        Alert.alert("Saved!", "Your prompt has been saved to your collection.");
      } catch (error) {
        console.error("Error saving prompt: ", error);
        Alert.alert("Error", "Could not save the prompt.");
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/7.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hi {userName}.</Text>
            <Text style={styles.title}>Ready to Unlock your creativity?</Text>
            {/* The Save Prompt button is now here */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePrompt}>
              <Text style={styles.saveButtonText}>SAVE PROMPT</Text>
            </TouchableOpacity>
          </View>

          {/* Prompt Display Section */}
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
          
          {/* This empty view is a spacer to push the other content up */}
          <View style={styles.footerSpacer} />

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 28,
    color: '#250243',
    marginTop: 8,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#250243',
    height: 52,
    borderRadius: 26, // Half of height
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25, // Space below the title
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1, // Adds spacing between letters
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 45,
    // By setting a width, we force the text inside to wrap.
    // '90%' means it will take up 90% of the screen's width.
    width: '90%', 
  },
  promptText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 15.42,
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
    // We increase the line height to give the stacked lines more space.
    lineHeight: 26, 
  },
  // This helps push the content into the right places with space-between
  footerSpacer: {
      height: 52, // Roughly the same height as the save button
  }
});

export default HomeScreen;