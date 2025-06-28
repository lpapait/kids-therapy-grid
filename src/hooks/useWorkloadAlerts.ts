
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { TherapistWorkload } from '@/types';
import { isSameWeek } from '@/lib/dateUtils';

export interface WorkloadAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  therapistId: string;
  therapistName: string;
  workloadData: TherapistWorkload;
  timestamp: Date;
}

export const useWorkloadAlerts = (selectedWeek: Date) => {
  const { therapists, schedules } = useData();
  const { toast } = useToast();

  const alerts = useMemo(() => {
    const alertsList: WorkloadAlert[] = [];

    therapists.forEach(therapist => {
      // Get schedules for this therapist in the selected week
      const weekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      const totalMinutes = weekSchedules.reduce((total, schedule) => 
        total + (schedule.duration || 60) + 15, 0 // Include 15min break
      );
      
      const hoursScheduled = Math.round((totalMinutes / 60) * 10) / 10;
      const maxHours = therapist.weeklyWorkloadHours;
      const percentage = Math.round((hoursScheduled / maxHours) * 100);

      let status: TherapistWorkload['status'];
      if (percentage >= 100) {
        status = 'overloaded';
      } else if (percentage >= 80) {
        status = 'near_limit';
      } else {
        status = 'available';
      }

      const workloadData: TherapistWorkload = {
        therapistId: therapist.id,
        hoursScheduled,
        maxHours,
        percentage,
        status,
        remainingHours: Math.max(0, maxHours - hoursScheduled),
        suggestedActions: []
      };

      // Generate alerts based on workload status
      if (status === 'overloaded') {
        alertsList.push({
          id: `overload-${therapist.id}`,
          type: 'error',
          message: `${therapist.name} está sobrecarregado (${percentage}% da carga semanal)`,
          therapistId: therapist.id,
          therapistName: therapist.name,
          workloadData,
          timestamp: new Date()
        });
      } else if (status === 'near_limit') {
        alertsList.push({
          id: `warning-${therapist.id}`,
          type: 'warning',
          message: `${therapist.name} está próximo do limite (${percentage}% da carga semanal)`,
          therapistId: therapist.id,
          therapistName: therapist.name,
          workloadData,
          timestamp: new Date()
        });
      }

      // Check for daily overload
      const dailyHours = new Map<string, number>();
      weekSchedules.forEach(schedule => {
        const dateKey = schedule.date.toDateString();
        const current = dailyHours.get(dateKey) || 0;
        dailyHours.set(dateKey, current + (schedule.duration || 60) / 60);
      });

      dailyHours.forEach((hours, dateKey) => {
        if (hours > 8) {
          alertsList.push({
            id: `daily-${therapist.id}-${dateKey}`,
            type: 'warning',
            message: `${therapist.name} excedeu limite diário em ${new Date(dateKey).toLocaleDateString()}: ${hours.toFixed(1)}h`,
            therapistId: therapist.id,
            therapistName: therapist.name,
            workloadData,
            timestamp: new Date()
          });
        }
      });
    });

    return alertsList.sort((a, b) => {
      const typeOrder = { error: 0, warning: 1, info: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }, [therapists, schedules, selectedWeek]);

  const showToastAlert = (alert: WorkloadAlert) => {
    toast({
      title: alert.type === 'error' ? 'Alerta Crítico' : 'Atenção',
      description: alert.message,
      variant: alert.type === 'error' ? 'destructive' : 'default',
    });
  };

  const criticalAlerts = alerts.filter(alert => alert.type === 'error');
  const warningAlerts = alerts.filter(alert => alert.type === 'warning');

  return {
    alerts,
    criticalAlerts,
    warningAlerts,
    showToastAlert,
    hasAlerts: alerts.length > 0,
    hasCriticalAlerts: criticalAlerts.length > 0
  };
};
