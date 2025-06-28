
import { useMemo } from 'react';
import { TherapistWorkload } from '@/types';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';

export const useTherapistWorkload = (therapistId: string | null, selectedWeek: Date): TherapistWorkload | null => {
  const { schedules, getTherapistById } = useData();

  return useMemo(() => {
    if (!therapistId) return null;

    const therapist = getTherapistById(therapistId);
    if (!therapist) return null;

    // Get schedules for the therapist in the selected week
    const weekSchedules = schedules.filter(schedule => 
      schedule.therapistId === therapistId &&
      isSameWeek(schedule.date, selectedWeek) &&
      schedule.status !== 'cancelled'
    );

    // Calculate total hours scheduled using actual durations
    const totalMinutesScheduled = weekSchedules.reduce((total, schedule) => {
      return total + (schedule.duration || 60); // Default to 60 minutes if not specified
    }, 0);
    
    const hoursScheduled = Math.round((totalMinutesScheduled / 60) * 10) / 10; // Round to 1 decimal
    const maxHours = therapist.weeklyWorkloadHours;
    const percentage = Math.round((hoursScheduled / maxHours) * 100);
    const remainingHours = Math.max(0, maxHours - hoursScheduled);

    let status: TherapistWorkload['status'];
    if (percentage >= 100) {
      status = 'overloaded';
    } else if (percentage >= 80) {
      status = 'near_limit';
    } else {
      status = 'available';
    }

    // Generate smart suggestions based on workload status
    const suggestedActions: string[] = [];
    
    if (status === 'available' && remainingHours > 2) {
      suggestedActions.push('Pode agendar mais sessões');
      suggestedActions.push(`${remainingHours.toFixed(1)}h disponíveis`);
    } else if (status === 'near_limit') {
      suggestedActions.push('Considere sessões mais curtas');
      suggestedActions.push('Planeje com cuidado');
    } else if (status === 'overloaded') {
      suggestedActions.push('Redistribuir algumas sessões');
      suggestedActions.push('Verificar disponibilidade de outros terapeutas');
    }

    return {
      therapistId,
      hoursScheduled,
      maxHours,
      percentage,
      status,
      remainingHours,
      suggestedActions
    };
  }, [therapistId, selectedWeek, schedules, getTherapistById]);
};
