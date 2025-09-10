import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetType } from '@/types';
import { 
  Gauge, 
  Zap, 
  BarChart3, 
  Type, 
  Activity,
  Plus
} from 'lucide-react';

interface WidgetPaletteProps {
  addWidget: (type: WidgetType) => void;
}

const widgetTypes = [
  { type: 'GAUGE' as WidgetType, icon: Gauge, label: 'Gauge', description: 'Circular meter for sensor values' },
  { type: 'SWITCH' as WidgetType, icon: Zap, label: 'Switch', description: 'Toggle switch for relays' },
  { type: 'CHART' as WidgetType, icon: BarChart3, label: 'Chart', description: 'Time-series data visualization' },
  { type: 'TEXT_VALUE' as WidgetType, icon: Type, label: 'Text Value', description: 'Display sensor readings as text' },
];

export default function WidgetPalette({ addWidget }: WidgetPaletteProps) {
  return (
    <Card className="bg-gradient-card border-widget-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Widget Palette</span>
        </CardTitle>
        <CardDescription>
          Click to add widgets to your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {widgetTypes.map(({ type, icon: Icon, label, description }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-muted/50"
              onClick={() => addWidget(type)}
            >
              <div className="flex items-center space-x-2 w-full">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{label}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}