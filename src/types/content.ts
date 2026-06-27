export interface CastMember {
    characterName: string;
    actorName: string;
    photoUrl: string;
}

export interface ContentItem {
    id: string;
    title: string;
    posterUrl: string;
    backdropUrl: string;
    genres: string[];
    rating: string;
    score: number;
    durationMinutes: number;
    releaseYear: number;
    description: string;
    cast: CastMember[];

}

export interface ContentRow{
    id: string;
    title: string;
    items: ContentItem[];
}

export interface HomeFeed {
    heroItems: ContentItem[];
    rows: ContentRow[];
    popularGrid: ContentRow;
}

export interface ContentDetail {
    item: ContentItem;
    related: ContentItem[];
}