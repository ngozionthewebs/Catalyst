import React, { useEffect } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

// This is the correct syntax for creating an animated component with your version.
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedBackgroundProps = {
  imageSource: any;
};

const AnimatedBackground = ({ imageSource }: AnimatedBackgroundProps) => {
  const startX = useSharedValue(0.1);
  const startY = useSharedValue(0.1);
  const endX = useSharedValue(0.9);
  const endY = useSharedValue(0.9);

  useEffect(() => {
    const duration = 4000;
    const easing = Easing.inOut(Easing.ease);

    startX.value = withRepeat(withTiming(1.0, { duration, easing }), -1, true); // Travels from 0.0 to 1.0
    startY.value = withRepeat(withTiming(0.9, { duration, easing }), -1, true); // Travels from 0.0 to 0.9
    endX.value = withRepeat(withTiming(0.0, { duration, easing }), -1, true);   // Travels from 1.0 to 0.0
    endY.value = withRepeat(withTiming(0.1, { duration, easing }), -1, true);   // Travels from 1.0 to 0.1
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      start: { x: startX.value, y: startY.value },
      end: { x: endX.value, y: endY.value },
    };
  });

  return (
    // We use a simple View as the main container here.
    // StyleSheet.absoluteFillObject makes it fill its parent.
    <View style={StyleSheet.absoluteFillObject}>
      <AnimatedLinearGradient
        colors={['#EEDAFF', '#B885E1', '#7116BC']}
        style={StyleSheet.absoluteFillObject}
        animatedProps={animatedProps}
      />
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

export default AnimatedBackground;