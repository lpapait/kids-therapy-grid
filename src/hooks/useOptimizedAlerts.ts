
import { useMemo, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

export interface OptimizedTherapistAlert {
  therapistId: string;
  therapistName: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  remainingHours: number;
  remainingSessions: number;
  status: 'approaching_limit' | 'near_limit' | 'critical';
  priority: number;
  color: string;
  recommendation: string;
}

// Cache para otimização
let alertsCache: OptimizedTherapistAlert[] = [];
let lastCacheKey = '';

export const useOptimizedAlerts = (selectedWeek: Date) => {
  const { therapists, schedules } = useData();
  const cacheKeyRef = useRef('');

  return useMemo(() => {
    // Criar chave de cache baseada nos dados
    const cacheKey = `${selectedWeek.getTime()}-${therapists.length}-${schedules.length}`;
    
    // Retornar cache se disponível e válido
    if (cacheKey === lastCacheKey && alertsCache.length > 0) {
      return alertsCache;
    }

    const alerts: OptimizedTherapistAlert[] = [];

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
      const remainingSessions = Math.floor(remainingHours / 1);

      let status: OptimizedTherapistAlert['status'];
      let priority: number;
      let color: string;
      let recommendation: string;

      if (percentage >= 95) {
        status = 'critical';
        priority = 1;
        color = '#ef4444';
        recommendation = 'Redistribuir sessões urgentemente';
      } else if (percentage >= 80) {
        status = 'near_limit';
        priority = 2;
        color = '#f97316';
        recommendation = 'Evitar novos agendamentos';
      } else if (percentage >= 75) {
        status = 'approaching_limit';
        priority = 3;
        color = '#eab308';
        recommendation = 'Planejar com cuidado';
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
        priority,
        color,
        recommendation
      });
    });

    // Ordenar por prioridade e atualizar cache
    const sortedAlerts = alerts.sort((a, b) => a.priority - b.priority);
    alertsCache = sortedAlerts;
    lastCacheKey = cacheKey;
    cacheKeyRef.current = cacheKey;

    return sortedAlerts;
  }, [therapists, schedules, selectedWeek]);
};

// Função para limpar cache quando necessário
export const clearAlertsCache = () => {
  alertsCache = [];
  lastCacheKey = '';
};
