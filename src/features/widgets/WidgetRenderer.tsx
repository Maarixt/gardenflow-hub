import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { topics } from "@/types/mqtt";
import { getMqtt } from "@/lib/mqtt";
import { useTelemetry } from "@/stores/telemetry";
import { Power, Gauge, Hash, Tag, Circle, BarChart3 } from "lucide-react";

export function newWidget(id: string, type: string) {
  return { 
    id, 
    type, 
    binding: { datastreamKey: "temp", deviceId: "test-device" }, 
    options: { min: 0, max: 100, unit: "" } 
  };
}

export function WidgetRenderer({ widget, systemId }: { widget: any; systemId: string }) {
  switch (widget.type) {
    case "switch": return <SwitchWidget widget={widget} />;
    case "slider": return <SliderWidget widget={widget} />;
    case "gauge":  return <GaugeWidget widget={widget} />;
    case "number": return <NumberWidget widget={widget} />;
    case "label":  return <LabelWidget widget={widget} />;
    case "indicator": return <IndicatorWidget widget={widget} />;
    case "chart":  return <ChartWidget widget={widget} />;
    default: return <div className="text-muted-foreground">Unknown widget: {widget.type}</div>;
  }
}

// Switch widget -> publishes command
function SwitchWidget({ widget }: { widget: any }) {
  const [isOn, setIsOn] = useState(false);
  const deviceId = widget.binding?.deviceId || "test-device";
  const datastreamKey = widget.binding?.datastreamKey ?? "relay";
  
  function toggle(on: boolean) {
    setIsOn(on);
    const msg = JSON.stringify({ 
      ts: Date.now(), 
      command: "relay.set", 
      params: { key: datastreamKey, value: on ? 1 : 0 } 
    });
    getMqtt().publish(topics(deviceId).cmd, msg);
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Power className="w-4 h-4" />
        <span className="font-medium">Switch</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">{datastreamKey}</span>
        <Switch checked={isOn} onCheckedChange={toggle} />
      </div>
    </div>
  );
}

// Slider widget -> publishes command with value
function SliderWidget({ widget }: { widget: any }) {
  const [value, setValue] = useState([50]);
  const deviceId = widget.binding?.deviceId || "test-device";
  const datastreamKey = widget.binding?.datastreamKey ?? "dimmer";
  const min = widget.options?.min ?? 0;
  const max = widget.options?.max ?? 100;
  
  function handleChange(newValue: number[]) {
    setValue(newValue);
    const msg = JSON.stringify({ 
      ts: Date.now(), 
      command: "set_value", 
      params: { key: datastreamKey, value: newValue[0] } 
    });
    getMqtt().publish(topics(deviceId).cmd, msg);
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4" />
        <span className="font-medium">Slider</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{datastreamKey}</span>
          <span>{value[0]}{widget.options?.unit}</span>
        </div>
        <Slider
          value={value}
          onValueChange={handleChange}
          min={min}
          max={max}
          step={1}
        />
      </div>
    </div>
  );
}

// Gauge widget -> shows progress bar
function GaugeWidget({ widget }: { widget: any }) {
  const deviceId = widget.binding?.deviceId || "test-device";
  const key = widget.binding?.datastreamKey ?? "temp";
  const tele = useTelemetry((s) => s.byDevice[deviceId]?.[key]);
  const value = typeof tele?.value === 'number' ? tele.value : 0;
  const max = widget.options?.max ?? 100;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Circle className="w-4 h-4" />
        <span className="font-medium">Gauge</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{key}</span>
          <span>{value}{widget.options?.unit}</span>
        </div>
        <Progress value={(value / max) * 100} />
      </div>
    </div>
  );
}

// Read-only metric display
function NumberWidget({ widget }: { widget: any }) {
  const deviceId = widget.binding?.deviceId || "test-device";
  const key = widget.binding?.datastreamKey ?? "temp";
  const tele = useTelemetry((s) => s.byDevice[deviceId]?.[key]);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4" />
        <span className="font-medium">Number</span>
      </div>
      <div className="text-center">
        <div className="text-xs text-muted-foreground">{key}</div>
        <div className="text-2xl font-bold">
          {tele ? String(tele.value) : "—"}
          <span className="text-sm text-muted-foreground ml-1">
            {widget.options?.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// Simple text label
function LabelWidget({ widget }: { widget: any }) {
  const text = widget.options?.text || "Label";
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4" />
        <span className="font-medium">{text}</span>
      </div>
    </div>
  );
}

// Status indicator (online/offline, boolean states)
function IndicatorWidget({ widget }: { widget: any }) {
  const deviceId = widget.binding?.deviceId || "test-device";
  const key = widget.binding?.datastreamKey ?? "status";
  const tele = useTelemetry((s) => s.byDevice[deviceId]?.[key]);
  const isActive = Boolean(tele?.value);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Circle className="w-4 h-4" />
        <span className="font-medium">Indicator</span>
      </div>
      <div className="flex items-center justify-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isActive ? 'bg-green-500' : 'bg-gray-300'
        }`}>
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        {key}: {isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
}

// Placeholder chart widget
function ChartWidget({ widget }: { widget: any }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        <span className="font-medium">Chart</span>
      </div>
      <div className="flex items-center justify-center h-20 border-2 border-dashed border-muted rounded">
        <span className="text-muted-foreground text-sm">Chart placeholder</span>
      </div>
    </div>
  );
}