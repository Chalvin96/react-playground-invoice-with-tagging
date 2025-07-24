
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ItemRowProps {
    tag: ImageTagItem;
    data: ItemData;
    onUpdateItemData: (tagId: string, data: ItemData) => void;
    onDeleteTagAndItem: (tagId: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
    tag,
    data,
    onUpdateItemData,
    onDeleteTagAndItem
}) => {
    const totalPrice = data.quantity * data.unitPrice;

    const handleInputChange = (field: keyof ItemData, value: string | number) => {
        const newData = {
            ...data,
            [field]: field === 'name' ? value : Number(value) || 0
        };
        onUpdateItemData(tag.id, newData);
    };

    return (
        <TableRow className="hover:bg-gray-50">
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
                    type="text"
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
                        type="text"
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
};

export default ItemRow; 