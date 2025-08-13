import { useState, useCallback, memo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { GripVertical } from 'lucide-react';

interface ThumbnailItemProps {
    img: {
        id: string;
        imageUrl: string;
        title: string;
    };
    isSelected: boolean;
    index: number;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onMove: (dragId: string, hoverId: string) => void;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = memo(({
    img,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onMove
}) => {
    const [openMenu, setOpenMenu] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'THUMBNAIL_ITEM',
        item: { id: img.id },
        collect: (monitor) => ({ isDragging: monitor.isDragging() })
    }), [img.id]);

    const [, drop] = useDrop(() => ({
        accept: 'THUMBNAIL_ITEM',
        hover: (item: { id: string }, monitor) => {
            if (!ref.current || item.id === img.id) return;
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only trigger move when crossing the midpoint to reduce jitter
            if (hoverClientY < hoverMiddleY) {
                onMove(item.id, img.id);
            } else if (hoverClientY > hoverMiddleY) {
                onMove(item.id, img.id);
            }
        }
    }), [img.id, onMove]);

    drop(ref);

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
            style={{ position: 'relative', opacity: isDragging ? 0.6 : 1 }}
            ref={ref}
        >
            <div className="flex items-center justify-between px-2 pt-2">
                <div ref={drag as any} className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700">
                    <GripVertical size={16} />
                </div>
                <Popover open={openMenu} onOpenChange={handleMenuToggle}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200  backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-4 w-4 text-gray-800" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 py-2 px-2" onClick={(e) => e.stopPropagation()}>
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
            <>
                <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-24 object-cover rounded-s border-none"
                    loading="lazy"
                />
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
        prevProps.img.imageUrl === nextProps.img.imageUrl
    );
});

export default ThumbnailItem; 