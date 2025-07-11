import React from 'react';
import ItemRow from './ItemRow';
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ItemsListProps {
    tags: ImageTagItem[];
    itemData: Record<string, ItemData>;
    onUpdateItemData: (tagId: string, data: ItemData) => void;
    onDeleteTagAndItem: (tagId: string) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({
    tags,
    itemData,
    onUpdateItemData,
    onDeleteTagAndItem
}) => {
    if (tags.length === 0) {
        return (
            <Card className="space-y-2">
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        No Item Yet
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="space-y-2">
            <CardContent>
                {/* Header */}
                <div className="flex items-center gap-2 p-2 font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        #
                    </div>
                    <div className="flex-1">Item Name</div>
                    <div className="w-20">Qty</div>
                    <div className="w-24">Unit Price</div>
                    <div className="w-24">Total Price</div>
                    <div className="w-8"></div>
                </div>
                <Separator className="my-2" />
                {/* Item Rows */}
                {tags.map((tag) => (
                    <ItemRow
                        key={tag.id}
                        tagIndex={tag.index}
                        onDelete={() => onDeleteTagAndItem(tag.id)}
                        onUpdate={(data) => onUpdateItemData(tag.id, data)}
                        initialData={itemData[tag.id]}
                    />
                ))}
            </CardContent>
        </Card>
    );
};

export default ItemsList; 