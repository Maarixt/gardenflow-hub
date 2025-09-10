import { Switch } from '@/components/ui/switch';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface SwitchWidgetProps {
  value: boolean;
  onChange?: (value: boolean) => void;
  config: WidgetConfig;
}

export function SwitchWidget({ value, onChange, config }: SwitchWidgetProps) {
  return (
    <div className="flex flex-col items-center space-y-3 py-2">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="scale-125"
      />
      <div className="text-center">
        <p className="text-sm font-medium">
          {config.label || 'Switch'}
        </p>
        <p className={cn(
          "text-xs font-medium",
          value ? "text-success" : "text-muted-foreground"
        )}>
          {value ? 'ON' : 'OFF'}
        </p>
      </div>
    </div>
  );
}