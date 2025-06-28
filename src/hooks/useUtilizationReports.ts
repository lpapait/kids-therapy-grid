
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek, startOfWeek, addWeeks } from 'date-fns';

export interface TherapistUtilization {
  therapistId: string;
  therapistName: string;
  color: string;
  currentWeekHours: number;
  maxWeeklyHours: number;
  utilization: number;
  trend: 'up' | 'down' | 'stable';
  previousWeekHours: number;
  averageSessionDuration: number;
  totalSessions: number;
}

export interface UtilizationSummary {
  totalTherapists: number;
  averageUtilization: number;
  overloadedCount: number;
  underutilizedCount: number;
  optimalCount: number;
  totalHoursScheduled: number;
  totalCapacity: number;
  capacityUtilization: number;
}

export const useUtilizationReports = (selectedWeek: Date) => {
  const { therapists, schedules } = useData();

  const utilizationData = useMemo(() => {
    const previousWeek = addWeeks(selectedWeek, -1);
    
    const therapistUtilization: TherapistUtilization[] = therapists.map(therapist => {
      // Current week schedules
      const currentWeekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      // Previous week schedules for trend analysis
      const previousWeekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, previousWeek) &&
        schedule.status !== 'cancelled'
      );

      const currentWeekMinutes = currentWeekSchedules.reduce((total, schedule) => 
        total + (schedule.duration || 60), 0
      );
      const currentWeekHours = Math.round((currentWeekMinutes / 60) * 10) / 10;

      const previousWeekMinutes = previousWeekSchedules.reduce((total, schedule) => 
        total + (schedule.duration || 60), 0
      );
      const previousWeekHours = Math.round((previousWeekMinutes / 60) * 10) / 10;

      const utilization = Math.round((currentWeekHours / therapist.weeklyWorkloadHours) * 100);
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      const hoursDiff = currentWeekHours - previousWeekHours;
      if (Math.abs(hoursDiff) > 1) {
        trend = hoursDiff > 0 ? 'up' : 'down';
      }

      const averageSessionDuration = currentWeekSchedules.length > 0 
        ? Math.round(currentWeekMinutes / currentWeekSchedules.length)
        : 0;

      return {
        therapistId: therapist.id,
        therapistName: therapist.name,
        color: therapist.color,
        currentWeekHours,
        maxWeeklyHours: therapist.weeklyWorkloadHours,
        utilization,
        trend,
        previousWeekHours,
        averageSessionDuration,
        totalSessions: currentWeekSchedules.length
      };
    });

    // Calculate summary statistics
    const totalHoursScheduled = therapistUtilization.reduce((sum, t) => sum + t.currentWeekHours, 0);
    const totalCapacity = therapistUtilization.reduce((sum, t) => sum + t.maxWeeklyHours, 0);
    const averageUtilization = Math.round(
      therapistUtilization.reduce((sum, t) => sum + t.utilization, 0) / therapistUtilization.length
    );

    const overloadedCount = therapistUtilization.filter(t => t.utilization >= 100).length;
    const underutilizedCount = therapistUtilization.filter(t => t.utilization < 60).length;
    const optimalCount = therapistUtilization.filter(t => t.utilization >= 60 && t.utilization < 100).length;

    const summary: UtilizationSummary = {
      totalTherapists: therapistUtilization.length,
      averageUtilization,
      overloadedCount,
      underutilizedCount,
      optimalCount,
      totalHoursScheduled,
      totalCapacity,
      capacityUtilization: Math.round((totalHoursScheduled / totalCapacity) * 100)
    };

    return {
      therapistUtilization: therapistUtilization.sort((a, b) => b.utilization - a.utilization),
      summary
    };
  }, [therapists, schedules, selectedWeek]);

  return utilizationData;
};
