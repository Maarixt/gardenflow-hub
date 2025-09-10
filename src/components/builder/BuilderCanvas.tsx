import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { WidgetCard } from '@/components/widgets/WidgetCard';
import { Widget } from '@/types';

interface BuilderCanvasProps {
  widgets: Widget[];
  onLayoutChange: (widgets: Widget[]) => void;
  isBuilderMode: boolean;
  sensorValues: Record<string, any>;
  onWidgetUpdate: (widgetId: string, value: any) => void;
  onWidgetEdit: (widget: Widget) => void;
  onWidgetDelete: (widgetId: string) => void;
}

export default function BuilderCanvas({ 
  widgets, 
  onLayoutChange, 
  isBuilderMode,
  sensorValues,
  onWidgetUpdate,
  onWidgetEdit,
  onWidgetDelete
}: BuilderCanvasProps) {
  const [layout, setLayout] = useState<any[]>([]);

  useEffect(() => {
    const l = widgets.map(w => ({
      i: w.id,
      x: w.position.x,
      y: w.position.y,
      w: w.position.w,
      h: w.position.h,
    }));
    setLayout(l);
  }, [widgets]);

  const handleLayoutChange = (newLayout: any[]) => {
    if (!isBuilderMode) return;
    
    const updatedWidgets = widgets.map(w => {
      const item = newLayout.find(l => l.i === w.id);
      if (item) {
        return { 
          ...w, 
          position: { 
            ...w.position,
            x: item.x, 
            y: item.y, 
            w: item.w, 
            h: item.h 
          }
        };
      }
      return w;
    });
    onLayoutChange(updatedWidgets);
    setLayout(newLayout);
  };

  return (
    <div className="w-full">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={60}
        width={1200}
        onLayoutChange={handleLayoutChange}
        isDraggable={isBuilderMode}
        isResizable={isBuilderMode}
        draggableHandle=".widget-drag-handle"
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {widgets.map(widget => (
          <div key={widget.id}>
            <WidgetCard
              widget={widget}
              value={sensorValues[widget.mqttTopic]}
              onUpdate={(value) => onWidgetUpdate(widget.id, value)}
              onEdit={isBuilderMode ? () => onWidgetEdit(widget) : undefined}
              onDelete={isBuilderMode ? () => onWidgetDelete(widget.id) : undefined}
              className={isBuilderMode ? 'cursor-move' : ''}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}