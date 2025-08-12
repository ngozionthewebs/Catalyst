import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

// Define the props our component will accept
type AnimatedBlobProps = {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
};

const AnimatedBlob = ({ color, size, initialX, initialY }: AnimatedBlobProps) => {
  // Shared values for animation that can be updated on the UI thread
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const scale = useSharedValue(1);

  // This effect runs once to start the continuous animation
  useEffect(() => {
    // Creates a looping animation sequence
    translateX.value = withRepeat(
      withSequence(
        // Animate to a new random-like position over 10 seconds
        withTiming(initialX + (Math.random() - 0.5) * 100, { duration: 10000 }),
        // Animate back to the original position
        withTiming(initialX, { duration: 10000 })
      ),
      -1, // -1 means repeat infinitely
      true // 'true' means the animation reverses on each repeat
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(initialY + (Math.random() - 0.5) * 100, { duration: 10000 }),
        withTiming(initialY, { duration: 10000 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 8000 }), // Scale up
        withTiming(1, { duration: 8000 })   // Scale down
      ),
      -1,
      true
    );
  }, []);

  // This connects our shared values to the component's transform style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2, // Makes it a perfect circle
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute', // Allows us to position it anywhere on the screen
    opacity: 0.7, // Makes the blobs slightly transparent
  },
});

export default AnimatedBlob;