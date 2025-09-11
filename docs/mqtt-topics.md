# MQTT Topics

SapHari uses a structured MQTT topic hierarchy for device communication:

## Topic Structure

```
saphari/devices/{device-id}/status         # LWT retained online|offline
saphari/devices/{device-id}/telemetry      # TelemetryMessage
saphari/devices/{device-id}/events         # Errors/acks
saphari/devices/{device-id}/shadow/report  # Device config snapshot
saphari/devices/{device-id}/shadow/get     # Backend->device resync request
saphari/devices/{device-id}/cmd            # CommandMessage
```

## Message Formats

### Status Message
```json
{
  "ts": 1713123456789,
  "status": "online"
}
```

### Telemetry Message
```json
{
  "ts": 1713123456789,
  "metrics": {
    "temperature": 24.5,
    "humidity": 65.2,
    "soil_moisture": 45,
    "light_level": 512
  }
}
```

### Command Message
```json
{
  "ts": 1713123456789,
  "command": "relay.set",
  "params": {
    "pin": 26,
    "value": 1
  },
  "reqId": "req-123"
}
```

### Shadow Report
```json
{
  "ts": 1713123456789,
  "state": {
    "relay1": 1,
    "relay2": 0,
    "config": {
      "sampling_rate": 30
    }
  }
}
```

## ESP32 Implementation Notes

- Use retained messages for status (LWT)
- Send telemetry every 30 seconds
- Listen for commands on `/cmd` topic
- Report shadow state on connect and config changes