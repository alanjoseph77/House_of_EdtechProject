import { memo, useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { CastMember } from '../types/content';

const AVATAR_SIZE = 64;
const ITEM_WIDTH = 84;

type Props = {
  cast: CastMember[];
};

function CastRowBase({ cast }: Props) {
  const keyExtractor = useCallback(
    (member: CastMember, index: number) => `${member.actorName}-${index}`,
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: CastMember }) => (
      <View style={{ width: ITEM_WIDTH, marginRight: 12 }} className="items-center">
        <Image
          source={{ uri: item.photoUrl }}
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
          contentFit="cover"
          transition={200}
        />
        <Text className="mt-2 text-xs font-semibold text-fg" numberOfLines={1}>
          {item.characterName}
        </Text>
        <Text className="text-xs text-fg-muted" numberOfLines={1}>
          {item.actorName}
        </Text>
      </View>
    ),
    []
  );

  return (
    <FlatList
      data={cast}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialNumToRender={4}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  );
}

export const CastRow = memo(CastRowBase);
