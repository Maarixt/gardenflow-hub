import { connect, IClientOptions, MqttClient } from "mqtt";

let client: MqttClient | null = null;

export function getMqtt(): MqttClient {
  if (client) return client;
  
  const url = "wss://broker.hivemq.com:8884/mqtt";
  const opts: IClientOptions = {
    username: "guest",
    password: "guest",
    reconnectPeriod: 2000,
    keepalive: 30,
    clean: true,
  };
  
  client = connect(url, opts);
  client.on("reconnect", () => console.log("MQTT reconnecting…"));
  client.on("error", (e) => console.error("MQTT error", e));
  client.on("connect", () => console.log("MQTT connected"));
  
  return client!;
}