
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, Activity } from 'lucide-react';
import { getWeekDays, getTimeSlots, getDayName } from '@/lib/dateUtils';
import { getTherapistColorStyles } from '@/lib/therapistColors';
import { Schedule, Therapist, Child } from '@/types';
import SessionTooltip from './SessionTooltip';
import SlotSuggestionPopover from './SlotSuggestionPopover';
import SessionActions from './SessionActions';

interface WeeklyAgendaGridProps {
  therapist: Therapist;
  weekSchedules: Schedule[];
  selectedWeek: Date;
  getChildById: (id: string) => Child | undefined;
  stats: {
    totalHours: number;
    maxHours: number;
  };
  onEditSession: (schedule: Schedule) => void;
  onDeleteSession: (schedule: Schedule) => void;
  onViewChild: (child: Child) => void;
  onMarkCompleted: (schedule: Schedule) => void;
}

const WeeklyAgendaGrid: React.FC<WeeklyAgendaGridProps> = ({
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

  const getScheduleForSlot = (date: Date, time: string) => {
    return weekSchedules.find(schedule => 
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
                    const child = schedule ? getChildById(schedule.childId) : null;
                    const colorStyles = schedule ? getTherapistColorStyles(therapist.color, true) : {};
                    
                    return (
                      <div
                        key={`${day.toISOString()}-${time}`}
                        className="border-b border-r p-2 min-h-[100px] transition-colors group relative"
                        style={schedule ? colorStyles : {}}
                      >
                        {schedule && child ? (
                          <SessionTooltip schedule={schedule} child={child}>
                            <div className="h-full cursor-pointer">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${getStatusColor(schedule.status)} mb-1`}
                                  >
                                    {getStatusIcon(schedule.status)}
                                  </Badge>
                                  <SessionActions
                                    schedule={schedule}
                                    child={child}
                                    onEdit={onEditSession}
                                    onDelete={onDeleteSession}
                                    onViewChild={onViewChild}
                                    onMarkCompleted={onMarkCompleted}
                                  />
                                </div>
                                <div className="text-sm space-y-1">
                                  <div className="font-medium text-gray-900 flex items-center">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-1 border" 
                                      style={{ backgroundColor: therapist.color }}
                                    />
                                    {child.name}
                                  </div>
                                  <div className="flex items-center text-blue-600 text-xs">
                                    <Activity className="h-3 w-3 mr-1" />
                                    {schedule.activity}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {schedule.duration} min
                                  </div>
                                  {schedule.observations && (
                                    <div className="text-xs text-gray-500 line-clamp-2">
                                      {schedule.observations}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SessionTooltip>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <SlotSuggestionPopover
                              therapist={therapist}
                              date={day}
                              time={time}
                              currentWorkload={stats.totalHours}
                              maxWorkload={stats.maxHours}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyAgendaGrid;
