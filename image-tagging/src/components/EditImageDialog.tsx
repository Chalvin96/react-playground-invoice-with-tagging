import { useState, useRef, useCallback } from 'react';
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
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
    open,
    currentImageBase64,
    currentTitle,
    trigger,
    onEditImage,
    onOpenChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isControlled = open !== undefined && onOpenChange !== undefined;
    const dialogOpen = isControlled ? open : isOpen;
    const setDialogOpen = isControlled ? onOpenChange : setIsOpen;

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreviewUrl(result);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleSaveChanges = useCallback(() => {
        const finalImageBase64 = previewUrl || currentImageBase64;
        onEditImage(finalImageBase64, currentTitle);
        // Reset form
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsOpen(false);
    }, [previewUrl, currentImageBase64, currentTitle, onEditImage]);

    const handleOpenChange = useCallback((open: boolean) => {
        setDialogOpen(open);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [setDialogOpen]);

    const handleCancel = useCallback(() => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsOpen(false);
    }, []);

    // Always valid since we're not editing title
    const isFormValid = true;

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
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