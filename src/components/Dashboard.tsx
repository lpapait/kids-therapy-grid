import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, UserPlus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import TherapistWeeklyView from './TherapistWeeklyView';

const Dashboard = () => {
  const { user } = useAuth();
  const { children, therapists, schedules } = useData();

  const today = new Date();
  const todaySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate.toDateString() === today.toDateString();
  });

  const thisWeekSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return scheduleDate >= weekStart && scheduleDate <= weekEnd;
  });

  const completedSessions = thisWeekSchedules.filter(s => s.status === 'completed').length;
  const cancelledSessions = thisWeekSchedules.filter(s => s.status === 'cancelled').length;

  if (user?.role === 'moderator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da clínica de reabilitação</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Moderador
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Crianças</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{children.length}</div>
              <p className="text-xs text-muted-foreground">Pacientes cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terapeutas</CardTitle>
              <UserPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{therapists.length}</div>
              <p className="text-xs text-muted-foreground">Profissionais ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{todaySchedules.length}</div>
              <p className="text-xs text-muted-foreground">Agendamentos para hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {thisWeekSchedules.length > 0 
                  ? Math.round((completedSessions / thisWeekSchedules.length) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Sessões desta semana</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessões de Hoje</CardTitle>
              <CardDescription>Agendamentos programados para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              {todaySchedules.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhuma sessão agendada para hoje</p>
              ) : (
                <div className="space-y-3">
                  {todaySchedules.slice(0, 5).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{schedule.activity}</p>
                        <p className="text-sm text-gray-600">
                          {children.find(c => c.id === schedule.childId)?.name} - {schedule.time}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          schedule.status === 'completed' ? 'default' :
                          schedule.status === 'cancelled' ? 'destructive' : 'secondary'
                        }
                      >
                        {schedule.status === 'completed' ? 'Concluída' :
                         schedule.status === 'cancelled' ? 'Cancelada' : 'Agendada'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo da Semana</CardTitle>
              <CardDescription>Estatísticas das sessões desta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Sessões Concluídas</span>
                  </div>
                  <span className="font-bold text-green-600">{completedSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span>Sessões Agendadas</span>
                  </div>
                  <span className="font-bold text-yellow-600">
                    {thisWeekSchedules.filter(s => s.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span>Sessões Canceladas</span>
                  </div>
                  <span className="font-bold text-red-600">{cancelledSessions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Therapist Dashboard with Weekly View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minha Agenda</h1>
          <p className="text-gray-600">Sua agenda semanal de atendimentos</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Terapeuta
        </Badge>
      </div>

      {user?.id && (
        <TherapistWeeklyView 
          therapistId={user.id} 
          showWeekSelector={true}
        />
      )}
    </div>
  );
};

export default Dashboard;
