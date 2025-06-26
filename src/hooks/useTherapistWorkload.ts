
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

    // Calculate total hours scheduled (assuming each session is 1 hour)
    const hoursScheduled = weekSchedules.length;
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

    return {
      therapistId,
      hoursScheduled,
      maxHours,
      percentage,
      status,
      remainingHours
    };
  }, [therapistId, selectedWeek, schedules, getTherapistById]);
};
