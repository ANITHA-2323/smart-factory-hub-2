import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MachineCard } from '@/components/machines/MachineCard';
import { MachineControlPanel } from '@/components/machines/MachineControlPanel';
import { Machine, MachineType, MachineStatus } from '@/types/industrial';
import { cn } from '@/lib/utils';

interface MachinesProps {
  machines: Machine[];
  onControlMachine: (machineId: string, action: string) => void;
}

const Machines: React.FC<MachinesProps> = ({ machines, onControlMachine }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MachineType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MachineStatus | 'all'>('all');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMachines = useMemo(() => {
    return machines.filter(machine => {
      const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || machine.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || machine.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [machines, searchQuery, selectedType, selectedStatus]);

  const typeFilters: { value: MachineType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'robot', label: 'Robots' },
    { value: 'conveyor', label: 'Conveyors' },
    { value: 'motor', label: 'Motors' },
    { value: 'sensor', label: 'Sensors' },
  ];

  const statusFilters: { value: MachineStatus | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Status', color: 'bg-secondary' },
    { value: 'active', label: 'Active', color: 'bg-success' },
    { value: 'idle', label: 'Idle', color: 'bg-warning' },
    { value: 'error', label: 'Error', color: 'bg-destructive' },
    { value: 'offline', label: 'Offline', color: 'bg-muted-foreground' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Machines</h1>
          <p className="text-muted-foreground">
            {filteredMachines.length} of {machines.length} machines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search machines by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {typeFilters.map(filter => (
            <Button
              key={filter.value}
              variant={selectedType === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(filter.value)}
              className="text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusFilters.map(filter => (
          <Badge
            key={filter.value}
            variant={selectedStatus === filter.value ? 'default' : 'outline'}
            className={cn(
              "cursor-pointer hover:opacity-80 transition-opacity",
              selectedStatus === filter.value && "border-primary"
            )}
            onClick={() => setSelectedStatus(filter.value)}
          >
            <span className={cn("h-2 w-2 rounded-full mr-1.5", filter.color)} />
            {filter.label}
          </Badge>
        ))}
      </div>

      {/* Machine Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMachines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onClick={() => setSelectedMachine(machine)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMachines.map(machine => (
            <div
              key={machine.id}
              className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => setSelectedMachine(machine)}
            >
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={cn(
                    machine.status === 'active' && 'bg-success/20 text-success border-success/30',
                    machine.status === 'idle' && 'bg-warning/20 text-warning border-warning/30',
                    machine.status === 'error' && 'bg-destructive/20 text-destructive border-destructive/30',
                    machine.status === 'offline' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {machine.status}
                </Badge>
                <div>
                  <h3 className="font-semibold text-foreground">{machine.name}</h3>
                  <p className="text-sm text-muted-foreground">{machine.location} • {machine.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Efficiency</p>
                  <p className="font-mono font-bold text-success">{machine.efficiency}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Temp</p>
                  <p className="font-mono font-bold">{machine.temperature}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Load</p>
                  <p className="font-mono font-bold">{machine.load}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredMachines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No machines found matching your criteria</p>
        </div>
      )}

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

export default Machines;
