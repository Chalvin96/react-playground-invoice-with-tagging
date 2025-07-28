
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import ItemCard from './ItemCard';

interface ItemsListProps {
    tags: ImageTagItem[];
    itemData: Record<string, ItemData>;
    onEditItem: (tagId: string) => void;
}

const K_CONST_EMPTY_ROW_DATA: ItemData = {
    name: '',
    quantity: 0,
    unitPrice: 0,
    length: 0,
    width: 0,
    height: 0,
    notes: ''
}

const ItemsList: React.FC<ItemsListProps> = ({
    tags,
    itemData,
    onEditItem
}) => {
    if (tags.length === 0) {
        return (
            <>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Yet</h3>
                    <p className="text-gray-500 text-sm">Click on the image to add tags and items</p>
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {tags.map((tag) => {
                const data = itemData[tag.id] || K_CONST_EMPTY_ROW_DATA;
                return (
                    <ItemCard
                        key={tag.id}
                        tag={tag}
                        data={data}
                        onEditItem={onEditItem}
                    />
                );
            })}
        </div>
    );
};

export default ItemsList; 