import { Button } from '@/components/ui/button';
import { Bell, Settings as SettingsIcon, AlertCircle, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';

interface NavigationProps {
  unreadCount?: number;
  onNotificationClick?: () => void;
}

export const Navigation = ({ unreadCount = 0, onNotificationClick }: NavigationProps) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Connected Plant Care</h1>
              <p className="text-xs text-muted-foreground">Smart monitoring system</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {location.pathname !== '/' && (
              <Link to="/">
                <Button variant="ghost" size="icon" title="Home">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
            )}
            
            <Link to="/alerts">
              <Button 
                variant={location.pathname === '/alerts' ? 'default' : 'ghost'} 
                size="icon"
                title="Alerts"
              >
                <AlertCircle className="w-5 h-5" />
              </Button>
            </Link>
            
            {onNotificationClick && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onNotificationClick}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center animate-pulse-soft">
                    {unreadCount}
                  </span>
                )}
              </Button>
            )}
            
            <Link to="/settings">
              <Button 
                variant={location.pathname === '/settings' ? 'default' : 'ghost'} 
                size="icon"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
