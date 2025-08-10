import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HowItWorksScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shake to Generate</Text>
      <Text style={styles.subtitle}>Physically shake your phone to get a new creative prompt!</Text>
      <Button
        title="Let's Go!"
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
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