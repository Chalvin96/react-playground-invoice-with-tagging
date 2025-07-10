import { useState, useCallback } from 'react';

export interface ItemData {
    name: string;
    quantity: number;
    unitPrice: number;
}

export const useItems = () => {
    const [itemData, setItemData] = useState<Record<string, ItemData>>({});

    const updateItemData = useCallback((tagId: string, data: ItemData) => {
        setItemData(prev => ({
            ...prev,
            [tagId]: data
        }));
    }, []);

    const removeItemData = useCallback((tagId: string) => {
        setItemData(prev => {
            const newItemData = { ...prev };
            delete newItemData[tagId];
            return newItemData;
        });
    }, []);

    const removeItemsForImage = useCallback((imageId: string, imageTagItems: any[]) => {
        setItemData(prev => {
            const newItemData = { ...prev };
            Object.keys(newItemData).forEach(tagId => {
                const tag = imageTagItems.find(t => t.id === tagId);
                if (tag && tag.baseImageId === imageId) {
                    delete newItemData[tagId];
                }
            });
            return newItemData;
        });
    }, []);

    const addItemForTag = useCallback((tagId: string) => {
        setItemData(prev => ({
            ...prev,
            [tagId]: {
                name: '',
                quantity: 0,
                unitPrice: 0
            }
        }));
    }, []);

    return {
        itemData,
        updateItemData,
        removeItemData,
        removeItemsForImage,
        addItemForTag
    };
}; 