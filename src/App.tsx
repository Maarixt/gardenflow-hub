import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/devices" element={<AppLayout><Devices /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><div className="p-8 text-center text-muted-foreground">Analytics page coming soon</div></AppLayout>} />
          <Route path="/automations" element={<AppLayout><div className="p-8 text-center text-muted-foreground">Automations page coming soon</div></AppLayout>} />
          <Route path="/schedule" element={<AppLayout><div className="p-8 text-center text-muted-foreground">Schedule page coming soon</div></AppLayout>} />
          <Route path="/users" element={<AppLayout><div className="p-8 text-center text-muted-foreground">Users page coming soon</div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-8 text-center text-muted-foreground">Settings page coming soon</div></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
