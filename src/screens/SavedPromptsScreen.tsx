import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ImageBackground, SafeAreaView, StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

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
    const renderPromptCard = ({ item }: { item: Prompt }) => (
    <BlurView intensity={80} tint="light" style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.cardInner}
        onPress={() => navigation.navigate('PromptDetail', { prompt: item })}
      >
        <View style={styles.cardTextContainer}>
          {/* Note: We will create a title from the first few words of the prompt */}
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.promptText.split(' ').slice(0, 4).join(' ')}...
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {item.promptText}
          </Text>
        </View>
        <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={20} color="#7116BC" />
        </View>
      </TouchableOpacity>
    </BlurView>
  );
  // If the data is still loading, we can show a simple message.
  if (loading) {
    return <View style={styles.centered}><Text>Loading prompts...</Text></View>;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/5.png')} // Using your new background
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Saved prompts</Text>

        {loading ? (
          <View style={styles.centered}><Text style={styles.infoText}>Loading...</Text></View>
        ) : savedPrompts.length === 0 ? (
          <View style={styles.centered}><Text style={styles.infoText}>You haven't saved any prompts yet.</Text></View>
        ) : (
          <FlatList
            data={savedPrompts}
            keyExtractor={(item) => item.id}
            renderItem={renderPromptCard}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 35,
    color: '#250243',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  listContentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Add padding to the bottom to avoid the tab bar
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden', // Crucial for BlurView
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardInner: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    flex: 1, // Allows text to take up available space
  },
  cardTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#250243',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#250243',
    lineHeight: 20,
  },
  editIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(238, 218, 255, 0.8)', // Semi-transparent light purple
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});

export default SavedPromptsScreen;