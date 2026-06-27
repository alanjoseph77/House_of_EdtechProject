import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MAX_STARS = 5;
const STAR_COLOR = '#F5C518';

interface StarRatingProps {
  score: number;
  size?: number;
}

export function StarRating({ score, size = 12 }: StarRatingProps) {
  const filled = Math.max(0, Math.min(MAX_STARS, Math.round(score / 2)));

  return (
    <View className="flex-row" style={{ gap: 1 }}>
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <Ionicons key={i} name={i < filled ? 'star' : 'star-outline'} size={size} color={STAR_COLOR} />
      ))}
    </View>
  );
}
