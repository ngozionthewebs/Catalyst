import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This screen will receive the prompt data as a parameter from the navigation.
const PromptDetailScreen = ({ route }: { route: any }) => {
  // Extracts the 'prompt' object from the navigation parameters.
  const { prompt } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.promptLabel}>Prompt:</Text>
      <Text style={styles.promptText}>{prompt.promptText}</Text>
      {/* We will add the note input and delete button here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  promptLabel: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  promptText: {
    fontSize: 22,
  },
});

export default PromptDetailScreen;