import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Appliance, ApplianceCategory } from '@/types/appliance';
import { calculateWarrantyExpiry } from '@/utils/dateUtils';

interface AddApplianceDialogProps {
  onAdd: (appliance: Omit<Appliance, 'id'>) => void;
}

const categories: { value: ApplianceCategory; label: string }[] = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'heating-cooling', label: 'Heating & Cooling' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'other', label: 'Other' },
];

export const AddApplianceDialog = ({ onAdd }: AddApplianceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseLocation: '',
    warrantyMonths: '',
    category: 'other' as ApplianceCategory,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.purchaseDate || !formData.warrantyMonths) {
      return;
    }

    const warrantyMonths = parseInt(formData.warrantyMonths);
    const warrantyExpiryDate = calculateWarrantyExpiry(formData.purchaseDate, warrantyMonths);

    const newAppliance: Omit<Appliance, 'id'> = {
      name: formData.name,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      serialNumber: formData.serialNumber || undefined,
      purchaseDate: formData.purchaseDate,
      purchaseLocation: formData.purchaseLocation || undefined,
      warrantyMonths,
      warrantyExpiryDate,
      category: formData.category,
      notes: formData.notes || undefined
    };

    onAdd(newAppliance);
    setFormData({
      name: '',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      purchaseLocation: '',
      warrantyMonths: '',
      category: 'other',
      notes: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add Appliance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Appliance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Samsung Refrigerator"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Samsung"
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="e.g., RF28R7351SG"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              placeholder="Serial number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="warrantyMonths">Warranty (Months) *</Label>
              <Input
                id="warrantyMonths"
                type="number"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData(prev => ({ ...prev, warrantyMonths: e.target.value }))}
                placeholder="12"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="purchaseLocation">Purchase Location</Label>
            <Input
              id="purchaseLocation"
              value={formData.purchaseLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, purchaseLocation: e.target.value }))}
              placeholder="e.g., Best Buy, Amazon"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value: ApplianceCategory) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this appliance..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Add Appliance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};