
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getWeekDays, getTimeSlots, getDayName } from '@/lib/dateUtils';
import { Schedule, Child, Therapist } from '@/types';
import { useData } from '@/contexts/DataContext';

interface WeeklyGridProps {
  selectedWeek: Date;
  selectedChild?: Child;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void;
  viewMode: 'template' | 'schedule';
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ 
  selectedWeek, 
  selectedChild,
  onScheduleClick,
  viewMode 
}) => {
  const { schedules, getTherapistById } = useData();
  const weekDays = getWeekDays(selectedWeek);
  const timeSlots = getTimeSlots();

  const getScheduleForSlot = (date: Date, time: string) => {
    if (!selectedChild) return null;
    
    return schedules.find(schedule => 
      schedule.childId === selectedChild.id &&
      format(schedule.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      schedule.time === time
    );
  };

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'rescheduled':
        return '⚠️';
      default:
        return '📅';
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="grid grid-cols-8 gap-0">
        {/* Header */}
        <div className="bg-gray-50 border-b border-r p-3 font-medium text-gray-900">
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
            <div className="bg-gray-50 border-b border-r p-3 text-sm font-medium text-gray-900 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              {time}
            </div>
            {weekDays.map((day) => {
              const schedule = getScheduleForSlot(day, time);
              const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
              
              return (
                <div
                  key={`${day.toISOString()}-${time}`}
                  className="border-b border-r p-2 min-h-[80px] hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onScheduleClick(day, time, schedule || undefined)}
                >
                  {schedule ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(schedule.status)}`}>
                          {getStatusIcon(schedule.status)} {schedule.status === 'scheduled' ? 'Agendado' : 
                           schedule.status === 'completed' ? 'Realizado' :
                           schedule.status === 'cancelled' ? 'Cancelado' : 'Remarcado'}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center text-blue-600 font-medium mb-1">
                          <Activity className="h-3 w-3 mr-1" />
                          {schedule.activity}
                        </div>
                        {therapist && (
                          <div className="flex items-center text-gray-600 text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {therapist.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <Button variant="ghost" size="sm" className="text-xs">
                        + Agendar
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGrid;
