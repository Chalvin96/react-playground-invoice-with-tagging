import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ImageTagger from "@/components/ImageTagger";
import { v4 as uuidv4 } from 'uuid';

interface ImageTaggerComponent {
  id: string;
  imageBase64: string;
}

const App: React.FC = () => {
  const [imageTaggerComponents, setImageTaggerComponents] = useState<ImageTaggerComponent[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const newComponent: ImageTaggerComponent = {
          id,
          imageBase64: result
        };

        setImageTaggerComponents(prev => [...prev, newComponent]);
      };
      reader.readAsDataURL(file);
    }

    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  const handleDeleteImage = (id: string): void => {
    setImageTaggerComponents(prev => prev.filter(item => item.id !== id));
  };

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
        {imageTaggerComponents.map(item => (
          <ImageTagger
            key={item.id}
            imageBase64={item.imageBase64}
            onDelete={() => handleDeleteImage(item.id)}
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