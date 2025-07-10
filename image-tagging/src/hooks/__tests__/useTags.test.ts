import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useTags } from '../useTags';

describe('useTags', () => {
    const mockImageItems = [
        { id: 'img1', timestamp: 1000 },
        { id: 'img2', timestamp: 2000 }
    ];

    it('should initialize with empty tag items', () => {
        const { result } = renderHook(() => useTags(mockImageItems));

        expect(result.current.imageTagItems).toEqual([]);
    });

    it('should add a tag', () => {
        const { result } = renderHook(() => useTags(mockImageItems));
        const onTagCreated = vi.fn();

        act(() => {
            result.current.addTag('img1', 50, 60, onTagCreated);
        });

        expect(result.current.imageTagItems).toHaveLength(1);
        expect(result.current.imageTagItems[0]).toMatchObject({
            baseImageId: 'img1',
            x: 50,
            y: 60,
            index: 1
        });
        expect(result.current.imageTagItems[0].id).toBeDefined();
        expect(onTagCreated).toHaveBeenCalledWith(result.current.imageTagItems[0].id);
    });

    it('should remove a tag', () => {
        const { result } = renderHook(() => useTags(mockImageItems));

        act(() => {
            result.current.addTag('img1', 50, 60);
        });

        const tagId = result.current.imageTagItems[0].id;

        act(() => {
            result.current.removeTag(tagId);
        });

        expect(result.current.imageTagItems).toHaveLength(0);
    });

    it('should drag a tag', () => {
        const { result } = renderHook(() => useTags(mockImageItems));

        act(() => {
            result.current.addTag('img1', 50, 60);
        });

        const tagId = result.current.imageTagItems[0].id;

        act(() => {
            result.current.dragTag(tagId, 75, 85);
        });

        expect(result.current.imageTagItems[0]).toMatchObject({
            x: 75,
            y: 85
        });
    });

    it('should remove tags for a specific image', () => {
        const { result } = renderHook(() => useTags(mockImageItems));

        act(() => {
            result.current.addTag('img1', 50, 60);
            result.current.addTag('img2', 100, 110);
        });

        expect(result.current.imageTagItems).toHaveLength(2);

        act(() => {
            result.current.removeTagsForImage('img1');
        });

        expect(result.current.imageTagItems).toHaveLength(1);
        expect(result.current.imageTagItems[0].baseImageId).toBe('img2');
    });

    it('should maintain continuous indexing across images', () => {
        const { result } = renderHook(() => useTags(mockImageItems));

        act(() => {
            result.current.addTag('img1', 50, 60);
            result.current.addTag('img2', 100, 110);
            result.current.addTag('img1', 150, 160);
        });

        expect(result.current.imageTagItems).toHaveLength(3);
        expect(result.current.imageTagItems[0].index).toBe(1);
        expect(result.current.imageTagItems[1].index).toBe(2);
        expect(result.current.imageTagItems[2].index).toBe(3);
    });

    it('should reindex tags when a tag is removed', () => {
        const { result } = renderHook(() => useTags(mockImageItems));

        act(() => {
            result.current.addTag('img1', 50, 60);
            result.current.addTag('img1', 100, 110);
            result.current.addTag('img1', 150, 160);
        });

        expect(result.current.imageTagItems).toHaveLength(3);
        expect(result.current.imageTagItems[0].index).toBe(1);
        expect(result.current.imageTagItems[1].index).toBe(2);
        expect(result.current.imageTagItems[2].index).toBe(3);

        const middleTagId = result.current.imageTagItems[1].id;

        act(() => {
            result.current.removeTag(middleTagId);
        });

        expect(result.current.imageTagItems).toHaveLength(2);
        expect(result.current.imageTagItems[0].index).toBe(1);
        expect(result.current.imageTagItems[1].index).toBe(2);
    });

    it('should sort tags by image timestamp first, then by original index', () => {
        const imageItemsWithDifferentTimestamps = [
            { id: 'img1', timestamp: 2000 }, // Later timestamp
            { id: 'img2', timestamp: 1000 }  // Earlier timestamp
        ];

        const { result } = renderHook(() => useTags(imageItemsWithDifferentTimestamps));

        act(() => {
            result.current.addTag('img1', 50, 60);  // Should get index 2
            result.current.addTag('img2', 100, 110); // Should get index 1
        });

        expect(result.current.imageTagItems).toHaveLength(2);
        expect(result.current.imageTagItems[0].baseImageId).toBe('img2');
        expect(result.current.imageTagItems[0].index).toBe(1);
        expect(result.current.imageTagItems[1].baseImageId).toBe('img1');
        expect(result.current.imageTagItems[1].index).toBe(2);
    });
}); 