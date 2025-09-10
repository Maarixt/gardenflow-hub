import { create } from 'zustand';
import { Device, SensorReading, DashboardLayout } from '@/types';

interface DeviceState {
  devices: Device[];
  activeDevice: Device | null;
  sensorReadings: Record<string, SensorReading[]>;
  dashboardLayouts: DashboardLayout[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<Device, 'id' | 'lastSeen'>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  setActiveDevice: (device: Device | null) => void;
  addSensorReading: (deviceId: string, reading: Omit<SensorReading, 'id'>) => void;
  getSensorReadings: (deviceId: string, topic: string) => SensorReading[];
  saveDashboardLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getDashboardLayout: (deviceId: string, userId: string) => DashboardLayout | null;
}

// Mock devices data
const mockDevices: Device[] = [
  {
    id: 'esp32-001',
    name: 'Garden Hub Alpha',
    type: 'ESP32',
    status: 'ONLINE',
    ipAddress: '192.168.1.100',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    firmwareVersion: '1.2.3',
    lastSeen: new Date(),
    organizationId: '1',
    mqttTopics: {
      subscribe: ['saphari/sensors/+', 'saphari/status'],
      publish: ['saphari/commands/+', 'saphari/relays/+']
    },
    metadata: {
      location: 'Greenhouse A',
      sensors: ['soil_moisture', 'water_level', 'light_sensor', 'temperature']
    }
  },
  {
    id: 'esp32-002',
    name: 'Garden Hub Beta',
    type: 'ESP32',
    status: 'OFFLINE',
    ipAddress: '192.168.1.101',
    macAddress: 'BB:CC:DD:EE:FF:AA',
    firmwareVersion: '1.2.2',
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    organizationId: '1',
    mqttTopics: {
      subscribe: ['saphari/sensors/+', 'saphari/status'],
      publish: ['saphari/commands/+', 'saphari/relays/+']
    },
    metadata: {
      location: 'Greenhouse B',
      sensors: ['soil_moisture', 'temperature', 'humidity']
    }
  }
];

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: mockDevices,
  activeDevice: mockDevices[0],
  sensorReadings: {},
  dashboardLayouts: [],
  isLoading: false,
  error: null,

  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ devices: mockDevices, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch devices', isLoading: false });
    }
  },

  addDevice: (deviceData) => {
    const newDevice: Device = {
      ...deviceData,
      id: `esp32-${Date.now()}`,
      lastSeen: new Date(),
    };
    set(state => ({
      devices: [...state.devices, newDevice]
    }));
  },

  updateDevice: (id, updates) => {
    set(state => ({
      devices: state.devices.map(device =>
        device.id === id ? { ...device, ...updates } : device
      )
    }));
  },

  setActiveDevice: (device) => {
    set({ activeDevice: device });
  },

  addSensorReading: (deviceId, reading) => {
    const newReading: SensorReading = {
      ...reading,
      id: `reading-${Date.now()}`,
      deviceId,
    };

    set(state => ({
      sensorReadings: {
        ...state.sensorReadings,
        [deviceId]: [
          ...(state.sensorReadings[deviceId] || []).slice(-99), // Keep last 100 readings
          newReading
        ]
      }
    }));
  },

  getSensorReadings: (deviceId, topic) => {
    const readings = get().sensorReadings[deviceId] || [];
    return readings.filter(reading => reading.topic === topic);
  },

  saveDashboardLayout: (layoutData) => {
    const newLayout: DashboardLayout = {
      ...layoutData,
      id: `layout-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({
      dashboardLayouts: [
        ...state.dashboardLayouts.filter(
          l => !(l.deviceId === newLayout.deviceId && l.userId === newLayout.userId)
        ),
        newLayout
      ]
    }));
  },

  getDashboardLayout: (deviceId, userId) => {
    return get().dashboardLayouts.find(
      l => l.deviceId === deviceId && l.userId === userId
    ) || null;
  },
}));