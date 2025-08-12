import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import { formatRupiah } from '@/lib/utils';
import TagBadge from '@/components/TagBadge';
import { Card } from '@/components/ui/card';
import { memo } from 'react';

interface ItemCardProps {
    tag: ImageTagItem;
    data: ItemData;
    onEditItem: (tagId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = memo(({
    tag,
    data,
    onEditItem
}) => {
    const formatDimensions = (data: ItemData) => {
        return `${data.length || 0} x ${data.width || 0} x ${data.height || 0} mm`;
    };

    const dimensions = formatDimensions(data);

    return (
        <Card className="gap-0 py-0 min-w-[400px] w-full border-none shadow-none cursor-pointer hover:bg-gray-50 hover:scale-[1.01] transition-transform duration-150 bg-white rounded-sm">
            {/* Header with type indicator */}
            <div className={`px-4 py-2 text-white text-sm font-medium rounded-t-sm ${data.type === 'Product' ? 'bg-blue-400' : 'bg-green-600'}`}>
                {data.type}
            </div>

            <div
                className="px-4 py-4 flex items-center gap-2 min-w-0 overflow-hidden"
                onClick={() => onEditItem(tag.id)}
            >
                {/* First column: Tag */}
                <div className="w-[5%] flex-shrink-0">
                    <TagBadge index={tag.index} />
                </div>

                {/* Second column: Title, Dimension, Notes */}
                <div className="w-[60%] flex flex-col gap-1 overflow-hidden">
                    <div className="font-semibold text-gray-700 truncate">
                        {data.name ? data.name : `Item #${tag.index}`}
                    </div>
                    {data.type === 'Product' && (
                        <div className="text-sm text-gray-600 truncate">
                            <span className="font-medium">Size:</span> {dimensions}
                        </div>
                    )}

                    <div className="text-sm text-gray-600">
                        <div className="text-xs text-gray-400 font-medium">Notes</div>
                        <div className="break-words">{data.notes}</div>
                    </div>

                </div>

                {/* Third column: Quantity, Unit Price, Total Price */}
                <div className="w-[35%] flex flex-col gap-1 text-right text-gray-800 overflow-hidden">
                    <div className="text-sm text-gray-600 truncate">
                        {formatRupiah(data.unitPrice)} / {data.type === 'Product' ? 'unit' : 'service'}
                    </div>
                    {data.type === 'Product' && (
                        <div className="text-sm text-right">
                            <span className="text-white bg-purple-500 rounded-lg px-2 py-1">
                                x {data.quantity}
                            </span>
                        </div>
                    )}
                    <div className="font-bold truncate">
                        Total {formatRupiah(data.type === 'Product' ? data.quantity * data.unitPrice : data.unitPrice)}
                    </div>
                </div>
            </div>

        </Card>
    );
});

export default ItemCard; 