import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/plant';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onNotificationClick: (plantId: string) => void;
  onDismissNotification: (notificationId: string) => void;
}

export const NotificationPanel = ({
  open,
  onOpenChange,
  notifications,
  onNotificationClick,
  onDismissNotification,
}: NotificationPanelProps) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-danger" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {sortedNotifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'relative bg-card border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md',
                  !notification.read && 'border-l-4 border-l-primary'
                )}
                onClick={() => {
                  onNotificationClick(notification.plantId);
                  onOpenChange(false);
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismissNotification(notification.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="flex gap-3 pr-6">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">{notification.plantName}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
