import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

// Define a type for our prompt objects for better code safety.
export type Prompt = {
  id: string;
  promptText: string;
  createdAt: any; // Storing as 'any' for simplicity, can be refined to Timestamp
  note?: string;
};

// Define the navigation param list for this stack
type RootStackParamList = {
  PromptDetail: { prompt: Prompt };
  // Add other routes here if needed
};

const SavedPromptsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // State to hold the array of saved prompts fetched from Firestore.
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  // State to manage a loading indicator.
  const [loading, setLoading] = useState(true);

  // useFocusEffect is like useEffect, but it re-runs every time the user navigates TO this screen.
  // This is perfect for ensuring the prompt list is always fresh.
  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        // Creates a reference to the 'savedPrompts' sub-collection.
        const promptsColRef = collection(db, 'users', user.uid, 'savedPrompts');
        // Creates a query to order the prompts by creation date, with the newest ones first.
        const promptsQuery = query(promptsColRef, orderBy('createdAt', 'desc'));

        // onSnapshot creates a real-time listener.
        // This code will automatically run every time the data in this collection changes.
        const unsubscribe = onSnapshot(promptsQuery, (querySnapshot) => {
          const prompts: Prompt[] = [];
          querySnapshot.forEach((doc) => {
            // Pushes each prompt into our array with its ID and data.
            prompts.push({ id: doc.id, ...doc.data() } as Prompt);
          });
          // Updates our state with the new list of prompts.
          setSavedPrompts(prompts);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching saved prompts: ", error);
          Alert.alert("Error", "Could not fetch your saved prompts.");
          setLoading(false);
        });

        // The cleanup function: Unsubscribes from the listener when the user navigates away.
        return () => unsubscribe();
      }
    }, [])
  );

  // If the data is still loading, we can show a simple message.
  if (loading) {
    return <View style={styles.container}><Text>Loading prompts...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* If there are no saved prompts, show a helpful message. */}
      {savedPrompts.length === 0 ? (
        <Text style={styles.emptyText}>You haven't saved any prompts yet. Go generate some!</Text>
      ) : (
        // FlatList is the standard, high-performance way to render lists in React Native.
        <FlatList
          data={savedPrompts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.promptCard}
              // We'll add the navigation to the detail screen here in the next step.
             onPress={() => navigation.navigate('PromptDetail', { prompt: item })}
            >
              <Text style={styles.promptCardText} numberOfLines={2}>{item.promptText}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  promptCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  promptCardText: {
    fontSize: 16,
  },
});

export default SavedPromptsScreen;