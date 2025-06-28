
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

export interface TherapistAlert {
  therapistId: string;
  therapistName: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  remainingHours: number;
  remainingSessions: number;
  status: 'approaching_limit' | 'near_limit' | 'critical';
  priority: number;
}

export const useTherapistAlerts = (selectedWeek: Date) => {
  const { therapists, schedules } = useData();

  return useMemo(() => {
    const alerts: TherapistAlert[] = [];

    therapists.forEach(therapist => {
      const weekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      const totalMinutes = weekSchedules.reduce((total, schedule) => 
        total + (schedule.duration || 60) + BREAK_TIME_MINUTES, 0
      );
      
      const adjustedMinutes = Math.max(0, totalMinutes - BREAK_TIME_MINUTES);
      const hoursScheduled = Math.round((adjustedMinutes / 60) * 10) / 10;
      const maxHours = therapist.weeklyWorkloadHours;
      const percentage = Math.round((hoursScheduled / maxHours) * 100);
      const remainingHours = Math.max(0, maxHours - hoursScheduled);
      const remainingSessions = Math.floor(remainingHours / 1); // Assuming 1h average sessions

      let status: TherapistAlert['status'];
      let priority: number;

      if (percentage >= 95) {
        status = 'critical';
        priority = 1;
      } else if (percentage >= 80) {
        status = 'near_limit';
        priority = 2;
      } else if (percentage >= 75) {
        status = 'approaching_limit';
        priority = 3;
      } else {
        return; // Skip therapists with low utilization
      }

      alerts.push({
        therapistId: therapist.id,
        therapistName: therapist.name,
        hoursScheduled,
        maxHours,
        percentage,
        remainingHours,
        remainingSessions,
        status,
        priority
      });
    });

    return alerts.sort((a, b) => a.priority - b.priority);
  }, [therapists, schedules, selectedWeek]);
};
