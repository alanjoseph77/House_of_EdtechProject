import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export function SquareTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const inactiveColor = isDark ? '#B7BDC6' : '#4B5563';

  return (
    <View
      className="flex-row bg-base px-3"
      style={{ paddingBottom: insets.bottom + 8, paddingTop: 8, gap: 10 }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icons = ICONS[route.name] ?? ICONS.Home;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className={
              isFocused
                ? 'flex-1 items-center justify-center rounded-xl bg-accent py-3'
                : 'flex-1 items-center justify-center rounded-xl bg-surface-elevated py-3'
            }
          >
            <Ionicons
              name={isFocused ? icons.active : icons.inactive}
              size={22}
              color={isFocused ? '#F5F7FA' : inactiveColor}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
