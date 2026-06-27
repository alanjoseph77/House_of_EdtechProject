import { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { Chip, Button } from 'react-native-paper';
import { Image } from 'expo-image';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { fetchContentDetail } from '../api/contentService';
import type { ContentDetail } from '../types/content';
import { ContentRow } from '../components/ContentRow';
import { CastRow } from '../components/CastRow';
import { MetadataRow } from '../components/detail/MetadataRow';
import { ActionsRow } from '../components/detail/ActionsRow';
import { DetailHeaderBar } from '../components/detail/DetailHeaderBar';
import { DetailSkeleton } from '../components/detail/DetailSkeleton';

const BACKDROP_HEIGHT = 280;

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [detail, setDetail] = useState<ContentDetail | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchContentDetail(id);
      if (!data) {
        setError(true);
      } else {
        setDetail(data);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePressRelated = useCallback(
    (relatedId: string) => {
      navigation.push('Detail', { id: relatedId });
    },
    [navigation]
  );

  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);
  const toggleMyList = useCallback(() => setInMyList((prev) => !prev), []);
  const handlePlay = useCallback(
    () => Alert.alert('Play', 'This feature is coming soon.'),
    []
  );
  const handleDownload = useCallback(
    () => Alert.alert('Download', 'This feature is coming soon.'),
    []
  );

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !detail) {
    return (
      <View className="flex-1 items-center justify-center bg-base px-6">
        <Text className="mb-4 text-base text-fg">Couldn't load this title.</Text>
        <Button mode="contained" buttonColor="#E50914" onPress={load}>
          Retry
        </Button>
      </View>
    );
  }

  const { item, related } = detail;

  return (
    <View className="flex-1 bg-base">
      <DetailHeaderBar scrollY={scrollY} title={item.title} onBackPress={handleBackPress} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Image
          source={{ uri: item.backdropUrl }}
          style={{ width: '100%', height: BACKDROP_HEIGHT }}
          contentFit="cover"
          transition={200}
        />

        <View className="px-4 pt-5">
          <Text className="text-center text-2xl font-bold text-fg">{item.title}</Text>

          <MetadataRow
            rating={item.rating}
            score={item.score}
            durationMinutes={item.durationMinutes}
            releaseYear={item.releaseYear}
          />

          <View className="mt-3 flex-row flex-wrap justify-center" style={{ gap: 8 }}>
            {item.genres.map((genre) => (
              <Chip key={genre} compact mode="outlined">
                {genre}
              </Chip>
            ))}
          </View>

          <Text className="mt-3 text-center text-sm leading-5 text-fg-muted">
            {item.description}
          </Text>
        </View>

        <ActionsRow
          inMyList={inMyList}
          onPlay={handlePlay}
          onToggleMyList={toggleMyList}
          onDownload={handleDownload}
        />

        <Text className="mb-3 mt-6 px-4 text-lg font-bold text-fg">Top Cast</Text>
        <CastRow cast={item.cast} />

        {related.length > 0 && (
          <ContentRow
            row={{ id: 'related', title: 'Similar Movies', items: related }}
            onPressItem={handlePressRelated}
          />
        )}

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
    </View>
  );
}
