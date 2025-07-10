
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { getWeekDays, getTimeSlots, getDayName, formatDateForComparison } from '@/lib/dateUtils';
import { Schedule, Therapist, Child } from '@/types';
import { AgendaStats } from '../../../types/agenda.types';
import GridCell from './GridCell';

interface WeeklyGridProps {
  therapist: Therapist;
  weekSchedules: Schedule[];
  selectedWeek: Date;
  getChildById: (id: string) => Child | undefined;
  stats: AgendaStats;
  onEditSession: (schedule: Schedule) => void;
  onDeleteSession: (schedule: Schedule) => void;
  onViewChild: (child: Child) => void;
  onMarkCompleted: (schedule: Schedule) => void;
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  therapist,
  weekSchedules,
  selectedWeek,
  getChildById,
  stats,
  onEditSession,
  onDeleteSession,
  onViewChild,
  onMarkCompleted
}) => {
  const weekDays = getWeekDays(selectedWeek);
  const timeSlots = getTimeSlots();

  console.log('=== WEEKLY GRID DEBUG ===');
  console.log('Therapist:', therapist.name);
  console.log('Week schedules received:', weekSchedules.length);
  console.log('Week days:', weekDays.map(d => formatDateForComparison(d)));
  
  weekSchedules.forEach(schedule => {
    console.log(`Schedule: ${formatDateForComparison(schedule.date)} ${schedule.time} - ${schedule.activity}`);
  });

  const getScheduleForSlot = (date: Date, time: string) => {
    const dateStr = formatDateForComparison(date);
    const schedule = weekSchedules.find(schedule => {
      const scheduleDate = formatDateForComparison(schedule.date);
      const matches = scheduleDate === dateStr && schedule.time === time;
      
      if (matches) {
        console.log(`Found match: ${scheduleDate} ${schedule.time} - ${schedule.activity}`);
      }
      
      return matches;
    });
    
    return schedule;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
            style={{ backgroundColor: therapist.color }}
          />
          <User className="h-5 w-5 text-blue-600" />
          <span>Agenda Semanal - {therapist.name}</span>
        </CardTitle>
        <CardDescription>
          {therapist.professionalType} • {therapist.specialties.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white">
            <div className="grid grid-cols-8 gap-0">
              {/* Header */}
              <div className="bg-gray-50 border-b border-r p-3 font-medium text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                Horário
              </div>
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="bg-gray-50 border-b border-r p-3 text-center">
                  <div className="font-medium text-gray-900">
                    {getDayName(day)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(day, 'dd/MM', { locale: ptBR })}
                  </div>
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="bg-gray-50 border-b border-r p-3 text-sm font-medium text-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      {time}
                    </div>
                  </div>
                  {weekDays.map((day) => {
                    const schedule = getScheduleForSlot(day, time);
                    
                    return (
                      <GridCell
                        key={`${day.toISOString()}-${time}`}
                        day={day}
                        time={time}
                        schedule={schedule}
                        therapist={therapist}
                        getChildById={getChildById}
                        stats={stats}
                        onEditSession={onEditSession}
                        onDeleteSession={onDeleteSession}
                        onViewChild={onViewChild}
                        onMarkCompleted={onMarkCompleted}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Debug info - remover em produção */}
        {weekSchedules.length === 0 && (
          <div className="p-4 bg-yellow-50 border-t text-sm text-yellow-800">
            <strong>Debug:</strong> Nenhum agendamento encontrado para {therapist.name} nesta semana.
            <br />
            Semana: {format(selectedWeek, 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyGrid;
