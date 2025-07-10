import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import ImageTagger from "@/components/ImageTagger";
import { v4 as uuidv4 } from 'uuid';


interface ImageTagItem {
  id: string;
  x: number;
  y: number;
  baseImageId: string;
  index: number;
}

interface ItemData {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface ImageItem {
  id: string;
  imageBase64: string;
  timestamp: number;
  startIndex?: string;
  tags?: ImageTagItem[];
}

const App: React.FC = () => {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [imageTagItems, setImageTagItems] = useState<ImageTagItem[]>([]);
  const [itemData, setItemData] = useState<Record<string, ItemData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddTag = useCallback((baseImageId: string, x: number, y: number) => {
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

      // Add item data for the new tag
      const newTag = reindexedTags.find(tag => tag.id === newImageTagItem.id);
      if (newTag) {
        setItemData(prev => ({
          ...prev,
          [newTag.id]: {
            name: '',
            quantity: 0,
            unitPrice: 0
          }
        }));
      }

      return reindexedTags;
    });
  }, [reindexTags]);

  const handleRemoveTag = useCallback((id: string) => {
    setImageTagItems(prev => {
      const filteredTags = prev.filter(item => item.id !== id);
      return reindexTags(filteredTags);
    });
  }, [reindexTags]);

  const handleDragTag = useCallback((id: string, x: number, y: number) => {
    setImageTagItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, x, y } : item
      )
    );
  }, []);

  const handleAddImage = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const id = uuidv4();
        const newImageItem: ImageItem = {
          id,
          imageBase64: result,
          timestamp: Date.now()
        };

        setImageItems(prev => [...prev, newImageItem]);
      };
      reader.readAsDataURL(file);
    }

    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  }, []);

  const handleDeleteImage = useCallback((id: string): void => {
    setImageItems(prev => prev.filter(item => item.id !== id));
    // Also remove all tags associated with this image and recalculate indices
    setImageTagItems(prev => {
      const filteredTags = prev.filter(tag => tag.baseImageId !== id);
      return reindexTags(filteredTags);
    });
    // Remove item data for tags on this image
    setItemData(prev => {
      const newItemData = { ...prev };
      Object.keys(newItemData).forEach(tagId => {
        const tag = imageTagItems.find(t => t.id === tagId);
        if (tag && tag.baseImageId === id) {
          delete newItemData[tagId];
        }
      });
      return newItemData;
    });
  }, [reindexTags, imageTagItems]);

  const handleUpdateItemData = useCallback((tagId: string, data: ItemData) => {
    setItemData(prev => ({
      ...prev,
      [tagId]: data
    }));
  }, []);

  const handleDeleteTagAndItem = useCallback((tagId: string) => {
    // Remove the tag
    setImageTagItems(prev => {
      const filteredTags = prev.filter(item => item.id !== tagId);
      return reindexTags(filteredTags);
    });
    // Remove the item data
    setItemData(prev => {
      const newItemData = { ...prev };
      delete newItemData[tagId];
      return newItemData;
    });
  }, [reindexTags]);


  const imageItemsWithTags = useMemo(() => {
    return imageItems.map(imageItem => {
      const filteredImageTagItems = imageTagItems.filter(
        tagItem => tagItem.baseImageId === imageItem.id
      );

      return {
        ...imageItem,
        tags: filteredImageTagItems
      };
    });
  }, [imageItems, imageTagItems]);

  return (
    <div className="relative h-screen w-screen">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main content area */}
      <div className="h-full w-full p-6 space-y-4 overflow-y-auto">
        {imageItemsWithTags.map((imageItem) => (
          <ImageTagger
            key={imageItem.id}
            imageBase64={imageItem.imageBase64}
            onDelete={() => handleDeleteImage(imageItem.id)}
            onImageClick={(x, y) => handleAddTag(imageItem.id, x, y)}
            tags={imageItem.tags}
            onDragTag={handleDragTag}
            onUpdateItemData={handleUpdateItemData}
            onDeleteTagAndItem={handleDeleteTagAndItem}
            itemData={itemData}
          />
        ))}
      </div>

      {/* Floating footer island */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-white rounded-2xl shadow-lg border px-6 py-4">
          <Button onClick={handleAddImage}>
            Add Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;