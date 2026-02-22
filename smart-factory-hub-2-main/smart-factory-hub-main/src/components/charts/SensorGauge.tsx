import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SensorGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export const SensorGauge: React.FC<SensorGaugeProps> = ({
  label,
  value,
  unit,
  min,
  max,
  warningThreshold,
  criticalThreshold,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const warningPercent = ((warningThreshold - min) / (max - min)) * 100;
  const criticalPercent = ((criticalThreshold - min) / (max - min)) * 100;
  
  const getStatus = () => {
    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'normal';
  };
  
  const status = getStatus();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn(
          "text-2xl font-bold font-mono",
          status === 'normal' && "text-success",
          status === 'warning' && "text-warning",
          status === 'critical' && "text-destructive animate-pulse"
        )}>
          {value.toFixed(1)}
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </span>
      </div>
      
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        {/* Warning zone */}
        <div 
          className="absolute h-full bg-warning/30"
          style={{ 
            left: `${warningPercent}%`, 
            width: `${criticalPercent - warningPercent}%` 
          }}
        />
        {/* Critical zone */}
        <div 
          className="absolute h-full bg-destructive/30"
          style={{ 
            left: `${criticalPercent}%`, 
            width: `${100 - criticalPercent}%` 
          }}
        />
        {/* Value indicator */}
        <div 
          className={cn(
            "absolute h-full rounded-full transition-all duration-500",
            status === 'normal' && "bg-success",
            status === 'warning' && "bg-warning",
            status === 'critical' && "bg-destructive"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Threshold markers */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-warning"
          style={{ left: `${warningPercent}%` }}
        />
        <div 
          className="absolute top-0 h-full w-0.5 bg-destructive"
          style={{ left: `${criticalPercent}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </Card>
  );
};
