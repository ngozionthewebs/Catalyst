import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Button, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

// This screen receives the prompt data as a parameter from the navigation.
const PromptDetailScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  // Extracts the 'prompt' object from the navigation parameters.
  const { prompt } = route.params;

  // A new state variable to hold the text for the user's note.
  // We initialise it with the prompt's existing note, or an empty string if there isn't one.
  const [note, setNote] = useState(prompt.note || '');

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
    <ScrollView style={styles.container}>
      {/* Prompt Display */}
      <Text style={styles.label}>Prompt</Text>
      <Text style={styles.promptText}>{prompt.promptText}</Text>
      
      {/* Note Input */}
      <Text style={styles.label}>Your Note</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Add your thoughts, ideas, or a story sketch here..."
        value={note}
        onChangeText={setNote}
        multiline={true} // Allows the input to have multiple lines.
      />

    {/* This section only renders if there IS an original note saved on the prompt */}
    {prompt.note && (
      <>
        <Text style={styles.label}>Your Saved Notes</Text>
        <View style={styles.savedNoteContainer}>
          <Text style={styles.savedNoteText}>{prompt.note}</Text>
        </View>
      </>
    )}


      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Save Note"
          onPress={handleUpdateNote}
          disabled={!isNoteChanged} // The button is disabled if the note hasn't changed.
        />
        <View style={styles.deleteButton}>
          <Button
            title="Delete Prompt"
            onPress={handleDeletePrompt}
            color="#E53935" // A distinct red color for a destructive action.
          />
        </View>
      </View>
    </ScrollView>
  );
};

//Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 20,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 22,
    lineHeight: 30, // Adds some extra space between lines for readability.
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the background respects the border radius.
  },
  noteInput: {
    fontSize: 16,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    minHeight: 150, // Gives the user a good amount of space to start writing.
    textAlignVertical: 'top', // Ensures the text starts from the top on Android.
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 40,
  },
  deleteButton: {
    marginTop: 15, // Adds some space between the two buttons.
  },
    savedNoteContainer: {
    backgroundColor: '#E9E9E9', // A slightly different background to distinguish it
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    },
    savedNoteText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic', // Italicize the note to show it's saved content
    color: '#555',
    },
});

export default PromptDetailScreen;