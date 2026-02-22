import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSimulation } from "@/hooks/useSimulation";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Machines from "@/pages/Machines";
import Analytics from "@/pages/Analytics";
import Alerts from "@/pages/Alerts";
import Logs from "@/pages/Logs";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { machines, alerts, controlMachine, acknowledgeAlert } = useSimulation();

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<DashboardLayout alertCount={unacknowledgedAlerts} />}>
        <Route 
          path="/" 
          element={
            <Dashboard 
              machines={machines} 
              alerts={alerts}
              onControlMachine={controlMachine}
              onAcknowledgeAlert={acknowledgeAlert}
            />
          } 
        />
        <Route 
          path="/machines" 
          element={
            <Machines 
              machines={machines}
              onControlMachine={controlMachine}
            />
          } 
        />
        <Route 
          path="/analytics" 
          element={<Analytics machines={machines} />} 
        />
        <Route 
          path="/alerts" 
          element={
            <Alerts 
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
            />
          } 
        />
        <Route path="/logs" element={<Logs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
