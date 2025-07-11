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

interface EditImageDialogProps {
    currentTitle: string;
    currentImageBase64: string;
    onEditImage: (imageBase64: string, title: string) => void;
    trigger: React.ReactNode;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
    currentTitle,
    currentImageBase64,
    onEditImage,
    trigger
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(currentTitle);
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

    const handleEditImage = () => {
        const finalImageBase64 = previewUrl || currentImageBase64;
        onEditImage(finalImageBase64, title);
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsOpen(false);
    };

      const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Initialize form with current values when dialog opens
      setTitle(currentTitle);
    } else {
      // Reset form when dialog closes
      setTitle(currentTitle);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setTitle(currentTitle);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsOpen(false);
  };

    const isFormValid = title.trim();

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>
                        Update the title and optionally replace the image.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-image-title">Image Title</Label>
                        <Input
                            id="edit-image-title"
                            type="text"
                            placeholder="Enter image title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Current Image Preview */}
                    <div className="space-y-2">
                        <Label>Current Image</Label>
                        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                                src={currentImageBase64}
                                alt="Current"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* File Selection for New Image */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-image-file">Replace Image (Optional)</Label>
                        <Input
                            id="edit-image-file"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>

                    {/* New Image Preview */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label>New Image Preview</Label>
                            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src={previewUrl}
                                    alt="New Preview"
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
            onClick={handleEditImage}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditImageDialog; 