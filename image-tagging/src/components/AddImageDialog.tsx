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

    const handleSaveImage = () => {
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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add New Image</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Enter a title for your image and select an image file to upload.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="image-title" className="text-sm font-medium text-gray-700">Image Title</Label>
                        <Input
                            id="image-title"
                            type="text"
                            placeholder="Enter a descriptive title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* File Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="image-file" className="text-sm font-medium text-gray-700">Select Image</Label>
                        <Input
                            id="image-file"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Preview</Label>
                            <div className="w-full h-64 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSaveImage}
                        disabled={!isFormValid}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Add Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddImageDialog; 