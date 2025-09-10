import { useEffect, useRef, useState, useCallback } from 'react';
import { MQTTConfig } from '@/types';
import { useDeviceStore } from '@/stores/deviceStore';

// Mock MQTT service for demonstration
// In production, replace with actual MQTT client library like mqtt.js

interface MqttMessage {
  topic: string;
  payload: string;
  timestamp: Date;
}

interface UseMqttServiceReturn {
  isConnected: boolean;
  messages: MqttMessage[];
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, payload: string) => void;
  connect: (config: MQTTConfig) => void;
  disconnect: () => void;
  clearMessages: () => void;
}

const defaultConfig: MQTTConfig = {
  broker: 'wss://broker.hivemq.com:8884/mqtt',
  port: 8884,
  useTLS: true,
  clientId: `saphari-${Math.random().toString(16).substr(2, 8)}`,
};

export const useMqttService = (): UseMqttServiceReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const subscribedTopics = useRef<Set<string>>(new Set());
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  const addSensorReading = useDeviceStore(state => state.addSensorReading);

  // Mock data generator for demonstration
  const generateMockSensorData = useCallback(() => {
    const topics = [
      'saphari/sensors/soil_moisture',
      'saphari/sensors/water_level', 
      'saphari/sensors/light_sensor',
      'saphari/sensors/temperature',
      'saphari/sensors/humidity'
    ];

    const mockData = {
      'saphari/sensors/soil_moisture': () => Math.floor(Math.random() * 100),
      'saphari/sensors/water_level': () => Math.floor(Math.random() * 100),
      'saphari/sensors/light_sensor': () => Math.floor(Math.random() * 1024),
      'saphari/sensors/temperature': () => Math.floor(Math.random() * 40),
      'saphari/sensors/humidity': () => Math.floor(Math.random() * 100),
    };

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const value = mockData[randomTopic as keyof typeof mockData]();
    
    const message: MqttMessage = {
      topic: randomTopic,
      payload: value.toString(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev.slice(-49), message]); // Keep last 50 messages

    // Store sensor reading  
    addSensorReading('esp32-001', {
      deviceId: 'esp32-001',
      topic: randomTopic,
      value,
      unit: getUnitForTopic(randomTopic),
      timestamp: new Date(),
    });
  }, [addSensorReading]);

  const getUnitForTopic = (topic: string): string => {
    if (topic.includes('temperature')) return '°C';
    if (topic.includes('humidity') || topic.includes('moisture')) return '%';
    if (topic.includes('water_level')) return '%';
    if (topic.includes('light')) return 'lux';
    return '';
  };

  const connect = useCallback((config: MQTTConfig = defaultConfig) => {
    console.log('Connecting to MQTT broker:', config.broker);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      
      // Start mock data simulation
      simulationInterval.current = setInterval(generateMockSensorData, 2000);
    }, 1000);
  }, [generateMockSensorData]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    console.log('Disconnected from MQTT broker');
  }, []);

  const subscribe = useCallback((topic: string) => {
    if (subscribedTopics.current.has(topic)) return;
    
    subscribedTopics.current.add(topic);
    console.log('Subscribed to topic:', topic);
  }, []);

  const unsubscribe = useCallback((topic: string) => {
    subscribedTopics.current.delete(topic);
    console.log('Unsubscribed from topic:', topic);
  }, []);

  const publish = useCallback((topic: string, payload: string) => {
    if (!isConnected) {
      console.warn('Cannot publish: not connected to MQTT broker');
      return;
    }

    console.log('Publishing to topic:', topic, 'payload:', payload);
    
    // Simulate relay control feedback
    if (topic.includes('relay')) {
      const message: MqttMessage = {
        topic: `${topic}/status`,
        payload,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev.slice(-49), message]);
    }
  }, [isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    subscribe,
    unsubscribe,
    publish,
    connect,
    disconnect,
    clearMessages,
  };
};