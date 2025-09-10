import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Smartphone, 
  Settings, 
  Calendar, 
  BarChart3,
  Zap,
  Users,
  Wifi
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'STAFF', 'USER'],
  },
  {
    title: 'Devices',
    url: '/devices',
    icon: Smartphone,
    roles: ['ADMIN', 'STAFF', 'USER'],
  },
  {
    title: 'Analytics', 
    url: '/analytics',
    icon: BarChart3,
    roles: ['ADMIN', 'STAFF', 'USER'],
  },
  {
    title: 'Automations',
    url: '/automations',
    icon: Zap,
    roles: ['ADMIN', 'STAFF', 'USER'],
  },
  {
    title: 'Schedule',
    url: '/schedule',
    icon: Calendar,
    roles: ['ADMIN', 'STAFF', 'USER'],
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'STAFF', 'USER'],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, organization } = useAuthStore();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const filteredItems = navigationItems.filter(item =>
    item.roles.includes(user?.role || 'USER')
  );

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar className="border-r border-border bg-gradient-to-b from-card to-card/80">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Wifi className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                {organization?.name || 'Saphari Hub'}
              </h2>
              <p className="text-xs text-muted-foreground">Smart IoT Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            collapsed && "sr-only"
          )}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive(item.url) && "bg-primary text-primary-foreground shadow-sm"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info at bottom */}
        <div className="mt-auto p-2">
          <div className={cn(
            "flex items-center space-x-2 p-2 rounded-md bg-muted/50",
            collapsed && "justify-center"
          )}>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}