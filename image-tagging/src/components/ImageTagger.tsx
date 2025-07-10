import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import ItemRow from '@/components/ItemRow';
import Tag from './Tag';

interface ImageTaggerProps {
    imageBase64: string;
    title: string;
    notes: string;
    onDelete: () => void;
    tags: any;
    onImageClick: (x: number, y: number) => void;
    onDragTag: (id: string, x: number, y: number) => void;
    onUpdateItemData: (tagId: string, data: any) => void;
    onDeleteTagAndItem: (tagId: string) => void;
    onUpdateTitle: (title: string) => void;
    onUpdateNotes: (notes: string) => void;
    itemData: Record<string, any>;
}

const ImageTagger: React.FC<ImageTaggerProps> = ({ imageBase64, title, notes, onDelete, tags, onImageClick, onDragTag, onUpdateItemData, onDeleteTagAndItem, onUpdateTitle, onUpdateNotes, itemData }) => {
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
        <div className="w-full bg-gray-200 border border-gray-300 p-4 rounded-lg space-y-4">
            {/* Title Field */}
            <input
                type="text"
                placeholder="Image Title"
                value={title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="min-w-[100px] w-fit px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 font-semibold text-lg bg-transparent"
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
                    <textarea
                        placeholder="Notes..."
                        value={notes}
                        onChange={(e) => onUpdateNotes(e.target.value)}
                        className="min-w-[100px] w-fit h-fit min-h-[50px] px-2 py-1 pb-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 resize-none bg-transparent"
                    />
                </div>
            </div>

            {/* Items Section */}
            <div className="space-y-2">
                {tags.length > 0 ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center gap-2 p-2 bg-white border rounded-lg font-semibold text-gray-700">
                            <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                #
                            </div>
                            <div className="flex-1">Item Name</div>
                            <div className="w-20">Qty</div>
                            <div className="w-24">Unit Price</div>
                            <div className="w-24">Total Price</div>
                            <div className="w-8"></div>
                        </div>

                        {/* Item Rows */}
                        {tags.map((tag: any) => (
                            <ItemRow
                                key={tag.id}
                                tagIndex={tag.index}
                                onDelete={() => onDeleteTagAndItem(tag.id)}
                                onUpdate={(data) => onUpdateItemData(tag.id, data)}
                                initialData={itemData[tag.id]}
                            />
                        ))}
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No Item Yet
                    </div>
                )}
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
                <Button onClick={onDelete} variant="destructive">
                    Delete Image
                </Button>
            </div>
        </div>
    );
};

export default ImageTagger;