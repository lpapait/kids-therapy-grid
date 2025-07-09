
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, UserPlus, TrendingUp } from 'lucide-react';
import WeeklyView from '@/features/therapist-agenda/components/WeeklyView';
import WeekSelector from './WeekSelector';

// New dashboard components
import TodaysSessions from './Dashboard/TodaysSessions';
import SystemAlerts from './Dashboard/SystemAlerts';
import SpecialtyDistribution from './Dashboard/SpecialtyDistribution';
import TherapistRanking from './Dashboard/TherapistRanking';
import WeeklyComparison from './Dashboard/WeeklyComparison';
import PlanningPendencies from './Dashboard/PlanningPendencies';
import QuickActions from './Dashboard/QuickActions';

// Dashboard metrics hook
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useData } from '@/contexts/DataContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { children, therapists } = useData();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const dashboardMetrics = useDashboardMetrics(selectedWeek);

  if (user?.role === 'moderator') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central de Comando</h1>
            <p className="text-gray-600">Painel estratégico e operacional da clínica</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              Moderador
            </Badge>
            <WeekSelector 
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
            />
          </div>
        </div>

        {/* Top Priority Section - Alerts and Today's Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemAlerts selectedWeek={selectedWeek} />
          <TodaysSessions sessions={dashboardMetrics.todaySchedules} />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total de Crianças</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{children.length}</div>
              <p className="text-xs text-blue-600">Pacientes cadastrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Terapeutas Ativos</CardTitle>
              <UserPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{therapists.length}</div>
              <p className="text-xs text-green-600">Profissionais na equipe</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Sessões Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{dashboardMetrics.todaySchedules.length}</div>
              <p className="text-xs text-purple-600">Agendamentos para hoje</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Esta Semana</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{dashboardMetrics.weeklyStats.totalScheduled}</div>
              <p className="text-xs text-orange-600">
                {dashboardMetrics.weeklyStats.completed} concluídas, {dashboardMetrics.weeklyStats.pending} pendentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpecialtyDistribution selectedWeek={selectedWeek} />
          <WeeklyComparison selectedWeek={selectedWeek} />
        </div>

        {/* Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TherapistRanking selectedWeek={selectedWeek} />
          </div>
          <QuickActions />
        </div>

        {/* Planning Section */}
        <PlanningPendencies selectedWeek={selectedWeek} />
      </div>
    );
  }

  // Therapist Dashboard - Keep existing functionality
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
        <WeeklyView 
          therapistId={user.id} 
          showWeekSelector={true}
        />
      )}
    </div>
  );
};

export default Dashboard;
