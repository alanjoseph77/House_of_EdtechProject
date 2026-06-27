import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native-paper';
import type { SettingsItem, SettingsSection } from '../../types/profile';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  section: SettingsSection;
  toggleValues: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onItemPress: (item: SettingsItem) => void;
};

function SettingsRow({
  item,
  enabled,
  onToggle,
  onPress,
  mutedColor,
}: {
  item: SettingsItem;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  onPress: () => void;
  mutedColor: string;
}) {
  return (
    <Pressable
      onPress={item.type === 'navigation' ? onPress : undefined}
      className="flex-row items-center px-4 py-3.5"
    >
      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={mutedColor} />
      <Text className="ml-3 flex-1 text-[14px] text-fg">{item.label}</Text>

      {item.type === 'toggle' && (
        <Switch value={enabled} onValueChange={onToggle} color="#E50914" />
      )}
      {item.type === 'value' && <Text className="text-[13px] text-fg-muted">{item.value}</Text>}
      {item.type === 'navigation' && <Ionicons name="chevron-forward" size={18} color={mutedColor} />}
    </Pressable>
  );
}

function SettingsSectionBase({ section, toggleValues, onToggle, onItemPress }: Props) {
  const { isDark } = useTheme();
  const mutedColor = isDark ? '#B7BDC6' : '#4B5563';
  const handlePress = useCallback((item: SettingsItem) => onItemPress(item), [onItemPress]);

  return (
    <View className="mx-4 mt-6">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {section.title}
      </Text>
      <View className="overflow-hidden rounded-2xl bg-surface-elevated">
        {section.items.map((item, index) => (
          <View key={item.id}>
            <SettingsRow
              item={item}
              enabled={toggleValues[item.id] ?? item.defaultEnabled ?? false}
              onToggle={(value) => onToggle(item.id, value)}
              onPress={() => handlePress(item)}
              mutedColor={mutedColor}
            />
            {index < section.items.length - 1 && <View className="h-px bg-fg-faint" />}
          </View>
        ))}
      </View>
    </View>
  );
}

export const SettingsSectionView = memo(SettingsSectionBase);
