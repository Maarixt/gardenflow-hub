import { create } from "zustand";

export type Device = {
  id: string;
  name: string;
  systemId: string;
  status: "online" | "offline";
  lastSeen?: number;
  metadata?: Record<string, unknown>;
};

type State = {
  devices: Record<string, Device>;
  upsert: (d: Device) => void;
  setStatus: (id: string, s: Device["status"], ts?: number) => void;
};

export const useDevices = create<State>((set) => ({
  devices: {},
  upsert: (d) => set((st) => ({ devices: { ...st.devices, [d.id]: d } })),
  setStatus: (id, status, ts = Date.now()) =>
    set((st) => {
      const d = st.devices[id] ?? { 
        id, 
        name: id, 
        systemId: "unknown", 
        status: "offline" as const 
      };
      return { 
        devices: { 
          ...st.devices, 
          [id]: { ...d, status, lastSeen: ts } 
        } 
      };
    }),
}));