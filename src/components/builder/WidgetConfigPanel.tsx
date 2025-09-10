import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Widget, WidgetType } from '@/types';
import { Settings, Save, X } from 'lucide-react';

interface WidgetConfigPanelProps {
  widget: Widget | null;
  onUpdateWidget: (widget: Widget) => void;
  onClose: () => void;
}

export default function WidgetConfigPanel({ widget, onUpdateWidget, onClose }: WidgetConfigPanelProps) {
  const [config, setConfig] = useState<any>({});
  const [title, setTitle] = useState('');
  const [mqttTopic, setMqttTopic] = useState('');

  useEffect(() => {
    if (widget) {
      setConfig(widget.config || {});
      setTitle(widget.title || '');
      setMqttTopic(widget.mqttTopic || '');
    }
  }, [widget]);

  if (!widget) return null;

  const handleSave = () => {
    const updatedWidget: Widget = {
      ...widget,
      title,
      mqttTopic,
      config: {
        ...config,
        label: title, // Keep label in sync with title
      }
    };
    onUpdateWidget(updatedWidget);
    onClose();
  };

  const handleConfigChange = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-gradient-card border-widget-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <CardTitle>Widget Configuration</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Configure your {widget.type.toLowerCase()} widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Settings */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Widget title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mqtt-topic">MQTT Topic</Label>
          <Input
            id="mqtt-topic"
            value={mqttTopic}
            onChange={(e) => setMqttTopic(e.target.value)}
            placeholder="saphari/sensors/example"
          />
        </div>

        {/* Widget-specific settings */}
        {widget.type === 'GAUGE' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={config.unit || ''}
                onChange={(e) => handleConfigChange('unit', e.target.value)}
                placeholder="%, °C, lux, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="min">Min Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={config.min || 0}
                  onChange={(e) => handleConfigChange('min', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Max Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={config.max || 100}
                  onChange={(e) => handleConfigChange('max', Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="warning">Warning Threshold</Label>
                <Input
                  id="warning"
                  type="number"
                  value={config.threshold?.warning || 30}
                  onChange={(e) => handleConfigChange('threshold', { 
                    ...config.threshold, 
                    warning: Number(e.target.value) 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="critical">Critical Threshold</Label>
                <Input
                  id="critical"
                  type="number"
                  value={config.threshold?.critical || 10}
                  onChange={(e) => handleConfigChange('threshold', { 
                    ...config.threshold, 
                    critical: Number(e.target.value) 
                  })}
                />
              </div>
            </div>
          </>
        )}

        {widget.type === 'TEXT_VALUE' && (
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={config.unit || ''}
              onChange={(e) => handleConfigChange('unit', e.target.value)}
              placeholder="%, °C, lux, etc."
            />
          </div>
        )}

        {widget.type === 'CHART' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select 
                value={config.chartType || 'line'}
                onValueChange={(value) => handleConfigChange('chartType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-range">Time Range</Label>
              <Select 
                value={config.timeRange || '24h'}
                onValueChange={(value) => handleConfigChange('timeRange', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}