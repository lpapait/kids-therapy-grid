import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule } from '@/types';
import { format, isSameDay, parse, addMinutes, isWithinInterval } from 'date-fns';

export interface ScheduleConflict {
  type: 'therapist_overlap' | 'child_overlap' | 'room_conflict';
  message: string;
  conflictingSchedule: Schedule;
  severity: 'warning' | 'error';
}

export const useConflictValidation = () => {
  const { schedules, getTherapistById } = useData();

  const validateScheduleConflict = useMemo(() => {
    return (
      newSchedule: Partial<Schedule> & { 
        date: Date; 
        time: string; 
        therapistId: string; 
        childId: string; 
        duration?: number;
      },
      excludeScheduleId?: string
    ): ScheduleConflict[] => {
      const conflicts: ScheduleConflict[] = [];
      const newDuration = newSchedule.duration || 60;
      
      // Parse new schedule time
      const newStartTime = parse(newSchedule.time, 'HH:mm', newSchedule.date);
      const newEndTime = addMinutes(newStartTime, newDuration);
      
      // Filter schedules for the same day, excluding the current schedule being edited
      const daySchedules = schedules.filter(schedule => 
        schedule.id !== excludeScheduleId &&
        isSameDay(new Date(schedule.date), newSchedule.date) &&
        schedule.status !== 'cancelled'
      );

      daySchedules.forEach(existingSchedule => {
        const existingStartTime = parse(existingSchedule.time, 'HH:mm', new Date(existingSchedule.date));
        const existingEndTime = addMinutes(existingStartTime, existingSchedule.duration || 60);

        // Check for time overlap
        const hasTimeOverlap = 
          isWithinInterval(newStartTime, { start: existingStartTime, end: existingEndTime }) ||
          isWithinInterval(newEndTime, { start: existingStartTime, end: existingEndTime }) ||
          isWithinInterval(existingStartTime, { start: newStartTime, end: newEndTime });

        if (hasTimeOverlap) {
          // Therapist conflict
          if (existingSchedule.therapistId === newSchedule.therapistId) {
            const therapist = getTherapistById(existingSchedule.therapistId);
            conflicts.push({
              type: 'therapist_overlap',
              message: `${therapist?.name || 'Terapeuta'} já possui agendamento das ${existingSchedule.time} às ${format(existingEndTime, 'HH:mm')}`,
              conflictingSchedule: existingSchedule,
              severity: 'error'
            });
          }

          // Child conflict
          if (existingSchedule.childId === newSchedule.childId) {
            conflicts.push({
              type: 'child_overlap',
              message: `Criança já possui agendamento das ${existingSchedule.time} às ${format(existingEndTime, 'HH:mm')}`,
              conflictingSchedule: existingSchedule,
              severity: 'error'
            });
          }
        }
      });

      return conflicts;
    };
  }, [schedules, getTherapistById]);

  const hasConflicts = (
    newSchedule: Partial<Schedule> & { 
      date: Date; 
      time: string; 
      therapistId: string; 
      childId: string; 
      duration?: number;
    },
    excludeScheduleId?: string
  ): boolean => {
    const conflicts = validateScheduleConflict(newSchedule, excludeScheduleId);
    return conflicts.some(conflict => conflict.severity === 'error');
  };

  return {
    validateScheduleConflict,
    hasConflicts
  };
};