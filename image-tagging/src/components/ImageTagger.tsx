import React from 'react';
import { Button } from "@/components/ui/button";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ItemRow from '@/components/ItemRow';

interface ImageTaggerProps {
    imageBase64: string;
    onDelete: () => void;
}

const ImageTagger: React.FC<ImageTaggerProps> = ({ imageBase64, onDelete }) => {
    return (
        <div className="w-full bg-gray-200 border border-gray-300 p-4 rounded-lg ">
            <div className="flex flex-row items-start">
                <div className="flex w-full items-center-safe">
                    <AspectRatio ratio={16 / 9}>
                        <img
                            src={imageBase64}
                            alt="Uploaded"
                            className="h-full object-cover rounded-lg max-h-100"
                        />
                    </AspectRatio>
                </div>
                <div className='flex w-full flex-col'>
                    <ItemRow />
                    <ItemRow />
                    <ItemRow />
                </div>
            </div>
        </div>
    );
};

export default ImageTagger;