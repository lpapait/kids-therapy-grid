
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';

interface DashboardMetrics {
  todaySchedules: Array<{
    id: string;
    time: string;
    childName: string;
    specialty: string;
    therapistName: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    activity: string;
  }>;
  weeklyStats: {
    totalScheduled: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
}

export const useDashboardMetrics = (selectedWeek: Date): DashboardMetrics => {
  const { schedules, children, therapists } = useData();

  return useMemo(() => {
    const today = new Date();
    
    // Today's schedules with detailed info
    const todaySchedules = schedules
      .filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.toDateString() === today.toDateString();
      })
      .map(schedule => {
        const child = children.find(c => c.id === schedule.childId);
        const therapist = therapists.find(t => t.id === schedule.therapistId);
        
        // Get specialty from therapist's specialties array (first one) or from therapist specialties
        const specialty = therapist?.specialties?.[0] || 'Especialidade não definida';
        
        // Map rescheduled status to scheduled for display
        const displayStatus = schedule.status === 'rescheduled' ? 'scheduled' : schedule.status;
        
        return {
          id: schedule.id,
          time: schedule.time,
          childName: child?.name || 'Criança não encontrada',
          specialty,
          therapistName: therapist?.name || 'Terapeuta não atribuído',
          status: displayStatus as 'scheduled' | 'completed' | 'cancelled',
          activity: schedule.activity
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    // Weekly stats
    const weekSchedules = schedules.filter(schedule => 
      isSameWeek(schedule.date, selectedWeek)
    );

    const weeklyStats = {
      totalScheduled: weekSchedules.length,
      completed: weekSchedules.filter(s => s.status === 'completed').length,
      cancelled: weekSchedules.filter(s => s.status === 'cancelled').length,
      pending: weekSchedules.filter(s => s.status === 'scheduled' || s.status === 'rescheduled').length
    };

    return {
      todaySchedules,
      weeklyStats
    };
  }, [schedules, children, therapists, selectedWeek]);
};
