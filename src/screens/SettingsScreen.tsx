// In SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../firebase'; // We'll put logout here

const SettingsScreen = ({ navigation }: any) => { // Using 'any' for now for simplicity
    const handleLogout = async () => {
        await auth.signOut();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
            <Button title="Logout" onPress={handleLogout} color="#E53935" />
        </View>
    );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
export default SettingsScreen;