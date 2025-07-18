import React, { useMemo, useState, useRef } from 'react';
import { useImages } from "@/hooks/useImages";
import { useTags } from "@/hooks/useTags";
import { useItems } from "@/hooks/useItems";
import Sidebar from '@/components/Sidebar';
import MainImageSection from '@/components/MainImageSection';
import TaggedItemsSection from '@/components/TaggedItemsSection';
import EditItemDialog from '@/components/EditItemDialog';

const App: React.FC = () => {
  const { imageItems, addImage, deleteImage, updateImageTitle, updateImageNotes } = useImages();
  const { imageTagItems, addTag, removeTag, dragTag, removeTagsForImage } = useTags(imageItems);
  const { itemData, updateItemData, removeItemData, removeItemsForImage, addItemForTag } = useItems();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [editItemTagId, setEditItemTagId] = useState<string | null>(null);

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
  React.useEffect(() => {
    if (imageItemsWithTags.length > 0 && (!selectedImageId || !imageItemsWithTags.some(img => img.id === selectedImageId))) {
      setSelectedImageId(imageItemsWithTags[0].id);
    }
  }, [imageItemsWithTags, selectedImageId]);

  // Add tag and open edit modal for new tag
  const handleAddTag = (baseImageId: string, x: number, y: number) => {
    const newTagId = addTag(baseImageId, x, y);
    addItemForTag(newTagId);
    setEditItemTagId(newTagId);
  };

  // Handle edit item from sidebar
  const handleEditItem = (tagId: string) => {
    setEditItemTagId(tagId);
  };

  const handleEditItemSave = (tagId: string, data: any) => {
    updateItemData(tagId, data);
  };

  const handleEditItemDelete = (tagId: string) => {
    removeTag(tagId);
    removeItemData(tagId);
  };

  const handleEditItemClose = () => {
    setEditItemTagId(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-gray-100 gap-4">
      <Sidebar
        imageItemsWithTags={imageItemsWithTags}
        selectedImageId={selectedImageId}
        setSelectedImageId={setSelectedImageId}
        addImage={addImage}
        deleteImage={deleteImage}
      />
      <MainImageSection
        selectedImage={selectedImage}
        updateImageTitle={updateImageTitle}
        updateImageNotes={updateImageNotes}
        onImageClick={handleAddTag}
        tags={selectedTags}
        dragTag={dragTag}
        itemData={itemData}
        updateItemData={updateItemData}
        removeTag={removeTag}
        removeItemData={removeItemData}
      />
      <TaggedItemsSection
        tags={selectedTags}
        itemData={itemData}
        onEditItem={handleEditItem}
      />
      <EditItemDialog
        open={!!editItemTagId}
        onOpenChange={open => { if (!open) handleEditItemClose(); }}
        itemData={editItemTagId ? itemData[editItemTagId] : null}
        onSave={data => editItemTagId && handleEditItemSave(editItemTagId, data)}
        onDelete={() => editItemTagId && handleEditItemDelete(editItemTagId)}
        tag={editItemTagId ? selectedTags.find(t => t.id === editItemTagId) : null}
      />
    </div>
  );
};

export default App;