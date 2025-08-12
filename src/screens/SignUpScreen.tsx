import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Alert, TouchableOpacity,
  ImageBackground, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { BlurView } from 'expo-blur'; // Import the BlurView for glassmorphism

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  // Add a new state for the user's name
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // We are not implementing the password visibility toggle or social auth in this step
  // to keep the focus on styling and core functionality.

  const handleSignUp = async () => {
    // Add name to the validation check
    if (!name || !email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // After creating the user, update their profile with the name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      console.log('SUCCESS: User account created!', userCredential.user.email);
      navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
      });

    } catch (error: any) {
        // ... (error handling remains the same)
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
    <ImageBackground
      source={require('../../assets/images/2.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* We wrap the content in a ScrollView to allow scrolling and better spacing */}
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Hey there 👋, looks like you're new here. Fill in the form and we can get started
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Input fields remain the same */}
            <BlurView intensity={50} tint="light" style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name + Surname"
                placeholderTextColor="rgba(37, 2, 67, 0.56)"
                value={name}
                onChangeText={setName}
              />
            </BlurView>
            <BlurView intensity={50} tint="light" style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(37, 2, 67, 0.56)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </BlurView>
            <BlurView intensity={50} tint="light" style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(37, 2, 67, 0.56)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </BlurView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Already Have An Account? </Text>
              <Text style={[styles.loginLinkText, styles.loginLinkTextBold]}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  // New style for the ScrollView's content
  scrollContentContainer: {
    flexGrow: 1, // Allows the content to grow and fill the space
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    // We can remove marginTop here as the new layout handles spacing
  },
  title: {
    fontFamily: 'Yellowtail',
    fontSize: 64,
    color: '#250243',
    textAlign: 'left', 
  },
  subtitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 15,
    color: '#250243',
    marginTop: 10,
    lineHeight: 22,
    textAlign: 'left', 
  },
  formContainer: {
    marginTop: 40, // Add space between header and form
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    // Add the new border style
    borderWidth: 1,
    borderColor: 'rgba(37, 2, 67, 0.35)', // 250243 with 35% opacity
  },
  input: {
    width: '100%',
    height: 58, // Increased height
    paddingHorizontal: 20,
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40, // Add space between form and footer
  },
  signUpButton: {
    backgroundColor: '#7116BC',
    width: '100%', // Make button width responsive
    maxWidth: 340, // But cap it at 340
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Reduced bottom margin for tighter layout
  },
  signUpButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loginLink: {
    flexDirection: 'row',
  },
  loginLinkText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#250243',
  },
  loginLinkTextBold: {
    fontFamily: 'Quicksand-Bold',
  },
});

export default SignUpScreen;