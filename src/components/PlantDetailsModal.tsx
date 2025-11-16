import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plant } from '@/types/plant';
import { Droplet, Thermometer, Sun, Gauge, Droplets } from 'lucide-react';
import { getPlantStatus, generateMoistureHistory } from '@/utils/sensorSimulation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface PlantDetailsModalProps {
  plant: Plant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWaterNow: (plantId: string) => void;
  onUpdateAutoWater: (plantId: string, enabled: boolean, threshold: number) => void;
}

export const PlantDetailsModal = ({
  plant,
  open,
  onOpenChange,
  onWaterNow,
  onUpdateAutoWater,
}: PlantDetailsModalProps) => {
  const [isWatering, setIsWatering] = useState(false);
  const [autoWaterEnabled, setAutoWaterEnabled] = useState(false);
  const [threshold, setThreshold] = useState(30);
  const [chartData, setChartData] = useState<Array<{ date: string; moisture: number }>>([]);

  useEffect(() => {
    if (plant) {
      setAutoWaterEnabled(plant.autoWaterEnabled);
      setThreshold(plant.autoWaterThreshold);
      setChartData(generateMoistureHistory(plant.moisture));
    }
  }, [plant]);

  if (!plant) return null;

  const status = getPlantStatus(plant.moisture);

  const handleWaterNow = async () => {
    setIsWatering(true);
    onWaterNow(plant.id);
    
    setTimeout(() => {
      setIsWatering(false);
    }, 2000);
  };

  const handleAutoWaterToggle = (enabled: boolean) => {
    setAutoWaterEnabled(enabled);
    onUpdateAutoWater(plant.id, enabled, threshold);
  };

  const handleThresholdChange = (value: number[]) => {
    setThreshold(value[0]);
    if (autoWaterEnabled) {
      onUpdateAutoWater(plant.id, autoWaterEnabled, value[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header with image */}
          <div className="relative">
            <div className="aspect-[2/1] rounded-lg overflow-hidden bg-muted">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={cn('absolute top-4 right-4 status-dot w-4 h-4', `status-${status}`)} />
          </div>

          {/* Plant info */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{plant.name}</h2>
            <p className="text-muted-foreground">{plant.type} • {plant.location}</p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Droplet className="w-4 h-4" />
                <span className="text-sm">Moisture</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{plant.moisture}%</p>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm">Temperature</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{plant.temperature}°C</p>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Sun className="w-4 h-4" />
                <span className="text-sm">Light</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{plant.light} lux</p>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Gauge className="w-4 h-4" />
                <span className="text-sm">Water Tank</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{plant.waterTankLevel}%</p>
            </div>
          </div>

          {/* Water Now button */}
          <Button
            onClick={handleWaterNow}
            disabled={isWatering}
            className="w-full relative overflow-hidden"
            size="lg"
          >
            <Droplets className="w-5 h-5 mr-2" />
            {isWatering ? 'Watering...' : 'Water Now'}
            {isWatering && (
              <div className="absolute inset-0 bg-primary/30 animate-water-fill origin-bottom" />
            )}
          </Button>

          {/* Auto-water settings */}
          <div className="space-y-4 bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-water" className="text-base font-semibold">
                Auto-Watering
              </Label>
              <Switch
                id="auto-water"
                checked={autoWaterEnabled}
                onCheckedChange={handleAutoWaterToggle}
              />
            </div>

            {autoWaterEnabled && (
              <div className="space-y-2">
                <Label>Moisture Threshold: {threshold}%</Label>
                <Slider
                  value={[threshold]}
                  onValueChange={handleThresholdChange}
                  min={20}
                  max={70}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Plant will be watered automatically when moisture drops below {threshold}%
                </p>
              </div>
            )}
          </div>

          {/* Moisture history chart */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Moisture History (7 days)</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
