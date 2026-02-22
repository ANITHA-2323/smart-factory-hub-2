import React, { useMemo, useState } from 'react';
import { Bot, Truck, Settings, Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { MachineCard } from '@/components/machines/MachineCard';
import { MachineControlPanel } from '@/components/machines/MachineControlPanel';
import { AlertBadge } from '@/components/alerts/AlertBadge';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProductionChart } from '@/components/charts/ProductionChart';
import { SensorGauge } from '@/components/charts/SensorGauge';
import { Machine } from '@/types/industrial';
import { generateProductionMetrics } from '@/data/mockData';

interface DashboardProps {
  machines: Machine[];
  alerts: any[];
  onControlMachine: (machineId: string, action: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  machines,
  alerts,
  onControlMachine,
  onAcknowledgeAlert,
}) => {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const productionData = useMemo(() => generateProductionMetrics(), []);

  const stats = useMemo(() => {
    const active = machines.filter(m => m.status === 'active').length;
    const idle = machines.filter(m => m.status === 'idle').length;
    const error = machines.filter(m => m.status === 'error').length;
    const avgEfficiency = Math.round(
      machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length
    );
    return { active, idle, error, total: machines.length, avgEfficiency };
  }, [machines]);

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  // Get average sensor values for gauges
  const avgTemp = Math.round(
    machines.reduce((sum, m) => sum + m.temperature, 0) / machines.length
  );
  const avgVibration = (
    machines.reduce((sum, m) => sum + m.vibration, 0) / machines.length
  ).toFixed(1);
  const avgLoad = Math.round(
    machines.reduce((sum, m) => sum + m.load, 0) / machines.length
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and control</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-foreground">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Machines"
          value={stats.active}
          subtitle={`of ${stats.total} total`}
          icon={CheckCircle}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Idle Machines"
          value={stats.idle}
          subtitle="Awaiting tasks"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Machines in Error"
          value={stats.error}
          subtitle="Require attention"
          icon={AlertTriangle}
          variant={stats.error > 0 ? 'error' : 'default'}
        />
        <StatsCard
          title="Avg. Efficiency"
          value={`${stats.avgEfficiency}%`}
          subtitle="Across all machines"
          icon={Zap}
          variant={stats.avgEfficiency > 85 ? 'success' : 'warning'}
          trend={{ value: 2.3, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="xl:col-span-2 space-y-6">
          <ProductionChart data={productionData} />
          
          {/* Sensor Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SensorGauge
              label="Avg Temperature"
              value={avgTemp}
              unit="°C"
              min={0}
              max={100}
              warningThreshold={50}
              criticalThreshold={65}
            />
            <SensorGauge
              label="Avg Vibration"
              value={parseFloat(avgVibration)}
              unit=" mm/s"
              min={0}
              max={5}
              warningThreshold={2}
              criticalThreshold={3.5}
            />
            <SensorGauge
              label="Avg Load"
              value={avgLoad}
              unit="%"
              min={0}
              max={100}
              warningThreshold={80}
              criticalThreshold={95}
            />
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
            <span className="text-sm text-muted-foreground">
              {activeAlerts.length} unresolved
            </span>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {activeAlerts.length > 0 ? (
              activeAlerts.slice(0, 5).map(alert => (
                <AlertBadge
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={onAcknowledgeAlert}
                  compact
                />
              ))
            ) : (
              <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-center">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-success font-medium">All systems operational</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Machines Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Machine Overview</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Robots</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Conveyors</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Motors</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sensors</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {machines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onClick={() => setSelectedMachine(machine)}
            />
          ))}
        </div>
      </div>

      {/* Machine Control Panel */}
      <MachineControlPanel
        machine={selectedMachine}
        open={!!selectedMachine}
        onClose={() => setSelectedMachine(null)}
        onControl={onControlMachine}
      />
    </div>
  );
};

export default Dashboard;
