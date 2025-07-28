import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import { Card } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';

interface ItemCardProps {
    tag: ImageTagItem;
    data: ItemData;
    onEditItem: (tagId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
    tag,
    data,
    onEditItem
}) => {
    const formatDimensions = (data: ItemData) => {
        if (data.length || data.width || data.height) {
            return `${data.length || 0} x ${data.width || 0} x ${data.height || 0} mm`;
        }
        return '';
    };

    const dimensions = formatDimensions(data);

    return (
        <Card
            className="p-4 flex flex-col gap-2 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-150 bg-white border-none"
            onClick={() => onEditItem(tag.id)}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {tag.index}
                </div>
                <span className="font-semibold text-gray-700">{data.name ? data.name : `Tag #${tag.index}`}</span>
            </div>
            <div className="flex flex-col gap-1 text-gray-800">
                <div className="flex gap-4">
                    <span><span className="font-medium">Qty:</span> {data.quantity}</span>
                    <span><span className="font-medium">Unit Price:</span> {formatRupiah(data.unitPrice)}</span>
                </div>
                <div><span className="font-medium">Total:</span> {formatRupiah(data.quantity * data.unitPrice)}</div>
                {dimensions && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Size:</span> {dimensions}
                    </div>
                )}
                {data.notes && (
                    <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Notes:</span> {data.notes}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ItemCard; 