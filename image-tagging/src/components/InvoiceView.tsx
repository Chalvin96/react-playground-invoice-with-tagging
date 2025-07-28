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

interface InvoiceViewProps {
    imageItemsWithTags: Array<{
        id: string;
        title: string;
        tags: ImageTagItem[];
    }>;
    itemData: Record<string, ItemData>;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ imageItemsWithTags, itemData }) => {
    // Collect all items from all images
    const allItems: Array<{
        imageTitle: string;
        tagIndex: number;
        itemData: ItemData;
    }> = [];

    imageItemsWithTags.forEach((image) => {
        image.tags.forEach((tag) => {
            const data = itemData[tag.id];
            if (data && data.name) { // Only include items with names
                allItems.push({
                    imageTitle: image.title || 'Untitled',
                    tagIndex: tag.index,
                    itemData: data,
                });
            }
        });
    });

    // Calculate totals
    const grandTotal = allItems.reduce((sum, item) => {
        return sum + (item.itemData.quantity * item.itemData.unitPrice);
    }, 0);

    const totalQuantity = allItems.reduce((sum, item) => {
        return sum + item.itemData.quantity;
    }, 0);

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg border border-gray-200 shadow p-8 h-full overflow-y-auto">
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead className="w-[80px]">Tag #</TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead className="text-center w-[100px]">Quantity</TableHead>
                                <TableHead className="text-center w-[150px]">Unit Price</TableHead>
                                <TableHead className="text-center w-[150px]">Total Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allItems.map((item, index) => {
                                const totalPrice = item.itemData.quantity * item.itemData.unitPrice;
                                return (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{item.imageTitle}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto">
                                                {item.tagIndex}
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.itemData.name}</TableCell>
                                        <TableCell className="text-center">{item.itemData.quantity}</TableCell>
                                        <TableCell className="text-center">{formatRupiah(item.itemData.unitPrice)}</TableCell>
                                        <TableCell className="text-center font-semibold">{formatRupiah(totalPrice)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/* Summary Section */}
                    <div className="mt-8 border-t pt-6">
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