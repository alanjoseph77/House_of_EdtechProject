import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
}

export function AppHeader({ onMenuPress, onNotificationsPress }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between px-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Pressable onPress={onMenuPress} hitSlop={8}>
        <Ionicons name="menu" size={24} color="#F5F7FA" />
      </Pressable>

      <View className="flex-row items-center" style={{ gap: 6 }}>
        <Ionicons name="film" size={18} color="#E50914" />
        <Text className="text-base font-extrabold tracking-wide text-overlay-fg">MOVIE</Text>
      </View>

      <Pressable onPress={onNotificationsPress} hitSlop={8}>
        <Ionicons name="notifications-outline" size={22} color="#F5F7FA" />
      </Pressable>
    </View>
  );
}
