
import type { ImageTagItem } from '@/hooks/useTags';
import type { ItemData } from '@/hooks/useItems';
import { Card } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';

interface ItemsListProps {
    tags: ImageTagItem[];
    itemData: Record<string, ItemData>;
    onEditItem: (tagId: string) => void;
}

const K_CONST_EMPTY_ROW_DATA = { name: '', quantity: 0, unitPrice: 0 }

const ItemsList: React.FC<ItemsListProps> = ({
    tags,
    itemData,
    onEditItem
}) => {
    if (tags.length === 0) {
        return (
            <>

                <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Yet</h3>
                        <p className="text-gray-500 text-sm">Click on the image to add tags and items</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {tags.map((tag) => {
                const data = itemData[tag.id] || K_CONST_EMPTY_ROW_DATA;
                return (
                    <Card
                        key={tag.id}
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
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default ItemsList; 