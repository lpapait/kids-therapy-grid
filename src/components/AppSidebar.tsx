
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  LogOut, 
  User, 
  Calendar, 
  Users, 
  UserPlus, 
  Eye,
  CalendarDays,
  Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const moderatorMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/children', label: 'Crianças', icon: Users },
    { path: '/therapists', label: 'Terapeutas', icon: UserPlus },
    { path: '/schedule', label: 'Agendamentos', icon: Calendar },
    { path: '/therapist-agenda', label: 'Ver Agendas', icon: Eye },
    { path: '/team-schedule-overview', label: 'Visão Geral da Equipe', icon: CalendarDays },
  ];

  const therapistMenuItems = [
    { path: '/dashboard', label: 'Minha Agenda', icon: Home },
  ];

  const menuItems = user?.role === 'moderator' ? moderatorMenuItems : therapistMenuItems;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 group-data-[collapsible=icon]:hidden">
            Grade Terapêutica
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-3 px-3 py-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">
                  {user?.role === 'moderator' ? 'Moderador' : 'Terapeuta'}
                </div>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sair"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
