export type MachineStatus = 'active' | 'idle' | 'error' | 'offline';
export type MachineType = 'robot' | 'conveyor' | 'motor' | 'sensor';
export type UserRole = 'admin' | 'engineer' | 'viewer';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
  status: MachineStatus;
  efficiency: number;
  temperature: number;
  vibration: number;
  load: number;
  cycleTime: number;
  assignedTask: string;
  lastMaintenance: string;
  location: string;
  mode: 'auto' | 'manual';
}

export interface Sensor {
  id: string;
  machineId: string;
  type: 'temperature' | 'vibration' | 'load' | 'pressure';
  value: number;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  timestamp: Date;
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  acknowledged: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ProductionMetric {
  timestamp: Date;
  productionRate: number;
  efficiency: number;
  defectRate: number;
  downtime: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  machineId?: string;
  machineName?: string;
  timestamp: Date;
  details: string;
}
