import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authStore';
import { useDeviceStore } from '@/stores/deviceStore';
import { useMqttService } from '@/hooks/useMqttService';
import { 
  LogOut, 
  Bell, 
  Wifi, 
  WifiOff,
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuthStore();
  const { activeDevice, devices } = useDeviceStore();
  const { isConnected } = useMqttService();
  const navigate = useNavigate();

  const onlineDevices = devices.filter(d => d.status === 'ONLINE').length;
  const totalDevices = devices.length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="-ml-1" />
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm font-medium">
              MQTT {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Devices:</span>
            <Badge variant={onlineDevices > 0 ? "default" : "secondary"}>
              {onlineDevices}/{totalDevices} Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {activeDevice && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active:</span>
            <Badge variant="outline">{activeDevice.name}</Badge>
          </div>
        )}

        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium">{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}