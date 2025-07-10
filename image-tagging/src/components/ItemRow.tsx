import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface ItemRowProps {
    tagIndex: number;
    onDelete: () => void;
    onUpdate: (data: ItemData) => void;
    initialData?: ItemData;
}

interface ItemData {
    name: string;
    quantity: number;
    unitPrice: number;
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
            <input
                type="text"
                placeholder="Item name"
                value={data.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Quantity Field */}
            <input
                type="text"
                placeholder="Qty"
                value={data.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('quantity', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Unit Price Field */}
            <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Rp.
                </span>
                <input
                    type="text"
                    placeholder="0"
                    value={data.unitPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('unitPrice', e.target.value)}
                    className="w-24 pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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