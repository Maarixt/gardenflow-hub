# SapHari System Flows

## Device Registration Flow

```mermaid
sequenceDiagram
    participant Web as Web App
    participant DB as Supabase
    participant MQTT as Broker
    participant ESP32

    Web->>DB: Create device record
    DB-->>Web: Return device ID & config
    Web-->>User: Show MQTT topics/credentials
    User->>ESP32: Flash with config
    ESP32->>MQTT: Connect & publish status
    MQTT-->>Web: Device online notification
```

## Real-time Communication

```mermaid
sequenceDiagram
    participant Web as Web Dashboard
    participant MQTT as Broker
    participant ESP32

    ESP32->>MQTT: status: online (retained)
    ESP32->>MQTT: telemetry: {...} (every 30s)
    MQTT-->>Web: Real-time updates
    
    Web->>MQTT: publish cmd
    MQTT-->>ESP32: Command received
    ESP32->>MQTT: events: ack/error
    MQTT-->>Web: Command feedback
```

## Dashboard Builder Flow

```mermaid
sequenceDiagram
    participant User
    participant Web as Web App
    participant DB as Supabase
    participant MQTT as Broker

    User->>Web: Add widget to dashboard
    Web->>DB: Save widget config
    User->>Web: Bind widget to datastream
    Web->>MQTT: Subscribe to device topic
    MQTT-->>Web: Real-time data
    Web-->>User: Live widget updates
```

## System Limits

- Maximum 10 systems per user
- Enforced at database level with triggers
- UI shows current usage (X/10 systems)
- System creation blocked when limit reached