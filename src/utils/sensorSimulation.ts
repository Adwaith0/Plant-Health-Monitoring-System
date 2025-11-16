import { Plant } from '@/types/plant';

export const simulateSensorUpdate = (plant: Plant): Partial<Plant> => {
  // Simulate realistic sensor changes
  const moistureChange = (Math.random() - 0.5) * 3; // -1.5 to +1.5%
  const tempChange = (Math.random() - 0.5) * 1; // -0.5 to +0.5°C
  const lightChange = (Math.random() - 0.5) * 50; // -25 to +25 lux
  const tankChange = -Math.random() * 0.5; // Slowly decrease tank
  
  const newMoisture = Math.max(0, Math.min(100, plant.moisture + moistureChange));
  const newTemp = Math.max(10, Math.min(40, plant.temperature + tempChange));
  const newLight = Math.max(0, Math.min(2000, plant.light + lightChange));
  const newTankLevel = Math.max(0, Math.min(100, plant.waterTankLevel + tankChange));
  
  return {
    moisture: Math.round(newMoisture * 10) / 10,
    temperature: Math.round(newTemp * 10) / 10,
    light: Math.round(newLight),
    waterTankLevel: Math.round(newTankLevel * 10) / 10,
  };
};

export const getPlantStatus = (moisture: number): 'good' | 'warning' | 'danger' => {
  if (moisture >= 40) return 'good';
  if (moisture >= 20) return 'warning';
  return 'danger';
};

export const generateMoistureHistory = (currentMoisture: number, days: number = 7): Array<{ date: string; moisture: number }> => {
  const history = [];
  let moisture = currentMoisture + (Math.random() * 20 - 10);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    moisture = Math.max(15, Math.min(85, moisture + (Math.random() * 10 - 5)));
    
    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      moisture: Math.round(moisture * 10) / 10,
    });
  }
  
  return history;
};
