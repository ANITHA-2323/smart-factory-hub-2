import React, { useState, useMemo } from 'react';
import { Search, Filter, Bell, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertBadge } from '@/components/alerts/AlertBadge';
import { Alert, AlertSeverity } from '@/types/industrial';
import { cn } from '@/lib/utils';

interface AlertsProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, onAcknowledge }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(true);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = 
        alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      const matchesAcknowledged = showAcknowledged || !alert.acknowledged;
      return matchesSearch && matchesSeverity && matchesAcknowledged;
    });
  }, [alerts, searchQuery, selectedSeverity, showAcknowledged]);

  const severityFilters: { value: AlertSeverity | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: 'bg-secondary' },
    { value: 'critical', label: 'Critical', color: 'bg-destructive' },
    { value: 'high', label: 'High', color: 'bg-destructive/70' },
    { value: 'medium', label: 'Medium', color: 'bg-warning' },
    { value: 'low', label: 'Low', color: 'bg-info' },
  ];

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const acknowledgeAll = () => {
    alerts.filter(a => !a.acknowledged).forEach(a => onAcknowledge(a.id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">
            {unacknowledgedCount} unacknowledged • {alerts.length} total
          </p>
        </div>
        {unacknowledgedCount > 0 && (
          <Button onClick={acknowledgeAll} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Acknowledge All
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {severityFilters.map(filter => (
            <Badge
              key={filter.value}
              variant={selectedSeverity === filter.value ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer hover:opacity-80 transition-opacity",
                selectedSeverity === filter.value && "border-primary"
              )}
              onClick={() => setSelectedSeverity(filter.value)}
            >
              <span className={cn("h-2 w-2 rounded-full mr-1.5", filter.color)} />
              {filter.label}
            </Badge>
          ))}
        </div>

        <Button
          variant={showAcknowledged ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAcknowledged(!showAcknowledged)}
        >
          {showAcknowledged ? 'Hide' : 'Show'} Acknowledged
        </Button>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertBadge
              key={alert.id}
              alert={alert}
              onAcknowledge={onAcknowledge}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
