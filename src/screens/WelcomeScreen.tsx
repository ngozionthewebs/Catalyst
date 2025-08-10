import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// We add { navigation } as a prop so we can use it. 'any' is fine for now.
const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Catalyst!</Text>
      <Text style={styles.subtitle}>Let's find your spark.</Text>
      <Button title="Get Started" onPress={() => navigation.navigate('Discipline')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: 'gray', marginTop: 8, marginBottom: 30 },
});

export default WelcomeScreen;