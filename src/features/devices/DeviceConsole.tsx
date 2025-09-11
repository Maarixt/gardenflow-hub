import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDevices } from "@/stores/devices";
import { useTelemetry } from "@/stores/telemetry";
import { getMqtt } from "@/lib/mqtt";
import { topics } from "@/types/mqtt";
import { Activity, Wifi, WifiOff } from "lucide-react";

export default function DeviceConsole({ deviceId }: { deviceId: string }) {
  const dev = useDevices((s) => s.devices[deviceId]);
  const tele = useTelemetry((s) => s.byDevice[deviceId] ?? {});
  const [cmd, setCmd] = useState('{"ts":0,"command":"relay.set","params":{"pin":26,"value":1}}');

  function send() {
    const c = getMqtt();
    c.publish(topics(deviceId).cmd, cmd, { qos: 0 });
  }

  const isOnline = dev?.status === "online";
  const lastSeen = dev?.lastSeen ? new Date(dev.lastSeen).toLocaleString() : "—";

  return (
    <div className="grid gap-4">
      {/* Device Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{dev?.name ?? deviceId}</CardTitle>
            <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Last seen: {lastSeen}
          </p>
        </CardContent>
      </Card>

      {/* Latest Telemetry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Latest Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(tele).map(([k, v]) => (
              <div key={k} className="p-3 border rounded-lg">
                <div className="text-sm font-medium">{k}</div>
                <div className="text-lg">{String(v.value)}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(v.ts).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {Object.keys(tele).length === 0 && (
              <div className="col-span-2 text-center text-muted-foreground py-4">
                No telemetry data received
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Send Command */}
      <Card>
        <CardHeader>
          <CardTitle>Send Command</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea 
            className="font-mono text-sm"
            rows={4}
            value={cmd} 
            onChange={(e) => setCmd(e.target.value)} 
            placeholder="Enter JSON command"
          />
          <Button onClick={send} className="w-full">
            Publish Command
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}