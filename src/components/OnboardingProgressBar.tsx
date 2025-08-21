import React from 'react';
import { View, StyleSheet } from 'react-native';

// Define the props: `step` will be 1, 2, or 3.
type OnboardingProgressBarProps = {
  step: number;
};

const OnboardingProgressBar = ({ step }: OnboardingProgressBarProps) => {
  return (
    <View style={styles.container}>
      {/* We create three bars and change their style based on the current step */}
      <View style={[styles.bar, step >= 1 && styles.barActive]} />
      <View style={[styles.bar, step >= 2 && styles.barActive]} />
      <View style={[styles.bar, step >= 3 && styles.barActive]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 60, // Space from the top of the screen
  },
  bar: {
    flex: 1, // Each bar takes up equal space
    height: 4,
    backgroundColor: 'rgba(37, 2, 67, 0.2)', // Inactive colour (250243 with 20% opacity)
    borderRadius: 2,
    marginHorizontal: 4,
  },
  barActive: {
    backgroundColor: '#250243', // Active colour
  },
});

export default OnboardingProgressBar;