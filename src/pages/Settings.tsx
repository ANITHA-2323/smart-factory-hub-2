import React from 'react';
import { Bell, Shield, Monitor, Database, Clock, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">System configuration and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Critical Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for critical machine failures
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Warning Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when machines approach warning thresholds
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Scheduled maintenance notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Updates about system changes and new features
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Thresholds */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Alert Thresholds</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Temperature Warning (°C)</Label>
              <Input type="number" defaultValue={50} className="mt-2 bg-secondary" />
            </div>
            <div>
              <Label>Temperature Critical (°C)</Label>
              <Input type="number" defaultValue={65} className="mt-2 bg-secondary" />
            </div>
            <div>
              <Label>Vibration Warning (mm/s)</Label>
              <Input type="number" defaultValue={2} step="0.1" className="mt-2 bg-secondary" />
            </div>
            <div>
              <Label>Efficiency Minimum (%)</Label>
              <Input type="number" defaultValue={70} className="mt-2 bg-secondary" />
            </div>
          </div>
        </Card>

        {/* Display */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Display</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Show more information in less space
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable pulse animations on status indicators
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh dashboard data
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Data */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Data & Sync</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Data Refresh Interval (seconds)</Label>
              <Input type="number" defaultValue={2} min={1} max={60} className="mt-2 bg-secondary" />
            </div>
            <div>
              <Label>Log Retention (days)</Label>
              <Input type="number" defaultValue={30} className="mt-2 bg-secondary" />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div>
                <Label>WebSocket Connection</Label>
                <p className="text-sm text-muted-foreground">
                  Use real-time data streaming
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>

      {/* System Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">System Information</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Version</p>
            <p className="font-mono font-semibold">v1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Environment</p>
            <p className="font-mono font-semibold">Production</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Update</p>
            <p className="font-mono font-semibold">Jan 22, 2024</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">API Status</p>
            <p className="font-mono font-semibold text-success">Connected</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
