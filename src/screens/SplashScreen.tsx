import React, { useState, useEffect } from 'react';
// Import ImageBackground instead of the gradient components
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';

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
    // We use a simple View as the main container
    <View style={styles.container}>
      {/* The AnimatedBackground component now handles the entire background */}
      {/* We place it first so it's at the bottom layer */}
      <AnimatedBackground 
        imageSource={require('../../assets/images/1.png')} 
      />

      {/* The rest of the content is rendered on top of the background */}
      <StatusBar barStyle="light-content" />
      <Text style={styles.heading}>{displayedTitle}</Text>
      <Text style={styles.subtext}>(Shake up your creative process.)</Text>
    </View>
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