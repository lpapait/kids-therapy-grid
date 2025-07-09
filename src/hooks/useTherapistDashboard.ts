
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useTherapistWorkload } from './useTherapistWorkload';

interface Notification {
  id: string;
  type: 'cancelled' | 'rescheduled' | 'new_child' | 'workload_alert';
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useTherapistDashboard = (therapistId: string) => {
  const { schedules, children } = useData();
  const selectedWeek = new Date();
  const dashboardMetrics = useDashboardMetrics(selectedWeek);
  const workloadData = useTherapistWorkload(therapistId, selectedWeek);

  // Generate mock notifications based on real data
  const notifications = useMemo((): Notification[] => {
    const mockNotifications: Notification[] = [];
    
    // Check for cancelled sessions in the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentCancelledSessions = schedules.filter(schedule => 
      schedule.therapistId === therapistId &&
      schedule.status === 'cancelled' &&
      new Date(schedule.updatedAt) > lastWeek
    );

    recentCancelledSessions.forEach((session, index) => {
      const child = children.find(c => c.id === session.childId);
      mockNotifications.push({
        id: `cancelled-${session.id}`,
        type: 'cancelled',
        message: `Sessão com ${child?.name || 'paciente'} foi cancelada para ${session.time}`,
        timestamp: new Date(session.updatedAt),
        read: index > 2 // First 3 unread
      });
    });

    // Check for rescheduled sessions
    const rescheduledSessions = schedules.filter(schedule => 
      schedule.therapistId === therapistId &&
      schedule.status === 'rescheduled' &&
      new Date(schedule.updatedAt) > lastWeek
    );

    rescheduledSessions.forEach((session, index) => {
      const child = children.find(c => c.id === session.childId);
      mockNotifications.push({
        id: `rescheduled-${session.id}`,
        type: 'rescheduled',
        message: `Sessão com ${child?.name || 'paciente'} foi remarcada para ${session.time}`,
        timestamp: new Date(session.updatedAt),
        read: index > 1
      });
    });

    // Workload alerts
    if (workloadData && workloadData.percentage >= 90) {
      mockNotifications.push({
        id: 'workload-alert',
        type: 'workload_alert',
        message: `Atenção: Você está com ${workloadData.percentage}% da sua capacidade semanal`,
        timestamp: new Date(),
        read: false
      });
    }

    return mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [schedules, children, therapistId, workloadData]);

  return {
    todaySchedules: dashboardMetrics.todaySchedules.filter(
      session => session.therapistName // Filter for current therapist would be added here
    ),
    workloadData,
    notifications
  };
};
