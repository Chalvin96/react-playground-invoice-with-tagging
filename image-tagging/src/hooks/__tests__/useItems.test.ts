import { renderHook, act } from '@testing-library/react';
import { useItems } from '../useItems';

describe('useItems', () => {
    it('should initialize with empty item data', () => {
        const { result } = renderHook(() => useItems());

        expect(result.current.itemData).toEqual({});
    });

    it('should update item data', () => {
        const { result } = renderHook(() => useItems());
        const tagId = 'tag1';
        const itemData = {
            name: 'Test Item',
            quantity: 5,
            unitPrice: 100
        };

        act(() => {
            result.current.updateItemData(tagId, itemData);
        });

        expect(result.current.itemData[tagId]).toEqual(itemData);
    });

    it('should remove item data', () => {
        const { result } = renderHook(() => useItems());
        const tagId = 'tag1';
        const itemData = {
            name: 'Test Item',
            quantity: 5,
            unitPrice: 100
        };

        act(() => {
            result.current.updateItemData(tagId, itemData);
        });

        expect(result.current.itemData[tagId]).toBeDefined();

        act(() => {
            result.current.removeItemData(tagId);
        });

        expect(result.current.itemData[tagId]).toBeUndefined();
    });

    it('should add item for tag', () => {
        const { result } = renderHook(() => useItems());
        const tagId = 'tag1';

        act(() => {
            result.current.addItemForTag(tagId);
        });

        expect(result.current.itemData[tagId]).toEqual({
            name: '',
            quantity: 0,
            unitPrice: 0
        });
    });

    it('should remove items for image', () => {
        const { result } = renderHook(() => useItems());
        const imageId = 'img1';
        const tag1 = { id: 'tag1', baseImageId: imageId };
        const tag2 = { id: 'tag2', baseImageId: 'img2' };
        const imageTagItems = [tag1, tag2];

        act(() => {
            result.current.updateItemData('tag1', { name: 'Item 1', quantity: 1, unitPrice: 10 });
            result.current.updateItemData('tag2', { name: 'Item 2', quantity: 2, unitPrice: 20 });
        });

        expect(result.current.itemData['tag1']).toBeDefined();
        expect(result.current.itemData['tag2']).toBeDefined();

        act(() => {
            result.current.removeItemsForImage(imageId, imageTagItems);
        });

        expect(result.current.itemData['tag1']).toBeUndefined();
        expect(result.current.itemData['tag2']).toBeDefined(); // Should remain
    });

    it('should maintain multiple items', () => {
        const { result } = renderHook(() => useItems());
        const item1 = { name: 'Item 1', quantity: 1, unitPrice: 10 };
        const item2 = { name: 'Item 2', quantity: 2, unitPrice: 20 };

        act(() => {
            result.current.updateItemData('tag1', item1);
            result.current.updateItemData('tag2', item2);
        });

        expect(result.current.itemData['tag1']).toEqual(item1);
        expect(result.current.itemData['tag2']).toEqual(item2);
    });

    it('should update existing item data', () => {
        const { result } = renderHook(() => useItems());
        const tagId = 'tag1';
        const initialData = { name: 'Initial', quantity: 1, unitPrice: 10 };
        const updatedData = { name: 'Updated', quantity: 5, unitPrice: 50 };

        act(() => {
            result.current.updateItemData(tagId, initialData);
        });

        expect(result.current.itemData[tagId]).toEqual(initialData);

        act(() => {
            result.current.updateItemData(tagId, updatedData);
        });

        expect(result.current.itemData[tagId]).toEqual(updatedData);
    });
}); 