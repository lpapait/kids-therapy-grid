
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Activity } from 'lucide-react';
import { getWeekDays, getTimeSlots, getDayName } from '@/lib/dateUtils';
import { Schedule, Therapist } from '@/types';
import { useData } from '@/contexts/DataContext';
import WeekSelector from './WeekSelector';

interface TherapistWeeklyViewProps {
  therapistId: string;
  showWeekSelector?: boolean;
}

const TherapistWeeklyView: React.FC<TherapistWeeklyViewProps> = ({ 
  therapistId, 
  showWeekSelector = true 
}) => {
  const { schedules, getChildById, getTherapistById } = useData();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const therapist = getTherapistById(therapistId);
  const weekDays = getWeekDays(selectedWeek);
  const timeSlots = getTimeSlots();

  const therapistSchedules = schedules.filter(schedule => 
    schedule.therapistId === therapistId
  );

  const getScheduleForSlot = (date: Date, time: string) => {
    return therapistSchedules.find(schedule => 
      format(schedule.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      schedule.time === time
    );
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

  if (!therapist) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Terapeuta não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showWeekSelector && (
        <WeekSelector
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
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
                      
                      return (
                        <div
                          key={`${day.toISOString()}-${time}`}
                          className="border-b border-r p-3 min-h-[100px] hover:bg-gray-50 transition-colors"
                        >
                          {schedule && child ? (
                            <div className="space-y-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getStatusColor(schedule.status)} mb-1`}
                              >
                                {getStatusIcon(schedule.status)}
                              </Badge>
                              <div className="text-sm space-y-1">
                                <div className="font-medium text-gray-900">
                                  {child.name}
                                </div>
                                <div className="flex items-center text-blue-600 text-xs">
                                  <Activity className="h-3 w-3 mr-1" />
                                  {schedule.activity}
                                </div>
                                {schedule.observations && (
                                  <div className="text-xs text-gray-500 line-clamp-2">
                                    {schedule.observations}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-300">
                              <span className="text-xs">Livre</span>
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
    </div>
  );
};

export default TherapistWeeklyView;
