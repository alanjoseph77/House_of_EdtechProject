import { memo, useCallback } from 'react';
import { FlatList, Text, View, Dimensions } from 'react-native';
import { ContentCard } from './ContentCard';
import type { ContentRow as ContentRowType, ContentItem } from '../types/content';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

type Props = {
  row: ContentRowType;
  onPressItem: (id: string) => void;
};

function ContentRowBase({ row, onPressItem }: Props) {
  const keyExtractor = useCallback((item: ContentItem) => item.id, []);
  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => (
      <ContentCard item={item} onPress={onPressItem} width={CARD_WIDTH} height={CARD_HEIGHT} />
    ),
    [onPressItem]
  );

  return (
    <View className="mt-6 px-4">
      <Text className="mb-3 text-lg font-bold text-fg">{row.title}</Text>
      <FlatList
        data={row.items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: GRID_GAP }}
        scrollEnabled={false}
        initialNumToRender={6}
        removeClippedSubviews
      />
    </View>
  );
}

export const ContentRow = memo(ContentRowBase);
