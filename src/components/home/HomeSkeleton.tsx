import { Dimensions, View } from 'react-native';
import { Skeleton } from '../Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_WIDTH * 0.95;
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

function CardGridSkeleton() {
  return (
    <View className="mt-6 px-4">
      <Skeleton width={120} height={16} style={{ marginBottom: 12 }} />
      <View className="flex-row" style={{ gap: GRID_GAP }}>
        <Skeleton width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={16} />
        <Skeleton width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={16} />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View className="flex-1 bg-base">
      <Skeleton width="100%" height={HERO_HEIGHT} borderRadius={0} />

      <View className="mx-4 mt-4">
        <Skeleton width="100%" height={48} borderRadius={16} />
      </View>

      <View className="mt-4 flex-row px-4" style={{ gap: 8 }}>
        <Skeleton width={64} height={32} borderRadius={16} />
        <Skeleton width={64} height={32} borderRadius={16} />
        <Skeleton width={64} height={32} borderRadius={16} />
      </View>

      <CardGridSkeleton />
      <CardGridSkeleton />
    </View>
  );
}
