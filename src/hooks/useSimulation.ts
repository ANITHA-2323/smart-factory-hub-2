import { useState, useEffect, useCallback } from 'react';
import { Machine, Alert } from '@/types/industrial';
import { mockMachines, mockAlerts } from '@/data/mockData';

const randomVariation = (base: number, range: number) => {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range));
};

export const useSimulation = () => {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const simulateData = useCallback(() => {
    setMachines(prevMachines => 
      prevMachines.map(machine => {
        if (machine.status === 'offline' || machine.status === 'idle') {
          return machine;
        }

        const newTemp = randomVariation(machine.temperature, 4);
        const newVibration = randomVariation(machine.vibration * 10, 2) / 10;
        const newLoad = randomVariation(machine.load, 8);
        const newEfficiency = machine.status === 'error' 
          ? randomVariation(machine.efficiency, 10) 
          : randomVariation(machine.efficiency, 3);

        // Check for new alerts
        if (newTemp > 55 && Math.random() > 0.8) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            machineId: machine.id,
            machineName: machine.name,
            type: 'Overheating',
            message: `Temperature at ${newTemp.toFixed(1)}°C exceeds threshold`,
            severity: newTemp > 60 ? 'critical' : 'high',
            timestamp: new Date(),
            acknowledged: false,
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 20));
        }

        return {
          ...machine,
          temperature: Number(newTemp.toFixed(1)),
          vibration: Number(newVibration.toFixed(2)),
          load: Number(newLoad.toFixed(0)),
          efficiency: Number(newEfficiency.toFixed(0)),
          cycleTime: machine.status === 'active' 
            ? Number(randomVariation(machine.cycleTime, 2).toFixed(1))
            : 0,
        };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateData, 2000);
    return () => clearInterval(interval);
  }, [simulateData]);

  const controlMachine = useCallback((machineId: string, action: string) => {
    setMachines(prevMachines =>
      prevMachines.map(machine => {
        if (machine.id !== machineId) return machine;

        switch (action) {
          case 'start':
            return { ...machine, status: 'active' as const };
          case 'stop':
            return { ...machine, status: 'idle' as const };
          case 'reset':
            return { 
              ...machine, 
              status: 'active' as const,
              efficiency: 95,
              temperature: 35,
              vibration: 0.5,
            };
          case 'emergency':
            return { ...machine, status: 'offline' as const };
          case 'toggle-mode':
            return { 
              ...machine, 
              mode: machine.mode === 'auto' ? 'manual' : 'auto' 
            };
          default:
            return machine;
        }
      })
    );
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  return {
    machines,
    alerts,
    controlMachine,
    acknowledgeAlert,
  };
};
