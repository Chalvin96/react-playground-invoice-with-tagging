import { useMemo, useState, useEffect } from 'react';
import { useImages } from "@/hooks/useImages";
import { useTags } from "@/hooks/useTags";
import { useItems } from "@/hooks/useItems";
import ThumbnailList from '@/components/ThumbnailList';
import MainImageSection from '@/components/MainImageSection';
import TaggedItemsSection from '@/components/TaggedItemsSection';
import EditItemDialog from '@/components/EditItemDialog';
import AddItemDialog from '@/components/AddItemDialog';

const App: React.FC = () => {
  const { imageItems, addImage, deleteImage, updateImageTitle, updateImageNotes, updateImage } = useImages();
  const { imageTagItems, addTag, removeTag, dragTag } = useTags(imageItems);
  const { itemData, updateItemData, removeItemData, addItemForTag } = useItems();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [editItemTagId, setEditItemTagId] = useState<string | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  // Memoize images with tags
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

  // Find selected image
  const selectedImage = imageItemsWithTags.find(img => img.id === selectedImageId) || imageItemsWithTags[0];
  const selectedTags = selectedImage ? selectedImage.tags : [];

  // Set default selected image on first load or when images change
  useEffect(() => {
    if (imageItemsWithTags.length > 0 && (!selectedImageId || !imageItemsWithTags.some(img => img.id === selectedImageId))) {
      setSelectedImageId(imageItemsWithTags[0].id);
    }
  }, [imageItemsWithTags, selectedImageId]);

  // Add tag and open add modal for new tag
  const handleAddTag = (baseImageId: string, x: number, y: number) => {
    const newTagId = addTag(baseImageId, x, y);
    addItemForTag(newTagId);
    setEditItemTagId(newTagId);
    setIsAddingNewItem(true);
  };

  // Handle edit item from sidebar
  const handleEditItem = (tagId: string) => {
    setEditItemTagId(tagId);
    setIsAddingNewItem(false);
  };

  const handleEditItemSave = (tagId: string, data: any) => {
    updateItemData(tagId, data);
  };

  const handleDeleteItem = (tagId: string) => {
    removeTag(tagId);
    removeItemData(tagId);
  };

  const handleCloseEditItem = () => {
    setEditItemTagId(null);
    setIsAddingNewItem(false);
  };

  const handleAddItemCancel = () => {
    if (editItemTagId) {
      removeTag(editItemTagId);
      removeItemData(editItemTagId);
    }
    setEditItemTagId(null);
    setIsAddingNewItem(false);
  };

  const handleEditImage = (imageId: string, newImageBase64: string) => {
    const currentImage = imageItems.find(img => img.id === imageId);
    if (currentImage) {
      updateImage(imageId, newImageBase64, currentImage.title);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-gray-100 gap-4">
      <ThumbnailList
        imageItemsWithTags={imageItemsWithTags}
        selectedImageId={selectedImageId}
        setSelectedImageId={setSelectedImageId}
        addImage={addImage}
        deleteImage={deleteImage}
        editImage={handleEditImage}
      />
      <MainImageSection
        selectedImage={selectedImage}
        updateImageTitle={updateImageTitle}
        updateImageNotes={updateImageNotes}
        onImageClick={handleAddTag}
        tags={selectedTags}
        dragTag={dragTag}
      />
      <TaggedItemsSection
        tags={selectedTags}
        itemData={itemData}
        onEditItem={handleEditItem}
      />
      {isAddingNewItem ? (
        <AddItemDialog
          open={!!editItemTagId}
          onOpenChange={open => { if (!open) handleCloseEditItem(); }}
          itemData={editItemTagId ? itemData[editItemTagId] : null}
          onSave={data => editItemTagId && handleEditItemSave(editItemTagId, data)}
          onCancel={handleAddItemCancel}
        />
      ) : (
        <EditItemDialog
          open={!!editItemTagId}
          onOpenChange={open => { if (!open) handleCloseEditItem(); }}
          itemData={editItemTagId ? itemData[editItemTagId] : null}
          onSave={data => editItemTagId && handleEditItemSave(editItemTagId, data)}
          onDelete={() => editItemTagId && handleDeleteItem(editItemTagId)}
        />
      )}
    </div>
  );
};

export default App;