
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import WeeklyGrid from '@/components/WeeklyGrid';
import { Child } from '@/types';

interface ScheduleGridProps {
  selectedWeek: Date;
  selectedChild: Child;
  onScheduleClick: (date: Date, time: string, schedule?: any) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedWeek,
  selectedChild,
  onScheduleClick
}) => {
  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Grade de Agendamentos - {selectedChild.name}</span>
          </CardTitle>
          <CardDescription>
            Clique em qualquer horário para agendar uma nova sessão ou editar uma existente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <WeeklyGrid
            selectedWeek={selectedWeek}
            selectedChild={selectedChild}
            onScheduleClick={onScheduleClick}
            viewMode="schedule"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleGrid;
