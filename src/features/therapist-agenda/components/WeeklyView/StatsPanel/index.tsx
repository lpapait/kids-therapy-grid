
import React from 'react';
import { BarChart3, Clock, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AgendaStats } from '../../../types/agenda.types';
import { Therapist, Schedule, Child } from '@/types';
import StatCard from './StatCard';
import AgendaExport from './ExportActions';

interface StatsPanelProps {
  stats: AgendaStats;
  therapist: Therapist;
  schedules: Schedule[];
  selectedWeek: Date;
  getChildById: (id: string) => Child | undefined;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  therapist,
  schedules,
  selectedWeek,
  getChildById
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={BarChart3}
        value={stats.totalScheduled}
        label="Total Sessões"
        color="text-blue-600"
      />
      <StatCard
        icon={Clock}
        value={`${stats.totalHours.toFixed(1)}h`}
        label="Horas Agendadas"
        color="text-green-600"
      />
      <StatCard
        icon={Activity}
        value={`${stats.utilizationPercentage.toFixed(0)}%`}
        label="Utilização"
        color="text-orange-600"
      />
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

export default StatsPanel;
