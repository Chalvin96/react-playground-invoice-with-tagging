import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ImageItem {
    id: string;
    imageBase64: string;
    timestamp: number;
    title: string;
    notes: string;
}

export const useImages = () => {
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);

    const addImage = useCallback((imageBase64: string, title: string = '') => {
        const newImageItem: ImageItem = {
            id: uuidv4(),
            imageBase64,
            timestamp: Date.now(),
            title,
            notes: ''
        };
        setImageItems(prev => [...prev, newImageItem]);
    }, []);

    const deleteImage = useCallback((id: string) => {
        setImageItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateImageTitle = useCallback((imageId: string, title: string) => {
        setImageItems(prev => prev.map(item =>
            item.id === imageId ? { ...item, title } : item
        ));
    }, []);

    const updateImageNotes = useCallback((imageId: string, notes: string) => {
        setImageItems(prev => prev.map(item =>
            item.id === imageId ? { ...item, notes } : item
        ));
    }, []);

    const updateImage = useCallback((imageId: string, imageBase64: string, title: string) => {
        setImageItems(prev => prev.map(item =>
            item.id === imageId ? { ...item, imageBase64, title } : item
        ));
    }, []);

    return {
        imageItems,
        addImage,
        deleteImage,
        updateImageTitle,
        updateImageNotes,
        updateImage
    };
}; 