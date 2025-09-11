import { supabase } from "@/integrations/supabase/client";

export async function createDevice(systemId: string, name: string) {
  const { data, error } = await supabase
    .from("devices")
    .insert([{ 
      system_id: systemId, 
      name, 
      secret: crypto.randomUUID() 
    }])
    .select()
    .single();
    
  if (error) throw error;
  
  const d = data as any;
  const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
  
  return {
    deviceId: d.id,
    brokerUrl,
    mqttUser: "guest",
    mqttPass: "guest",
    topics: {
      status:       `saphari/devices/${d.id}/status`,
      telemetry:    `saphari/devices/${d.id}/telemetry`,
      events:       `saphari/devices/${d.id}/events`,
      shadowReport: `saphari/devices/${d.id}/shadow/report`,
      shadowGet:    `saphari/devices/${d.id}/shadow/get`,
      cmd:          `saphari/devices/${d.id}/cmd`
    },
    heartbeatSec: 30
  };
}

export async function getSystems() {
  const { data, error } = await supabase
    .from("systems")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createSystem(name: string) {
  const { data, error } = await supabase
    .from("systems")
    .insert([{ name, owner_id: (await supabase.auth.getUser()).data.user?.id }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getDevices(systemId: string) {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("system_id", systemId)
    .order("name");
    
  if (error) throw error;
  return data;
}