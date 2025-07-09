
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

interface TeamWorkloadData {
  therapistId: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  remainingHours: number;
  sessionsCount: number;
}

export const useTeamWorkload = (selectedWeek: Date): TeamWorkloadData[] => {
  const { schedules, therapists } = useData();

  return useMemo(() => {
    return therapists.map(therapist => {
      // Get schedules for the therapist in the selected week
      const weekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      // Calculate total hours scheduled including break time
      const totalMinutesScheduled = weekSchedules.reduce((total, schedule) => {
        const sessionDuration = schedule.duration || 60;
        return total + sessionDuration + BREAK_TIME_MINUTES;
      }, 0);
      
      // Remove one break time since the last session doesn't need a break after
      const adjustedMinutes = Math.max(0, totalMinutesScheduled - BREAK_TIME_MINUTES);
      const hoursScheduled = Math.round((adjustedMinutes / 60) * 10) / 10;
      
      const maxHours = therapist.weeklyWorkloadHours;
      const percentage = Math.round((hoursScheduled / maxHours) * 100);
      const remainingHours = Math.max(0, maxHours - hoursScheduled);

      let status: 'available' | 'near_limit' | 'overloaded';
      if (percentage >= 100) {
        status = 'overloaded';
      } else if (percentage >= 80) {
        status = 'near_limit';
      } else {
        status = 'available';
      }

      return {
        therapistId: therapist.id,
        hoursScheduled,
        maxHours,
        percentage,
        status,
        remainingHours,
        sessionsCount: weekSchedules.length
      };
    }).filter(workload => workload.hoursScheduled > 0 || workload.sessionsCount > 0);
  }, [selectedWeek, schedules, therapists]);
};
