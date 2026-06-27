import contentData from '../data/content.json'
import type { ContentDetail, ContentItem, HomeFeed } from '../types/content'

function delay(ms:number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAllItems(): ContentItem[] {
    const data = contentData as unknown as HomeFeed;
    return [
        ...data.heroItems,
        ...data.rows.flatMap((row) => row.items),
        ...data.popularGrid.items,
    ];
}

export async function fetchHomeFeed():Promise<HomeFeed> {
    await delay(1200);
    return contentData as unknown as HomeFeed;
}

export async function fetchContentDetail(id: string): Promise<ContentDetail | null> {
    await delay(800);
    const all = getAllItems();
    const item = all.find((c) => c.id === id);
    if (!item) return null;
    const related = all.filter((c) => c.id !== id).slice(0, 6);
    return { item, related };
}

const MAX_POPULAR_PAGES = 3;

export async function fetchPopularPage(page: number): Promise<{ items: ContentItem[]; hasMore: boolean }> {
    await delay(900);
    const data = contentData as unknown as HomeFeed;
    const baseItems = data.popularGrid.items;
    const items = baseItems.map((item) => ({ ...item, id: `${item.id}-p${page}` }));
    return { items, hasMore: page < MAX_POPULAR_PAGES };
}
