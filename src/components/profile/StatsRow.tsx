import { memo } from 'react';
import { Text, View } from 'react-native';
import type { ProfileStat } from '../../types/profile';

type Props = {
  stats: ProfileStat[];
};

function StatsRowBase({ stats }: Props) {
  return (
    <View className="mx-4 mt-6 flex-row rounded-2xl bg-surface-elevated py-4">
      {stats.map((stat, index) => (
        <View
          key={stat.id}
          className={
            index === stats.length - 1
              ? 'flex-1 items-center'
              : 'flex-1 items-center border-r border-fg-faint'
          }
        >
          <Text className="text-lg font-bold text-fg">{stat.value}</Text>
          <Text className="mt-0.5 text-xs text-fg-muted">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

export const StatsRow = memo(StatsRowBase);
