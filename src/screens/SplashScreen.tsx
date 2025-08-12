import React, { useState, useEffect } from 'react';
// Import ImageBackground instead of the gradient components
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';

const SplashScreen = () => {
  const fullTitle = 'Catalyst';
  const [displayedTitle, setDisplayedTitle] = useState('');

  // The typing animation for the "Catalyst" heading
  useEffect(() => {
    if (displayedTitle.length < fullTitle.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle(fullTitle.substring(0, displayedTitle.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [displayedTitle]);

  return (
    // We replace the gradient with the ImageBackground component
    <ImageBackground
      // Use `require` to specify the path to your image
      source={require('../../assets/images/1.png')}
      // Ensure the image covers the entire screen
      resizeMode="cover"
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <Text style={styles.heading}>{displayedTitle}</Text>
      <Text style={styles.subtext}>(Shake up your creative process.)</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: 'Yellowtail',
    fontSize: 67,
    color: '#250243',
    marginBottom: 10,
    textAlign: 'center',

  },
  subtext: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 15,
    color: '#250243',
    textAlign: 'center',

  },
});

export default SplashScreen;