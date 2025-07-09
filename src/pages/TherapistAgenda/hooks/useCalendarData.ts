
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameMonth, isSameDay, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarDay {
  date: Date;
  sessions: Array<{
    id: string;
    time: string;
    childName: string;
    therapistName: string;
    therapistId: string;
    activity: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    color: string;
  }>;
  hasConflicts: boolean;
  sessionCount: number;
}

interface CalendarData {
  days: CalendarDay[];
  monthStats: {
    totalSessions: number;
    byTherapist: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

export const useCalendarData = (
  selectedDate: Date,
  therapistFilters: string[] = [],
  activityFilters: string[] = [],
  statusFilters: string[] = []
): CalendarData => {
  const { schedules, children, therapists } = useData();

  return useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Filter schedules for the month
    const monthSchedules = schedules.filter(schedule => 
      isSameMonth(schedule.date, selectedDate)
    );

    // Apply filters
    const filteredSchedules = monthSchedules.filter(schedule => {
      if (therapistFilters.length > 0 && !therapistFilters.includes(schedule.therapistId)) {
        return false;
      }
      if (activityFilters.length > 0 && !activityFilters.includes(schedule.activity)) {
        return false;
      }
      if (statusFilters.length > 0 && !statusFilters.includes(schedule.status)) {
        return false;
      }
      return true;
    });

    // Build calendar days
    const days: CalendarDay[] = monthDays.map(date => {
      const daySessions = filteredSchedules
        .filter(schedule => isSameDay(schedule.date, date))
        .map(schedule => {
          const child = children.find(c => c.id === schedule.childId);
          const therapist = therapists.find(t => t.id === schedule.therapistId);
          
          return {
            id: schedule.id,
            time: schedule.time,
            childName: child?.name || 'Desconhecido',
            therapistName: therapist?.name || 'Terapeuta não atribuído',
            therapistId: schedule.therapistId,
            activity: schedule.activity,
            status: schedule.status,
            color: therapist?.color || '#6B7280'
          };
        })
        .sort((a, b) => a.time.localeCompare(b.time));

      // Check for time conflicts
      const hasConflicts = daySessions.some((session, index) => {
        return daySessions.slice(index + 1).some(otherSession => 
          session.therapistId === otherSession.therapistId && 
          session.time === otherSession.time
        );
      });

      return {
        date,
        sessions: daySessions,
        hasConflicts,
        sessionCount: daySessions.length
      };
    });

    // Calculate month statistics
    const monthStats = {
      totalSessions: filteredSchedules.length,
      byTherapist: filteredSchedules.reduce((acc, schedule) => {
        const therapist = therapists.find(t => t.id === schedule.therapistId);
        const name = therapist?.name || 'Desconhecido';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: filteredSchedules.reduce((acc, schedule) => {
        acc[schedule.status] = (acc[schedule.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return { days, monthStats };
  }, [selectedDate, therapistFilters, activityFilters, statusFilters, schedules, children, therapists]);
};
