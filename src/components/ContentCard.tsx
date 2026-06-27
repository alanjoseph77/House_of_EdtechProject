import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ContentItem } from "../types/content";
import { StarRating } from "./StarRating";

type Props ={
    item: ContentItem
    onPress: (id: string)=> void;
    width: number;
    height: number;

};

function ContentCardBase({item, onPress, width, height}:Props){
    const handlePress = useCallback(()=>onPress(item.id), [item.id, onPress]);



return (
    <Pressable
      onPress={handlePress}
      style={{
        width,
        height,
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
      className="overflow-hidden rounded-2xl bg-surface-elevated"
    >
      <Image
        source={{ uri: item.posterUrl }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={200}
      />

      <LinearGradient
        colors={['transparent', 'rgba(11,14,20,0.25)', 'rgba(11,14,20,0.95)']}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' }}
      />

      <View
        className="absolute left-2 top-2 rounded-md px-1.5 py-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      >
        <StarRating score={item.score} size={9} />
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-2.5">
        <Text numberOfLines={1} className="text-[13px] font-bold text-overlay-fg">
          {item.title}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 text-[10px] text-overlay-fg-muted">
          {item.releaseYear} • {item.genres.slice(0, 2).join('/')}
        </Text>
      </View>
    </Pressable>
  );
}

export const ContentCard = memo(ContentCardBase)
