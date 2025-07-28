import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MoreHorizontal } from 'lucide-react';

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

  const [openMenu, setOpenMenu] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      // Add image as base64 url for simplification
      // TODO: Upload to s3 + add CDN
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
    <div className="w-64 min-w-64 flex flex-col bg-white h-full border border-gray-200 overflow-y-auto rounded-lg">
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
        <span className="font-semibold text-lg">Images</span>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm"
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
      <div className="flex-1 overflow-y-auto">
        {imageItemsWithTags.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No Images</div>
        ) : (
          <div className="space-y-2 p-2">
            {imageItemsWithTags.map((img) => (
              <div
                key={img.id}
                className={`rounded-lg cursor-pointer flex flex-col gap-1 p-0 hover:bg-purple-50 transition ${selectedImageId === img.id ? 'bg-purple-100 border-2 border-purple-400' : 'border border-gray-300'}`}
                onClick={() => setSelectedImageId(img.id)}
                style={{ position: 'relative' }}
              >
                <>
                  <img
                    src={img.imageBase64}
                    alt={img.title}
                    className="w-full h-24 object-cover rounded-md border-none p-1"
                  />
                  <div className="absolute top-1 right-1">
                    <Popover open={openMenu} onOpenChange={setOpenMenu}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
                          <MoreHorizontal className="h-4 w-4 text-gray-800" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32 py-2 px-2">
                        <Button
                          className="w-full justify-center hover:bg-purple-50 font-medium rounded-none"
                          variant="ghost"
                          onClick={e => { e.stopPropagation(); handleEditImage(img.id); setOpenMenu(false); }}
                        >Edit</Button>
                        <Button
                          className="w-full justify-center text-red-700 hover:text-red-800 hover:bg-red-50 font-medium rounded-none"
                          variant="ghost"
                          onClick={e => { e.stopPropagation(); deleteImage(img.id); setOpenMenu(false); }}
                        >Delete</Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
                <div className="px-2 pb-2 pt-1 text-xs text-gray-700 truncate w-full text-center">{img.title || 'Untitled'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailList; 