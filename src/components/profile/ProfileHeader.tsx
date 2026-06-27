import { memo } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../../theme/ThemeContext';

const AVATAR_SIZE = 84;

type Props = {
  name: string;
  email: string;
  membership: string;
  avatarUrl: string;
  onEditPress: () => void;
};

function ProfileHeaderBase({ name, email, membership, avatarUrl, onEditPress }: Props) {
  const { isDark } = useTheme();

  return (
    <View className="items-center px-4 pt-6">
      <View className="relative">
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
          contentFit="cover"
          transition={200}
        />
        <View className="absolute -bottom-1 -right-1 rounded-full bg-accent px-2 py-0.5">
          <Text className="text-[10px] font-bold text-overlay-fg">PRO</Text>
        </View>
      </View>

      <Text className="mt-3 text-xl font-bold text-fg">{name}</Text>
      <Text className="mt-1 text-sm text-fg-muted">{email}</Text>
      <Text className="mt-1 text-xs font-semibold text-accent">{membership}</Text>

      <IconButton
        icon="pencil-outline"
        mode="outlined"
        size={16}
        onPress={onEditPress}
        style={{ marginTop: 12, borderColor: isDark ? '#4B5563' : '#B7BDC6' }}
        iconColor={isDark ? '#F5F7FA' : '#0C1118'}
      />
    </View>
  );
}

export const ProfileHeader = memo(ProfileHeaderBase);
