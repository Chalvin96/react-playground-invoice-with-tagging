import { renderHook, act } from '@testing-library/react';
import { useImages } from '../useImages';

describe('useImages', () => {
    it('should initialize with empty image items', () => {
        const { result } = renderHook(() => useImages());

        expect(result.current.imageItems).toEqual([]);
    });

    it('should add an image', () => {
        const { result } = renderHook(() => useImages());
        const imageBase64 = 'data:image/jpeg;base64,test-image-data';

        act(() => {
            result.current.addImage(imageBase64);
        });

        expect(result.current.imageItems).toHaveLength(1);
        expect(result.current.imageItems[0]).toMatchObject({
            imageBase64,
            title: '',
            notes: ''
        });
        expect(result.current.imageItems[0].id).toBeDefined();
        expect(result.current.imageItems[0].timestamp).toBeDefined();
    });

    it('should delete an image', () => {
        const { result } = renderHook(() => useImages());
        const imageBase64 = 'data:image/jpeg;base64,test-image-data';

        act(() => {
            result.current.addImage(imageBase64);
        });

        const imageId = result.current.imageItems[0].id;

        act(() => {
            result.current.deleteImage(imageId);
        });

        expect(result.current.imageItems).toHaveLength(0);
    });

    it('should update image title', () => {
        const { result } = renderHook(() => useImages());
        const imageBase64 = 'data:image/jpeg;base64,test-image-data';

        act(() => {
            result.current.addImage(imageBase64);
        });

        const imageId = result.current.imageItems[0].id;
        const newTitle = 'Test Image Title';

        act(() => {
            result.current.updateImageTitle(imageId, newTitle);
        });

        expect(result.current.imageItems[0].title).toBe(newTitle);
    });

    it('should update image notes', () => {
        const { result } = renderHook(() => useImages());
        const imageBase64 = 'data:image/jpeg;base64,test-image-data';

        act(() => {
            result.current.addImage(imageBase64);
        });

        const imageId = result.current.imageItems[0].id;
        const newNotes = 'Test notes for the image';

        act(() => {
            result.current.updateImageNotes(imageId, newNotes);
        });

        expect(result.current.imageItems[0].notes).toBe(newNotes);
    });

    it('should maintain multiple images', () => {
        const { result } = renderHook(() => useImages());
        const image1 = 'data:image/jpeg;base64,test-image-1';
        const image2 = 'data:image/jpeg;base64,test-image-2';

        act(() => {
            result.current.addImage(image1);
            result.current.addImage(image2);
        });

        expect(result.current.imageItems).toHaveLength(2);
        expect(result.current.imageItems[0].imageBase64).toBe(image1);
        expect(result.current.imageItems[1].imageBase64).toBe(image2);
    });

    it('should only delete the specified image', () => {
        const { result } = renderHook(() => useImages());
        const image1 = 'data:image/jpeg;base64,test-image-1';
        const image2 = 'data:image/jpeg;base64,test-image-2';

        act(() => {
            result.current.addImage(image1);
            result.current.addImage(image2);
        });

        const image1Id = result.current.imageItems[0].id;

        act(() => {
            result.current.deleteImage(image1Id);
        });

        expect(result.current.imageItems).toHaveLength(1);
        expect(result.current.imageItems[0].imageBase64).toBe(image2);
    });
}); 