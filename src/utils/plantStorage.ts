import { Plant, Notification } from '@/types/plant';

const PLANTS_KEY = 'connected_plant_care_plants';
const NOTIFICATIONS_KEY = 'connected_plant_care_notifications';

export const loadPlants = (): Plant[] => {
  try {
    const stored = localStorage.getItem(PLANTS_KEY);
    if (!stored) return [];
    
    const plants = JSON.parse(stored);
    return plants.map((plant: any) => ({
      ...plant,
      lastWatered: new Date(plant.lastWatered),
    }));
  } catch (error) {
    console.error('Error loading plants:', error);
    return [];
  }
};

export const savePlants = (plants: Plant[]): void => {
  try {
    localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
  } catch (error) {
    console.error('Error saving plants:', error);
  }
};

export const loadNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!stored) return [];
    
    const notifications = JSON.parse(stored);
    return notifications.map((notif: any) => ({
      ...notif,
      timestamp: new Date(notif.timestamp),
    }));
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(PLANTS_KEY);
  localStorage.removeItem(NOTIFICATIONS_KEY);
};
