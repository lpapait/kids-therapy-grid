
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Activity, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getWeekDays, getTimeSlots, getDayName } from '@/lib/dateUtils';
import { getTherapistColorStyles } from '@/lib/therapistColors';
import { Schedule, Child, Therapist } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useTherapistWorkload } from '@/hooks/useTherapistWorkload';

interface WeeklyGridProps {
  selectedWeek: Date;
  selectedChild?: Child | null;
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
  
  // Validações de segurança
  if (!selectedWeek) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center text-gray-500">
          <Calendar className="h-8 w-8 mx-auto mb-2" />
          <p>Semana não selecionada</p>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays(selectedWeek);
  const timeSlots = getTimeSlots();

  const getScheduleForSlot = (date: Date, time: string) => {
    if (!selectedChild) return null;
    
    try {
      return schedules.find(schedule => 
        schedule.childId === selectedChild.id &&
        format(schedule.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        schedule.time === time
      ) || null;
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      return null;
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
      case 'scheduled':
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
      case 'scheduled':
      default:
        return '📅';
    }
  };

  const getStatusLabel = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'Realizado';
      case 'cancelled':
        return 'Cancelado';
      case 'rescheduled':
        return 'Remarcado';
      case 'scheduled':
      default:
        return 'Agendado';
    }
  };

  // Component to show workload alert
  const WorkloadAlert: React.FC<{ therapistId: string }> = ({ therapistId }) => {
    const workloadData = useTherapistWorkload(therapistId, selectedWeek);
    
    if (!workloadData || workloadData.status === 'available') return null;
    
    return (
      <div className="absolute top-1 right-1">
        <AlertTriangle 
          className={`h-3 w-3 ${
            workloadData.status === 'overloaded' ? 'text-red-500' : 'text-yellow-500'
          }`}
        />
      </div>
    );
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
              <div className="text-center">
                {time}
              </div>
            </div>
            {weekDays.map((day) => {
              const schedule = getScheduleForSlot(day, time);
              const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
              const colorStyles = therapist ? getTherapistColorStyles(therapist.color, false) : {};
              
              return (
                <div
                  key={`${day.toISOString()}-${time}`}
                  className="border-b border-r p-3 min-h-[120px] hover:bg-gray-50 cursor-pointer transition-colors relative"
                  style={schedule ? colorStyles : {}}
                  onClick={() => onScheduleClick(day, time, schedule || undefined)}
                >
                  {schedule ? (
                    <div className="space-y-2">
                      {/* Workload Alert */}
                      {schedule.therapistId && (
                        <WorkloadAlert therapistId={schedule.therapistId} />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(schedule.status)}`}>
                          {getStatusIcon(schedule.status)} {getStatusLabel(schedule.status)}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-blue-600 font-medium">
                          <Activity className="h-3 w-3 mr-1" />
                          {schedule.activity || 'Atividade não definida'}
                        </div>
                        {therapist && (
                          <div className="flex items-center text-gray-600 text-xs">
                            <div 
                              className="w-3 h-3 rounded-full mr-1 border" 
                              style={{ backgroundColor: therapist.color || '#gray' }}
                            />
                            <User className="h-3 w-3 mr-1" />
                            {therapist.name || 'Terapeuta não identificado'}
                          </div>
                        )}
                        {schedule.observations && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {schedule.observations}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        disabled={!selectedChild}
                      >
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
