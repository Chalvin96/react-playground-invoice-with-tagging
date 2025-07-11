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
        <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative">
            {/* Action Menu Popover */}
            <div className="absolute top-3 right-3 z-10">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
                            <MoreHorizontal className="h-4 w-4 text-gray-800" />
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
                                    <Button variant="ghost" className="w-full justify-start text-gray-800 hover:text-gray-900 hover:bg-gray-100 font-medium">
                                        Edit Image
                                    </Button>
                                }
                            />
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-700 hover:text-red-800 hover:bg-red-50 font-medium"
                                onClick={onDelete}
                            >
                                Delete Image
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <CardContent className="p-8 space-y-8">
                {/* Title Field */}
                <div className="space-y-2">
                    <Input
                        type="text"
                        placeholder="Enter image title..."
                        value={title}
                        onChange={(e) => onUpdateTitle(e.target.value)}
                        className="text-2xl font-semibold border-0 border-b-2 border-gray-200 focus:border-purple-500 focus:ring-0 bg-transparent px-0 py-3 rounded-none"
                    />
                </div>

                {/* Image and Notes Section */}
                <div className="flex gap-8">
                    {/* Image Container */}
                    <div className="w-[800px] h-[500px] flex-shrink-0">
                        <div ref={containerRef} className="relative w-full h-full" onClick={handleClick}>
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden shadow-inner hover:shadow-md transition-shadow">
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <Textarea
                                placeholder="Add notes about this image..."
                                value={notes}
                                onChange={(e) => onUpdateNotes(e.target.value)}
                                className="min-h-[200px] border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none bg-white"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

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