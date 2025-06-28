
import { useMemo, useCallback } from 'react';
import { TherapistWorkload } from '@/types';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

interface WorkloadCache {
  [key: string]: TherapistWorkload;
}

let workloadCache: WorkloadCache = {};
let lastCacheKey = '';

export const useOptimizedWorkload = (therapistId: string | null, selectedWeek: Date): TherapistWorkload | null => {
  const { schedules, getTherapistById } = useData();

  return useMemo(() => {
    if (!therapistId) return null;

    // Create cache key for memoization
    const cacheKey = `${therapistId}-${selectedWeek.getTime()}-${schedules.length}`;
    
    // Return cached result if available
    if (workloadCache[cacheKey] && lastCacheKey === cacheKey) {
      return workloadCache[cacheKey];
    }

    const therapist = getTherapistById(therapistId);
    if (!therapist) return null;

    // Get schedules for the therapist in the selected week
    const weekSchedules = schedules.filter(schedule => 
      schedule.therapistId === therapistId &&
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

    let status: TherapistWorkload['status'];
    if (percentage >= 100) {
      status = 'overloaded';
    } else if (percentage >= 80) {
      status = 'near_limit';
    } else {
      status = 'available';
    }

    // Generate suggestions
    const suggestedActions: string[] = [];
    
    if (status === 'available' && remainingHours > 2) {
      suggestedActions.push('Pode agendar mais sessões');
      suggestedActions.push(`${remainingHours.toFixed(1)}h disponíveis`);
    } else if (status === 'near_limit') {
      suggestedActions.push('Considere sessões mais curtas');
      suggestedActions.push('Planeje com cuidado - próximo do limite');
    } else if (status === 'overloaded') {
      suggestedActions.push('⚠️ Limite excedido - redistribuir sessões');
      suggestedActions.push('Verificar outros terapeutas');
    }

    const result: TherapistWorkload = {
      therapistId,
      hoursScheduled,
      maxHours,
      percentage,
      status,
      remainingHours,
      suggestedActions
    };

    // Cache the result
    workloadCache[cacheKey] = result;
    lastCacheKey = cacheKey;

    return result;
  }, [therapistId, selectedWeek, schedules, getTherapistById]);
};

// Utility to clear cache when needed
export const clearWorkloadCache = () => {
  workloadCache = {};
  lastCacheKey = '';
};
