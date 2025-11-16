import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plant } from '@/types/plant';
import plant1 from '@/assets/plant1.jpg';
import plant2 from '@/assets/plant2.jpg';
import plant3 from '@/assets/plant3.jpg';

interface AddPlantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlant: (plant: Omit<Plant, 'id'>) => void;
}

const plantImages = [plant1, plant2, plant3];

export const AddPlantModal = ({ open, onOpenChange, onAddPlant }: AddPlantModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState<'indoor' | 'outdoor'>('indoor');
  const [selectedImage, setSelectedImage] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type) return;

    const newPlant: Omit<Plant, 'id'> = {
      name,
      type,
      location,
      image: plantImages[selectedImage],
      moisture: Math.round((Math.random() * 40 + 30) * 10) / 10,
      temperature: Math.round((Math.random() * 10 + 18) * 10) / 10,
      light: Math.round(Math.random() * 1000 + 500),
      waterTankLevel: Math.round((Math.random() * 40 + 60) * 10) / 10,
      lastWatered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      autoWaterEnabled: false,
      autoWaterThreshold: 30,
    };

    onAddPlant(newPlant);
    
    // Reset form
    setName('');
    setType('');
    setLocation('indoor');
    setSelectedImage(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Plant</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Monstera"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Plant Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Monstera deliciosa"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={(val) => setLocation(val as 'indoor' | 'outdoor')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Choose Plant Image</Label>
            <div className="grid grid-cols-3 gap-2">
              {plantImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  <img src={img} alt={`Plant ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Plant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
