
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Therapist } from '@/types';
import { validateSchedule, ScheduleValidationContext, ValidationResult } from '@/lib/validationRules';

export const useScheduleValidation = (
  schedule: Partial<Schedule>,
  therapist: Therapist | null,
  date: Date,
  time: string,
  duration: number
): ValidationResult => {
  const { schedules } = useData();

  return useMemo(() => {
    if (!therapist) {
      return {
        isValid: false,
        errors: [{
          rule: 'therapist_required',
          message: 'Terapeuta é obrigatório',
          severity: 'error'
        }],
        warnings: []
      };
    }

    const context: ScheduleValidationContext = {
      schedule,
      existingSchedules: schedules,
      therapist,
      date,
      time,
      duration
    };

    return validateSchedule(context);
  }, [schedule, therapist, date, time, duration, schedules]);
};
