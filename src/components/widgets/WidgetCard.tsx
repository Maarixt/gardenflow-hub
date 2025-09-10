import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Widget } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Trash2, 
  GripVertical,
  Activity,
  Zap,
  Gauge,
  BarChart3,
  Type,
  Power,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SwitchWidget } from './SwitchWidget';
import { GaugeWidget } from './GaugeWidget';
import { ChartWidget } from './ChartWidget';
import { TextValueWidget } from './TextValueWidget';

interface WidgetCardProps {
  widget: Widget;
  value?: number | string | boolean;
  onUpdate?: (value: any) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const widgetIcons = {
  SWITCH: Power,
  SLIDER: Activity,
  GAUGE: Gauge,
  CHART: BarChart3,
  TEXT_VALUE: Type,
  BUTTON: Zap,
  LED_INDICATOR: Lightbulb,
  PROGRESS_BAR: TrendingUp,
};

export function WidgetCard({ 
  widget, 
  value, 
  onUpdate, 
  onEdit, 
  onDelete, 
  className 
}: WidgetCardProps) {
  const Icon = widgetIcons[widget.type] || Activity;

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'SWITCH':
        return (
          <SwitchWidget
            value={Boolean(value)}
            onChange={onUpdate}
            config={widget.config}
          />
        );
      case 'GAUGE':
        return (
          <GaugeWidget
            value={Number(value) || 0}
            config={widget.config}
          />
        );
      case 'CHART':
        return (
          <ChartWidget
            data={[]} // This would come from historical data
            config={widget.config}
          />
        );
      case 'TEXT_VALUE':
        return (
          <TextValueWidget
            value={value}
            config={widget.config}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            <Icon className="w-8 h-8" />
          </div>
        );
    }
  };

  return (
    <Card className={cn(
      "relative group bg-widget-bg border-widget-border shadow-widget hover:shadow-card transition-all duration-200",
      className
    )}>
      {/* Drag Handle */}
      <div className="widget-drag-handle absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Widget Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Settings className="w-3 h-3" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Icon className="w-4 h-4 text-primary" />
          <span>{widget.title}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {widget.type}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {renderWidgetContent()}
        
        {/* MQTT Topic Info */}
        <div className="mt-3 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono truncate">
            {widget.mqttTopic}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}