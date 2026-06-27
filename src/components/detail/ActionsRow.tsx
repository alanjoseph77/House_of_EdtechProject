import { memo } from 'react';
import { View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  inMyList: boolean;
  onPlay: () => void;
  onToggleMyList: () => void;
  onDownload: () => void;
};

function ActionsRowBase({ inMyList, onPlay, onToggleMyList, onDownload }: Props) {
  const { isDark } = useTheme();
  const neutralIconColor = isDark ? '#F5F7FA' : '#0C1118';

  return (
    <View className="mt-4 flex-row items-center px-4" style={{ gap: 10 }}>
      <Button
        mode="contained"
        icon="play"
        buttonColor="#E50914"
        textColor="#F5F7FA"
        onPress={onPlay}
        style={{ flex: 1, borderRadius: 10 }}
      >
        Play
      </Button>

      <IconButton
        icon={inMyList ? 'check-circle' : 'plus-circle-outline'}
        size={24}
        iconColor={inMyList ? '#E50914' : neutralIconColor}
        onPress={onToggleMyList}
        mode="outlined"
        containerColor="transparent"
      />

      <IconButton
        icon="download-outline"
        size={24}
        iconColor={neutralIconColor}
        onPress={onDownload}
        mode="outlined"
        containerColor="transparent"
      />
    </View>
  );
}

export const ActionsRow = memo(ActionsRowBase);
