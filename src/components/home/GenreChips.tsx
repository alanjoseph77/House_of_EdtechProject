import { Pressable, ScrollView, Text } from 'react-native';

interface GenreChipsProps {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
}

export function GenreChips({ genres, selected, onSelect }: GenreChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="mt-4"
    >
      {genres.map((genre) => {
        const isActive = genre === selected;
        return (
          <Pressable
            key={genre}
            onPress={() => onSelect(genre)}
            className={
              isActive ? 'rounded-full bg-accent px-4 py-2' : 'rounded-full bg-surface-elevated px-4 py-2'
            }
          >
            <Text
              className={
                isActive
                  ? 'text-[13px] font-semibold text-overlay-fg'
                  : 'text-[13px] font-medium text-fg-muted'
              }
            >
              {genre}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
