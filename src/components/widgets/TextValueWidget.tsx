import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface TextValueWidgetProps {
  value: number | string | boolean | undefined;
  config: WidgetConfig;
}

export function TextValueWidget({ value, config }: TextValueWidgetProps) {
  const displayValue = value !== undefined ? String(value) : '--';
  
  const getValueColor = () => {
    if (typeof value === 'number') {
      if (config.threshold?.critical && value >= config.threshold.critical) {
        return 'text-destructive';
      }
      if (config.threshold?.warning && value >= config.threshold.warning) {
        return 'text-warning';
      }
      return 'text-primary';
    }
    if (typeof value === 'boolean') {
      return value ? 'text-success' : 'text-muted-foreground';
    }
    return 'text-foreground';
  };

  return (
    <div className="flex flex-col items-center space-y-2 py-4">
      <div className="text-center">
        <p className={cn(
          "text-2xl font-bold tabular-nums",
          getValueColor()
        )}>
          {displayValue}
        </p>
        {config.unit && (
          <p className="text-sm text-muted-foreground">
            {config.unit}
          </p>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium">
          {config.label || 'Value'}
        </p>
        <p className="text-xs text-muted-foreground">
          Updated {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}