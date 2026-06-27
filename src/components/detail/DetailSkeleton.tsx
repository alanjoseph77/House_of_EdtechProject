import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export function DetailSkeleton() {
  return (
    <View className="flex-1 bg-base">
      <Skeleton width="100%" height={280} borderRadius={0} />

      <View className="items-center px-6 pt-5">
        <Skeleton width={220} height={22} />
        <Skeleton width={160} height={14} style={{ marginTop: 10 }} />
        <View className="mt-4 flex-row" style={{ gap: 8 }}>
          <Skeleton width={64} height={28} borderRadius={14} />
          <Skeleton width={64} height={28} borderRadius={14} />
          <Skeleton width={64} height={28} borderRadius={14} />
        </View>
      </View>

      <View className="mt-4 flex-row px-4" style={{ gap: 10 }}>
        <Skeleton width="100%" height={44} borderRadius={10} style={{ flex: 1 }} />
        <Skeleton width={44} height={44} borderRadius={22} />
        <Skeleton width={44} height={44} borderRadius={22} />
      </View>

      <View className="mt-6 px-4">
        <Skeleton width={90} height={16} style={{ marginBottom: 12 }} />
        <View className="flex-row" style={{ gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={64} height={64} borderRadius={32} />
          ))}
        </View>
      </View>

      <View className="mt-6 px-4">
        <Skeleton width={140} height={16} style={{ marginBottom: 12 }} />
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          <Skeleton width="46%" height={140} borderRadius={16} />
          <Skeleton width="46%" height={140} borderRadius={16} />
        </View>
      </View>
    </View>
  );
}
