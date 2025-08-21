import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  Alert, TouchableOpacity, ImageBackground, StatusBar,
  SafeAreaView // We will use SafeAreaView for top spacing
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainTabNavigator';
import { auth, db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type PromptDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'PromptDetail'>;

// I've corrected the props destructuring here for better type-safety
const PromptDetailScreen = ({ route, navigation }: PromptDetailScreenProps) => {
  const { prompt } = route.params;
  const [note, setNote] = useState(prompt.note || '');

  // A new state variable to hold the text for the user's note.
  // We initialise it with the prompt's existing note, or an empty string if there isn't one.

    //Create a title from the prompt text for the header
  useEffect(() => {
    navigation.setOptions({
      title: prompt.promptText.split(' ').slice(0, 4).join(' ') + '...',
    });
  }, [navigation, prompt]);


  // (UPDATE) This function updates the 'note' field for the current prompt in Firestore.
  const handleUpdateNote = async () => {
    // Gets the currently logged-in user.
    const user = auth.currentUser;
    if (user) {
      try {
        // Creates a direct reference to the specific prompt document we want to update.
        // The path is /users/{userId}/savedPrompts/{promptId}
        const promptDocRef = doc(db, 'users', user.uid, 'savedPrompts', prompt.id);

        // Uses the updateDoc function to change only the fields specified.
        await updateDoc(promptDocRef, {
          note: note // Updates the 'note' field with the text from our state.
        });

        // Provides positive feedback to the user.
        Alert.alert("Note Saved", "Your notes have been successfully saved.");

        // It's good UX to navigate back to the list after saving.
        navigation.goBack();

      } catch (error) {
        console.error("Error updating note: ", error);
        Alert.alert("Error", "Could not save your note. Please try again.");
      }
    }
  };

  // (DELETE) This function deletes the current prompt from Firestore after user confirmation.
  const handleDeletePrompt = () => {
    // Alert.alert shows a native confirmation dialog.
    // This is a critical step to prevent accidental deletions.
    Alert.alert(
      "Delete Prompt", // The title of the alert
      "Are you sure you want to permanently delete this prompt?", // The message
      [
        // The array of buttons.
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel" // This style gives it a distinct look on iOS.
        },
        {
          text: "Delete",
          onPress: async () => {
            // This async function runs only if the user taps "Delete".
            const user = auth.currentUser;
            if (user) {
              try {
                // Creates a direct reference to the specific prompt document to be deleted.
                const promptDocRef = doc(db, 'users', user.uid, 'savedPrompts', prompt.id);
                // Calls the deleteDoc function from Firestore.
                await deleteDoc(promptDocRef);
                
                // Provides feedback and navigates the user away from the now-deleted item.
                Alert.alert("Deleted", "The prompt has been successfully deleted.");
                navigation.goBack();

              } catch (error) {
                console.error("Error deleting prompt: ", error);
                Alert.alert("Error", "Could not delete the prompt. Please try again.");
              }
            }
          },
          style: "destructive" // This styles the button text red on iOS.
        }
      ]
    );
  };

  // Checks if the note has been changed from its original value.
  // This is used to enable/disable the "Save Note" button.
  const isNoteChanged = note !== (prompt.note || '');

  return (
    <ImageBackground
      source={require('../../assets/images/5.png')}
      resizeMode="cover"
      style={styles.background}
    >
      {/* SafeAreaView now wraps everything to handle the top notch correctly */}
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* --- START OF NEW HEADER --- */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#250243" />
          </TouchableOpacity>
          <Text style={styles.title}>Saved prompt</Text>
          {/* This is an empty view to balance the flexbox layout */}
          <View style={{ width: 44 }} />
        </View>
        {/* --- END OF NEW HEADER --- */}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* We no longer need the title here as it's in the header */}
          
          <BlurView intensity={80} tint="light" style={styles.promptContainer}>
            <Text style={styles.promptText}>{prompt.promptText}</Text>
          </BlurView>
          
          <Text style={styles.label}>Your Note</Text>
          <BlurView intensity={80} tint="light" style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add your thoughts or ideas here..."
              placeholderTextColor="rgba(37, 2, 67, 0.56)"
              value={note}
              onChangeText={setNote}
              multiline={true}
            />
          </BlurView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, !isNoteChanged && styles.disabledButton]}
              onPress={handleUpdateNote}
              disabled={!isNoteChanged}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeletePrompt}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Delete Prompt</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  // New Header styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 22, // Adjusted size for a header title
    color: '#250243',
  },
  // Main content styles
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  label: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#250243',
    marginTop: 25,
    marginBottom: 10,
  },
  promptContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  promptText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#250243',
    padding: 20,
  },
  noteInputContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  noteInput: {
    fontSize: 16,
    padding: 20,
    minHeight: 150,
    textAlignVertical: 'top',
    fontFamily: 'Quicksand-Regular',
    color: '#250243',
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#7116BC',
  },
  deleteButton: {
    backgroundColor: '#250243',
  },
  disabledButton: {
    backgroundColor: '#B885E1',
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default PromptDetailScreen;