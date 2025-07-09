import React, { useState, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import ImageTagger from "@/components/ImageTagger";
import { v4 as uuidv4 } from 'uuid';




interface ImageTagItem {
  id: string;
  x: number;
  y: number;
  baseImageId: string;
}

interface ImageItem {
  id: string;
  imageBase64: string;
  startIndex?: string;
  tags?: ImageTagItem[];
}

const App: React.FC = () => {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [imageTagItems, setImageTagItems] = useState<ImageTagItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (baseImageId: string, x: number, y: number) => {
    const newImageTagItem: ImageTagItem = {
      id: uuidv4(),
      x,
      y,
      baseImageId
    };
    setImageTagItems(prev => [...prev, newImageTagItem])
  };

  const handleRemoveTag = (id: string) => {
    setImageTagItems(prev => prev.filter(item => item.id != id))
  };

  const handleDragTag = (id: string, x: number, y: number) => {
    setImageTagItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, x, y } : item
      )
    );
  }

  const handleAddImage = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const id = uuidv4();
        const newImageItem: ImageItem = {
          id,
          imageBase64: result
        };

        setImageItems(prev => [...prev, newImageItem]);
      };
      reader.readAsDataURL(file);
    }

    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  const handleDeleteImage = (id: string): void => {
    setImageItems(prev => prev.filter(item => item.id !== id));
  };


  const imageItemsWithStartIndex = useMemo(() => {
    let currentIndex = 1;

    return imageItems.map(imageItem => {
      const filteredImageTagItems = imageTagItems.filter(
        tagItem => tagItem.baseImageId === imageItem.id
      );
      const startIndex = currentIndex;
      currentIndex += filteredImageTagItems.length;

      return {
        ...imageItem,
        startIndex,
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
        {imageItemsWithStartIndex.map(imageItem => (
          <ImageTagger
            key={imageItem.id}
            imageBase64={imageItem.imageBase64}
            onDelete={() => handleDeleteImage(imageItem.id)}
            onImageClick={(x, y) => handleAddTag(imageItem.id, x, y)}
            startIndex={imageItem.startIndex}
            tags={imageItem.tags}
            onDragTag={handleDragTag}
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