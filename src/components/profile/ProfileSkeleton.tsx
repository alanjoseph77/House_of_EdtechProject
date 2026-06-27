import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export function ProfileSkeleton() {
  return (
    <View className="flex-1 bg-base">
      <View className="items-center px-4 pt-6">
        <Skeleton width={84} height={84} borderRadius={42} />
        <Skeleton width={140} height={18} style={{ marginTop: 14 }} />
        <Skeleton width={180} height={13} style={{ marginTop: 8 }} />
        <Skeleton width={90} height={12} style={{ marginTop: 8 }} />
      </View>

      <View className="mx-4 mt-6 flex-row gap-3">
        <Skeleton width="100%" height={70} borderRadius={16} style={{ flex: 1 }} />
      </View>

      {[0, 1, 2].map((i) => (
        <View key={i} className="mx-4 mt-6">
          <Skeleton width={100} height={12} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={120} borderRadius={16} />
        </View>
      ))}
    </View>
  );
}
