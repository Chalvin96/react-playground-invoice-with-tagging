import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';

const AddItemDialog = ({
  open,
  onOpenChange,
  itemData,
  onSave,
  onCancel
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [editData, setEditData] = useState(itemData || {
    name: '',
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

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleNumberChange = (field: string, value: string) => {
    const num = value === '' ? 0 : Number(value);
    if (!isNaN(num)) {
      setEditData({ ...editData, [field]: num });
    }
  };

  const incrementQuantity = () => {
    setEditData({ ...editData, quantity: editData.quantity + 1 });
  };

  const decrementQuantity = () => {
    if (editData.quantity > 1) {
      setEditData({ ...editData, quantity: editData.quantity - 1 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Item</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Separator />

          {/* Product Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <Input
              type="text"
              placeholder="Enter product name"
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
              className="input input-ghost"
            />
          </div>

          {/* Unit Price */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Unit Price</label>
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

          {/* Dimensions and Quantity Row */}
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
            <div className="flex flex-col gap-2 w-32">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={decrementQuantity}
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={editData.quantity}
                  onChange={e => handleNumberChange('quantity', e.target.value)}
                  className="input input-ghost text-center flex-1"
                  min="1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={incrementQuantity}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
              <span className="text-xs text-gray-500 text-center">unit</span>
            </div>
          </div>

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

        <DialogFooter className="flex flex-row gap-2 justify-between mt-4">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog; 