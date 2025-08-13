import { useMemo, useState, useEffect } from 'react';
import { useImages } from "@/hooks/useImages";
import { useTags } from "@/hooks/useTags";
import { useItems } from "@/hooks/useItems";
import ThumbnailList from '@/components/ThumbnailList';
import MainImageSection from '@/components/MainImageSection';
import TaggedItemsSection from '@/components/TaggedItemsSection';
import EditItemDialog from '@/components/EditItemDialog';
import AddItemDialog from '@/components/AddItemDialog';
import Footer from '@/components/Footer';
import InvoiceView from '@/components/InvoiceView';

const App: React.FC = () => {
  const { imageItems, addImage, deleteImage, updateImageTitle, updateImageNotes, updateImage, moveImage } = useImages();
  const { imageTagItems, addTag, removeTag, dragTag, removeTagsForImage } = useTags(imageItems);
  const { itemData, updateItemData, removeItemData, removeItemsForImage, addItemForTag } = useItems();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [editItemTagId, setEditItemTagId] = useState<string | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [currentView, setCurrentView] = useState<'editor' | 'invoice'>('editor');

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

  const selectedImage = imageItemsWithTags.find(img => img.id === selectedImageId) || imageItemsWithTags[0];
  const selectedTags = selectedImage ? selectedImage.tags : [];

  useEffect(() => {
    if (imageItemsWithTags.length > 0 && (!selectedImageId || !imageItemsWithTags.some(img => img.id === selectedImageId))) {
      setSelectedImageId(imageItemsWithTags[0].id);
    }
  }, [imageItemsWithTags, selectedImageId]);

  const handleAddTag = (baseImageId: string, x: number, y: number) => {
    const newTagId = addTag(baseImageId, x, y);
    addItemForTag(newTagId);
    setEditItemTagId(newTagId);
    setIsAddingNewItem(true);
  };

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

  const handleEditImage = (imageId: string, newImageUrl: string) => {
    const currentImage = imageItems.find(img => img.id === imageId);
    if (currentImage) {
      updateImage(imageId, newImageUrl, currentImage.title);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    removeItemsForImage(imageId, imageTagItems);
    removeTagsForImage(imageId);
    deleteImage(imageId);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      {currentView === 'editor' ? (
        <>
          <div className="flex-1 flex flex-row justify-between print:hidden min-h-0">
            <ThumbnailList
              imageItemsWithTags={imageItemsWithTags}
              selectedImageId={selectedImageId}
              setSelectedImageId={setSelectedImageId}
              addImage={addImage}
              deleteImage={handleDeleteImage}
              editImage={handleEditImage}
              moveImage={moveImage}
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
          </div>
          <div className="hidden print:block">
            <InvoiceView
              imageItemsWithTags={imageItemsWithTags}
              itemData={itemData}
            />
          </div>
        </>
      ) : (
        <InvoiceView
          imageItemsWithTags={imageItemsWithTags}
          itemData={itemData}
        />
      )}

      <Footer currentView={currentView} onViewChange={setCurrentView} />

      {isAddingNewItem ? (
        <AddItemDialog
          open={isAddingNewItem}
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