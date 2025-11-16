export interface Plant {
  id: string;
  name: string;
  type: string;
  location: 'indoor' | 'outdoor';
  image: string;
  moisture: number;
  temperature: number;
  light: number;
  waterTankLevel: number;
  lastWatered: Date;
  autoWaterEnabled: boolean;
  autoWaterThreshold: number;
}

export interface Notification {
  id: string;
  plantId: string;
  plantName: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  timestamp: Date;
  read: boolean;
}

export interface SensorHistory {
  timestamp: Date;
  moisture: number;
}
