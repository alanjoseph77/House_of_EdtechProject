import { memo } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
};

function EmptyStateBase({ icon, title, message }: Props) {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={42} color={isDark ? '#4B5563' : '#B7BDC6'} />
      <Text className="mt-4 text-base font-semibold text-fg">{title}</Text>
      <Text className="mt-1 text-center text-sm text-fg-muted">{message}</Text>
    </View>
  );
}

export const EmptyState = memo(EmptyStateBase);
