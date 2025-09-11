import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WidgetRenderer, newWidget } from "../widgets/WidgetRenderer";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

type Props = { 
  systemId: string; 
  initial?: Layout[]; 
};

export default function Builder({ systemId, initial = [] }: Props) {
  const [layout, setLayout] = useState<Layout[]>(initial);
  const [widgets, setWidgets] = useState<any[]>([]);

  function add(type: string) {
    const id = crypto.randomUUID();
    setWidgets((w) => [...w, newWidget(id, type)]);
    setLayout((l) => [...l, { i: id, x: 0, y: Infinity, w: 3, h: 3 }]);
  }

  function save() {
    // TODO: save to Supabase dashboard_layout table
    console.log("Saving layout:", { systemId, layout, widgets });
  }

  const widgetTypes = ["switch", "slider", "gauge", "number", "label", "indicator", "chart"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dashboard Builder</CardTitle>
          <Button onClick={save} variant="default">
            Save Layout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Widget Palette */}
        <div className="flex flex-wrap gap-2">
          {widgetTypes.map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => add(type)}
            >
              Add {type}
            </Button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="border rounded-lg p-4 min-h-[400px]">
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={1200}
            onLayoutChange={setLayout}
            draggableHandle=".widget-handle"
          >
            {widgets.map((w) => (
              <div key={w.id} className="border rounded-xl p-2 overflow-hidden bg-card">
                <div className="widget-handle cursor-move h-6 bg-muted/50 -m-2 mb-2 flex items-center justify-center text-xs text-muted-foreground">
                  ⋮⋮⋮
                </div>
                <WidgetRenderer widget={w} systemId={systemId} />
              </div>
            ))}
          </GridLayout>
          
          {widgets.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Add widgets from the palette above to start building your dashboard
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}