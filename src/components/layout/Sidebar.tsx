import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Activity, 
  Bell, 
  Settings, 
  Users, 
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Factory
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  alertCount: number;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'engineer', 'viewer'] },
  { name: 'Machines', href: '/machines', icon: Bot, roles: ['admin', 'engineer', 'viewer'] },
  { name: 'Analytics', href: '/analytics', icon: Activity, roles: ['admin', 'engineer'] },
  { name: 'Alerts', href: '/alerts', icon: Bell, roles: ['admin', 'engineer', 'viewer'] },
  { name: 'Activity Logs', href: '/logs', icon: FileText, roles: ['admin'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'engineer'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, alertCount }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <Factory className="h-8 w-8 text-primary shrink-0" />
        {!collapsed && (
          <span className="ml-3 text-lg font-bold text-foreground">
            Industrial<span className="text-primary">OS</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-glow-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
              {!collapsed && (
                <>
                  <span className="ml-3 font-medium">{item.name}</span>
                  {item.name === 'Alerts' && alertCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto text-xs px-1.5 py-0.5 min-w-[20px] flex items-center justify-center"
                    >
                      {alertCount}
                    </Badge>
                  )}
                </>
              )}
              {collapsed && item.name === 'Alerts' && alertCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground font-bold">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={logout}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground hover:bg-destructive/10",
            collapsed && "p-2"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  );
};
