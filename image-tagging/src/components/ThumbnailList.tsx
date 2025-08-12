import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import ThumbnailItem from '@/components/ThumbnailItem';

function getFileNameWithoutExt(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

const ThumbnailList = ({
  imageItemsWithTags,
  selectedImageId,
  setSelectedImageId,
  addImage,
  deleteImage,
  editImage
}: {
  imageItemsWithTags: any[];
  selectedImageId: string | null;
  setSelectedImageId: (id: string) => void;
  addImage: (base64: string, title: string) => void;
  deleteImage: (id: string) => void;
  editImage: (id: string, newImageBase64: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      // Add image as base64 url for simplification
      // Otherwise upload to s3 + add CDN
      reader.onload = (e) => {
        const result = e.target?.result as string;
        addImage(result, getFileNameWithoutExt(file.name));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileSelect = (event: React.ChangeEvent<HTMLInputElement>, imageId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        editImage(imageId, result);
        if (editFileInputRef.current) {
          editFileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = (imageId: string) => {
    editFileInputRef.current?.click();
    if (editFileInputRef.current) {
      editFileInputRef.current.setAttribute('data-image-id', imageId);
    }
  };

  return (
    <div className="w-128 flex flex-col bg-white h-full border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b bg-white z-10 flex-shrink-0">
        <span className="font-semibold text-lg">Images</span>
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-sm"
          onClick={() => fileInputRef.current?.click()}
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
          onChange={(e) => {
            const imageId = e.target.getAttribute('data-image-id');
            if (imageId) {
              handleEditFileSelect(e, imageId);
            }
          }}
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {imageItemsWithTags.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No Images</div>
        ) : (
          <div className="space-y-2 p-2">
            {imageItemsWithTags.map((img) => (
              <ThumbnailItem
                key={img.id}
                img={img}
                isSelected={selectedImageId === img.id}
                onSelect={setSelectedImageId}
                onEdit={handleEditImage}
                onDelete={deleteImage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailList; 