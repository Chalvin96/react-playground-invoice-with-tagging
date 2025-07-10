import { useState, useCallback } from 'react';
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
                // Sort by image timestamp first, then by original index
                const imageA = imageItems.find(img => img.id === a.baseImageId);
                const imageB = imageItems.find(img => img.id === b.baseImageId);
                if (imageA && imageB && imageA.timestamp !== imageB.timestamp) {
                    return imageA.timestamp - imageB.timestamp;
                }
                return a.index - b.index;
            })
            .map((tag, newIndex) => ({
                ...tag,
                index: newIndex + 1
            }));
    }, [imageItems]);

      const addTag = useCallback((baseImageId: string, x: number, y: number, onTagCreated?: (tagId: string) => void) => {
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

      const allTags = [...prev, newImageTagItem];
      const reindexedTags = reindexTags(allTags);
      
      // Call the callback with the new tag ID
      const newTag = reindexedTags.find(tag => tag.id === newImageTagItem.id);
      if (newTag && onTagCreated) {
        onTagCreated(newTag.id);
      }
      
      return reindexedTags;
    });
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