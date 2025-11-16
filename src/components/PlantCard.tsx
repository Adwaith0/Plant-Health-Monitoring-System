import { Plant } from '@/types/plant';
import { Card } from '@/components/ui/card';
import { Droplet, Thermometer, Sun, Calendar } from 'lucide-react';
import { getPlantStatus } from '@/utils/sensorSimulation';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
}

export const PlantCard = ({ plant, onClick }: PlantCardProps) => {
  const status = getPlantStatus(plant.moisture);
  const lastWateredText = new Date(plant.lastWatered).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] duration-300"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{plant.name}</h3>
            <p className="text-sm text-muted-foreground">{plant.type}</p>
          </div>
          <div className={cn('status-dot', `status-${status}`)} />
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplet className="w-4 h-4" />
              <span>Moisture</span>
            </div>
            <span className="font-medium text-foreground">{plant.moisture}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Thermometer className="w-4 h-4" />
              <span>Temp</span>
            </div>
            <span className="font-medium text-foreground">{plant.temperature}°C</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </div>
            <span className="font-medium text-foreground">{plant.light} lux</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Last watered</span>
            </div>
            <span className="text-xs font-medium text-foreground">{lastWateredText}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
