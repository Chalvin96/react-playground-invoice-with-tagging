export interface ImageItem {
    id: string;
    imageUrl: string; // blob or remote URL
    timestamp: number;
    title: string;
    notes: string;
    order: number;
}

export interface ImageWithTags extends ImageItem {
    tags: Array<{
        id: string;
        x: number;
        y: number;
        baseImageId: string;
        index: number;
    }>;
}


