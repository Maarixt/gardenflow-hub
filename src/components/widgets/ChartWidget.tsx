import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetConfig } from '@/types';

interface ChartWidgetProps {
  data: Array<{ timestamp: string; value: number }>;
  config: WidgetConfig;
}

export function ChartWidget({ data, config }: ChartWidgetProps) {
  // Mock data for demonstration
  const mockData = Array.from({ length: 10 }, (_, i) => ({
    timestamp: new Date(Date.now() - (9 - i) * 60000).toLocaleTimeString(),
    value: Math.floor(Math.random() * 100),
  }));

  const chartData = data.length > 0 ? data : mockData;

  return (
    <div className="h-32 w-full">
      <div className="mb-2">
        <p className="text-sm font-medium">
          {config.label || 'Chart'}
        </p>
        <p className="text-xs text-muted-foreground">
          Last {chartData.length} readings
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            labelStyle={{ fontSize: '12px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}