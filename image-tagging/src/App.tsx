import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import ImageTagger from "@/components/ImageTagger";
import AddImageDialog from "@/components/AddImageDialog";
import { useImages } from "@/hooks/useImages";
import { useTags } from "@/hooks/useTags";
import { useItems } from "@/hooks/useItems";

const App: React.FC = () => {

  // Custom hooks for state management
  const { imageItems, addImage, deleteImage, updateImageTitle, updateImageNotes, updateImage } = useImages();
  const { imageTagItems, addTag, removeTag, dragTag, removeTagsForImage } = useTags(imageItems);
  const { itemData, updateItemData, removeItemData, removeItemsForImage, addItemForTag } = useItems();

  const handleAddImage = (imageBase64: string, title: string): void => {
    addImage(imageBase64, title);
  };

  const handleEditImage = (imageId: string, imageBase64: string, title: string): void => {
    updateImage(imageId, imageBase64, title);
  };

  const handleDeleteImage = (id: string): void => {
    deleteImage(id);
    removeTagsForImage(id);
    removeItemsForImage(id, imageTagItems);
  };

  const handleAddTag = (baseImageId: string, x: number, y: number) => {
    addTag(baseImageId, x, y, addItemForTag);
  };

  const handleDeleteTagAndItem = (tagId: string) => {
    removeTag(tagId);
    removeItemData(tagId);
  };

  // Memoized data for rendering
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
    <div className="min-h-screen flex flex-col w-full">
      {/* Main content area */}
      <div className="flex-1 p-6 space-y-4 w-full">
        {imageItemsWithTags.map((imageItem) => (
          <ImageTagger
            key={imageItem.id}
            imageBase64={imageItem.imageBase64}
            title={imageItem.title}
            notes={imageItem.notes}
            onDelete={() => handleDeleteImage(imageItem.id)}
            onEdit={(imageBase64, title) => handleEditImage(imageItem.id, imageBase64, title)}
            onImageClick={(x, y) => handleAddTag(imageItem.id, x, y)}
            tags={imageItem.tags}
            onDragTag={dragTag}
            onUpdateItemData={updateItemData}
            onDeleteTagAndItem={handleDeleteTagAndItem}
            onUpdateTitle={(title) => updateImageTitle(imageItem.id, title)}
            onUpdateNotes={(notes) => updateImageNotes(imageItem.id, notes)}
            itemData={itemData}
          />
        ))}
      </div>

      {/* Bottom centered button */}
      <div className="p-6 border-t bg-white">
        <div className="flex items-center justify-center">
          <div className="flex-1 max-w-xs">
            <div className="h-px bg-gray-300"></div>
          </div>
          <div className="px-4">
            <AddImageDialog
              onAddImage={handleAddImage}
              trigger={
                <Button className="px-8">
                  Add Image
                </Button>
              }
            />
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;