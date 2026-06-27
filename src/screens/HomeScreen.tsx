import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { fetchHomeFeed, fetchPopularPage } from '../api/contentService';
import type { ContentItem, ContentRow as ContentRowType, HomeFeed } from '../types/content';

import { AppHeader } from '../components/home/AppHeader';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { SearchBar } from '../components/home/SearchBar';
import { GenreChips } from '../components/home/GenreChips';
import { HomeSkeleton } from '../components/home/HomeSkeleton';
import { ContentRow } from '../components/ContentRow';
import { ContentCard } from '../components/ContentCard';
import { EmptyState } from '../components/EmptyState';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';

const ALL_GENRES = 'All';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

function matchesFilters(item: ContentItem, search: string, genre: string) {
  if (genre !== ALL_GENRES && !item.genres.includes(genre)) return false;
  if (search.trim() && !item.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
  return true;
}

function filterRow(row: ContentRowType, search: string, genre: string): ContentRowType {
  return { ...row, items: row.items.filter((item) => matchesFilters(item, search, genre)) };
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
  >;

export default function HomeScreen({navigation}:Props){
    const [feed,setFeed] = useState<HomeFeed|null>(null);
    const [error,setError] =useState(false);
    const [loading, setLoading] =useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(ALL_GENRES);

    const [popularItems, setPopularItems] = useState<ContentItem[]>([]);
    const [popularPage, setPopularPage] = useState(1);
    const [hasMorePopular, setHasMorePopular] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadFeed = useCallback(async()=>{
        setLoading(true);
        setError(false);
        try{
            const data =await fetchHomeFeed();
            setFeed(data);
            setPopularItems(data.popularGrid.items);
            setPopularPage(1);
            setHasMorePopular(true);
        }catch{
            setError(true);

        }finally{
            setLoading(false)
        }
   },[])

   useEffect(()=>{
    loadFeed();
   },[loadFeed])

   const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchHomeFeed();
      setFeed(data);
      setPopularItems(data.popularGrid.items);
      setPopularPage(1);
      setHasMorePopular(true);
    } catch {
      setError(true);
    } finally {
      setRefreshing(false);
    }
   }, []);

   const loadMorePopular = useCallback(async () => {
    if (loadingMore || !hasMorePopular) return;
    setLoadingMore(true);
    try {
      const nextPage = popularPage + 1;
      const res = await fetchPopularPage(nextPage);
      setPopularItems((prev) => [...prev, ...res.items]);
      setPopularPage(nextPage);
      setHasMorePopular(res.hasMore);
    } finally {
      setLoadingMore(false);
    }
   }, [loadingMore, hasMorePopular, popularPage]);

   const handlePressItem = useCallback(
    (id: string)=>{
        navigation.navigate('Detail',{id});
    },
    [navigation]
   )

   const genreOptions = useMemo(() => {
    if (!feed) return [ALL_GENRES];
    const all = [...feed.heroItems, ...feed.rows.flatMap((row) => row.items), ...feed.popularGrid.items];
    const unique = Array.from(new Set(all.flatMap((item) => item.genres))).sort();
    return [ALL_GENRES, ...unique];
   }, [feed]);

   const filteredRows = useMemo(() => {
    if (!feed) return [];
    return feed.rows.map((row) => filterRow(row, search, selectedGenre)).filter((row) => row.items.length > 0);
   }, [feed, search, selectedGenre]);

   const filteredPopularItems = useMemo(
    () => popularItems.filter((item) => matchesFilters(item, search, selectedGenre)),
    [popularItems, search, selectedGenre]
   );

   const keyExtractor = useCallback((item: ContentItem) => item.id, []);
   const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => (
      <ContentCard item={item} onPress={handlePressItem} width={CARD_WIDTH} height={CARD_HEIGHT} />
    ),
    [handlePressItem]
   );

   if(loading){
    return <HomeSkeleton />;
   }
   if(error||!feed){
    return(
      <View className="flex-1 items-center justify-center bg-base px-6">
        <Text className="mb-4 text-base text-fg">Something went wrong loading content.</Text>
        <Button mode="contained" buttonColor="#E50914" onPress={loadFeed}>
          Retry
        </Button>
      </View>
    )
   }

   return (
    <FlatList
      className="flex-1 bg-base"
      data={filteredPopularItems}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: GRID_PADDING, marginBottom: GRID_GAP }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      windowSize={7}
      removeClippedSubviews
      onEndReachedThreshold={0.5}
      onEndReached={loadMorePopular}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" colors={['#E50914']} />
      }
      ListHeaderComponent={
        <>
          <View style={{ position: 'relative' }}>
            <HeroCarousel slides={feed.heroItems} onPlay={handlePressItem} />
            <AppHeader />
          </View>

          <SearchBar value={search} onChangeText={setSearch} />
          <GenreChips genres={genreOptions} selected={selectedGenre} onSelect={setSelectedGenre} />

          {filteredRows.map((row) => (
            <ContentRow key={row.id} row={row} onPressItem={handlePressItem} />
          ))}

          {filteredPopularItems.length > 0 && (
            <Text className="mb-3 mt-6 px-4 text-lg font-bold text-fg">{feed.popularGrid.title}</Text>
          )}
        </>
      }
      ListFooterComponent={
        loadingMore ? (
          <View className="py-6">
            <ActivityIndicator color="#E50914" />
          </View>
        ) : !hasMorePopular && filteredPopularItems.length > 0 ? (
          <Text className="py-6 text-center text-xs text-fg-faint">You've reached the end</Text>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState
          icon="film-outline"
          title="No results found"
          message="Try a different search term or genre filter."
        />
      }
    />
  );
}
