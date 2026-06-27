import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { isDark } = useTheme();
  const mutedColor = isDark ? '#B7BDC6' : '#4B5563';

  return (
    <View
      className="mx-4 mt-4 flex-row items-center rounded-2xl bg-surface-elevated px-4"
      style={{ height: 48 }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        placeholderTextColor={mutedColor}
        className="flex-1 text-[14px] text-fg"
        style={{ paddingVertical: 0 }}
      />
      <Ionicons name="search" size={18} color={mutedColor} />
    </View>
  );
}
