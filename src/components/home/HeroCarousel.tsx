import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Image } from 'expo-image';
import type { ContentItem } from '../../types/content';

const { width: SCREEN } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN * 0.95;
const AUTOPLAY_MS = 5000;

interface HeroCarouselProps {
  slides: ContentItem[];
  onPlay: (titleId: string) => void;
}

export function HeroCarousel({ slides, onPlay }: HeroCarouselProps) {
  const listRef = useRef<FlatList<ContentItem>>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);

  const setIndex = (i: number) => {
    indexRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      const next = (indexRef.current + 1) % slides.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN));
    pausedRef.current = false;
  };

  const current = slides[active];

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(s) => s.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: SCREEN, offset: SCREEN * index, index })}
          onScrollBeginDrag={() => {
            pausedRef.current = true;
          }}
          onMomentumScrollEnd={onMomentumEnd}
          renderItem={({ item }) => (
            <Pressable onPress={() => onPlay(item.id)} style={{ width: SCREEN, height: HERO_HEIGHT }}>
              <Image
                source={{ uri: item.backdropUrl }}
                contentFit="cover"
                transition={300}
                style={{
                  width: '100%',
                  height: '100%',
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                }}
              />
            </Pressable>
          )}
        />
      </View>

      <View className="mt-3 flex-row justify-center" style={{ gap: 6 }}>
        {slides.map((s, i) => (
          <View
            key={s.id}
            className={i === active ? 'bg-fg' : 'bg-fg-faint'}
            style={{ height: 6, width: i === active ? 18 : 6, borderRadius: 3 }}
          />
        ))}
      </View>

      {current && (
        <View className="px-4 pt-3">
          <Text numberOfLines={1} className="text-2xl font-bold text-fg">
            {current.title}
          </Text>
          <View
            className="mt-2 self-start rounded-md bg-[#F5C518] px-2 py-1"
          >
            <Text className="text-[12px] font-bold text-ink">★ {current.score.toFixed(1)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
