
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek, addWeeks } from '@/lib/dateUtils';

interface WeeklyStats {
  completed: number;
  cancelled: number;
  total: number;
}

interface WeeklyComparison {
  current: WeeklyStats;
  previous: WeeklyStats;
  trends: {
    completed: { value: number; percentage: number };
    cancelled: { value: number; percentage: number };
    total: { value: number; percentage: number };
  };
}

export const useWeeklyComparison = (selectedWeek: Date): WeeklyComparison => {
  const { schedules } = useData();

  return useMemo(() => {
    const previousWeek = addWeeks(selectedWeek, -1);

    // Current week stats
    const currentWeekSchedules = schedules.filter(schedule => 
      isSameWeek(schedule.date, selectedWeek)
    );
    
    const current: WeeklyStats = {
      completed: currentWeekSchedules.filter(s => s.status === 'completed').length,
      cancelled: currentWeekSchedules.filter(s => s.status === 'cancelled').length,
      total: currentWeekSchedules.length
    };

    // Previous week stats
    const previousWeekSchedules = schedules.filter(schedule => 
      isSameWeek(schedule.date, previousWeek)
    );
    
    const previous: WeeklyStats = {
      completed: previousWeekSchedules.filter(s => s.status === 'completed').length,
      cancelled: previousWeekSchedules.filter(s => s.status === 'cancelled').length,
      total: previousWeekSchedules.length
    };

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      const value = current - previous;
      const percentage = previous > 0 ? Math.round((value / previous) * 100) : 0;
      return { value, percentage };
    };

    const trends = {
      completed: calculateTrend(current.completed, previous.completed),
      cancelled: calculateTrend(current.cancelled, previous.cancelled),
      total: calculateTrend(current.total, previous.total)
    };

    return { current, previous, trends };
  }, [schedules, selectedWeek]);
};
