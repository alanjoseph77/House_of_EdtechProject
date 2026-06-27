import { useEffect } from 'react';
import { type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const { isDark } = useTheme();
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.ease }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { backgroundColor: isDark ? '#1A1F29' : '#E5E7EB', width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}
