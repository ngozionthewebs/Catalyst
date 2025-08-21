import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Alert, TouchableOpacity,
  ImageBackground, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BlurView } from 'expo-blur';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }
    try {
      // The only job is to sign in. The AppNavigator will handle the rest.
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful, AppNavigator will now take over.');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
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
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Welcome Back 👋🏽, I hope you're ready to step out and create something new
            </Text>
          </View>

          <View style={styles.formContainer}>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpLink}>
              <Text style={styles.signUpLinkText}>Don't Have An Account? </Text>
              <Text style={[styles.signUpLinkText, styles.signUpLinkTextBold]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Styles 
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {},
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
    marginTop: 40,
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(37, 2, 67, 0.35)',
  },
  input: {
    width: '100%',
    height: 58,
    paddingHorizontal: 20,
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#250243',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loginButton: {
    backgroundColor: '#7116BC',
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  signUpLink: {
    flexDirection: 'row',
  },
  signUpLinkText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#250243',
  },
  signUpLinkTextBold: {
    fontFamily: 'Quicksand-Bold',
  },
});

export default LoginScreen;