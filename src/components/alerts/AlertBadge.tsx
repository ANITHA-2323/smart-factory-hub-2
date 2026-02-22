import React from 'react';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import { Alert as AlertType, AlertSeverity } from '@/types/industrial';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface AlertBadgeProps {
  alert: AlertType;
  onAcknowledge?: (id: string) => void;
  compact?: boolean;
}

const severityConfig: Record<AlertSeverity, { 
  icon: React.ElementType; 
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  low: {
    icon: Info,
    bgClass: 'bg-info/10',
    textClass: 'text-info',
    borderClass: 'border-info/30',
  },
  medium: {
    icon: AlertCircle,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  high: {
    icon: AlertTriangle,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/30',
  },
  critical: {
    icon: XCircle,
    bgClass: 'bg-destructive/20',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/50',
  },
};

export const AlertBadge: React.FC<AlertBadgeProps> = ({ 
  alert, 
  onAcknowledge,
  compact = false,
}) => {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        config.bgClass,
        config.borderClass,
        !alert.acknowledged && alert.severity === 'critical' && "animate-pulse"
      )}>
        <Icon className={cn("h-4 w-4", config.textClass)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", config.textClass)}>
            {alert.type}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {alert.machineName}
          </p>
        </div>
        {!alert.acknowledged && onAcknowledge && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={() => onAcknowledge(alert.id)}
          >
            ACK
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all",
      config.bgClass,
      config.borderClass,
      !alert.acknowledged && alert.severity === 'critical' && "animate-pulse"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          alert.severity === 'critical' ? "bg-destructive/30" : config.bgClass
        )}>
          <Icon className={cn("h-5 w-5", config.textClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn("font-semibold", config.textClass)}>
              {alert.type}
            </h4>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full uppercase font-semibold",
              config.bgClass,
              config.textClass
            )}>
              {alert.severity}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {alert.message}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{alert.machineName}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
            </div>
            {!alert.acknowledged && onAcknowledge && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            )}
            {alert.acknowledged && (
              <span className="text-xs text-muted-foreground italic">Acknowledged</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
