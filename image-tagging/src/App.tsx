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
    <div className="min-h-screen flex flex-col w-full bg-gray-100">
      {/* Main content area */}
      <div className="flex-1 p-6 space-y-6 w-full">
        {imageItemsWithTags.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🖼️</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Images Yet</h2>
            <p className="text-gray-500 mb-8">Start by adding your first image to begin tagging items</p>
            <AddImageDialog
              onAddImage={handleAddImage}
              trigger={
                <Button size="lg" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white">
                  Add Your First Image
                </Button>
              }
            />
          </div>
        ) : (
          imageItemsWithTags.map((imageItem) => (
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
          ))
        )}
      </div>

      {/* Bottom centered button */}
      {imageItemsWithTags.length > 0 && (
        <div className="p-6 border-t bg-white shadow-sm">
          <div className="flex items-center justify-center">
            <div className="flex-1 max-w-xs">
              <div className="h-px bg-gray-200"></div>
            </div>
            <div className="px-4">
              <AddImageDialog
                onAddImage={handleAddImage}
                trigger={
                  <Button className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white">
                    Add Another Image
                  </Button>
                }
              />
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-px bg-gray-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;