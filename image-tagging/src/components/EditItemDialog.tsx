import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ItemData {
  name: string;
  type: 'Product' | 'Service';
  quantity: number;
  unitPrice: number;
  length: number;
  width: number;
  height: number;
  notes: string;
}

const EditItemDialog = ({
  open,
  onOpenChange,
  itemData,
  onSave,
  onDelete
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemData: ItemData | null;
  onSave: (data: ItemData) => void;
  onDelete: () => void;
}) => {
  const [editData, setEditData] = useState<ItemData>(itemData || {
    name: '',
    type: 'Product',
    quantity: 1,
    unitPrice: 0,
    length: 0,
    width: 0,
    height: 0,
    notes: ''
  });

  useEffect(() => {
    if (itemData) {
      setEditData(itemData);
    } else {
      setEditData({
        name: '',
        type: 'Product',
        quantity: 1,
        unitPrice: 0,
        length: 0,
        width: 0,
        height: 0,
        notes: ''
      });
    }
  }, [itemData, open]);

  const handleSave = () => {
    onSave(editData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  const handleNumberChange = (field: keyof ItemData, value: string) => {
    const num = value === '' ? 0 : Number(value);
    if (!isNaN(num)) {
      setEditData({ ...editData, [field]: num });
    }
  };

  const handleTypeChange = (newType: 'Product' | 'Service') => {
    setEditData((prev: ItemData) => ({
      ...prev,
      type: newType,
      // Reset dimensions when switching to Service
      length: newType === 'Service' ? 0 : prev.length,
      width: newType === 'Service' ? 0 : prev.width,
      height: newType === 'Service' ? 0 : prev.height,
      // Reset quantity to 1 if switching to Product
      quantity: newType === 'Product' ? (prev.quantity || 1) : 1
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Item</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Separator />

          {/* Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <Select value={editData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product/Service Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{editData.type} Name</label>
            <Input
              type="text"
              placeholder={`Enter ${editData.type.toLowerCase()} name`}
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
              className="input input-ghost"
            />
          </div>

          {/* Unit Price */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Price per {editData.type === 'Product' ? 'Unit' : 'Service'}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                Rp
              </span>
              <Input
                type="number"
                placeholder="0"
                value={editData.unitPrice === 0 ? '' : editData.unitPrice}
                onChange={e => handleNumberChange('unitPrice', e.target.value)}
                className="input input-ghost pl-8"
              />
            </div>
          </div>

          <Separator />

          {/* Conditional Dimensions and Quantity Row */}
          {editData.type === 'Product' ? (
            <div className="flex gap-4">
              {/* Dimensions */}
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium text-gray-700">Dimension</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Length(mm)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={editData.length === 0 ? '' : editData.length}
                      onChange={e => handleNumberChange('length', e.target.value)}
                      className="input input-ghost text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Width(mm)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={editData.width === 0 ? '' : editData.width}
                      onChange={e => handleNumberChange('width', e.target.value)}
                      className="input input-ghost text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Height(mm)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={editData.height === 0 ? '' : editData.height}
                      onChange={e => handleNumberChange('height', e.target.value)}
                      className="input input-ghost text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="flex items-center">
                <div className="w-px h-16 bg-gray-200"></div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-2 w-20">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">unit</label>
                  <Input
                    type="number"
                    value={editData.quantity}
                    onChange={e => handleNumberChange('quantity', e.target.value)}
                    className="input input-ghost text-center"
                    min="1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Services don't have dimensions or quantity.
            </div>
          )}

          <Separator />

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <Textarea
              placeholder="Enter notes..."
              value={editData.notes}
              onChange={e => setEditData({ ...editData, notes: e.target.value })}
              className="textarea textarea-ghost min-h-[80px] resize-none"
            />
          </div>

          <Separator />
        </div>

        <DialogFooter className="flex flex-row justify-between items-center mt-4">
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog; 