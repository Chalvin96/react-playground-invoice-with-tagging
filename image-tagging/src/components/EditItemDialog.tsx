import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { formatRupiah } from '@/lib/utils';

const EditItemDialog = ({
  open,
  onOpenChange,
  itemData,
  onSave,
  onDelete
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemData: any;
  onSave: (data: any) => void;
  onDelete: () => void;
}) => {
  const [editData, setEditData] = useState(itemData || { name: '', quantity: 0, unitPrice: 0 });

  useEffect(() => {
    if (itemData) {
      setEditData(itemData);
    } else {
      setEditData({ name: '', quantity: 0, unitPrice: 0 });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Edit Existing Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 bg-white">
          <label className="flex flex-col gap-1 font-medium text-gray-700">
            Name
            <input
              type="text"
              placeholder="Enter item name"
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
              className="border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>
          <label className="flex flex-col gap-1 font-medium text-gray-700">
            Quantity
            <input
              type="number"
              placeholder="Qty"
              value={editData.quantity === 0 ? '0' : String(editData.quantity)}
              onChange={e => {
                let val = e.target.value;
                if (val === '' || val === undefined) {
                  setEditData({ ...editData, quantity: 0 });
                  return;
                }
                if (isNaN(Number(val))) return;
                const stripped = val.replace(/^0+/, '');
                let num = stripped === '' ? 0 : Number(stripped);
                setEditData({ ...editData, quantity: num });
              }}
              className="border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>
          <label className="flex flex-col gap-1 font-medium text-gray-700">
            Unit Price
            <input
              type="number"
              placeholder="Unit Price"
              value={editData.unitPrice === 0 ? '0' : String(editData.unitPrice)}
              onChange={e => {
                let val = e.target.value;
                if (val === '' || val === undefined) {
                  setEditData({ ...editData, unitPrice: 0 });
                  return;
                }
                if (isNaN(Number(val))) return;
                const stripped = val.replace(/^0+/, '');
                let num = stripped === '' ? 0 : Number(stripped);
                setEditData({ ...editData, unitPrice: num });
              }}
              className="border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>
          <div className="font-semibold text-gray-700">Total: {formatRupiah(editData.quantity * editData.unitPrice)}</div>
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-between mt-4">
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog; 