import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Leaf, Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Plant, Notification } from '@/types/plant';
import { PlantCard } from '@/components/PlantCard';
import { AddPlantModal } from '@/components/AddPlantModal';
import { PlantDetailsModal } from '@/components/PlantDetailsModal';
import { NotificationPanel } from '@/components/NotificationPanel';
import { loadPlants, savePlants, loadNotifications, saveNotifications } from '@/utils/plantStorage';
import { simulateSensorUpdate, getPlantStatus } from '@/utils/sensorSimulation';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';
import plant1 from '@/assets/plant1.jpg';
import plant2 from '@/assets/plant2.jpg';
import plant3 from '@/assets/plant3.jpg';

const Index = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { toast } = useToast();

  // Initialize with demo data if no plants exist
  useEffect(() => {
    const storedPlants = loadPlants();
    const storedNotifications = loadNotifications();
    
    if (storedPlants.length === 0) {
      // Create demo plants
      const demoPlants: Plant[] = [
        {
          id: '1',
          name: 'Monstera',
          type: 'Monstera deliciosa',
          location: 'indoor',
          image: plant1,
          moisture: 65,
          temperature: 22,
          light: 800,
          waterTankLevel: 85,
          lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          autoWaterEnabled: false,
          autoWaterThreshold: 30,
        },
        {
          id: '2',
          name: 'Snake Plant',
          type: 'Sansevieria',
          location: 'indoor',
          image: plant2,
          moisture: 35,
          temperature: 21,
          light: 600,
          waterTankLevel: 70,
          lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          autoWaterEnabled: true,
          autoWaterThreshold: 30,
        },
        {
          id: '3',
          name: 'Pothos',
          type: 'Epipremnum aureum',
          location: 'indoor',
          image: plant3,
          moisture: 18,
          temperature: 23,
          light: 750,
          waterTankLevel: 45,
          lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          autoWaterEnabled: false,
          autoWaterThreshold: 30,
        },
      ];
      
      setPlants(demoPlants);
      savePlants(demoPlants);
    } else {
      setPlants(storedPlants);
    }
    
    setNotifications(storedNotifications);
  }, []);

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlants((currentPlants) => {
        const updatedPlants = currentPlants.map((plant) => {
          const updates = simulateSensorUpdate(plant);
          const updatedPlant = { ...plant, ...updates };
          
          // Check for auto-watering trigger
          if (
            updatedPlant.autoWaterEnabled &&
            updatedPlant.moisture < updatedPlant.autoWaterThreshold &&
            updatedPlant.waterTankLevel > 5
          ) {
            // Trigger auto-water
            const wateredPlant = {
              ...updatedPlant,
              moisture: Math.min(100, updatedPlant.moisture + 25),
              waterTankLevel: Math.max(0, updatedPlant.waterTankLevel - 5),
              lastWatered: new Date(),
            };
            
            // Create notification
            const newNotification: Notification = {
              id: Date.now().toString() + Math.random(),
              plantId: plant.id,
              plantName: plant.name,
              message: `Auto-watered (moisture was ${updatedPlant.moisture.toFixed(1)}%)`,
              type: 'info',
              timestamp: new Date(),
              read: false,
            };
            
            setNotifications((prev) => {
              const updated = [newNotification, ...prev];
              saveNotifications(updated);
              return updated;
            });
            
            return wateredPlant;
          }
          
          return updatedPlant;
        });
        
        savePlants(updatedPlants);
        return updatedPlants;
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Check for low moisture and create notifications
  useEffect(() => {
    plants.forEach((plant) => {
      const status = getPlantStatus(plant.moisture);
      
      if (status === 'danger' || status === 'warning') {
        const existingNotif = notifications.find(
          (n) => n.plantId === plant.id && n.message.includes('Moisture')
        );
        
        if (!existingNotif) {
          const newNotification: Notification = {
            id: Date.now().toString() + Math.random(),
            plantId: plant.id,
            plantName: plant.name,
            message: `Moisture is ${status === 'danger' ? 'critically' : ''} low at ${plant.moisture}%`,
            type: status === 'danger' ? 'danger' : 'warning',
            timestamp: new Date(),
            read: false,
          };
          
          setNotifications((prev) => {
            const updated = [newNotification, ...prev];
            saveNotifications(updated);
            return updated;
          });
        }
      }
      
      if (plant.waterTankLevel < 20) {
        const existingNotif = notifications.find(
          (n) => n.plantId === plant.id && n.message.includes('Water tank')
        );
        
        if (!existingNotif) {
          const newNotification: Notification = {
            id: Date.now().toString() + Math.random(),
            plantId: plant.id,
            plantName: plant.name,
            message: `Water tank is low at ${plant.waterTankLevel.toFixed(1)}%`,
            type: 'warning',
            timestamp: new Date(),
            read: false,
          };
          
          setNotifications((prev) => {
            const updated = [newNotification, ...prev];
            saveNotifications(updated);
            return updated;
          });
        }
      }
    });
  }, [plants]);

  const handleAddPlant = (newPlant: Omit<Plant, 'id'>) => {
    const plant: Plant = {
      ...newPlant,
      id: Date.now().toString(),
    };
    
    const updatedPlants = [...plants, plant];
    setPlants(updatedPlants);
    savePlants(updatedPlants);
    
    toast({
      title: 'Plant added!',
      description: `${plant.name} has been added to your garden.`,
    });
  };

  const handleWaterNow = (plantId: string) => {
    setPlants((currentPlants) => {
      const updatedPlants = currentPlants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              moisture: Math.min(100, plant.moisture + 30),
              waterTankLevel: Math.max(0, plant.waterTankLevel - 10),
              lastWatered: new Date(),
            }
          : plant
      );
      savePlants(updatedPlants);
      return updatedPlants;
    });
    
    toast({
      title: 'Watering complete!',
      description: 'Your plant has been watered.',
    });
  };

  const handleUpdateAutoWater = (plantId: string, enabled: boolean, threshold: number) => {
    setPlants((currentPlants) => {
      const updatedPlants = currentPlants.map((plant) =>
        plant.id === plantId
          ? { ...plant, autoWaterEnabled: enabled, autoWaterThreshold: threshold }
          : plant
      );
      savePlants(updatedPlants);
      return updatedPlants;
    });
  };

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setDetailsModalOpen(true);
  };

  const handleNotificationClick = (plantId: string) => {
    const plant = plants.find((p) => p.id === plantId);
    if (plant) {
      handlePlantClick(plant);
    }
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notificationId);
      saveNotifications(updated);
      return updated;
    });
  };

  const avgMoisture =
    plants.length > 0
      ? Math.round(plants.reduce((sum, p) => sum + p.moisture, 0) / plants.length)
      : 0;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Connected Plant Care</h1>
                <p className="text-xs text-muted-foreground">Smart monitoring system</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/alerts">
                <Button variant="ghost" size="icon">
                  <AlertCircle className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotificationPanelOpen(true)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center animate-pulse-soft">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back! 🌱
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span>{plants.length} plants</span>
            </div>
            <div>
              <span>Avg. moisture: {avgMoisture}%</span>
            </div>
          </div>
        </div>

        {/* Plants grid */}
        {plants.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No plants yet</h3>
            <p className="text-muted-foreground mb-6">Add your first plant to get started!</p>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Plant
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} onClick={() => handlePlantClick(plant)} />
            ))}
          </div>
        )}

        {/* Floating action button */}
        {plants.length > 0 && (
          <Button
            onClick={() => setAddModalOpen(true)}
            size="lg"
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </main>

      {/* Modals */}
      <AddPlantModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddPlant={handleAddPlant}
      />
      
      <PlantDetailsModal
        plant={selectedPlant}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onWaterNow={handleWaterNow}
        onUpdateAutoWater={handleUpdateAutoWater}
      />
      
      <NotificationPanel
        open={notificationPanelOpen}
        onOpenChange={setNotificationPanelOpen}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onDismissNotification={handleDismissNotification}
      />
    </div>
  );
};

export default Index;
