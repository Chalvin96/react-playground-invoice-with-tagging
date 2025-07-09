import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ItemRow from '@/components/ItemRow';
import Tag from './Tag';

interface ImageTaggerProps {
    imageBase64: string;
    onDelete: () => void;
    startIndex: number;
    tags: any;
    onImageClick: (x: number, y: number) => void;
    onDragTag: (id: string, x: number, y: number) => void;
}

const ImageTagger: React.FC<ImageTaggerProps> = ({ imageBase64, onDelete, startIndex, tags, onImageClick, onDragTag }) => {
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
        <div className="w-full bg-gray-200 border border-gray-300 p-4 rounded-lg ">
            <div className="flex flex-row items-start">
                <div ref={containerRef} className="relative flex w-full items-center-safe" onClick={handleClick}>
                    <AspectRatio ratio={16 / 9}>
                        <img
                            src={imageBase64}
                            alt="Uploaded"
                            className="h-full w-full object-cover rounded-lg"
                        />
                    </AspectRatio>
                    {tags.map((tag: any, i: number) => (
                        <Tag
                            key={tag.id}
                            id={tag.id}
                            x={tag.x}
                            y={tag.y}
                            index={startIndex + i}
                            containerRef={containerRef}
                            onDrag={onDragTag}
                        />
                    ))}
                </div>
                <div className='flex w-full flex-col'>
                    {tags.map((tag: any) => (<ItemRow key={tag.id} />))}
                </div>
                <Button onClick={onDelete}>Delete</Button>
            </div>
        </div>
    );
};

export default ImageTagger;