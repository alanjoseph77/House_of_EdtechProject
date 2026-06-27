import { memo } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration } from '../../utils/format';

type Props = {
  rating: string;
  score: number;
  durationMinutes: number;
  releaseYear: number;
};

function MetadataRowBase({ rating, score, durationMinutes, releaseYear }: Props) {
  return (
    <View className="mt-3 flex-row items-center justify-center" style={{ gap: 10 }}>
      <View className="rounded-md border border-fg-faint px-1.5 py-0.5">
        <Text className="text-[11px] font-semibold text-fg-muted">{rating}</Text>
      </View>

      <View className="flex-row items-center" style={{ gap: 3 }}>
        <Ionicons name="star" size={13} color="#F5C518" />
        <Text className="text-[13px] font-semibold text-fg">{score.toFixed(1)}</Text>
      </View>

      <Text className="text-[13px] text-fg-faint">•</Text>
      <Text className="text-[13px] text-fg-muted">{formatDuration(durationMinutes)}</Text>

      <Text className="text-[13px] text-fg-faint">•</Text>
      <Text className="text-[13px] text-fg-muted">{releaseYear}</Text>
    </View>
  );
}

export const MetadataRow = memo(MetadataRowBase);
