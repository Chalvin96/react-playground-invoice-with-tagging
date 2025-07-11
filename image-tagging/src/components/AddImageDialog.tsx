import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddImageDialogProps {
    onAddImage: (imageBase64: string, title: string) => void;
    trigger: React.ReactNode;
}

const AddImageDialog: React.FC<AddImageDialogProps> = ({ onAddImage, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreviewUrl(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImage = () => {
        if (selectedFile && previewUrl) {
            onAddImage(previewUrl, title);
            // Reset form
            setTitle('');
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setIsOpen(false);
        }
    };

      const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setTitle('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setTitle('');
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsOpen(false);
  };

    const isFormValid = title.trim() && selectedFile;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Image</DialogTitle>
                    <DialogDescription>
                        Enter a title for your image and select an image file to upload.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="image-title">Image Title</Label>
                        <Input
                            id="image-title"
                            type="text"
                            placeholder="Enter image title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* File Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="image-file">Select Image</Label>
                        <Input
                            id="image-file"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>

                        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddImage}
            disabled={!isFormValid}
          >
            Add Image
          </Button>
        </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddImageDialog; 