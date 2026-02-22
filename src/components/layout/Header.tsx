import React from 'react';
import { Bell, Search, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({ alertCount }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.05);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search machines, sensors..." 
            className="w-80 pl-10 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-success" />
              <span className="text-xs text-success font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-destructive animate-pulse" />
              <span className="text-xs text-destructive font-medium">Reconnecting...</span>
            </>
          )}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-semibold">LIVE</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {alertCount > 9 ? '9+' : alertCount}
            </Badge>
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              {user?.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
