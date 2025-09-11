export type TelemetryMessage = {
  ts: number;
  metrics: Record<string, number | string | boolean>;
};

export type CommandMessage = {
  ts: number;
  command: string;
  params?: Record<string, unknown>;
  reqId?: string;
};

export type ShadowMessage = { 
  ts: number; 
  state: Record<string, unknown>; 
};

export type StatusMessage = { 
  ts: number; 
  status: "online" | "offline"; 
};

export const topics = (deviceId: string) => ({
  status:        `saphari/devices/${deviceId}/status`,
  telemetry:     `saphari/devices/${deviceId}/telemetry`,
  events:        `saphari/devices/${deviceId}/events`,
  shadowReport:  `saphari/devices/${deviceId}/shadow/report`,
  shadowGet:     `saphari/devices/${deviceId}/shadow/get`,
  cmd:           `saphari/devices/${deviceId}/cmd`,
});