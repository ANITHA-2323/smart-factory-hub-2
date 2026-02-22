import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Power, 
  AlertTriangle, 
  Settings,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Machine } from '@/types/industrial';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MachineControlPanelProps {
  machine: Machine | null;
  open: boolean;
  onClose: () => void;
  onControl: (machineId: string, action: string) => void;
}

export const MachineControlPanel: React.FC<MachineControlPanelProps> = ({
  machine,
  open,
  onClose,
  onControl,
}) => {
  const { user, hasPermission } = useAuth();
  const canControl = hasPermission(['admin', 'engineer']);
  const canEmergency = hasPermission(['admin']);

  if (!machine) return null;

  const handleAction = (action: string, label: string) => {
    onControl(machine.id, action);
    toast.success(`${label} command sent to ${machine.name}`);
  };

  const handleEmergencyShutdown = () => {
    if (window.confirm('Are you sure you want to initiate EMERGENCY SHUTDOWN? This action cannot be undone.')) {
      onControl(machine.id, 'emergency');
      toast.error(`Emergency shutdown initiated for ${machine.name}`, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Control Panel - {machine.name}
          </DialogTitle>
          <DialogDescription>
            Manage machine operations and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Overview */}
          <Card className="p-4 bg-secondary/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Current Status</p>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "mt-1",
                    machine.status === 'active' && "bg-success/20 text-success border-success/30",
                    machine.status === 'idle' && "bg-warning/20 text-warning border-warning/30",
                    machine.status === 'error' && "bg-destructive/20 text-destructive border-destructive/30",
                    machine.status === 'offline' && "bg-muted text-muted-foreground"
                  )}
                >
                  {machine.status.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mode</p>
                <Badge variant="secondary" className="mt-1 uppercase">
                  {machine.mode}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Efficiency</p>
                <p className="text-lg font-bold font-mono text-success">{machine.efficiency}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className={cn(
                  "text-lg font-bold font-mono",
                  machine.temperature < 50 ? "text-success" : machine.temperature < 60 ? "text-warning" : "text-destructive"
                )}>
                  {machine.temperature}°C
                </p>
              </div>
            </div>
          </Card>

          {/* Control Buttons */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Machine Controls</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="default"
                className="h-12 bg-success hover:bg-success/90"
                onClick={() => handleAction('start', 'Start')}
                disabled={!canControl || machine.status === 'active'}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              
              <Button
                variant="secondary"
                className="h-12"
                onClick={() => handleAction('stop', 'Stop')}
                disabled={!canControl || machine.status === 'idle' || machine.status === 'offline'}
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </Button>
              
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleAction('reset', 'Reset')}
                disabled={!canControl}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleAction('toggle-mode', 'Mode Toggle')}
                disabled={!canControl}
              >
                <Power className="h-4 w-4 mr-2" />
                {machine.mode === 'auto' ? 'Manual' : 'Auto'} Mode
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full h-12"
              disabled={!canControl}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Assign New Task
            </Button>
          </div>

          {/* Emergency Shutdown */}
          {canEmergency && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="destructive"
                className="w-full h-14 text-base font-bold"
                onClick={handleEmergencyShutdown}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                EMERGENCY SHUTDOWN
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Admin only - Immediately stops all machine operations
              </p>
            </div>
          )}

          {!canControl && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                You don't have permission to control machines
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
