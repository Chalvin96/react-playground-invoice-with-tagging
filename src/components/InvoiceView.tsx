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
import { formatRupiah } from '@/lib/utils';
import TagBadge from '@/components/TagBadge';

interface InvoiceViewProps {
    imageItemsWithTags: Array<{
        id: string;
        title: string;
        tags: ImageTagItem[];
    }>;
    itemData: Record<string, ItemData>;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ imageItemsWithTags, itemData }) => {
    const allItems: Array<{
        imageTitle: string;
        tagIndex: number;
        itemData: ItemData;
    }> = [];

    imageItemsWithTags.forEach((image) => {
        image.tags.forEach((tag) => {
            const data = itemData[tag.id];
            if (data) {
                allItems.push({
                    imageTitle: image.title || 'Untitled',
                    tagIndex: tag.index,
                    itemData: data,
                });
            }
        });
    });

    const grandTotal = allItems.reduce((sum, item) => {
        return sum + (item.itemData.quantity * item.itemData.unitPrice);
    }, 0);

    const totalQuantity = allItems.reduce((sum, item) => {
        return sum + item.itemData.quantity;
    }, 0);

    const formatDimensions = (data: ItemData) => {
        if (data.length || data.width || data.height) {
            return `${data.length || 0} x ${data.width || 0} x ${data.height || 0} mm`;
        }
        return '';
    };

    return (
        <div className="invoice-container w-full max-w-6xl mx-auto bg-white rounded-lg border border-gray-200 shadow p-8 h-full overflow-y-auto print:shadow-none print:border-none print:h-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice</h1>
            </div>

            {allItems.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Found</h3>
                    <p className="text-gray-500 text-sm">Add some items to your tagged images to see them here</p>
                </div>
            ) : (
                <>
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Tag #</TableHead>
                                <TableHead className="w-[400px]">Item Details</TableHead>
                                <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                                <TableHead className="w-[80px] text-center">Qty</TableHead>
                                <TableHead className="w-[120px] text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allItems.map((item, index) => {
                                const totalPrice = item.itemData.quantity * item.itemData.unitPrice;
                                const dimensions = formatDimensions(item.itemData);
                                return (
                                    <TableRow key={index} className="hover:bg-gray-50 print:break-inside-avoid">
                                        <TableCell className="text-center">
                                            <div className="mx-auto">
                                                <TagBadge index={item.tagIndex} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[400px] max-w-[400px] overflow-hidden">
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="font-medium text-gray-900 break-words">
                                                    {item.itemData.name || `Tag #${item.tagIndex} (Unnamed Item)`}
                                                </div>
                                                {dimensions && (
                                                    <div className="text-sm text-gray-500">
                                                        {dimensions}
                                                    </div>
                                                )}
                                                {item.itemData.notes && (
                                                    <div className="text-sm text-gray-600 mt-1 break-words overflow-wrap-anywhere whitespace-pre-wrap">
                                                        {item.itemData.notes}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-1">
                                                    From: {item.imageTitle}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{formatRupiah(item.itemData.unitPrice)}</TableCell>
                                        <TableCell className="text-center">{item.itemData.quantity}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatRupiah(totalPrice)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/* Summary Section */}
                    <div className="mt-8 border-t pt-6 print:break-inside-avoid">
                        <div className="flex justify-end">
                            <div className="w-80">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="font-medium">Total Items:</span>
                                    <span>{allItems.length}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="font-medium">Total Quantity:</span>
                                    <span>{totalQuantity}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 text-lg font-bold">
                                    <span>Grand Total:</span>
                                    <span className="text-purple-700">{formatRupiah(grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoiceView; 