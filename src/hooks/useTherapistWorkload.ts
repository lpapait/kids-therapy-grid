
import { useMemo } from 'react';
import { TherapistWorkload } from '@/types';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

export const useTherapistWorkload = (therapistId: string | null, selectedWeek: Date): TherapistWorkload | null => {
  const { schedules, getTherapistById } = useData();

  return useMemo(() => {
    if (!therapistId) return null;

    const therapist = getTherapistById(therapistId);
    if (!therapist) return null;

    // Get schedules for the therapist in the selected week
    const weekSchedules = schedules.filter(schedule => 
      schedule.therapistId === therapistId &&
      isSameWeek(schedule.date, selectedWeek) &&
      schedule.status !== 'cancelled'
    );

    // Separar sessões administrativas das regulares
    const regularSessions = weekSchedules.filter(s => s.type !== 'administrative');
    const administrativeSessions = weekSchedules.filter(s => s.type === 'administrative');

    // Calculate total hours scheduled including break time and administrative time
    const totalMinutesScheduled = weekSchedules.reduce((total, schedule) => {
      const sessionDuration = schedule.duration || 60;
      const breakTime = BREAK_TIME_MINUTES;
      return total + sessionDuration + breakTime;
    }, 0);
    
    // Remove one break time since the last session of the week doesn't need a break after
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

    // Generate enhanced suggestions based on workload status and validation rules
    const suggestedActions: string[] = [];
    
    if (status === 'available' && remainingHours > 2) {
      suggestedActions.push('Pode agendar mais sessões');
      suggestedActions.push(`${remainingHours.toFixed(1)}h disponíveis (incluindo intervalos)`);
      
      // Sugerir blocos administrativos se necessário
      const adminHours = Math.round((administrativeSessions.reduce((total, s) => total + (s.duration || 60), 0) / 60) * 10) / 10;
      const recommendedAdminHours = therapist.weeklyAdministrativeHours || 4;
      
      if (adminHours < recommendedAdminHours) {
        suggestedActions.push(`Considere reservar ${(recommendedAdminHours - adminHours).toFixed(1)}h para atividades administrativas`);
      }
    } else if (status === 'near_limit') {
      suggestedActions.push('Considere sessões mais curtas');
      suggestedActions.push('Planeje com cuidado - próximo do limite');
      suggestedActions.push('Verifique intervalos obrigatórios');
    } else if (status === 'overloaded') {
      suggestedActions.push('⚠️ Limite excedido - redistribuir sessões');
      suggestedActions.push('Verificar disponibilidade de outros terapeutas');
      suggestedActions.push('Considerar reagendamento');
    }

    return {
      therapistId,
      hoursScheduled,
      maxHours,
      percentage,
      status,
      remainingHours,
      suggestedActions
    };
  }, [therapistId, selectedWeek, schedules, getTherapistById]);
};
