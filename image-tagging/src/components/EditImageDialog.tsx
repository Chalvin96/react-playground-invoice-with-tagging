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

    const handleSaveChanges = () => {
        const finalImageBase64 = previewUrl || currentImageBase64;
        onEditImage(finalImageBase64, currentTitle); // Keep the current title
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

    const isFormValid = true; // Always valid since we're not editing title

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Image</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Update the image file.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">

                    {/* Current Image Preview */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Current Image</Label>
                        <div className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                            <img
                                src={currentImageBase64}
                                alt="Current"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* File Selection for New Image */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-image-file" className="text-sm font-medium text-gray-700">Replace Image (Optional)</Label>
                        <Input
                            id="edit-image-file"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* New Image Preview */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">New Image Preview</Label>
                            <div className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSaveChanges}
                        disabled={!isFormValid}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditImageDialog; 