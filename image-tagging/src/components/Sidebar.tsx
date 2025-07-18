import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MoreHorizontal } from 'lucide-react';

function getFileNameWithoutExt(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

const Sidebar = ({
  imageItemsWithTags,
  selectedImageId,
  setSelectedImageId,
  addImage,
  deleteImage
}: {
  imageItemsWithTags: any[];
  selectedImageId: string | null;
  setSelectedImageId: (id: string) => void;
  addImage: (base64: string, title: string) => void;
  deleteImage: (id: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        addImage(result, getFileNameWithoutExt(file.name));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64 flex flex-col bg-white h-screen border-r overflow-y-auto">
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
      </div>
      <div className="flex-1 overflow-y-auto">
        {imageItemsWithTags.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No Images</div>
        ) : (
          <ul className="space-y-2 p-2">
            {imageItemsWithTags.map((img) => (
              <li
                key={img.id}
                className={`rounded-lg cursor-pointer flex flex-col gap-1 p-0 hover:bg-purple-50 transition ${selectedImageId === img.id ? 'bg-purple-100 border-2 border-purple-400' : 'border border-gray-300'}`}
                onClick={() => setSelectedImageId(img.id)}
                style={{ position: 'relative' }}
              >
                <div className="relative w-full">
                  <img
                    src={img.imageBase64}
                    alt={img.title}
                    className="w-full h-24 object-cover rounded-md border-none"
                  />
                  <div className="absolute top-1 right-1 z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
                          <MoreHorizontal className="h-4 w-4 text-gray-800" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32" align="end">
                        <Button
                          className="w-full justify-start text-red-700 hover:text-red-800 hover:bg-red-50 font-medium"
                          variant="ghost"
                          onClick={e => { e.stopPropagation(); deleteImage(img.id); }}
                        >Delete</Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="px-2 pb-2 pt-1 text-xs text-gray-700 truncate w-full text-center">{img.title || 'Untitled'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 