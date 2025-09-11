import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDevice } from "./api";

export default function CreateDeviceCard({ systemId }: { systemId: string }) {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const deviceResult = await createDevice(systemId, name);
      setResult(deviceResult);
    } catch (error) {
      console.error("Failed to create device:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Device</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="device-name">Device Name</Label>
          <Input
            id="device-name"
            placeholder="ESP32 Garden Hub"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleCreate} 
          disabled={loading || !name.trim()}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Device"}
        </Button>
        
        {result && (
          <div className="mt-4">
            <Label>Device Configuration (paste into ESP32 code):</Label>
            <pre className="text-xs bg-muted p-3 rounded-md mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}