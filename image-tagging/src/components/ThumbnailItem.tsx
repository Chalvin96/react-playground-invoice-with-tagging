import { useState, useCallback, memo } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MoreHorizontal } from 'lucide-react';

interface ThumbnailItemProps {
    img: {
        id: string;
        imageBase64: string;
        title: string;
    };
    isSelected: boolean;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = memo(({
    img,
    isSelected,
    onSelect,
    onEdit,
    onDelete
}) => {
    const [openMenu, setOpenMenu] = useState(false);

    const handleSelect = useCallback(() => {
        onSelect(img.id);
    }, [onSelect, img.id]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(img.id);
        setOpenMenu(false);
    }, [onEdit, img.id]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(img.id);
        setOpenMenu(false);
    }, [onDelete, img.id]);

    const handleMenuToggle = useCallback((open: boolean) => {
        setOpenMenu(open);
    }, []);

    return (
        <div
            className={`rounded-s cursor-pointer flex flex-col gap-1 p-0 hover:bg-purple-50 transition ${isSelected ? 'bg-purple-100 border-2 border-purple-400' : ''}`}
            onClick={handleSelect}
            style={{ position: 'relative' }}
        >
            <>
                <img
                    src={img.imageBase64}
                    alt={img.title}
                    className="w-full h-24 object-cover rounded-s border-none"
                    loading="lazy"
                />
                <div className="absolute top-1 right-1">
                    <Popover open={openMenu} onOpenChange={handleMenuToggle}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-200 bg-white/80 backdrop-blur-sm shadow-sm"
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-800" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 py-2 px-2">
                            <Button
                                className="w-full justify-center hover:bg-purple-50 font-medium rounded-none"
                                variant="ghost"
                                onClick={handleEdit}
                            >
                                Edit
                            </Button>
                            <Button
                                className="w-full justify-center text-red-700 hover:text-red-800 hover:bg-red-50 font-medium rounded-none"
                                variant="ghost"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </>
            <div className="px-2 pb-2 pt-1 text-xs text-gray-700 truncate w-full text-center">
                {img.title || 'Untitled'}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.img.id === nextProps.img.id &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.img.title === nextProps.img.title &&
        prevProps.img.imageBase64 === nextProps.img.imageBase64
    );
});

export default ThumbnailItem; 