
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';

export interface CapacityMetrics {
  overallUtilization: number;
  totalCapacity: number;
  totalScheduled: number;
  availableHours: number;
  overloadedTherapists: number;
  nearLimitTherapists: number;
  availableTherapists: number;
  criticalAlerts: number;
  status: 'optimal' | 'warning' | 'critical';
  recommendation: string;
}

export const useCapacityMetrics = (selectedWeek: Date): CapacityMetrics => {
  const { therapists, schedules } = useData();

  return useMemo(() => {
    const weekSchedules = schedules.filter(schedule => 
      isSameWeek(schedule.date, selectedWeek) &&
      schedule.status !== 'cancelled'
    );

    let totalScheduled = 0;
    let totalCapacity = 0;
    let overloadedCount = 0;
    let nearLimitCount = 0;
    let availableCount = 0;
    let criticalAlerts = 0;

    therapists.forEach(therapist => {
      const therapistSchedules = weekSchedules.filter(s => s.therapistId === therapist.id);
      const hoursScheduled = therapistSchedules.reduce((total, s) => 
        total + (s.duration || 60) / 60, 0
      );
      
      totalScheduled += hoursScheduled;
      totalCapacity += therapist.weeklyWorkloadHours;
      
      const utilization = (hoursScheduled / therapist.weeklyWorkloadHours) * 100;
      
      if (utilization >= 100) {
        overloadedCount++;
        criticalAlerts++;
      } else if (utilization >= 80) {
        nearLimitCount++;
      } else {
        availableCount++;
      }
    });

    const overallUtilization = Math.round((totalScheduled / totalCapacity) * 100);
    const availableHours = Math.max(0, totalCapacity - totalScheduled);

    let status: CapacityMetrics['status'];
    let recommendation: string;

    if (overallUtilization >= 90 || overloadedCount > 0) {
      status = 'critical';
      recommendation = 'Ação urgente necessária - redistribuir sessões';
    } else if (overallUtilization >= 75 || nearLimitCount > 0) {
      status = 'warning';  
      recommendation = 'Monitorar de perto - planeje com cuidado';
    } else {
      status = 'optimal';
      recommendation = 'Capacidade saudável - espaço para crescimento';
    }

    return {
      overallUtilization,
      totalCapacity: Math.round(totalCapacity * 10) / 10,
      totalScheduled: Math.round(totalScheduled * 10) / 10,
      availableHours: Math.round(availableHours * 10) / 10,
      overloadedTherapists: overloadedCount,
      nearLimitTherapists: nearLimitCount,
      availableTherapists: availableCount,
      criticalAlerts,
      status,
      recommendation
    };
  }, [therapists, schedules, selectedWeek]);
};
