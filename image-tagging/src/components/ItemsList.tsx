import React from 'react';
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
                        const data = itemData[tag.id] || { name: '', quantity: 0, unitPrice: 0 };
                        const totalPrice = data.quantity * data.unitPrice;

                        const handleInputChange = (field: keyof ItemData, value: string | number) => {
                            const newData = {
                                ...data,
                                [field]: field === 'name' ? value : Number(value) || 0
                            };
                            onUpdateItemData(tag.id, newData);
                        };

                        return (
                            <TableRow key={tag.id} className="hover:bg-gray-50">
                                <TableCell className="text-center py-4">
                                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto">
                                        {tag.index}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Input
                                        type="text"
                                        placeholder="Enter item name"
                                        value={data.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="border-0 bg-transparent p-0 focus:ring-0 focus:border-0 text-gray-900"
                                    />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={data.quantity}
                                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                                        className="border-0 bg-transparent p-0 text-center focus:ring-0 focus:border-0 text-gray-900"
                                    />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="relative">
                                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                                            Rp.
                                        </span>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={data.unitPrice}
                                            onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                                            className="border-0 bg-transparent p-0 pl-8 text-center focus:ring-0 focus:border-0 text-gray-900"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="text-center font-semibold text-purple-700">
                                        Rp. {totalPrice.toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Button
                                        onClick={() => onDeleteTagAndItem(tag.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        ×
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default ItemsList; 