import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Machine } from '@/types/industrial';
import { generateProductionMetrics } from '@/data/mockData';

interface AnalyticsProps {
  machines: Machine[];
}

const Analytics: React.FC<AnalyticsProps> = ({ machines }) => {
  const productionData = useMemo(() => generateProductionMetrics(), []);

  // Machine status distribution
  const statusDistribution = useMemo(() => {
    const counts = machines.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'Active', value: counts.active || 0, color: 'hsl(142, 76%, 36%)' },
      { name: 'Idle', value: counts.idle || 0, color: 'hsl(38, 92%, 50%)' },
      { name: 'Error', value: counts.error || 0, color: 'hsl(0, 84%, 60%)' },
      { name: 'Offline', value: counts.offline || 0, color: 'hsl(215, 20%, 35%)' },
    ];
  }, [machines]);

  // Machine type efficiency
  const typeEfficiency = useMemo(() => {
    const types = ['robot', 'conveyor', 'motor', 'sensor'] as const;
    return types.map(type => {
      const typeMachines = machines.filter(m => m.type === type);
      const avgEfficiency = typeMachines.length > 0
        ? Math.round(typeMachines.reduce((sum, m) => sum + m.efficiency, 0) / typeMachines.length)
        : 0;
      return {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        efficiency: avgEfficiency,
        temperature: Math.round(typeMachines.reduce((sum, m) => sum + m.temperature, 0) / typeMachines.length) || 0,
      };
    });
  }, [machines]);

  // Hourly production simulation
  const hourlyProduction = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      hour: `${(i + 8).toString().padStart(2, '0')}:00`,
      units: Math.floor(Math.random() * 500) + 200,
      target: 400,
    }));
  }, []);

  // Vibration trend data
  const vibrationTrend = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      time: `T-${10 - i}`,
      robot: (Math.random() * 2 + 0.5).toFixed(2),
      conveyor: (Math.random() * 1.5 + 0.3).toFixed(2),
      motor: (Math.random() * 1.8 + 0.4).toFixed(2),
    }));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground">Performance metrics and predictive analysis</p>
      </div>

      {/* Top Row - Summary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Machine Status Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(215, 28%, 17%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Type Efficiency */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Efficiency by Machine Type</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 28%, 17%)" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(215, 28%, 17%)',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="efficiency" 
                  fill="hsl(217, 91%, 60%)" 
                  radius={[4, 4, 0, 0]}
                  name="Efficiency %"
                />
                <Bar 
                  dataKey="temperature" 
                  fill="hsl(38, 92%, 50%)" 
                  radius={[4, 4, 0, 0]}
                  name="Avg Temp °C"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Middle Row - Production Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Production */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hourly Production Output</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyProduction}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 28%, 17%)" />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(215, 28%, 17%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="units" 
                  fill="hsl(142, 76%, 36%)" 
                  radius={[4, 4, 0, 0]}
                  name="Units Produced"
                />
                <Bar 
                  dataKey="target" 
                  fill="hsl(215, 28%, 25%)" 
                  radius={[4, 4, 0, 0]}
                  name="Target"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vibration Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vibration Trend Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tracking vibration levels for predictive maintenance
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vibrationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 28%, 17%)" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={12}
                  domain={[0, 4]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(215, 28%, 17%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="robot" 
                  stroke="hsl(217, 91%, 60%)" 
                  strokeWidth={2}
                  dot={false}
                  name="Robots"
                />
                <Line 
                  type="monotone" 
                  dataKey="conveyor" 
                  stroke="hsl(142, 76%, 36%)" 
                  strokeWidth={2}
                  dot={false}
                  name="Conveyors"
                />
                <Line 
                  type="monotone" 
                  dataKey="motor" 
                  stroke="hsl(38, 92%, 50%)" 
                  strokeWidth={2}
                  dot={false}
                  name="Motors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Predictive Alerts Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Predictive Maintenance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm text-muted-foreground">Healthy Machines</p>
            <p className="text-3xl font-bold text-success font-mono">
              {machines.filter(m => m.efficiency > 85 && m.temperature < 50).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">No maintenance required</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-muted-foreground">Attention Needed</p>
            <p className="text-3xl font-bold text-warning font-mono">
              {machines.filter(m => m.efficiency <= 85 && m.efficiency > 70).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Schedule maintenance soon</p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-3xl font-bold text-destructive font-mono">
              {machines.filter(m => m.efficiency <= 70 || m.temperature >= 55).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Immediate action required</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
