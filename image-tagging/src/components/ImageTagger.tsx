import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import ItemsList from '@/components/ItemsList';
import Tag from './Tag';
import EditImageDialog from './EditImageDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MoreHorizontal } from 'lucide-react';

interface ImageTaggerProps {
    imageBase64: string;
    title: string;
    notes: string;
    onDelete: () => void;
    onEdit: (imageBase64: string, title: string) => void;
    tags: any;
    onImageClick: (x: number, y: number) => void;
    onDragTag: (id: string, x: number, y: number) => void;
    onUpdateItemData: (tagId: string, data: any) => void;
    onDeleteTagAndItem: (tagId: string) => void;
    onUpdateTitle: (title: string) => void;
    onUpdateNotes: (notes: string) => void;
    itemData: Record<string, any>;
}

const ImageTagger: React.FC<ImageTaggerProps> = ({ imageBase64, title, notes, onDelete, onEdit, tags, onImageClick, onDragTag, onUpdateItemData, onDeleteTagAndItem, onUpdateTitle, onUpdateNotes, itemData }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
        // prevent adding if click near existing tag (within 10px)
        const exists = tags.some((tag: any) => {
            const tagXpx = (tag.x / 100) * rect.width;
            const tagYpx = (tag.y / 100) * rect.height;
            const clickXpx = e.clientX - rect.left;
            const clickYpx = e.clientY - rect.top;
            const dx = tagXpx - clickXpx;
            const dy = tagYpx - clickYpx;
            return Math.hypot(dx, dy) < 10; // 10px radius
        });
        if (!exists) {
            onImageClick(xPercent, yPercent);
        }
    };

    return (
        <Card className="w-full bg-gray-200 border border-gray-300 p-4 rounded-lg space-y-4 relative">
            {/* Action Menu Popover */}
            <div className="absolute top-2 right-2 z-10">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                        <div className="space-y-1">
                            <EditImageDialog
                                currentTitle={title}
                                currentImageBase64={imageBase64}
                                onEditImage={onEdit}
                                trigger={
                                    <Button variant="ghost" className="w-full justify-start">
                                        Edit Image
                                    </Button>
                                }
                            />
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive hover:text-destructive"
                                onClick={onDelete}
                            >
                                Delete Image
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <CardContent className="space-y-4">
                {/* Title Field */}
                <Input
                    type="text"
                    placeholder="Image Title"
                    value={title}
                    onChange={(e) => onUpdateTitle(e.target.value)}
                    className="min-w-[100px] w-fit px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 font-semibold text-lg bg-transparent focus-visible:ring-0"
                />

                {/* Image and Notes Section */}
                <div className="flex gap-4">
                    {/* Image Container */}
                    <div className="w-[600px] h-[400px] flex-shrink-0">
                        <div ref={containerRef} className="relative w-full h-full" onClick={handleClick}>
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={imageBase64}
                                    alt="Uploaded"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            {tags.map((tag: any) => (
                                <Tag
                                    key={tag.id}
                                    id={tag.id}
                                    x={tag.x}
                                    y={tag.y}
                                    index={tag.index}
                                    containerRef={containerRef}
                                    onDrag={onDragTag}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Notes Field */}
                    <div className="flex-1">
                        <Textarea
                            placeholder="Notes..."
                            value={notes}
                            onChange={(e) => onUpdateNotes(e.target.value)}
                            className="min-w-[100px] w-fit h-fit min-h-[50px] px-2 py-1 pb-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 resize-none bg-transparent"
                        />
                    </div>
                </div>

                <Separator />

                {/* Items Section */}
                <ItemsList
                    tags={tags}
                    itemData={itemData}
                    onUpdateItemData={onUpdateItemData}
                    onDeleteTagAndItem={onDeleteTagAndItem}
                />


            </CardContent>
        </Card>
    );
};

export default ImageTagger;