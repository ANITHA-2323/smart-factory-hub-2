import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      icon: 'bg-primary/20 text-primary',
      glow: '',
    },
    success: {
      icon: 'bg-success/20 text-success',
      glow: 'card-glow-success',
    },
    warning: {
      icon: 'bg-warning/20 text-warning',
      glow: 'card-glow-warning',
    },
    error: {
      icon: 'bg-destructive/20 text-destructive',
      glow: 'card-glow-error',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn("p-6 border border-border/50", styles.glow)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-mono mt-1 text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-muted-foreground text-xs ml-1">vs last hour</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
