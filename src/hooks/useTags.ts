import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ImageTagItem {
    id: string;
    x: number;
    y: number;
    baseImageId: string;
    index: number;
}

export const useTags = (imageItems: any[]) => {
    const [imageTagItems, setImageTagItems] = useState<ImageTagItem[]>([]);

    // Helper function to reindex all tags to maintain continuous numbering
    const reindexTags = useCallback((tags: ImageTagItem[]): ImageTagItem[] => {
        return tags
            .sort((a, b) => {
                const orderA = imageItems.findIndex(img => img.id === a.baseImageId);
                const orderB = imageItems.findIndex(img => img.id === b.baseImageId);
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                return a.index - b.index;
            })
            .map((tag, newIndex) => ({
                ...tag,
                index: newIndex + 1
            }));
    }, [imageItems]);

    // When image order changes, reindex all tags to maintain consistent numbering
    useEffect(() => {
        setImageTagItems(prev => reindexTags(prev));
    }, [imageItems, reindexTags]);

    const addTag = useCallback((baseImageId: string, x: number, y: number) => {
        let newTagId: string;
        setImageTagItems(prev => {
            const tagsForImage = prev.filter(tag => tag.baseImageId === baseImageId);
            const maxIndex = tagsForImage.length > 0 ? Math.max(...tagsForImage.map(tag => tag.index)) : 0;

            const newImageTagItem: ImageTagItem = {
                id: uuidv4(),
                x,
                y,
                baseImageId,
                index: maxIndex + 1
            };

            newTagId = newImageTagItem.id;
            const allTags = [...prev, newImageTagItem];
            const reindexedTags = reindexTags(allTags);

            return reindexedTags;
        });
        return newTagId!;
    }, [reindexTags]);

    const removeTag = useCallback((id: string) => {
        setImageTagItems(prev => {
            const filteredTags = prev.filter(item => item.id !== id);
            return reindexTags(filteredTags);
        });
    }, [reindexTags]);

    const dragTag = useCallback((id: string, x: number, y: number) => {
        setImageTagItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, x, y } : item
            )
        );
    }, []);

    const removeTagsForImage = useCallback((imageId: string) => {
        setImageTagItems(prev => {
            const filteredTags = prev.filter(tag => tag.baseImageId !== imageId);
            return reindexTags(filteredTags);
        });
    }, [reindexTags]);

    return {
        imageTagItems,
        addTag,
        removeTag,
        dragTag,
        removeTagsForImage
    };
}; 