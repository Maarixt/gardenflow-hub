import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeviceStore } from '@/stores/deviceStore';
import { useMqttService } from '@/hooks/useMqttService';
import { useAuthStore } from '@/stores/authStore';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { Widget, WidgetType } from '@/types';
import { 
  Plus, 
  Edit3, 
  Save, 
  Smartphone, 
  Activity,
  Droplets,
  Thermometer,
  Sun,
  Zap,
  Gauge
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock widgets for demonstration
const mockWidgets: Widget[] = [
  {
    id: 'widget-1',
    type: 'GAUGE',
    title: 'Soil Moisture',
    deviceId: 'esp32-001',
    mqttTopic: 'saphari/sensors/soil_moisture',
    position: { x: 0, y: 0, w: 2, h: 2 },
    config: {
      label: 'Soil Moisture',
      unit: '%',
      min: 0,
      max: 100,
      threshold: { warning: 30, critical: 20 }
    },
    createdAt: new Date(),
  },
  {
    id: 'widget-2',
    type: 'TEXT_VALUE',
    title: 'Water Level',
    deviceId: 'esp32-001',
    mqttTopic: 'saphari/sensors/water_level',
    position: { x: 2, y: 0, w: 2, h: 2 },
    config: {
      label: 'Water Tank',
      unit: '%',
      threshold: { warning: 30, critical: 10 }
    },
    createdAt: new Date(),
  },
  {
    id: 'widget-3',
    type: 'SWITCH',
    title: 'Water Pump',
    deviceId: 'esp32-001',
    mqttTopic: 'saphari/relays/pump',
    position: { x: 4, y: 0, w: 2, h: 2 },
    config: {
      label: 'Irrigation Pump'
    },
    createdAt: new Date(),
  },
  {
    id: 'widget-4',
    type: 'CHART',
    title: 'Temperature Trend',
    deviceId: 'esp32-001',
    mqttTopic: 'saphari/sensors/temperature',
    position: { x: 0, y: 2, w: 3, h: 2 },
    config: {
      label: 'Temperature',
      unit: '°C',
      chartType: 'line' as const,
      timeRange: '24h' as const
    },
    createdAt: new Date(),
  },
  {
    id: 'widget-5',
    type: 'GAUGE',
    title: 'Light Sensor',
    deviceId: 'esp32-001',
    mqttTopic: 'saphari/sensors/light_sensor',
    position: { x: 3, y: 2, w: 2, h: 2 },
    config: {
      label: 'Light Level',
      unit: 'lux',
      min: 0,
      max: 1024
    },
    createdAt: new Date(),
  },
];

export default function Dashboard() {
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(mockWidgets);
  const [sensorValues, setSensorValues] = useState<Record<string, any>>({});
  
  const { activeDevice, devices } = useDeviceStore();
  const { messages, publish } = useMqttService();
  const { user } = useAuthStore();

  // Process MQTT messages to update sensor values
  useEffect(() => {
    const latestValues: Record<string, any> = {};
    
    messages.forEach(message => {
      latestValues[message.topic] = parseFloat(message.payload) || message.payload;
    });
    
    setSensorValues(prev => ({ ...prev, ...latestValues }));
  }, [messages]);

  const handleWidgetUpdate = (widgetId: string, value: any) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      // Publish to MQTT
      publish(widget.mqttTopic, String(value));
      
      // Update local state
      setSensorValues(prev => ({
        ...prev,
        [widget.mqttTopic]: value
      }));
    }
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type}`,
      deviceId: activeDevice?.id || 'esp32-001',
      mqttTopic: 'saphari/sensors/new',
      position: { x: 0, y: 0, w: 2, h: 2 },
      config: { label: `New ${type}` },
      createdAt: new Date(),
    };
    
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const onlineDevices = devices.filter(d => d.status === 'ONLINE').length;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control your smart garden devices
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select 
            defaultValue={activeDevice?.id}
            onValueChange={(deviceId) => {
              const device = devices.find(d => d.id === deviceId);
              // setActiveDevice would be called here
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map(device => (
                <SelectItem key={device.id} value={device.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      device.status === 'ONLINE' ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                    <span>{device.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={isBuilderMode ? 'default' : 'outline'}
            onClick={() => setIsBuilderMode(!isBuilderMode)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isBuilderMode ? 'Exit Builder' : 'Builder Mode'}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices Online</CardTitle>
            <Smartphone className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {onlineDevices}/{devices.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {onlineDevices > 0 ? 'All systems operational' : 'Check connections'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(sensorValues['saphari/sensors/soil_moisture'] || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Optimal range: 40-60%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(sensorValues['saphari/sensors/temperature'] || 0)}°C
            </div>
            <p className="text-xs text-muted-foreground">
              Perfect growing condition
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-widget-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Light Level</CardTitle>
            <Sun className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(sensorValues['saphari/sensors/light_sensor'] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lux measurement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Widget Palette (Builder Mode) */}
      {isBuilderMode && (
        <Card className="bg-gradient-card border-widget-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Widgets</span>
            </CardTitle>
            <CardDescription>
              Drag and drop widgets to customize your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWidget('GAUGE')}
              >
                <Gauge className="w-4 h-4 mr-2" />
                Gauge
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWidget('SWITCH')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Switch
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWidget('CHART')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Chart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWidget('TEXT_VALUE')}
              >
                <span className="w-4 h-4 mr-2 text-xs font-bold">T</span>
                Text Value
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {widgets.map(widget => (
          <div 
            key={widget.id}
            className={`col-span-${widget.position.w} row-span-${widget.position.h}`}
          >
            <WidgetCard
              widget={widget}
              value={sensorValues[widget.mqttTopic]}
              onUpdate={(value) => handleWidgetUpdate(widget.id, value)}
              onDelete={isBuilderMode ? () => removeWidget(widget.id) : undefined}
              onEdit={isBuilderMode ? () => console.log('Edit widget', widget.id) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <Card className="bg-gradient-card border-widget-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No widgets configured
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Enable Builder Mode to add and configure widgets for your dashboard. 
              Create a custom layout to monitor your smart garden devices.
            </p>
            <Button onClick={() => setIsBuilderMode(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Enter Builder Mode
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}