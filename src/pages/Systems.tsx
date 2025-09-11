import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getSystems, createSystem, getDevices } from "@/features/devices/api";
import CreateDeviceCard from "@/features/devices/CreateDeviceCard";
import DeviceConsole from "@/features/devices/DeviceConsole";
import Builder from "@/features/dashboard/Builder";
import { Plus, Settings, Activity, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Systems() {
  const [systems, setSystems] = useState<any[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [newSystemName, setNewSystemName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSystems();
  }, []);

  useEffect(() => {
    if (selectedSystem) {
      loadDevices(selectedSystem);
    }
  }, [selectedSystem]);

  const loadSystems = async () => {
    try {
      const data = await getSystems();
      setSystems(data);
      if (data.length > 0 && !selectedSystem) {
        setSelectedSystem(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load systems:", error);
    }
  };

  const loadDevices = async (systemId: string) => {
    try {
      const data = await getDevices(systemId);
      setDevices(data);
    } catch (error) {
      console.error("Failed to load devices:", error);
    }
  };

  const handleCreateSystem = async () => {
    if (!newSystemName.trim()) return;
    
    setLoading(true);
    try {
      await createSystem(newSystemName);
      setNewSystemName("");
      await loadSystems();
    } catch (error) {
      console.error("Failed to create system:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedSystemData = systems.find(s => s.id === selectedSystem);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Systems</h1>
          <p className="text-muted-foreground">
            Manage your IoT systems and devices
          </p>
        </div>
        
        <Badge variant="secondary">
          {systems.length}/10 systems
        </Badge>
      </div>

      {/* Create New System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New System
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="System name (e.g., Smart Garden)"
            value={newSystemName}
            onChange={(e) => setNewSystemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateSystem()}
          />
          <Button 
            onClick={handleCreateSystem} 
            disabled={loading || !newSystemName.trim() || systems.length >= 10}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </CardContent>
      </Card>

      {/* Systems List & Management */}
      {systems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Systems Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Systems</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {systems.map((system) => (
                <Button
                  key={system.id}
                  variant={selectedSystem === system.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSystem(system.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {system.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedSystemData && (
              <Tabs defaultValue="devices" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="devices" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Devices
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Dashboard
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="devices" className="space-y-4">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* Create Device */}
                    <CreateDeviceCard systemId={selectedSystem!} />
                    
                    {/* Device Consoles */}
                    {devices.map((device) => (
                      <DeviceConsole key={device.id} deviceId={device.id} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="dashboard">
                  <Builder systemId={selectedSystem!} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      )}

      {systems.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No systems yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Create your first IoT system to start managing devices and building dashboards.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}