import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ImageItem } from '@/types/image';

export const useImages = () => {
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);

    const revokeIfBlobUrl = useCallback((url: string) => {
        try {
            if (typeof url === 'string' && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        } catch {
            // no-op
        }
    }, []);

    const addImage = useCallback((imageUrl: string, title: string = '') => {
        const newImageItem: ImageItem = {
            id: uuidv4(),
            imageUrl,
            timestamp: Date.now(),
            title,
            notes: '',
            order: Date.now(),
        };
        setImageItems(prev => [...prev, newImageItem]);
    }, []);

    const deleteImage = useCallback((id: string) => {
        setImageItems(prev => {
            const toDelete = prev.find(item => item.id === id);
            if (toDelete) {
                revokeIfBlobUrl(toDelete.imageUrl);
            }
            return prev.filter(item => item.id !== id);
        });
    }, [revokeIfBlobUrl]);

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

    const updateImage = useCallback((imageId: string, imageUrl: string, title: string) => {
        setImageItems(prev => prev.map(item => {
            if (item.id === imageId) {
                revokeIfBlobUrl(item.imageUrl);
                return { ...item, imageUrl, title };
            }
            return item;
        }));
    }, [revokeIfBlobUrl]);

    const moveImage = useCallback((dragId: string, hoverId: string) => {
        setImageItems(prev => {
            const current = [...prev];
            const dragIndex = current.findIndex(it => it.id === dragId);
            const hoverIndex = current.findIndex(it => it.id === hoverId);
            if (dragIndex === -1 || hoverIndex === -1 || dragIndex === hoverIndex) {
                return prev;
            }
            const updated = [...current];
            const [removed] = updated.splice(dragIndex, 1);
            updated.splice(hoverIndex, 0, removed);
            // Reassign incremental order to maintain stability
            return updated.map((img, idx) => ({ ...img, order: idx }));
        });
    }, []);


    return {
        imageItems,
        addImage,
        deleteImage,
        updateImageTitle,
        updateImageNotes,
        updateImage,
        moveImage
    };
}; 