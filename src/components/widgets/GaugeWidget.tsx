import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface GaugeWidgetProps {
  value: number;
  config: WidgetConfig;
}

export function GaugeWidget({ value, config }: GaugeWidgetProps) {
  const min = config.min || 0;
  const max = config.max || 100;
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  const getColorForValue = (val: number) => {
    if (config.threshold?.critical && val >= config.threshold.critical) {
      return 'text-destructive';
    }
    if (config.threshold?.warning && val >= config.threshold.warning) {
      return 'text-warning';
    }
    return 'text-primary';
  };

  return (
    <div className="flex flex-col items-center space-y-3 py-2">
      {/* Circular Progress */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/20"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${percentage * 2.83} 283`}
            className={cn("transition-all duration-500", getColorForValue(value))}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className={cn("text-lg font-bold", getColorForValue(value))}>
              {Math.round(value)}
            </p>
            {config.unit && (
              <p className="text-xs text-muted-foreground">
                {config.unit}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-medium">
          {config.label || 'Sensor'}
        </p>
        <p className="text-xs text-muted-foreground">
          {min} - {max} {config.unit}
        </p>
      </div>
    </div>
  );
}