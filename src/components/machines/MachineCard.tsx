import React from 'react';
import { Bot, Truck, Settings, Thermometer, Activity, Gauge, Clock, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Machine, MachineStatus } from '@/types/industrial';
import { cn } from '@/lib/utils';

interface MachineCardProps {
  machine: Machine;
  onClick?: () => void;
}

const machineIcons = {
  robot: Bot,
  conveyor: Truck,
  motor: Settings,
  sensor: Thermometer,
};

const statusConfig: Record<MachineStatus, { label: string; className: string; glowClass: string }> = {
  active: { 
    label: 'Active', 
    className: 'bg-success/20 text-success border-success/30',
    glowClass: 'card-glow-success border-success/20',
  },
  idle: { 
    label: 'Idle', 
    className: 'bg-warning/20 text-warning border-warning/30',
    glowClass: 'card-glow-warning border-warning/20',
  },
  error: { 
    label: 'Error', 
    className: 'bg-destructive/20 text-destructive border-destructive/30',
    glowClass: 'card-glow-error border-destructive/20',
  },
  offline: { 
    label: 'Offline', 
    className: 'bg-muted text-muted-foreground border-muted',
    glowClass: 'card-glow-idle border-muted/50',
  },
};

export const MachineCard: React.FC<MachineCardProps> = ({ machine, onClick }) => {
  const Icon = machineIcons[machine.type];
  const status = statusConfig[machine.status];

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] border",
        status.glowClass,
        machine.status === 'error' && "animate-pulse"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-lg",
            machine.status === 'active' ? "bg-primary/20" : "bg-secondary"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              machine.status === 'active' ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{machine.name}</h3>
            <p className="text-xs text-muted-foreground">{machine.location}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-xs", status.className)}>
          <span className={cn(
            "h-1.5 w-1.5 rounded-full mr-1.5",
            machine.status === 'active' && "bg-success",
            machine.status === 'idle' && "bg-warning",
            machine.status === 'error' && "bg-destructive animate-ping",
            machine.status === 'offline' && "bg-muted-foreground"
          )} />
          {status.label}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricItem 
          icon={Gauge} 
          label="Efficiency" 
          value={`${machine.efficiency}%`}
          variant={machine.efficiency > 85 ? 'success' : machine.efficiency > 70 ? 'warning' : 'error'}
        />
        <MetricItem 
          icon={Thermometer} 
          label="Temp" 
          value={`${machine.temperature}°C`}
          variant={machine.temperature < 50 ? 'success' : machine.temperature < 60 ? 'warning' : 'error'}
        />
        <MetricItem 
          icon={Activity} 
          label="Vibration" 
          value={`${machine.vibration} mm/s`}
          variant={machine.vibration < 2 ? 'success' : machine.vibration < 3 ? 'warning' : 'error'}
        />
        <MetricItem 
          icon={Gauge} 
          label="Load" 
          value={`${machine.load}%`}
          variant={machine.load < 80 ? 'success' : machine.load < 90 ? 'warning' : 'error'}
        />
      </div>

      {/* Task & Details */}
      <div className="space-y-2 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Task:</span>
          <span className="text-foreground font-medium truncate ml-2 max-w-[60%]">
            {machine.assignedTask}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Cycle
          </span>
          <span className="text-foreground font-mono">{machine.cycleTime}s</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Wrench className="h-3 w-3" /> Last Service
          </span>
          <span className="text-foreground font-mono">{machine.lastMaintenance}</span>
        </div>
      </div>

      {/* Mode Badge */}
      <div className="mt-3 flex items-center justify-between">
        <Badge variant="secondary" className="text-xs uppercase">
          {machine.mode} Mode
        </Badge>
        <span className="text-xs text-muted-foreground capitalize">{machine.type}</span>
      </div>
    </Card>
  );
};

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  variant: 'success' | 'warning' | 'error';
}

const MetricItem: React.FC<MetricItemProps> = ({ icon: Icon, label, value, variant }) => {
  const variantClasses = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
      <Icon className={cn("h-4 w-4", variantClasses[variant])} />
      <div>
        <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
        <p className={cn("text-sm font-semibold font-mono", variantClasses[variant])}>
          {value}
        </p>
      </div>
    </div>
  );
};
