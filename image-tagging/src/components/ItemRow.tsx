import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ItemData } from '@/hooks/useItems';

interface ItemRowProps {
    tagIndex: number;
    onDelete: () => void;
    onUpdate: (data: ItemData) => void;
    initialData?: ItemData;
}

const ItemRow: React.FC<ItemRowProps> = ({ tagIndex, onDelete, onUpdate, initialData }) => {
    const [data, setData] = useState<ItemData>(initialData || {
        name: '',
        quantity: 0,
        unitPrice: 0
    });

    const totalPrice = data.quantity * data.unitPrice;

    const handleInputChange = useCallback((field: keyof ItemData, value: string | number) => {
        const newData = {
            ...data,
            [field]: field === 'name' ? value : Number(value) || 0
        };
        setData(newData);
        onUpdate(newData);
    }, [data, onUpdate]);

    return (
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-white">
            {/* Tag Index */}
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {tagIndex}
            </div>

            {/* Name Field */}
            <Label htmlFor={`item-name-${tagIndex}`} className="sr-only">Item Name</Label>
            <Input
                id={`item-name-${tagIndex}`}
                type="text"
                placeholder="Item name"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="flex-1"
            />

            {/* Quantity Field */}
            <Label htmlFor={`item-qty-${tagIndex}`} className="sr-only">Quantity</Label>
            <Input
                id={`item-qty-${tagIndex}`}
                type="text"
                placeholder="Qty"
                value={data.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-20"
            />

            {/* Unit Price Field */}
            <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Rp.
                </span>
                <Label htmlFor={`item-price-${tagIndex}`} className="sr-only">Unit Price</Label>
                <Input
                    id={`item-price-${tagIndex}`}
                    type="text"
                    placeholder="0"
                    value={data.unitPrice}
                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                    className="w-24 pl-8"
                />
            </div>

            {/* Total Price (Derived Field) */}
            <div className="w-24 px-2 py-1 bg-gray-100 rounded text-right font-medium">
                Rp. {totalPrice.toLocaleString()}
            </div>

            {/* Delete Button */}
            <Button
                onClick={onDelete}
                variant="destructive"
                size="sm"
                className="w-8 h-8 p-0"
            >
                ×
            </Button>
        </div>
    );
};

export default ItemRow;