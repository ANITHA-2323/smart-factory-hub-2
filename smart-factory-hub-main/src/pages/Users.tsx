import React from 'react';
import { Plus, MoreVertical, Shield, UserCheck, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Users: React.FC = () => {
  const roleIcons = {
    admin: Shield,
    engineer: UserCheck,
    viewer: Eye,
  };

  const roleColors = {
    admin: 'bg-primary/20 text-primary border-primary/30',
    engineer: 'bg-success/20 text-success border-success/30',
    viewer: 'bg-info/20 text-info border-info/30',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user access and roles</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Role Legend */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Roles:</span>
        {(['admin', 'engineer', 'viewer'] as const).map(role => {
          const Icon = roleIcons[role];
          return (
            <div key={role} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{role}</span>
            </div>
          );
        })}
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockUsers.map(user => {
          const Icon = roleIcons[user.role];
          return (
            <Card key={user.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={cn("capitalize", roleColors[user.role])}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Active since Jan 2024
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Role Permissions Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Admin</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Full system access</li>
              <li>• Emergency shutdown control</li>
              <li>• User management</li>
              <li>• View all logs</li>
              <li>• Machine management</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-success" />
              <span className="font-semibold text-foreground">Engineer</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Control machines</li>
              <li>• Assign tasks/jobs</li>
              <li>• View analytics</li>
              <li>• Acknowledge alerts</li>
              <li>• No emergency access</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-info" />
              <span className="font-semibold text-foreground">Viewer</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Read-only dashboard</li>
              <li>• View machine status</li>
              <li>• View active alerts</li>
              <li>• No control access</li>
              <li>• No settings access</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Users;
