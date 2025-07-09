
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Clock, Activity } from 'lucide-react';
import AgendaExport from './AgendaExport';
import { Therapist, Schedule, Child } from '@/types';

interface StatsCardsProps {
  stats: {
    totalScheduled: number;
    confirmedSessions: number;
    pendingSessions: number;
    cancelledSessions: number;
    completedSessions: number;
    totalHours: number;
    maxHours: number;
    utilizationPercentage: number;
  };
  therapist: Therapist;
  schedules: Schedule[];
  selectedWeek: Date;
  getChildById: (id: string) => Child | undefined;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  therapist,
  schedules,
  selectedWeek,
  getChildById
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalScheduled}</p>
              <p className="text-xs text-gray-600">Total Sessões</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-600">Horas Agendadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{stats.utilizationPercentage.toFixed(0)}%</p>
              <p className="text-xs text-gray-600">Utilização</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-center">
          <AgendaExport
            therapist={therapist}
            schedules={schedules}
            selectedWeek={selectedWeek}
            getChildById={getChildById}
            stats={{
              totalHours: stats.totalHours,
              totalScheduled: stats.totalScheduled,
              confirmedSessions: stats.confirmedSessions,
              pendingSessions: stats.pendingSessions,
              cancelledSessions: stats.cancelledSessions
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
