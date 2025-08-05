import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Import from our new firebase config file and the new library
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    try {
      // Use the new syntax for the Web SDK
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('SUCCESS: User account created!', userCredential.user.email);
      navigation.navigate('Main');

    } catch (error: any) {
      console.error('FIREBASE ERROR:', error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Sign Up Failed', 'That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Sign Up Failed', 'That email address is invalid!');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Sign Up Failed', 'The password is too weak (must be at least 6 characters).');
      } else {
        Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? </Text>
        <Text style={[styles.linkText, styles.link]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 12, paddingHorizontal: 8 },
    button: { backgroundColor: '#007BFF', paddingVertical: 12, borderRadius: 50, marginTop: 20, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    linkContainer: { flexDirection: 'row', marginTop: 20 },
    linkText: { fontSize: 14, color: 'gray' },
    link: { color: '#007BFF', fontWeight: 'bold' },
});

export default SignUpScreen;