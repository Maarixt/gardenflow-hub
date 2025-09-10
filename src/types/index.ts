// Core types for Saphari Smart Garden Hub IoT Platform

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  organizationId?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  themeColors?: {
    primary: string;
    secondary: string;
  };
  createdAt: Date;
}

export interface Device {
  id: string;
  name: string;
  type: 'ESP32' | 'ARDUINO' | 'RASPBERRY_PI';
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  ipAddress?: string;
  macAddress?: string;
  firmwareVersion?: string;
  lastSeen: Date;
  organizationId: string;
  mqttTopics: {
    subscribe: string[];
    publish: string[];
  };
  metadata?: Record<string, any>;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  deviceId: string;
  mqttTopic: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: WidgetConfig;
  createdAt: Date;
}

export type WidgetType = 
  | 'SWITCH'
  | 'SLIDER' 
  | 'GAUGE'
  | 'CHART'
  | 'TEXT_VALUE'
  | 'BUTTON'
  | 'LED_INDICATOR'
  | 'PROGRESS_BAR';

export interface WidgetConfig {
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  threshold?: {
    warning?: number;
    critical?: number;
  };
  colors?: {
    primary?: string;
    secondary?: string;
  };
  chartType?: 'line' | 'bar' | 'area';
  timeRange?: '1h' | '24h' | '7d' | '30d';
  updateInterval?: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  deviceId: string;
  userId: string;
  widgets: Widget[];
  isTemplate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensorReading {
  id: string;
  deviceId: string;
  topic: string;
  value: number | string | boolean;
  unit?: string;
  timestamp: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  deviceId: string;
  enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  createdAt: Date;
}

export interface RuleCondition {
  type: 'SENSOR_VALUE' | 'TIME_BASED' | 'DEVICE_STATUS';
  topic?: string;
  operator: '>' | '<' | '=' | '>=' | '<=' | '!=';
  value: number | string;
  timeSchedule?: {
    days: string[];
    time: string;
  };
}

export interface RuleAction {
  type: 'MQTT_PUBLISH' | 'NOTIFICATION' | 'EMAIL' | 'WEBHOOK';
  mqttTopic?: string;
  payload?: string;
  message?: string;
  webhookUrl?: string;
}

export interface MQTTConfig {
  broker: string;
  port: number;
  username?: string;
  password?: string;
  useTLS: boolean;
  clientId: string;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  webhooks: string[];
  thresholds: {
    [topic: string]: {
      warning: number;
      critical: number;
    };
  };
}