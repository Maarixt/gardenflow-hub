import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDeviceStore } from '@/stores/deviceStore';
import { 
  Plus, 
  Search, 
  Smartphone, 
  Wifi, 
  WifiOff,
  Settings,
  Power,
  Activity,
  MapPin,
  Clock,
  Cpu
} from 'lucide-react';
import { Device } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState('');
  const { devices, setActiveDevice, activeDevice } = useDeviceStore();
  
  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'ONLINE': return 'bg-success text-success-foreground';
      case 'OFFLINE': return 'bg-muted text-muted-foreground';
      case 'ERROR': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'ONLINE': return <Wifi className="w-4 h-4" />;
      case 'OFFLINE': return <WifiOff className="w-4 h-4" />;
      case 'ERROR': return <Power className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Device Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your IoT devices
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Configure a new IoT device for your smart garden system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Device provisioning wizard coming soon. This will support:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li>• Wi-Fi AP provisioning</li>
                <li>• BLE-assisted setup</li>
                <li>• QR code configuration</li>
                <li>• Firmware OTA updates</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Device Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered devices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Wifi className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {devices.filter(d => d.status === 'ONLINE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {devices.filter(d => d.status === 'OFFLINE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <Card 
            key={device.id}
            className={`bg-gradient-card border-widget-border hover:shadow-card transition-all cursor-pointer ${
              activeDevice?.id === device.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveDevice(device)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{device.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {device.type}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  className={getStatusColor(device.status)}
                  variant="secondary"
                >
                  {getStatusIcon(device.status)}
                  <span className="ml-1">{device.status}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Device Info */}
              <div className="space-y-2">
                {device.ipAddress && (
                  <div className="flex items-center text-sm">
                    <Activity className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">IP:</span>
                    <span className="ml-1 font-mono">{device.ipAddress}</span>
                  </div>
                )}
                
                {device.metadata?.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-1">{device.metadata.location}</span>
                  </div>
                )}

                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">Last seen:</span>
                  <span className="ml-1">
                    {new Date(device.lastSeen).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Firmware Version */}
              {device.firmwareVersion && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Firmware:</span>
                    <Badge variant="outline" className="text-xs">
                      v{device.firmwareVersion}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Sensors */}
              {device.metadata?.sensors && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Sensors:</p>
                  <div className="flex flex-wrap gap-1">
                    {device.metadata.sensors.map((sensor: string) => (
                      <Badge 
                        key={sensor}
                        variant="secondary" 
                        className="text-xs"
                      >
                        {sensor.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                {activeDevice?.id === device.id && (
                  <Badge variant="default" className="px-3 py-1">
                    Active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDevices.length === 0 && (
        <Card className="bg-gradient-card border-widget-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Smartphone className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No devices found
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm 
                ? `No devices match "${searchTerm}". Try adjusting your search.`
                : 'Add your first IoT device to start monitoring your smart garden.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}