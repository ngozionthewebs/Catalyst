import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Import our auth object and the login function from the firebase SDK
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // This function now handles the actual login process
  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    try {
      // This is the core Firebase function for signing a user in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // If successful, log the user info and navigate to the Home screen
      console.log('User logged in!', userCredential.user.email);
      navigation.navigate('Main');

    } catch (error: any) {
      console.error('FIREBASE LOGIN ERROR:', error.code, error.message);
      
      // Provide user-friendly feedback based on the error code
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Catalyst</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <Text style={[styles.linkText, styles.link]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: 'gray',
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;