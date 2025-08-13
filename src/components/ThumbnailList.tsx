import { useRef, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ThumbnailItem from '@/components/ThumbnailItem';
import { MAX_IMAGE_SIZE_BYTES } from '@/constants';

function getFileNameWithoutExt(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

const ThumbnailList = ({
  imageItemsWithTags,
  selectedImageId,
  setSelectedImageId,
  addImage,
  deleteImage,
  editImage,
  moveImage
}: {
  imageItemsWithTags: any[];
  selectedImageId: string | null;
  setSelectedImageId: (id: string) => void;
  addImage: (url: string, title: string) => void;
  deleteImage: (id: string) => void;
  editImage: (id: string, newImageUrl: string) => void;
  moveImage: (dragId: string, hoverId: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const editingImageIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      // Reset file inputs on cleanup
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    };
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert('File size too large. Please select a file smaller than 10MB.');
      return false;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return false;
    }

    return true;
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      const objectUrl = URL.createObjectURL(file);
      addImage(objectUrl, getFileNameWithoutExt(file.name));
    }

    if (event.target) {
      event.target.value = '';
    }
  }, [addImage, validateFile]);

  const handleEditFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const imageId = editingImageIdRef.current;

    if (file && imageId && validateFile(file)) {
      const objectUrl = URL.createObjectURL(file);
      editImage(imageId, objectUrl);
    }

    // Reset the input and clear the editing reference
    if (event.target) {
      event.target.value = '';
    }
    editingImageIdRef.current = null;
  }, [editImage, validateFile]);

  const handleEditImage = useCallback((imageId: string) => {
    editingImageIdRef.current = imageId;
    editFileInputRef.current?.click();
  }, []);

  const handleAddImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const thumbnailItems = useMemo(() => {
    return imageItemsWithTags.map((img, index) => (
      <ThumbnailItem
        key={img.id}
        img={img}
        isSelected={selectedImageId === img.id}
        onSelect={setSelectedImageId}
        onEdit={handleEditImage}
        onDelete={deleteImage}
        onMove={moveImage}
        index={index}
      />
    ));
  }, [imageItemsWithTags, selectedImageId, setSelectedImageId, handleEditImage, deleteImage, moveImage]);

  return (
    <div className="w-64 shrink-0 flex flex-col bg-white h-full border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-white z-10 flex-shrink-0">
        <span className="font-semibold text-lg">Images</span>
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-sm"
          onClick={handleAddImageClick}
        >
          Add Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={editFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleEditFileSelect}
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {imageItemsWithTags.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No Images</div>
        ) : (
          <div className="space-y-2 p-2">
            {thumbnailItems}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailList;