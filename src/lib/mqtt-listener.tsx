import { useEffect } from "react";
import { getMqtt } from "./mqtt";
import { useDevices } from "@/stores/devices";
import { useTelemetry } from "@/stores/telemetry";
import type { TelemetryMessage } from "@/types/mqtt";

export function MqttListener() {
  const setStatus = useDevices((s) => s.setStatus);
  const push = useTelemetry((s) => s.push);

  useEffect(() => {
    const c = getMqtt();
    
    // Subscribe to wildcards
    c.subscribe("saphari/devices/+/status");
    c.subscribe("saphari/devices/+/telemetry");
    c.subscribe("saphari/devices/+/shadow/report");
    
    const handleMessage = (topic: string, payload: Buffer) => {
      try {
        const deviceId = topic.split("/")[2];
        
        if (topic.endsWith("/status")) {
          const { status } = JSON.parse(payload.toString());
          setStatus(deviceId, status);
        } else if (topic.endsWith("/telemetry")) {
          const msg = JSON.parse(payload.toString()) as TelemetryMessage;
          push(deviceId, msg.ts, msg.metrics);
          setStatus(deviceId, "online", msg.ts);
        }
      } catch (e) {
        console.error("Bad MQTT JSON on", topic, e);
      }
    };
    
    c.on("message", handleMessage);
    
    return () => {
      c.removeListener("message", handleMessage);
    };
  }, [push, setStatus]);

  return null;
}