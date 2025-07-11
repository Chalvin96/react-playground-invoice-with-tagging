import React from 'react';
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import ItemRow from './ItemRow';

interface ItemsListProps {
    tags: ImageTagItem[];
    itemData: Record<string, ItemData>;
    onUpdateItemData: (tagId: string, data: ItemData) => void;
    onDeleteTagAndItem: (tagId: string) => void;
}

const K_CONST_EMPTY_ROW_DATA = { name: '', quantity: 0, unitPrice: 0 }

const ItemsList: React.FC<ItemsListProps> = ({
    tags,
    itemData,
    onUpdateItemData,
    onDeleteTagAndItem
}) => {
    if (tags.length === 0) {
        return (
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Yet</h3>
                    <p className="text-gray-500 text-sm">Click on the image to add tags and items</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-100">
                        <TableHead className="w-16 text-center font-semibold text-gray-700">#</TableHead>
                        <TableHead className="font-semibold text-gray-700">Item Name</TableHead>
                        <TableHead className="w-24 text-center font-semibold text-gray-700">Qty</TableHead>
                        <TableHead className="w-32 text-center font-semibold text-gray-700">Unit Price</TableHead>
                        <TableHead className="w-32 text-center font-semibold text-gray-700">Total Price</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tags.map((tag) => {
                        const data = itemData[tag.id] || K_CONST_EMPTY_ROW_DATA;

                        return (
                            <ItemRow
                                key={tag.id}
                                tag={tag}
                                data={data}
                                onUpdateItemData={onUpdateItemData}
                                onDeleteTagAndItem={onDeleteTagAndItem}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default ItemsList; 