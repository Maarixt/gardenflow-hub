import { create } from "zustand";

type Telemetry = Record<string, { ts: number; value: number | string | boolean }>;

type State = {
  byDevice: Record<string, Telemetry>;
  push: (deviceId: string, ts: number, metrics: Record<string, any>) => void;
};

export const useTelemetry = create<State>((set) => ({
  byDevice: {},
  push: (deviceId, ts, metrics) =>
    set((st) => {
      const curr = st.byDevice[deviceId] ?? {};
      const next = { ...curr };
      for (const [k, v] of Object.entries(metrics)) {
        next[k] = { ts, value: v };
      }
      return { 
        byDevice: { 
          ...st.byDevice, 
          [deviceId]: next 
        } 
      };
    }),
}));