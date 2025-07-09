
import React from 'react';
import { format } from 'date-fns';
import { getWeekDays, getTimeSlots } from '@/lib/dateUtils';
import { Schedule, Child } from '@/types';
import { useData } from '@/contexts/DataContext';
import WeeklyGridValidation from './WeeklyGrid/WeeklyGridValidation';
import WeeklyGridHeader from './WeeklyGrid/WeeklyGridHeader';
import WeeklyGridTimeSlot from './WeeklyGrid/WeeklyGridTimeSlot';
import WeeklyGridCell from './WeeklyGrid/WeeklyGridCell';

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
  const validationComponent = <WeeklyGridValidation selectedWeek={selectedWeek} />;
  if (validationComponent) return validationComponent;

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

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="grid grid-cols-8 gap-0">
        {/* Header */}
        <WeeklyGridHeader weekDays={weekDays} />

        {/* Time slots */}
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <WeeklyGridTimeSlot time={time} />
            {weekDays.map((day) => {
              const schedule = getScheduleForSlot(day, time);
              const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
              
              return (
                <WeeklyGridCell
                  key={`${day.toISOString()}-${time}`}
                  date={day}
                  time={time}
                  schedule={schedule}
                  therapist={therapist}
                  selectedChild={selectedChild}
                  onScheduleClick={onScheduleClick}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGrid;
