import { memo } from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

const FADE_START = 140;
const FADE_END = 220;

type Props = {
  scrollY: SharedValue<number>;
  title: string;
  onBackPress: () => void;
};

function DetailHeaderBarBase({ scrollY, title, onBackPress }: Props) {
  const insets = useSafeAreaInsets();

  const barStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(12,17,24,${interpolate(scrollY.value, [FADE_START, FADE_END], [0, 0.97], 'clamp')})`,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [FADE_START, FADE_END], [0, 1], 'clamp'),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingTop: insets.top,
          flexDirection: 'row',
          alignItems: 'center',
        },
        barStyle,
      ]}
    >
      <IconButton
        icon="arrow-left"
        iconColor="#F5F7FA"
        containerColor="rgba(0,0,0,0.3)"
        onPress={onBackPress}
      />
      <Animated.View style={[{ flex: 1, alignItems: 'center', marginRight: 48 }, titleStyle]}>
        <Text numberOfLines={1} className="text-base font-bold text-overlay-fg">
          {title}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

export const DetailHeaderBar = memo(DetailHeaderBarBase);
